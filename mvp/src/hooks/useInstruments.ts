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
): { loaded: boolean; instruments: Instrument[] } => {
  const { library } = useWeb3React();

  const addresses = useMemo(() => {
    let instrumentsByNetwork: DeployedInstrumentByNetwork = deployedInstruments;
    if (instrumentsByNetwork[network]) {
      const deployedInstruments = instrumentsByNetwork[network];
      return deployedInstruments.map((instrument) => instrument.address);
    }
    return [];
  }, [network]);

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

  return { loaded, instruments: instrumentData };
};

export const useInstrument = () => {};

const fetchInstrumentData = async (
  instrument: TwinYield
): Promise<Instrument> => {
  const strikePrice = (await instrument.strikePrice()).toNumber();

  const instrumentData = {
    symbol: await instrument.symbol(),
    strikePrice,
    expiryTimestamp: (await instrument.strikePrice()).toNumber(),
    balancerPool: "0x",
    instrumentSpotPrice: strikePrice - 10,
    targetSpotPrice: strikePrice - 5,
  };
  return instrumentData;
};
