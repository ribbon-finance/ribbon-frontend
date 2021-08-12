import { BigNumber } from "ethers";
import { useCallback, useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import { useWeb3Context } from "./web3Context";
import { VaultDataResponse } from "../store/types";
import { useGlobalState } from "../store/store";
import { getVault } from "./useVault";
import { getDefaultChainID } from "../utils/env";
import { getAssets, VaultOptions } from "../constants/constants";
import { isETHVault } from "../utils/vault";
import { getERC20Token } from "./useERC20Token";
import { ERC20Token } from "../models/eth";

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
          providerVault.maxWithdrawableShares(),
          providerVault.totalSupply(),
        ];

        let connectedPromises: Promise<BigNumber>[] = [];

        const defaultToNextValue = (
          prevValue: BigNumber,
          nextValue: BigNumber
        ) => (prevValue.isZero() ? nextValue : prevValue);

        const defaultToPrevValue = (
          prevValue: BigNumber,
          nextValue: BigNumber
        ) => (nextValue.isZero() ? prevValue : nextValue);

        if (walletConnected && account && chainId) {
          if (chainId !== envChainID) {
            doSideEffect &&
              setResponse((prevResponse) => ({
                ...prevResponse,
                [vault]: {
                  ...prevResponse[vault],
                  status: "error",
                  error: "wrong_network",
                  deposits: defaultToNextValue(
                    zero,
                    prevResponse[vault].deposits
                  ),
                  vaultLimit: defaultToNextValue(
                    zero,
                    prevResponse[vault].vaultLimit
                  ),
                  vaultMaxWithdrawAmount: defaultToNextValue(
                    zero,
                    prevResponse[vault].vaultLimit
                  ),
                  vaultBalanceInAsset: defaultToNextValue(
                    zero,
                    prevResponse[vault].vaultBalanceInAsset
                  ),
                  userAssetBalance: defaultToNextValue(
                    zero,
                    prevResponse[vault].userAssetBalance
                  ),
                  maxWithdrawAmount: defaultToNextValue(
                    zero,
                    prevResponse[vault].maxWithdrawAmount
                  ),
                },
              }));
            return;
          }

          const signerVault = getVault(library, vault);

          if (signerVault) {
            connectedPromises = [
              signerVault.accountVaultBalance(account),
              isETHVault(vault)
                ? library.getBalance(account)
                : getERC20Token(
                    library,
                    getAssets(vault).toLowerCase() as ERC20Token
                  )?.balanceOf(account),
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
                ...prevResponse,
                [vault]: {
                  ...prevResponse[vault],
                  status: "success",
                  error: null,
                  deposits: defaultToPrevValue(
                    prevResponse[vault].deposits,
                    responses[0]
                  ),
                  vaultLimit: defaultToPrevValue(
                    prevResponse[vault].vaultLimit,
                    responses[1]
                  ),
                  vaultMaxWithdrawAmount: defaultToPrevValue(
                    prevResponse[vault].vaultMaxWithdrawAmount,
                    responses[2].mul(responses[0]).div(responses[3])
                  ),
                  vaultBalanceInAsset: prevResponse[vault].vaultBalanceInAsset,
                  userAssetBalance: prevResponse[vault].userAssetBalance,
                  maxWithdrawAmount: prevResponse[vault].maxWithdrawAmount,
                },
              }));

            return;
          }

          doSideEffect &&
            setResponse((prevResponse) => ({
              ...prevResponse,
              [vault]: {
                ...prevResponse[vault],
                status: "success",
                error: null,
                deposits: defaultToPrevValue(
                  prevResponse[vault].deposits,
                  responses[0]
                ),
                vaultLimit: defaultToPrevValue(
                  prevResponse[vault].vaultLimit,
                  responses[1]
                ),
                vaultMaxWithdrawAmount: defaultToPrevValue(
                  prevResponse[vault].vaultMaxWithdrawAmount,
                  responses[2].mul(responses[0]).div(responses[3])
                ),
                vaultBalanceInAsset: defaultToPrevValue(
                  prevResponse[vault].vaultBalanceInAsset,
                  responses[4]
                ),
                userAssetBalance: defaultToPrevValue(
                  prevResponse[vault].userAssetBalance,
                  responses[5]
                ),
                maxWithdrawAmount: defaultToPrevValue(
                  prevResponse[vault].maxWithdrawAmount,
                  responses[6]
                ),
              },
            }));
        } catch (e) {
          console.error(e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault, account, setResponse, walletConnected, chainId, library]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
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

  return response[vault];
};

export default useVaultData;
