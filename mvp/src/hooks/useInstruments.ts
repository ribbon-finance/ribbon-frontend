import { Instrument } from "./../models";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { DataProviderFactory, TwinYield, TwinYieldFactory } from "../codegen";
import deployedInstruments from "../constants/instruments.json";
import { BPoolFactory } from "../codegen/BPoolFactory";
import { etherToDecimals } from "../utils/math";

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
  const [status, setStatus] = useState("loading");
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
        const responses = await Promise.all(promises);
        const hasError = responses.some((ins) => !ins.success);

        if (hasError) {
          setStatus("error");
        } else {
          setStatus("success");
          let instrumentsArr: Instrument[] = [];
          responses.forEach(
            (ins) => ins.success && instrumentsArr.push(ins.instrument)
          );
          setInstrumentData(instrumentsArr);
        }
      })();
    }
  }, [addresses, library]);

  switch (status) {
    case "success":
      if (instrumentData !== null) {
        return { status: "success", instruments: instrumentData };
      }
      return { status: "error", message: "Failed to load instrument" };
    case "loading":
      return { status: "loading" };
    case "error":
      return { status: "error", message: "Failed to load instrument" };
    default:
      return { status: "error", message: "Failed to load instrument" };
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
  const [status, setStatus] = useState("loading");
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
        const res = await fetchInstrumentData(library, instrument);
        if (res.success) {
          setStatus("success");
          setInstrumentData(res.instrument);
        } else {
          setStatus("error");
        }
      })();
    }
  }, [deployedInstrument, instrumentSymbol, library]);

  if (!deployedInstrument) {
    return {
      status: "error",
      message: `No instrument found at ${instrumentSymbol}`,
    };
  }

  switch (status) {
    case "success":
      if (instrumentData !== null) {
        return { status: "success", instrument: instrumentData };
      }
      return { status: "error", message: "Failed to load instrument" };
    case "loading":
      return { status: "loading" };
    case "error":
      return { status: "error", message: "Failed to load instrument" };
    default:
      return { status: "error", message: "Failed to load instrument" };
  }
};

const fetchInstrumentData = async (
  library: any,
  instrument: TwinYield
): Promise<
  { success: true; instrument: Instrument } | { success: false; error: Error }
> => {
  try {
    const strikePrice = etherToDecimals(await instrument.strikePrice());

    const signer = library.getSigner();
    const paymentToken = await instrument.paymentToken();
    const dTokenAddress = await instrument.dToken();
    const poolAddress = await instrument.balancerPool();
    const dataProviderAddress = await instrument.dataProvider();

    const balancerPool = BPoolFactory.connect(poolAddress, signer);
    const dataProvider = new DataProviderFactory(signer).attach(
      dataProviderAddress
    );

    const targetSpotPrice = etherToDecimals(
      await dataProvider.getPrice(paymentToken)
    );
    const instrumentSpotPrice = await balancerPool.getSpotPriceSansFee(
      paymentToken,
      dTokenAddress
    );
    const swapFee = await balancerPool.getSwapFee();

    const instrumentData = {
      instrumentAddress: instrument.address,
      symbol: await instrument.symbol(),
      strikePrice,
      expiryTimestamp: (await instrument.expiry()).toNumber(),
      balancerPool: poolAddress,
      instrumentSpotPrice,
      swapFee,
      targetSpotPrice,
      dTokenAddress,
      paymentCurrencyAddress: paymentToken,
    };
    return { success: true, instrument: instrumentData };
  } catch (e) {
    return { success: false, error: e };
  }
};

const getDeployedInstruments = (network: string) => {
  let instrumentsByNetwork: DeployedInstrumentByNetwork = deployedInstruments;
  if (instrumentsByNetwork[network]) {
    return instrumentsByNetwork[network];
  }
  return [];
};
