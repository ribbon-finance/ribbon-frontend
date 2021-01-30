import { ethers } from "ethers";
import { MulticallFactory } from "../codegen/MulticallFactory";
import { BasicStraddle, Product, Straddle } from "../models";
import externalAddresses from "../constants/externalAddresses.json";
import instrumentAddresses from "../constants/instruments.json";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { IAggregatedOptionsInstrumentFactory } from "../codegen/IAggregatedOptionsInstrumentFactory";
const abiCoder = new ethers.utils.AbiCoder();

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

    const nowTimestamp = Math.floor(Date.now() / 1000);

    const instruments = instrumentAddresses.mainnet
      .filter((details) => parseInt(details.expiry) > nowTimestamp)
      .map((instrumentDetails, index) => {
        const {
          address,
          instrumentSymbol: symbol,
          expiry: expiryTimestamp,
        } = instrumentDetails;

        const underlying = abiCoder
          .decode(["uint256"], response.returnData[index])
          .toString();

        return {
          address,
          symbol,
          underlying,
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
      emoji: "",
      instruments,
    },
  ];
};

export const useDefaultProduct = (): Product => useProducts()[0];

type InstrumentResponse = BasicStraddle | Straddle | null;

export const useInstrument = (instrumentSymbol: string) => {
  const instrumentDetails = instrumentAddresses.mainnet.find(
    (a) => a.instrumentSymbol === instrumentSymbol
  );

  const { library } = useWeb3React();
  const [instrument, setInstrument] = useState<InstrumentResponse>(null);

  const fetchInstrumentDetail = useCallback(async () => {
    if (!instrumentDetails) {
      return;
    }
    const signer = library.getSigner();

    const instrument = IAggregatedOptionsInstrumentFactory.connect(
      instrumentDetails.address,
      signer
    );

    const underlying = (await instrument.underlying()).toString();

    const {
      address,
      instrumentSymbol: symbol,
      expiry: expiryTimestamp,
    } = instrumentDetails;

    setInstrument({
      address,
      symbol,
      underlying,
      expiryTimestamp: parseInt(expiryTimestamp),
    });
  }, [library, instrumentDetails]);

  useEffect(() => {
    if (library && instrumentDetails) {
      fetchInstrumentDetail();
    } else if (instrumentDetails) {
      const {
        address,
        expiry: expiryTimestamp,
        instrumentSymbol: symbol,
      } = instrumentDetails;

      setInstrument({
        address,
        expiryTimestamp: parseInt(expiryTimestamp),
        symbol,
      });
    }
  }, [library, instrumentDetails, fetchInstrumentDetail]);

  return instrument;
};

export const useInstrumentAddresses = () => {
  const addresses = instrumentAddresses.mainnet.map((i) => i.address);
  return addresses;
};
