import { useWeb3Context } from "./web3Context";
import { useCallback, useEffect } from "react";
import { VaultDataResponse } from "../store/types";
import { useGlobalState } from "../store/store";
import { getVault } from "./useVault";
import { getDefaultChainID } from "../utils/env";

type UseVaultData = () => VaultDataResponse;

const useVaultData: UseVaultData = () => {
  const { provider: ethersProvider } = useWeb3Context();

  const [response, setResponse] = useGlobalState<any>("vaultData");

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

        try {
          const responses = await Promise.all(unconnectedPromises);

          setResponse({
            status: "success",
            deposits: responses[0],
            vaultLimit: responses[1],
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setResponse]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall]);

  return response;
};

export default useVaultData;
