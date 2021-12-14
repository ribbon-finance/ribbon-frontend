import { useCallback, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";

import { AirdropBreakDownType } from "../models/airdrop";
import { proof, airdrop, breakdown } from "../constants/constants";
import useMerkleDistributor from "./useMerkleDistributor";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { formatUnits } from "@ethersproject/units";
import { impersonateAddress } from "shared/lib/utils/development";
import { useGlobalState } from "shared/lib/store/store";
import { CHAINID } from "shared/lib/utils/env";

const useAirdrop = () => {
  const web3Context = useWeb3React();
  const { chainId } = web3Context;
  const account = impersonateAddress ? impersonateAddress : web3Context.account;
  const merkleDistributor = useMerkleDistributor();
  const [airdropInfo, setAirdropInfo] = useGlobalState("airdropInfo");
  const { pendingTransactions } = usePendingTransactions();

  const updateAirdropInfo = useCallback(async () => {
    if (chainId !== CHAINID.ETH_MAINNET || !account || !merkleDistributor) {
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
      account,
      total: total,
      proof: { ...airdropClaim, amount: BigNumber.from(airdropClaim.amount) },
      breakdown: airdropBreakdown,
      claimed,
    });
  }, [account, merkleDistributor, setAirdropInfo, chainId]);

  useEffect(() => {
    if (!airdropInfo || airdropInfo.account !== account) {
      updateAirdropInfo();
    }
  }, [account, airdropInfo, updateAirdropInfo]);

  useEffect(() => {
    if (pendingTransactions[pendingTransactions.length - 1]?.type === "claim") {
      setAirdropInfo((prev) => (prev ? { ...prev, total: 0 } : undefined));
    }
  }, [pendingTransactions, setAirdropInfo]);

  return airdropInfo;
};

export default useAirdrop;
