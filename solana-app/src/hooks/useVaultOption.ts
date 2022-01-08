import { useMemo } from "react";
import { useRouteMatch } from "react-router-dom";

import {
  VaultName,
  VaultNameOptionMap,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";

const useVaultOption = () => {
  const matchv1 = useRouteMatch<{ vaultSymbol: string }>(
    "/theta-vault/:vaultSymbol"
  );
  const matchv2 = useRouteMatch<{ vaultSymbol: string }>(
    "/v2/theta-vault/:vaultSymbol"
  );
  const [vaultOption, vaultVersion] = useMemo((): [
    VaultOptions | undefined,
    VaultVersion
  ] => {
    if (
      matchv1?.params.vaultSymbol &&
      matchv1.params.vaultSymbol in VaultNameOptionMap
    ) {
      return [
        VaultNameOptionMap[matchv1?.params.vaultSymbol as VaultName],
        "v1",
      ];
    }

    if (
      matchv2?.params.vaultSymbol &&
      matchv2.params.vaultSymbol in VaultNameOptionMap
    ) {
      return [
        VaultNameOptionMap[matchv2?.params.vaultSymbol as VaultName],
        "v2",
      ];
    }

    /** Default value */
    return [undefined, "v1"];
  }, [matchv1, matchv2]);

  return { vaultOption, vaultVersion };
};

export default useVaultOption;
