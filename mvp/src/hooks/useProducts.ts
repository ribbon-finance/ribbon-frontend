import { MulticallFactory } from "../codegen/MulticallFactory";
import { Product, Straddle } from "../models";
import externalAddresses from "../constants/externalAddresses.json";
import instrumentAddresses from "../constants/instruments.json";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { IAggregatedOptionsInstrumentFactory } from "../codegen/IAggregatedOptionsInstrumentFactory";

export const useProducts = (): Product[] => {
  const { library } = useWeb3React();
  const [instruments, setInstruments] = useState<Straddle[]>([]);
  const instrumentDetails = instrumentAddresses.mainnet;

  const fetchInstrumentDetailsFromContract = useCallback(async () => {
    const signer = library.getSigner();

    const multicall = MulticallFactory.connect(
      externalAddresses.mainnet.multicall,
      signer
    );

    const calls = instrumentDetails.map((detail) => {
      const instrument = IAggregatedOptionsInstrumentFactory.connect(
        detail.address,
        signer
      );

      return {
        target: detail.address,
        callData: instrument.interface.encodeFunctionData("underlying"),
      };
    });

    const response = await multicall.aggregate(calls);
    console.log(response);

    const instruments = instrumentAddresses.mainnet.map((instrumentDetails) => {
      const {
        address,
        instrumentSymbol: symbol,
        expiry: expiryTimestamp,
      } = instrumentDetails;

      return {
        address,
        symbol,
        expiryTimestamp: parseInt(expiryTimestamp),
      };
    });

    setInstruments(instruments);
  }, [library, instrumentDetails]);

  useEffect(() => {
    if (library) {
      fetchInstrumentDetailsFromContract();
    }
  }, [library, fetchInstrumentDetailsFromContract]);

  return [
    {
      name: "ETH Straddle",
      emoji: "📉📈",
      instruments,
    },
  ];
};

export const useDefaultProduct = (): Product => useProducts()[0];

const straddle1: Straddle = {
  address: "0x0000000000000000000000000000000000000000",
  symbol: "ETH-VOL-251220",
  // currency: "0x0000000000000000000000000000000000000000",
  expiryTimestamp: 1612051200,
  // totalPremium: "22636934749846005",
  // callPremium: "22636934749846005",
  // callStrikePrice: "500000000000000000000",
  // callVenue: "OPYN_V1",
  // callPositionID: null,
  // putPremium: "22636934749846005",
  // putStrikePrice: "500000000000000000000",
  // putVenue: "HEGIC",
  // putPositionID: "0",
};
