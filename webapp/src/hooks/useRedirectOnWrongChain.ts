import { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { VaultOptions } from "shared/lib/constants/constants";
import { isVaultSupportedOnChain } from "shared/lib/utils/vault";

const useRedirectOnWrongChain = (
  vaultOption: VaultOptions | undefined,
  chainId: number | undefined
) => {
  const v1VaultPage = useRouteMatch({ path: "/theta-vault" });
  const v2VaultPage = useRouteMatch({ path: "/v2/theta-vault" });
  const isVaultPage = Boolean(v1VaultPage || v2VaultPage);
  const history = useHistory();

  useEffect(() => {
    if (
      isVaultPage &&
      chainId &&
      vaultOption &&
      !isVaultSupportedOnChain(vaultOption, chainId)
    ) {
      setTimeout(() => {
        history.push("/");
      }, 500);
    }
  }, [chainId, history, isVaultPage, vaultOption]);
};

export default useRedirectOnWrongChain;
