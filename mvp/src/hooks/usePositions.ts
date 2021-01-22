import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { IAggregatedOptionsInstrumentFactory } from "../codegen/IAggregatedOptionsInstrumentFactory";
import { MulticallFactory } from "../codegen/MulticallFactory";
import { InstrumentPosition } from "../models";
import externalAddresses from "../constants/externalAddresses.json";
import instrumentDetails from "../constants/instruments.json";
import { AbiCoder } from "ethers/lib/utils";
import { BigNumber } from "ethers";

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
  const [positions, setPositions] = useState<InstrumentPosition[]>([]);

  const fetchPositions = useCallback(async () => {
    if (library && account) {
      const signer = library.getSigner();

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

          return resultArray[0].map((result: DecodedInstrumentPosition) => {
            const [
              exercised,
              optionTypes,
              optionIDs,
              amounts,
              strikePrices,
              venues,
            ] = result;

            return {
              exercised,
              optionTypes,
              optionIDs,
              amounts,
              strikePrices,
              venues,
              instrumentAddress,
              expiry,
            };
          });
        }
      );
      const flattenedPositions = positionsOnContract.reduce((a, b) =>
        a.concat(b)
      );
      setPositions(flattenedPositions);
    }
  }, [library, account]);

  useEffect(() => {
    if (library && account) {
      fetchPositions();
    }
  }, [library, account]);

  return positions;
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

export default usePositions;
