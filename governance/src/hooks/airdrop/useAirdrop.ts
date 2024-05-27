import { BigNumber } from "@ethersproject/bignumber";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import ProofData2 from "./proof-mainnet-2.json";
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

const airdropBreakdown = isProduction()
  ? (BreakdownData as AirdropBreakdownData)
  : (BreakdownTestnetData as AirdropBreakdownData);

const rbnDecimals = getAssetDecimals("RBN");

const getProof = (account: string) => {
  const proof = isProduction()
    ? (ProofData as AirdropProof)
    : (ProofTestnetData as AirdropProof);

  // lowercased all claims
  const proofClaims = Object.keys(proof.claims).reduce((prev, address) => {
    return {
      ...prev,
      [address.toLowerCase()]: proof.claims[address],
    };
  }, proof.claims);
  proof.claims = proofClaims;

  const missedProof = isProduction()
    ? (ProofData2 as AirdropProof)
    : (ProofTestnetData as AirdropProof);

  // lowercased all claims
  const missedProofClaims = Object.keys(missedProof.claims).reduce(
    (prev, address) => {
      return {
        ...prev,
        [address.toLowerCase()]: missedProof.claims[address],
      };
    },
    missedProof.claims
  );
  missedProof.claims = missedProofClaims;

  const isMissedAccount = Boolean(missedProof.claims[account.toLowerCase()]);

  return {
    merkleProof: isMissedAccount ? missedProof : proof,
    isMissedAccount,
  };
};

const useAirdrop = () => {
  const web3Context = useWeb3Wallet();
  const { chainId } = web3Context;
  const account = impersonateAddress ? impersonateAddress : web3Context.account;
  const { contract, contract2 } = useMerkleDistributor();
  const { pendingTransactions } = usePendingTransactions();

  const [airdropInfo, setAirdropInfo] = useState<GovernanceAirdropInfoData>();
  const [loading, setLoading] = useState(false);

  const proof = useMemo(() => {
    if (account) {
      return getProof(account);
    }
    return undefined;
  }, [account]);

  const merkleDistributor = useMemo(() => {
    if (proof) {
      const { isMissedAccount } = proof;
      return isMissedAccount ? contract2 : contract;
    }
    return contract;
  }, [contract, contract2, proof]);

  const updateAirdropInfo = useCallback(async () => {
    if (
      !proof ||
      chainId !== CHAINID.ETH_MAINNET ||
      !account ||
      !merkleDistributor
    ) {
      setAirdropInfo(undefined);
      return;
    }

    const airdropClaim = proof.merkleProof.claims[account.toLowerCase()];
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
        proof.isMissedAccount
          ? true
          : airdropBreakdown[account.toLowerCase()]?.heldRbnAfterTGE,
      },
      unclaimedAmount: totalBn.sub(claimedAmount),
    });
  }, [proof, chainId, account, merkleDistributor]);

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
    merkleDistributor,
    airdropInfo,
    loading,
  };
};

export default useAirdrop;
