import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";

import { AirdropBreakDownType } from "../models/airdrop";
import { proof, airdrop, breakdown } from "../constants/constants";
import useMerkleDistributor from "./useMerkleDistributor";
import usePendingTransactions from "./usePendingTransactions";
import { formatUnits } from "@ethersproject/units";

const useAirdrop = () => {
  const { account } = useWeb3React();
  const merkleDistributor = useMerkleDistributor();
  const [airdropInfo, setAirdropInfo] = useState<
    | {
        total: number;
        proof: {
          index: number;
          amount: BigNumber;
          proof: string[];
        };
        breakdown: {
          [key: string]: number;
        };
      }
    | undefined
  >(undefined);
  const [pendingTransactions] = usePendingTransactions();

  const updateAirdropInfo = useCallback(async () => {
    if (!account || !merkleDistributor) {
      setAirdropInfo(undefined);
      return;
    }

    const airdropClaim = proof["claims"][account];
    const airdropBreakdown = Object.fromEntries(
      Object.keys(breakdown)
        .map((key) => [[key], breakdown[key as AirdropBreakDownType][account]])
        .filter((entry) => entry[1])
    );
    const total = airdrop[account]
      ? parseFloat(formatUnits(BigNumber.from("0x" + airdrop[account]), 18))
      : 0;

    if (!airdropClaim || !airdropBreakdown || !total) {
      setAirdropInfo(undefined);
      return;
    }

    const claimed = await merkleDistributor.isClaimed(airdropClaim.index);

    setAirdropInfo({
      total: claimed ? 0 : total,
      proof: { ...airdropClaim, amount: BigNumber.from(airdropClaim.amount) },
      breakdown: airdropBreakdown,
    });
  }, [account, merkleDistributor]);

  useEffect(() => {
    updateAirdropInfo();
  }, [updateAirdropInfo]);

  useEffect(() => {
    pendingTransactions.forEach((tx) => {
      if (tx.type === "claim") {
        setAirdropInfo((prev) => (prev ? { ...prev, total: 0 } : undefined));
      }
    });
  }, [pendingTransactions]);

  return airdropInfo;
};

export default useAirdrop;
