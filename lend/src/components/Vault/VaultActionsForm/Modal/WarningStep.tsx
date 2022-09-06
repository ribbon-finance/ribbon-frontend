import React from "react";
import {
  getAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { WithdrawMetadata } from "../../../../hooks/useVaultActionForm";
import { ACTIONS, ActionType, V2WithdrawOption } from "./types";
import { formatBigNumber } from "shared/lib/utils/math";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import WarningModalContent from "./WarningModalContent";

interface WarningStepProps {
  actionType: ActionType;
  withdrawOption?: V2WithdrawOption;
  vaultOption: VaultOptions;
  vaultVersion: VaultVersion;
  withdrawMetadata: WithdrawMetadata;
  onFormSubmit: () => void;
}

const WarningStep: React.FC<WarningStepProps> = ({
  actionType,
  withdrawOption,
  vaultOption,
  vaultVersion,
  withdrawMetadata,
  onFormSubmit,
}) => {
  const asset = getAssets(vaultOption);

  // Standard withdraw warning for v2
  if (
    actionType === ACTIONS.withdraw &&
    withdrawOption === "standard" &&
    vaultVersion === "v2" &&
    !withdrawMetadata.instantWithdrawBalance?.isZero()
  ) {
    return (
      <WarningModalContent
        descriptionText={`
        You can withdraw ${formatBigNumber(
          withdrawMetadata.instantWithdrawBalance!,
          getAssetDecimals(asset)
        )} ${getAssetDisplay(
          asset
        )} immediately via instant withdrawals because these funds have not yet been deployed in the vault’s strategy`}
        onButtonClick={onFormSubmit}
      />
    );
  }

  return <></>;
};

export default WarningStep;
