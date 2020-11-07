import { Instrument } from "./../models";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { DataProviderFactory, TwinYield, TwinYieldFactory } from "../codegen";
import deployedInstruments from "../constants/instruments.json";
import { BPoolFactory } from "../codegen/BPoolFactory";
import { ethers } from "ethers";

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
  const addresses = useMemo(
    () => getDeployedInstruments(network).map((ins) => ins.address),
    [network]
  );
  const [loaded, setLoaded] = useState(false);
  const [instrumentData, setInstrumentData] = useState<Instrument[]>([]);

  useEffect(() => {
    if (library) {
      const signer = library.getSigner();
      const factory = new TwinYieldFactory(signer);
      const instruments = addresses.map((a) => factory.attach(a));

      (async function () {
        const promises = instruments.map((instrument) =>
          fetchInstrumentData(library, instrument)
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
  instrumentSymbol: string,
  network = "kovan"
):
  | { status: "error"; message: string }
  | { status: "success"; instrument: Instrument }
  | { status: "loading" } => {
  const { library } = useWeb3React();
  const deployedInstruments = useMemo(() => getDeployedInstruments(network), [
    network,
  ]);
  const [loaded, setLoaded] = useState(false);
  const [instrumentData, setInstrumentData] = useState<Instrument | null>(null);

  const deployedInstrument = deployedInstruments.find(
    (ins) => ins.instrumentSymbol === instrumentSymbol
  );

  useEffect(() => {
    if (library && deployedInstrument) {
      (async function () {
        const signer = library.getSigner();
        const factory = new TwinYieldFactory(signer);
        const instrument = factory.attach(deployedInstrument.address);
        const data = await fetchInstrumentData(library, instrument);
        setLoaded(true);
        setInstrumentData(data);
      })();
    }
  }, [deployedInstrument, instrumentSymbol, library]);

  if (!deployedInstrument) {
    return {
      status: "error",
      message: `No instrument found at ${instrumentSymbol}`,
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
  library: any,
  instrument: TwinYield
): Promise<Instrument> => {
  const strikePrice = (await instrument.strikePrice()).toNumber();
  const signer = library.getSigner();
  const paymentToken = await instrument.paymentToken();
  const dTokenAddress = await instrument.dToken();
  const poolAddress = await instrument.balancerPool();
  const dataProviderAddress = await instrument.dataProvider();

  const balancerPool = BPoolFactory.connect(poolAddress, signer);
  const dataProvider = new DataProviderFactory(signer).attach(
    dataProviderAddress
  );

  const WAD = ethers.BigNumber.from(10).pow("18");
  const targetPrice = await dataProvider.getPrice(paymentToken);
  const targetSpotPrice = parseInt(targetPrice.toString());
  const instrumentSpotPrice = parseInt(
    (
      await balancerPool.getSpotPriceSansFee(paymentToken, dTokenAddress)
    ).toString()
  );

  const instrumentData = {
    symbol: await instrument.symbol(),
    strikePrice,
    expiryTimestamp: (await instrument.expiry()).toNumber(),
    balancerPool: poolAddress,
    instrumentSpotPrice,
    targetSpotPrice,
  };
  console.log(instrumentData);
  return instrumentData;
};

const getDeployedInstruments = (network: string) => {
  let instrumentsByNetwork: DeployedInstrumentByNetwork = deployedInstruments;
  if (instrumentsByNetwork[network]) {
    return instrumentsByNetwork[network];
  }
  return [];
};
