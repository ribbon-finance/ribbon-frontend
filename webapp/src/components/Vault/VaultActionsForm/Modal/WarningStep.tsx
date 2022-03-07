import React from "react";
import styled from "styled-components";

import {
  getAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { WithdrawMetadata } from "../../../../hooks/useVaultActionForm";
import { ACTIONS, ActionType, V2WithdrawOption } from "./types";
import colors from "shared/lib/designSystem/colors";
import { SecondaryText, Title } from "shared/lib/designSystem";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { formatBigNumber } from "shared/lib/utils/math";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import WarningModalContent from "./WarningModalContent";

const ActionLogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${colors.red}14;
`;

const FormTitle = styled(Title)`
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
`;

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
