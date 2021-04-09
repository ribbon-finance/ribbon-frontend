import { BigNumber } from "ethers";
import { useWeb3Context } from "./web3Context";
import { useCallback, useEffect, useRef } from "react";
import { VaultDataResponse } from "../store/types";
import { useWeb3React } from "@web3-react/core";
import { useGlobalState } from "../store/store";
import { getVault } from "./useVault";
import { getDefaultChainID } from "../utils/env";
import { VaultOptions } from "../constants/constants";

type UseVaultData = (
  vault: VaultOptions,
  params?: {
    poll: boolean;
    pollingFrequency?: number;
  }
) => VaultDataResponse;

const useVaultData: UseVaultData = (vault, params) => {
  const poll = false || Boolean(params && params.poll);
  const pollingFrequency = (params && params.pollingFrequency) || 4000;

  const isMountedRef = useRef(true);
  const { chainId, library, active: walletConnected, account } = useWeb3React();
  const { provider: ethersProvider } = useWeb3Context();

  const [response, setResponse] = useGlobalState("vaultData");

  const doMulticall = useCallback(async () => {
    const envChainID = getDefaultChainID();
    const zero = BigNumber.from("0");
    const doSideEffect = isMountedRef.current;

    if (ethersProvider) {
      const providerVault = getVault(ethersProvider, vault, false);

      if (providerVault) {
        const unconnectedPromises = [
          providerVault.totalBalance(),
          providerVault.cap(),
        ];

        let connectedPromises: Promise<BigNumber>[] = [];

        const defaultToNextValue = (
          prevValue: BigNumber,
          nextValue: BigNumber
        ) => {
          return prevValue.isZero() ? nextValue : prevValue;
        };

        const defaultToPrevValue = (
          prevValue: BigNumber,
          nextValue: BigNumber
        ) => {
          return nextValue.isZero() ? prevValue : nextValue;
        };

        if (walletConnected && account && chainId) {
          if (chainId !== envChainID) {
            doSideEffect &&
              setResponse((prevResponse) => ({
                status: "error",
                error: "wrong_network",
                deposits: defaultToNextValue(zero, prevResponse.deposits),
                vaultLimit: defaultToNextValue(zero, prevResponse.vaultLimit),
                vaultBalanceInAsset: defaultToNextValue(
                  zero,
                  prevResponse.vaultBalanceInAsset
                ),
                userAssetBalance: defaultToNextValue(
                  zero,
                  prevResponse.userAssetBalance
                ),
                maxWithdrawAmount: defaultToNextValue(
                  zero,
                  prevResponse.maxWithdrawAmount
                ),
              }));
            return;
          }

          const signerVault = getVault(library, vault);

          if (signerVault) {
            connectedPromises = [
              signerVault.accountVaultBalance(account),
              library.getBalance(account),
              signerVault.maxWithdrawAmount(account),
            ];
          }
        }
        const promises = unconnectedPromises.concat(connectedPromises);

        try {
          const responses = await Promise.all(promises);

          if (!walletConnected) {
            doSideEffect &&
              setResponse((prevResponse) => ({
                status: "success",
                error: null,
                deposits: defaultToPrevValue(
                  prevResponse.deposits,
                  responses[0]
                ),
                vaultLimit: defaultToPrevValue(
                  prevResponse.vaultLimit,
                  responses[1]
                ),
                vaultBalanceInAsset: prevResponse.vaultBalanceInAsset,
                userAssetBalance: prevResponse.userAssetBalance,
                maxWithdrawAmount: prevResponse.maxWithdrawAmount,
              }));

            return;
          }

          doSideEffect &&
            setResponse((prevResponse) => ({
              status: "success",
              error: null,
              deposits: defaultToPrevValue(prevResponse.deposits, responses[0]),
              vaultLimit: defaultToPrevValue(
                prevResponse.vaultLimit,
                responses[1]
              ),
              vaultBalanceInAsset: defaultToPrevValue(
                prevResponse.vaultBalanceInAsset,
                responses[2]
              ),
              userAssetBalance: defaultToPrevValue(
                prevResponse.userAssetBalance,
                responses[3]
              ),
              maxWithdrawAmount: defaultToPrevValue(
                prevResponse.maxWithdrawAmount,
                responses[4]
              ),
            }));
        } catch (e) {
          console.error(e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, setResponse, walletConnected, chainId, library]);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    if (poll) {
      doMulticall();
      pollInterval = setInterval(doMulticall, pollingFrequency);
    } else {
      doMulticall();
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [poll, pollingFrequency, doMulticall]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return response;
};

export default useVaultData;
