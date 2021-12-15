import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useContext, useEffect, useState } from "react";
import { LidoOracleFactory } from "../codegen/LidoOracleFactory";
import { LidoOracleAddress } from "../constants/constants";
import { CHAINID, isProduction } from "../utils/env";
import { useWeb3Context } from "./web3Context";
import { Web3DataContext } from "./web3DataContext";

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
  const { library, active, chainId } = useWeb3React();
  const { provider } = useWeb3Context();

  const [data, setData] = useState(defaultLidoOracleData);

  const fetchLidoOracleData = useCallback(async () => {
    if (!isProduction()) {
      console.time("Lido Oracle Data Fetch");
    }

    const contract = getLidoOracle(library || provider, active);

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
      console.timeEnd("Lido Oracle Data Fetch");
    }
  }, [active, library, provider]);

  useEffect(() => {
    if (chainId === CHAINID.ETH_MAINNET) {
      fetchLidoOracleData();
    }
  }, [chainId, fetchLidoOracleData]);

  return data;
};

const useLidoAPY = () => {
  const contextData = useContext(Web3DataContext);
  const preTotalPooledEther = parseFloat(
    formatUnits(contextData.lidoOracle.data.preTotalPooledEther, 18)
  );
  const postTotalPooledEther = parseFloat(
    formatUnits(contextData.lidoOracle.data.postTotalPooledEther, 18)
  );
  const secondsInYear = 60 * 60 * 24 * 365;

  return contextData.lidoOracle.loading
    ? 0
    : ((postTotalPooledEther - preTotalPooledEther) * secondsInYear) /
        (preTotalPooledEther * contextData.lidoOracle.data.timeElapsed);
};

export default useLidoAPY;
