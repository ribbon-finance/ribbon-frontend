import { useMemo } from "react";
import { useRouteMatch } from "react-router-dom";

import {
  VaultName,
  VaultNameOptionMap,
  VaultOptions,
  VaultVersion,
  VaultList,
  isEarnVault,
} from "shared/lib/constants/constants";

const useVaultOption = () => {
  const matchv2 = useRouteMatch<{ vaultSymbol: string }>(
    "/treasury/:vaultSymbol"
  );
  const [vaultOption, vaultVersion] = useMemo((): [
    VaultOptions | undefined,
    VaultVersion
  ] => {
    if (
      matchv2?.params.vaultSymbol &&
      matchv2.params.vaultSymbol in VaultNameOptionMap &&
      VaultList.indexOf(
        VaultNameOptionMap[
          matchv2?.params.vaultSymbol as VaultName
        ] as typeof VaultList[number]
      ) > -1
    ) {
      const vaultName =
        VaultNameOptionMap[matchv2?.params.vaultSymbol as VaultName];
      if (isEarnVault(vaultName)) {
        return [vaultName, "earn"];
      }
      return [vaultName, "v2"];
    }

    /** Default value */
    return [undefined, "v1"];
  }, [matchv2]);

  return { vaultOption, vaultVersion };
};

export default useVaultOption;
