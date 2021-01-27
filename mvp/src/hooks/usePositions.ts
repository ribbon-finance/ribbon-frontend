import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { IAggregatedOptionsInstrumentFactory } from "../codegen/IAggregatedOptionsInstrumentFactory";
import { MulticallFactory } from "../codegen/MulticallFactory";
import {
  CALL_OPTION_TYPE,
  InstrumentPosition,
  PUT_OPTION_TYPE,
} from "../models";
import externalAddresses from "../constants/externalAddresses.json";
import instrumentDetails from "../constants/instruments.json";
import { AbiCoder } from "ethers/lib/utils";
import { BigNumber, Signer } from "ethers";
import { useETHPrice } from "./useEthPrice";
import { wmul } from "../utils/math";

const abiCoder = new AbiCoder();

type DecodedInstrumentPosition = [
  exercised: boolean,
  optionTypes: number[],
  optionIDs: number[],
  amounts: BigNumber[],
  strikePrices: BigNumber[],
  venues: string[]
];

const usePositions = (instrumentAddresses: string[]) => {
  const { library, account } = useWeb3React();
  const [loading, setLoading] = useState<boolean>(true);
  const [positions, setPositions] = useState<InstrumentPosition[]>([]);
  const ethPrice = useETHPrice();
  const ethPriceStr = ethPrice.toString();

  const fetchPositions = useCallback(async () => {
    try {
      if (library && account) {
        const signer = library.getSigner();

        const positions = await fetchAllInstrumentPositions(
          signer,
          account,
          BigNumber.from(ethPriceStr),
          instrumentAddresses
        );

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
      setLoading(false);
    }
  }, [library, account, ethPriceStr]);

  useEffect(() => {
    if (library && account && ethPriceStr !== "0") {
      fetchPositions();
    }
  }, [library, account, ethPriceStr, fetchPositions]);

  return { loading, positions };
};

const fetchAllInstrumentPositions = async (
  signer: Signer,
  account: string,
  assetPrice: BigNumber,
  instrumentAddresses: string[]
) => {
  const multicall = MulticallFactory.connect(
    externalAddresses.mainnet.multicall,
    signer
  );

  const calls = instrumentAddresses.map((instrumentAddress) => {
    const instrument = IAggregatedOptionsInstrumentFactory.connect(
      instrumentAddress,
      signer
    );
    const callData = instrument.interface.encodeFunctionData(
      "getInstrumentPositions",
      [account]
    );

    return {
      target: instrumentAddress,
      callData,
    };
  });

  const response = await multicall.aggregate(calls);

  const positionsOnContract: InstrumentPosition[][] = response.returnData.map(
    (data, index) => {
      const resultArray = abiCoder.decode(
        ["(bool,uint8[],uint32[],uint256[],uint256[],string[])[]"],
        data
      );
      const instrumentAddress = instrumentAddresses[index];
      const expiry = getInstrumentExpiry(instrumentAddress);

      return resultArray[0].map(
        (result: DecodedInstrumentPosition, positionID: number) => {
          const [
            exercised,
            optionTypes,
            optionIDs,
            amounts,
            strikePrices,
            venues,
          ] = result;
          const pnl = calculatePNL(
            assetPrice,
            optionTypes,
            strikePrices,
            amounts
          );

          return {
            positionID,
            exercised,
            optionTypes,
            optionIDs,
            amounts,
            strikePrices,
            venues,
            instrumentAddress,
            expiry,
            pnl,
            canExercise: false,
          };
        }
      );
    }
  );
  const flattenedPositions = positionsOnContract.reduce((a, b) => a.concat(b));
  return flattenedPositions;
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

const getInstrumentExpiry = (instrumentAddress: string) => {
  const mainnetInstrumentDetails = instrumentDetails.mainnet;
  const details = mainnetInstrumentDetails.find(
    (d) => d.address === instrumentAddress
  );
  if (!details) {
    throw new Error("Instrument not found");
  }
  return details.expiry;
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
