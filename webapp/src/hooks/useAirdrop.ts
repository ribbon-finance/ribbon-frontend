import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";

import { AirdropBreakDownType } from "../models/airdrop";
import { proof, airdrop, breakdown } from "../constants/constants";

const useAirdrop = () => {
  const { account } = useWeb3React();

  return useMemo(() => {
    if (!account) {
      return undefined;
    }

    const airdropClaim = proof["claims"][account];
    const airdropBreakdown = Object.fromEntries(
      Object.keys(breakdown)
        .map((key) => [[key], breakdown[key as AirdropBreakDownType][account]])
        .filter((entry) => entry[1])
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
