import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";

import proof from "../data/proof.json";
import { BigNumber } from "@ethersproject/bignumber";

type ProofObj = {
  claims: {
    [key: string]: {
      index: number;
      amount: string;
      proof: string[];
    };
  };
};

const useAirdropProof = () => {
  const { account } = useWeb3React();

  const claimAmount = useMemo(() => {
    if (!account) {
      return undefined;
    }

    const claimObj = (proof as ProofObj)["claims"][account];
    if (!claimObj) {
      return undefined;
    }

    return { ...claimObj, amount: BigNumber.from(claimObj.amount) };
  }, [account]);

  return claimAmount;
};

export default useAirdropProof;
