import { BigNumber } from "ethers";
import { useWeb3Context } from "./web3Context";
import { useCallback, useEffect, useRef } from "react";
import { VaultDataResponse } from "../store/types";
import { useWeb3React } from "@web3-react/core";
import { useGlobalState } from "../store/store";
import { getVault } from "./useVault";
import { getDefaultChainID } from "../utils/env";

type UseVaultData = (params?: {
  poll: boolean;
  pollingFrequency?: number;
}) => VaultDataResponse;

const useVaultData: UseVaultData = (params) => {
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
      const providerVault = getVault(envChainID, ethersProvider, false);

      if (providerVault) {
        const unconnectedPromises = [
          providerVault.totalBalance(),
          providerVault.cap(),
        ];

        let connectedPromises: Promise<BigNumber>[] = [];

        const defaultToValue = (
          prevValue: BigNumber,
          defaultValue: BigNumber
        ) => {
          return prevValue.isZero() ? defaultValue : prevValue;
        };

        if (walletConnected && account && chainId) {
          if (chainId !== envChainID) {
            doSideEffect &&
              setResponse((prevResponse) => ({
                status: "error",
                error: "wrong_network",
                deposits: defaultToValue(zero, prevResponse.deposits),
                vaultLimit: defaultToValue(zero, prevResponse.vaultLimit),
                vaultBalanceInAsset: defaultToValue(
                  zero,
                  prevResponse.vaultBalanceInAsset
                ),
                userAssetBalance: defaultToValue(
                  zero,
                  prevResponse.userAssetBalance
                ),
                maxWithdrawAmount: defaultToValue(
                  zero,
                  prevResponse.maxWithdrawAmount
                ),
              }));
            return;
          }

          const signerVault = getVault(chainId, library);

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
                deposits: defaultToValue(prevResponse.deposits, responses[0]),
                vaultLimit: defaultToValue(
                  prevResponse.vaultLimit,
                  responses[1]
                ),
                vaultBalanceInAsset: defaultToValue(
                  prevResponse.vaultBalanceInAsset,
                  zero
                ),
                userAssetBalance: defaultToValue(
                  prevResponse.userAssetBalance,
                  zero
                ),
                maxWithdrawAmount: defaultToValue(
                  prevResponse.maxWithdrawAmount,
                  zero
                ),
              }));

            return;
          }

          doSideEffect &&
            setResponse((prevResponse) => ({
              status: "success",
              error: null,
              deposits: defaultToValue(prevResponse.deposits, responses[0]),
              vaultLimit: defaultToValue(prevResponse.vaultLimit, responses[1]),
              vaultBalanceInAsset: defaultToValue(
                prevResponse.vaultBalanceInAsset,
                responses[2]
              ),
              userAssetBalance: defaultToValue(
                prevResponse.userAssetBalance,
                responses[3]
              ),
              maxWithdrawAmount: defaultToValue(
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
      isMountedRef.current = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [poll, pollingFrequency, doMulticall]);

  return response;
};

export default useVaultData;
