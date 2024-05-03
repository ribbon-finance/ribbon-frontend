import { BigNumber } from "@ethersproject/bignumber";
import { useCallback, useEffect, useState } from "react";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";

import { formatUnits } from "@ethersproject/units";
import { CHAINID } from "shared/lib/constants/constants";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { impersonateAddress } from "shared/lib/utils/development";
import useMerkleDistributor from "../useMerkleDistributor";

import {
  AirdropBreakdownKeys,
  GovernanceAirdropInfoData,
} from "shared/lib/store/types";
import { isProduction } from "shared/lib/utils/env";
import ProofData from "./proof-mainnet.json";
import ProofTestnetData from "./proof-testnet.json";
import BreakdownData from "./breakdown-mainnet.json";
import BreakdownTestnetData from "./breakdown-testnet.json";
import { getAssetDecimals } from "shared/lib/utils/asset";

export type AirdropClaim = {
  index: number;
  amount: string;
  proof: string[];
};

export type AirdropProof = {
  merkleRoot: string;
  tokenTotal: string;
  claims: {
    [key: string]: AirdropClaim | undefined;
  };
};

export type AirdropBreakdownData = {
  [address: string]: {
    rbnAmount: number;
    heldRbnAfterTGE: boolean;
  };
};

const proof = isProduction()
  ? (ProofData as AirdropProof)
  : (ProofTestnetData as AirdropProof);
const airdropBreakdown = isProduction()
  ? (BreakdownData as AirdropBreakdownData)
  : (BreakdownTestnetData as AirdropBreakdownData);

const rbnDecimals = getAssetDecimals("RBN");

const useAirdrop = () => {
  const web3Context = useWeb3Wallet();
  const { chainId } = web3Context;
  const account = impersonateAddress ? impersonateAddress : web3Context.account;
  const merkleDistributor = useMerkleDistributor();
  const [airdropInfo, setAirdropInfo] = useState<GovernanceAirdropInfoData>();
  const { pendingTransactions } = usePendingTransactions();

  const [loading, setLoading] = useState(false);

  const updateAirdropInfo = useCallback(async () => {
    if (chainId !== CHAINID.ETH_MAINNET || !account || !merkleDistributor) {
      setAirdropInfo(undefined);
      return;
    }

    const airdropClaim = proof["claims"][account];
    const totalBn = BigNumber.from(airdropClaim?.amount || 0);
    const total = parseFloat(formatUnits(totalBn, rbnDecimals));

    if (!airdropClaim || !total) {
      setAirdropInfo(undefined);
      return;
    }

    let claimedAmount = BigNumber.from(0);
    try {
      claimedAmount = await merkleDistributor.claimed(account);
    } catch (error) {
      console.error("Unable to get claimed amount");
    }

    setAirdropInfo({
      account,
      total,
      proof: { ...airdropClaim, amount: BigNumber.from(airdropClaim.amount) },
      breakdown: {
        [AirdropBreakdownKeys.maxStaked]: !totalBn.isZero(),
        [AirdropBreakdownKeys.heldRbnAfterTGE]:
          airdropBreakdown[account.toLowerCase()]?.heldRbnAfterTGE,
      },
      unclaimedAmount: totalBn.sub(claimedAmount),
    });
  }, [account, merkleDistributor, setAirdropInfo, chainId]);

  useEffect(() => {
    if (!airdropInfo || airdropInfo.account !== account) {
      setLoading(true);
      updateAirdropInfo().finally(() => {
        setLoading(false);
      });
    }
  }, [account, airdropInfo, updateAirdropInfo]);

  useEffect(() => {
    if (pendingTransactions[pendingTransactions.length - 1]?.type === "claim") {
      setAirdropInfo((prev) => (prev ? { ...prev, total: 0 } : undefined));
    }
  }, [pendingTransactions, setAirdropInfo]);

  return {
    airdropInfo,
    loading,
  };
};

export default useAirdrop;
