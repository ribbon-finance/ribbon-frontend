import { Instrument } from "./../models";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { TwinYield, TwinYieldFactory } from "../codegen";
import deployedInstruments from "../constants/instruments.json";

type DeployedInstrument = {
  txhash: string;
  expiry: number;
  instrumentSymbol: string;
  address: string;
};

type DeployedInstrumentByNetwork = {
  [key: string]: DeployedInstrument[];
};

export const useInstruments = (
  network = "kovan"
):
  | { status: "error"; message: string }
  | { status: "success"; instruments: Instrument[] }
  | { status: "loading" } => {
  const { library } = useWeb3React();
  const addresses = useMemo(() => getDeployedInstrumentAddresses(network), [
    network,
  ]);
  const [loaded, setLoaded] = useState(false);
  const [instrumentData, setInstrumentData] = useState<Instrument[]>([]);

  useEffect(() => {
    if (library) {
      const signer = library.getSigner();
      const factory = new TwinYieldFactory(signer);
      const instruments = addresses.map((a) => factory.attach(a));

      (async function () {
        const promises = instruments.map((instrument) =>
          fetchInstrumentData(instrument)
        );
        const instrumentData = await Promise.all(promises);
        setLoaded(true);
        setInstrumentData(instrumentData);
      })();
    }
  }, [addresses, library]);

  switch (loaded) {
    case true:
      if (instrumentData !== null) {
        return { status: "success", instruments: instrumentData };
      }
      return { status: "error", message: "Failed to load instrument" };
    case false:
      return { status: "loading" };
  }
};

export const useInstrument = (
  instrumentAddress: string,
  network = "kovan"
):
  | { status: "error"; message: string }
  | { status: "success"; instrument: Instrument }
  | { status: "loading" } => {
  const { library } = useWeb3React();
  const addresses = useMemo(() => getDeployedInstrumentAddresses(network), [
    network,
  ]);
  const [loaded, setLoaded] = useState(false);
  const [instrumentData, setInstrumentData] = useState<Instrument | null>(null);

  useEffect(() => {
    if (library) {
      (async function () {
        const signer = library.getSigner();
        const factory = new TwinYieldFactory(signer);
        const instrument = factory.attach(instrumentAddress);
        const data = await fetchInstrumentData(instrument);
        setLoaded(true);
        setInstrumentData(data);
      })();
    }
  }, [instrumentAddress, library]);

  if (!addresses.includes(instrumentAddress)) {
    return {
      status: "error",
      message: `No instrument found at ${instrumentAddress}`,
    };
  }

  switch (loaded) {
    case true:
      if (instrumentData !== null) {
        return { status: "success", instrument: instrumentData };
      }
      return { status: "error", message: "Failed to load instrument" };
    case false:
      return { status: "loading" };
  }
};

const fetchInstrumentData = async (
  instrument: TwinYield
): Promise<Instrument> => {
  const strikePrice = (await instrument.strikePrice()).toNumber();

  const instrumentData = {
    symbol: await instrument.symbol(),
    strikePrice,
    expiryTimestamp: (await instrument.expiry()).toNumber(),
    balancerPool: "0x",
    instrumentSpotPrice: strikePrice - 10,
    targetSpotPrice: strikePrice - 5,
  };
  return instrumentData;
};

const getDeployedInstrumentAddresses = (network: string) => {
  let instrumentsByNetwork: DeployedInstrumentByNetwork = deployedInstruments;
  if (instrumentsByNetwork[network]) {
    const deployedInstruments = instrumentsByNetwork[network];
    return deployedInstruments.map((instrument) => instrument.address);
  }
  return [];
};
