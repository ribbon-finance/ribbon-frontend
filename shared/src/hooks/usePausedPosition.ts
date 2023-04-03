import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { RibbonVaultPauser } from "../codegen";
import {
  isBinanceVault,
  isSolanaVault,
  VaultAddressMap,
  VaultOptions,
  VaultVersion,
} from "../constants/constants";
import { isPracticallyZero } from "../utils/math";
import useVaultContract from "./useVaultContract";
import useVaultPauser from "./useV2VaultPauserContract";
import useWeb3Wallet from "./useWeb3Wallet";
import { useV2VaultData } from "./web3DataContext";
import { isVIP } from "../utils/env";

export const usePausedPosition = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion
) => {
  const [pausedShares, setPausedShares] = useState(BigNumber.from(0));
  const [roundPricePerShare, setRoundPricePerShare] = useState(
    BigNumber.from(0)
  );
  const [canResume, setCanResume] = useState(false);
  const [canPause, setCanPause] = useState(false);
  const {
    data: { lockedBalanceInAsset, round, decimals },
  } = useV2VaultData(vaultOption);

  const { account, chainId } = useWeb3Wallet();
  const pauseContract = useVaultPauser(chainId || 1) as RibbonVaultPauser;
  const vaultAddress = VaultAddressMap[vaultOption][vaultVersion];
  const v2Contract = useVaultContract(vaultOption);

  useEffect(() => {
    if (
      pauseContract &&
      v2Contract &&
      vaultAddress &&
      account &&
      !isVIP() &&
      !isBinanceVault(vaultOption) &&
      !isSolanaVault(vaultOption)
    ) {
      pauseContract
        .getPausePosition(vaultAddress, account)
        .then(([pauseRound, pauseAmount]) => {
          setPausedShares(pauseAmount);
          setCanResume(pauseRound !== 0 && pauseRound < round); // edge case round returns 0
          setCanPause(
            isPracticallyZero(pauseAmount, decimals) &&
              !isPracticallyZero(lockedBalanceInAsset, decimals)
          );
          if (pauseRound === round) {
            v2Contract.pricePerShare().then((val) => {
              setRoundPricePerShare(val);
            });
          } else {
            v2Contract.roundPricePerShare(pauseRound).then((val) => {
              setRoundPricePerShare(val);
            });
          }
        });
    }
  }, [
    pauseContract,
    canResume,
    vaultAddress,
    account,
    lockedBalanceInAsset,
    decimals,
    round,
    v2Contract,
    vaultOption,
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
