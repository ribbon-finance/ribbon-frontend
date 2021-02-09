import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { IAggregatedOptionsInstrumentFactory } from "../codegen/IAggregatedOptionsInstrumentFactory";
import { MulticallFactory } from "../codegen/MulticallFactory";
import { InstrumentPosition, PositionsQuery } from "../models";
import externalAddresses from "../constants/externalAddresses.json";
import instrumentDetails from "../constants/instruments.json";
import { AbiCoder } from "ethers/lib/utils";
import { BigNumber, ethers, Signer } from "ethers";
import axios from "axios";

const abiCoder = new AbiCoder();

const usePositions = () => {
  const { library, account } = useWeb3React();
  const [loading, setLoading] = useState<boolean>(true);
  const [positions, setPositions] = useState<InstrumentPosition[]>([]);

  const fetchPositions = useCallback(async () => {
    try {
      if (library && account) {
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
  }, [library, account]);

  useEffect(() => {
    if (library && account) {
      fetchPositions();
    }
  }, [library, account, fetchPositions]);

  const nowTimestamp = Math.floor(Date.now() / 1000);
  const activePositions = positions.filter(
    (p) => (p.expiry > nowTimestamp || p.canExercise) && !p.exercised
  );
  const numOfActivePositions = activePositions.length;

  return { loading, positions, numOfActivePositions };
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
          amount
          optionTypes
          venues
          strikePrices
          exerciseProfit
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
    const exerciseProfit = BigNumber.from(pos.exerciseProfit);

    return {
      positionID,
      instrumentAddress,
      pnl,
      canExercise: false,
      exerciseProfit,
      exercised: pos.exercised,
      expiry,
      amount: BigNumber.from(pos.amount),
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
  const unexercisedPositions = positions.filter(
    (position) => position.canExercise && !position.exercised
  );

  const multicall = MulticallFactory.connect(
    externalAddresses.mainnet.multicall,
    signer
  );

  const exerciseProfitCalls = unexercisedPositions.map((position) => {
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

  const exerciseProfitMap: Map<string, BigNumber> = new Map(
    exerciseProfitResponse.returnData.map((r, index) => [
      `${positions[index].instrumentAddress}-${account}-${positions[index].positionID}`,
      abiCoder.decode(["uint256"], r)[0],
    ])
  );

  return positions.map((position) => {
    const { pnl, instrumentAddress, positionID } = position;
    const positionKey = `${instrumentAddress}-${account}-${positionID}`;
    const exerciseProfit =
      exerciseProfitMap.get(positionKey) || position.exerciseProfit;

    return {
      ...position,
      pnl: pnl.add(exerciseProfit),
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

export default usePositions;
