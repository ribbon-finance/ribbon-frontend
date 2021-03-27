import { constants, BigNumber } from "ethers";
import { useWeb3Context } from "./web3Context";
import { useCallback, useEffect } from "react";
import { VaultDataResponse } from "../store/types";
import { useWeb3React } from "@web3-react/core";
import { useGlobalState } from "../store/store";
import { getVault } from "./useVault";

type UseVaultData = () => VaultDataResponse;

const useVaultData: UseVaultData = () => {
  const { chainId, library, active: walletConnected, account } = useWeb3React();
  const { provider: ethersProvider } = useWeb3Context();

  const [response, setResponse] = useGlobalState("vaultData");

  const doMulticall = useCallback(async () => {
    if (ethersProvider && chainId && library) {
      const vault = getVault(chainId, library);

      if (vault) {
        const promises = [
          vault.totalBalance(),
          vault.cap(),
          vault.accountVaultBalance(account || constants.AddressZero),
        ];
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
          });

          return;
        }

        setResponse({
          status: "success",
          ...data,
          vaultBalanceInAsset: responses[2],
        });
      }
    }
  }, [account, setResponse, ethersProvider, walletConnected, chainId, library]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, walletConnected]);

  return response;
};

export default useVaultData;
