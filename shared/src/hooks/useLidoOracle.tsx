import { BigNumber } from "@ethersproject/bignumber";
import { useCallback, useEffect, useState } from "react";
import { LidoOracleFactory } from "../codegen/LidoOracleFactory";
import { LidoOracleAddress } from "../constants/constants";
import { isProduction } from "../utils/env";
import { useETHWeb3Context } from "./web3Context";

export const getLidoOracle = (library: any, useSigner: boolean = true) => {
  if (!LidoOracleAddress) {
    return null;
  }

  const provider = useSigner ? library.getSigner() : library;

  return LidoOracleFactory.connect(LidoOracleAddress, provider);
};

export interface LidoOracleData {
  data: {
    preTotalPooledEther: BigNumber;
    postTotalPooledEther: BigNumber;
    timeElapsed: number;
  };
  loading: boolean;
}

export const defaultLidoOracleData: LidoOracleData = {
  data: {
    preTotalPooledEther: BigNumber.from(0),
    postTotalPooledEther: BigNumber.from(0),
    timeElapsed: 0,
  },
  loading: true,
};

export const useFetchLidoOracleData = () => {
  const { provider } = useETHWeb3Context();

  const [data, setData] = useState(defaultLidoOracleData);

  const fetchLidoOracleData = useCallback(async () => {
    if (!isProduction()) {
      console.time("Lido Oracle Data Fetch"); // eslint-disable-line
    }

    const contract = getLidoOracle(provider, false);

    if (!contract) {
      setData((prev) => ({ ...prev, loading: false }));
      return;
    }

    const responses = await contract.getLastCompletedReportDelta();

    setData({
      data: {
        preTotalPooledEther: responses.preTotalPooledEther,
        postTotalPooledEther: responses.postTotalPooledEther,
        timeElapsed: parseFloat(responses.timeElapsed.toString()),
      },
      loading: false,
    });

    if (!isProduction()) {
      console.timeEnd("Lido Oracle Data Fetch"); // eslint-disable-line
    }
  }, [provider]);

  useEffect(() => {
    fetchLidoOracleData();
  }, [fetchLidoOracleData]);

  return data;
};
