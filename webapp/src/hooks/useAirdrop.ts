import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";

import {
  AirdropProof,
  AirdropBreakdown,
  AirdropBreakDownType,
  Airdrop,
} from "../models/airdrop";
const airdrop: Airdrop = require("../data/airdrop.json");
const proof: AirdropProof = require("../data/proof.json");
const breakdown: AirdropBreakdown = require("../data/breakdown.json");

type ProofObj = {
  claims: {
    [key: string]: {
      index: number;
      amount: string;
      proof: string[];
    };
  };
};

const useAirdrop = () => {
  const { account } = useWeb3React();

  return useMemo(() => {
    if (!account) {
      return undefined;
    }

    const airdropClaim = (proof as ProofObj)["claims"][account];
    const airdropBreakdown = Object.fromEntries(
      Object.keys(breakdown).map((key) => [
        [key],
        breakdown[key as AirdropBreakDownType][account],
      ])
    );
    const total = airdrop[account];

    if (!airdropClaim || !airdropBreakdown || !total) {
      return undefined;
    }

    return {
      total,
      proof: { ...airdropClaim, amount: BigNumber.from(airdropClaim.amount) },
      breakdown: airdropBreakdown,
    };
  }, [account]);
};

export default useAirdrop;
