import { BigNumber } from "ethers";
import { useWeb3Context } from "./web3Context";
import { useCallback, useEffect } from "react";
import { VaultDataResponse } from "../store/types";
import { useWeb3React } from "@web3-react/core";
import { useGlobalState } from "../store/store";
import { getVault } from "./useVault";
import { getDefaultChainID } from "../utils/env";

type UseVaultData = () => VaultDataResponse;

const useVaultData: UseVaultData = () => {
  const { chainId, library, active: walletConnected, account } = useWeb3React();
  const { provider: ethersProvider } = useWeb3Context();

  const [response, setResponse] = useGlobalState("vaultData");

  const doMulticall = useCallback(async () => {
    const envChainID = getDefaultChainID();
    const zero = BigNumber.from("0");

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
            setResponse((prevResponse) => ({
              status: "success",
              error: null,
              deposits: defaultToValue(prevResponse.deposits, responses[0]),
              vaultLimit: defaultToValue(prevResponse.vaultLimit, responses[1]),
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
  }, [account, setResponse, ethersProvider, walletConnected, chainId, library]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, walletConnected]);

  return response;
};

export default useVaultData;
