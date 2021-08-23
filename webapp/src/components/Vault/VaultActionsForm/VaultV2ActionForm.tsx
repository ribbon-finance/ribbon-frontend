import React, { useMemo } from "react";

import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { getAssets } from "shared/lib/constants/constants";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { isPracticallyZero } from "shared/lib/utils/math";
import VaultV2MigrationForm from "./Migration/VaultV2MigrationForm";
import { FormStepProps } from "./types";

const VaultV2ActionsForm: React.FC<FormStepProps> = ({
  vaultOption,
  onFormSubmit,
}) => {
  const vaultOptions = useMemo(() => [vaultOption], [vaultOption]);
  const { vaultAccounts } = useVaultAccounts(vaultOptions);
  const decimals = getAssetDecimals(getAssets(vaultOption));

  const showMigrationForm = useMemo(
    () =>
      Boolean(
        vaultAccounts[vaultOption] &&
          !isPracticallyZero(vaultAccounts[vaultOption]!.totalBalance, decimals)
      ),
    [decimals, vaultAccounts, vaultOption]
  );

  /**
   * Show migration form if user has balance in v1
   */
  if (showMigrationForm) {
    return (
      <VaultV2MigrationForm
        vaultOption={vaultOption}
        vaultAccount={vaultAccounts[vaultOption]!}
        onFormSubmit={onFormSubmit}
      />
    );
  }

  return <></>;
};

export default VaultV2ActionsForm;
