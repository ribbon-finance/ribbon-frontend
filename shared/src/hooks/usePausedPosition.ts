import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { RibbonVaultPauser } from "../codegen";
import {
  isBinanceVault,
  isEarnVault,
  isSolanaVault,
  VaultAddressMap,
  VaultOptions,
  VaultVersion,
} from "../constants/constants";
import { isPracticallyZero } from "../utils/math";
import useVaultContract from "./useVaultContract";
import useVaultPauser from "./useV2VaultPauserContract";
import useWeb3WalletReadOnly from "./useWeb3WalletReadOnly";
import { useV2VaultData } from "./web3DataContext";
import { isVIP } from "../utils/env";

export const usePausedPosition = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion,
  { enabled = true }: { enabled?: boolean } = {}
) => {
  const [pausedShares, setPausedShares] = useState(BigNumber.from(0));
  const [roundPricePerShare, setRoundPricePerShare] = useState(
    BigNumber.from(0)
  );
  const [canResume, setCanResume] = useState(false);
  const [canPause, setCanPause] = useState(false);
  const lastFetchKey = useRef<string>();
  const {
    data: { lockedBalanceInAsset, round, decimals },
  } = useV2VaultData(vaultOption);

  const { account, chainId } = useWeb3WalletReadOnly();
  const pauseContract = useVaultPauser(chainId || 1) as RibbonVaultPauser;
  const vaultAddress = VaultAddressMap[vaultOption][vaultVersion];
  const v2Contract = useVaultContract(vaultOption);

  useEffect(() => {
    if (
      !enabled ||
      !pauseContract ||
      !v2Contract ||
      !vaultAddress ||
      !account ||
      isVIP() ||
      isBinanceVault(vaultOption) ||
      isSolanaVault(vaultOption) ||
      isEarnVault(vaultOption)
    ) {
      return;
    }

    const fetchKey = [
      chainId || 1,
      vaultOption,
      vaultVersion,
      vaultAddress,
      account,
      round,
      decimals,
      lockedBalanceInAsset.toString(),
    ].join(":");

    if (lastFetchKey.current === fetchKey) {
      return;
    }
    lastFetchKey.current = fetchKey;

    let cancelled = false;

    pauseContract
      .getPausePosition(vaultAddress, account)
      .then(async ([pauseRound, pauseAmount]) => {
        if (cancelled || pauseRound === 0) {
          return;
        }

        const pricePerShare =
          pauseRound === round
            ? await v2Contract.pricePerShare()
            : await v2Contract.roundPricePerShare(pauseRound);

        if (cancelled) {
          return;
        }

        setPausedShares(pauseAmount);
        setCanResume(pauseRound < round);
        setCanPause(
          isPracticallyZero(pauseAmount, decimals) &&
            !isPracticallyZero(lockedBalanceInAsset, decimals)
        );
        setRoundPricePerShare(pricePerShare);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [
    pauseContract,
    enabled,
    vaultAddress,
    account,
    chainId,
    lockedBalanceInAsset,
    decimals,
    round,
    v2Contract,
    vaultOption,
    vaultVersion,
  ]);

  const pausedAmount = useMemo(() => {
    return pausedShares.mul(roundPricePerShare).div(parseUnits("1", decimals));
  }, [pausedShares, roundPricePerShare, decimals]);

  return {
    pausedAmount: pausedAmount,
    canResume: canResume,
    canPause: canPause,
  };
};
