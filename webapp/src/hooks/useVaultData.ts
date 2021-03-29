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
    if (ethersProvider) {
      const providerVault = getVault(
        getDefaultChainID(),
        ethersProvider,
        false
      );

      if (providerVault) {
        const unconnectedPromises = [
          providerVault.totalBalance(),
          providerVault.cap(),
        ];

        let connectedPromises: Promise<BigNumber>[] = [];

        if (walletConnected && account && chainId) {
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

          const data = {
            deposits: responses[0],
            vaultLimit: responses[1],
          };

          if (!walletConnected) {
            setResponse({
              status: "success",
              ...data,
              vaultBalanceInAsset: BigNumber.from("0"),
              userAssetBalance: BigNumber.from("0"),
              maxWithdrawAmount: BigNumber.from("0"),
            });

            return;
          }

          setResponse({
            status: "success",
            ...data,
            vaultBalanceInAsset: responses[2],
            userAssetBalance: responses[3],
            maxWithdrawAmount: responses[4],
          });
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
