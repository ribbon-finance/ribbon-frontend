import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { IAggregatedOptionsInstrumentFactory } from "../codegen/IAggregatedOptionsInstrumentFactory";
import { MulticallFactory } from "../codegen/MulticallFactory";
import {
  CALL_OPTION_TYPE,
  InstrumentPosition,
  PositionsQuery,
  PUT_OPTION_TYPE,
} from "../models";
import externalAddresses from "../constants/externalAddresses.json";
import instrumentDetails from "../constants/instruments.json";
import { AbiCoder } from "ethers/lib/utils";
import { BigNumber, ethers, Signer } from "ethers";
import { useETHPrice } from "./useEthPrice";
import { wmul } from "../utils/math";
import axios from "axios";

const abiCoder = new AbiCoder();

type DecodedInstrumentPosition = [
  exercised: boolean,
  optionTypes: number[],
  optionIDs: number[],
  amounts: BigNumber[],
  strikePrices: BigNumber[],
  venues: string[]
];

const usePositions = () => {
  const { library, account } = useWeb3React();
  const [loading, setLoading] = useState<boolean>(true);
  const [positions, setPositions] = useState<InstrumentPosition[]>([]);
  const ethPrice = useETHPrice();
  const ethPriceStr = ethPrice.toString();

  const fetchPositions = useCallback(async () => {
    try {
      if (library && account) {
        // const instrumentPositions = await fetchInstrumentPositionsFromSubgraph(account, 10, 0);
        const positions = await fetchInstrumentPositionsFromSubgraph(
          account,
          100,
          0
        );
        const signer = library.getSigner();

        const positionsWithCanExercise = await fetchCanExercise(
          signer,
          account,
          positions
        );

        const positionsWithProfit = await fetchExerciseProfit(
          signer,
          account,
          positionsWithCanExercise
        );

        setPositions(positionsWithProfit);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [library, account, ethPriceStr]);

  useEffect(() => {
    if (library && account) {
      fetchPositions();
    }
  }, [library, account, fetchPositions]);

  return { loading, positions };
};

const SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/kenchangh/ribbon-finance";

const fetchInstrumentPositionsFromSubgraph = async (
  account: string,
  pageSize: number,
  pageNumber: number
): Promise<InstrumentPosition[]> => {
  const skip = Math.floor(pageSize * pageNumber);
  const response = await axios.post(
    SUBGRAPH_URL,
    {
      query: `
      {
        instrumentPositions(first: ${pageSize}, skip: ${skip}, where: {account: "${account}"}) {
          id
          instrumentAddress
          cost
          exercised
          amounts
          optionTypes
          venues
          strikePrices
        }
      }
      `,
      variables: null,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  const positions: PositionsQuery[] = response.data.data.instrumentPositions;
  return positions.map((pos) => {
    const positionID = parseInt(pos.id.split("-")[2]);
    const instrumentAddress = ethers.utils.getAddress(pos.instrumentAddress);
    const pnl = BigNumber.from(pos.cost).mul(BigNumber.from("-1"));
    const expiry = getInstrumentExpiry(instrumentAddress);

    return {
      positionID,
      instrumentAddress,
      pnl,
      canExercise: false,
      exerciseProfit: BigNumber.from("0"),
      exercised: pos.exercised,
      expiry,
      amounts: pos.amounts.map((amount) => BigNumber.from(amount)),
      strikePrices: pos.strikePrices.map((price) => BigNumber.from(price)),
      optionTypes: pos.optionTypes,
      venues: pos.venues,
    };
  });
};

const fetchCanExercise = async (
  signer: Signer,
  account: string,
  positions: InstrumentPosition[]
) => {
  const multicall = MulticallFactory.connect(
    externalAddresses.mainnet.multicall,
    signer
  );

  const canExerciseCalls = positions.map((position) => {
    const instrument = IAggregatedOptionsInstrumentFactory.connect(
      position.instrumentAddress,
      signer
    );
    const callData = instrument.interface.encodeFunctionData("canExercise", [
      account,
      position.positionID,
    ]);
    return {
      target: position.instrumentAddress,
      callData,
    };
  });
  const canExerciseResponses = await multicall.aggregate(canExerciseCalls);

  return positions.map((position, index) => {
    const canExercise = abiCoder.decode(
      ["bool"],
      canExerciseResponses.returnData[index]
    )[0];
    return {
      ...position,
      canExercise,
    };
  });
};

const fetchExerciseProfit = async (
  signer: Signer,
  account: string,
  positions: InstrumentPosition[]
) => {
  const multicall = MulticallFactory.connect(
    externalAddresses.mainnet.multicall,
    signer
  );

  const exerciseProfitCalls = positions.map((position) => {
    const instrument = IAggregatedOptionsInstrumentFactory.connect(
      position.instrumentAddress,
      signer
    );
    const callData = instrument.interface.encodeFunctionData("exerciseProfit", [
      account,
      position.positionID,
    ]);
    return {
      target: position.instrumentAddress,
      callData,
    };
  });
  const exerciseProfitResponse = await multicall.aggregate(exerciseProfitCalls);

  return positions.map((position, index) => {
    const exerciseProfit = abiCoder.decode(
      ["uint256"],
      exerciseProfitResponse.returnData[index]
    )[0];
    return {
      ...position,
      exerciseProfit,
    };
  });
};

const getInstrumentExpiry = (instrumentAddress: string): number => {
  const mainnetInstrumentDetails = instrumentDetails.mainnet;
  const details = mainnetInstrumentDetails.find(
    (d) => d.address === instrumentAddress
  );
  if (!details) {
    throw new Error("Instrument not found");
  }
  return parseInt(details.expiry);
};

const calculatePNL = (
  assetPrice: BigNumber,
  optionTypes: number[],
  strikePrices: BigNumber[],
  amounts: BigNumber[]
): BigNumber => {
  const callIndex = optionTypes.findIndex(
    (optionType) => optionType === CALL_OPTION_TYPE
  );
  const putIndex = optionTypes.findIndex(
    (optionType) => optionType === PUT_OPTION_TYPE
  );
  if (callIndex === -1 || putIndex === -1) {
    throw new Error("No call or put option found");
  }

  const callStrikePrice = strikePrices[callIndex];
  const putStrikePrice = strikePrices[putIndex];

  if (assetPrice.lt(putStrikePrice)) {
    return wmul(putStrikePrice.sub(assetPrice), amounts[putIndex]);
  } else if (assetPrice.gt(callStrikePrice)) {
    return wmul(assetPrice.sub(callStrikePrice), amounts[callIndex]);
  }
  return BigNumber.from("0");
};

export default usePositions;
