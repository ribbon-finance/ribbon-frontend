import { useState, useEffect } from "react";
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
  const [vaultOption, setVaultOption] = useState<VaultOptions | undefined>(
    // Match v1
    matchv1?.params.vaultSymbol &&
      matchv1.params.vaultSymbol in VaultNameOptionMap
      ? VaultNameOptionMap[matchv1?.params.vaultSymbol as VaultName]
      : // Match V2
      matchv2?.params.vaultSymbol &&
        matchv2.params.vaultSymbol in VaultNameOptionMap
      ? VaultNameOptionMap[matchv2?.params.vaultSymbol as VaultName]
      : undefined
  );
  const [vaultVersion, setVaultVersion] = useState<VaultVersion>(
    // Match v1
    matchv1?.params.vaultSymbol &&
      matchv1.params.vaultSymbol in VaultNameOptionMap
      ? "v1"
      : // Match V2
      matchv2?.params.vaultSymbol &&
        matchv2.params.vaultSymbol in VaultNameOptionMap
      ? "v2"
      : // Default version
        "v1"
  );

  useEffect(() => {
    if (
      matchv1 &&
      matchv1.params &&
      matchv1.params.vaultSymbol in VaultNameOptionMap
    ) {
      setVaultOption(
        VaultNameOptionMap[matchv1.params.vaultSymbol as VaultName]
      );
      setVaultVersion("v1");
      return;
    }

    if (
      matchv2 &&
      matchv2.params &&
      matchv2.params.vaultSymbol in VaultNameOptionMap
    ) {
      setVaultOption(
        VaultNameOptionMap[matchv2.params.vaultSymbol as VaultName]
      );
      setVaultVersion("v2");
      return;
    }

    setVaultOption(undefined);
  }, [matchv1, matchv2]);

  return { vaultOption, vaultVersion };
};

export default useVaultOption;
