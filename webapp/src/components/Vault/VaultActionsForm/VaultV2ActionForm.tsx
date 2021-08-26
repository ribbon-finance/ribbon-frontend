import React, { useMemo } from "react";
import styled from "styled-components";

import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { getAssets } from "shared/lib/constants/constants";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { isPracticallyZero } from "shared/lib/utils/math";
import VaultV2MigrationForm from "./v2/VaultV2MigrationForm";
import { FormStepProps } from "./types";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import { PrimaryText } from "shared/lib/designSystem";
import { getVaultColor } from "shared/lib/utils/vault";
import VaultV2DepositWithdrawForm from "./v2/VaultV2DepositWithdrawForm";
import useVaultActionForm from "../../../hooks/useVaultActionForm";
import { ACTIONS } from "./Modal/types";

const FormContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  background: ${colors.background};
  z-index: 1;
`;

const FormExtraContainer = styled.div`
  background: ${colors.primaryText}0a;
  padding: 32px 24px 16px 24px;
  margin-top: -16px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  text-align: center;
  z-index: 0;
`;

const VaultV2ActionsForm: React.FC<FormStepProps> = ({
  vaultOption,
  onFormSubmit,
}) => {
  const vaultOptions = useMemo(() => [vaultOption], [vaultOption]);
  const { vaultAccounts } = useVaultAccounts(vaultOptions);
  const decimals = getAssetDecimals(getAssets(vaultOption));
  const color = getVaultColor(vaultOption);
  const { vaultActionForm } = useVaultActionForm(vaultOption);

  const showMigrationForm = useMemo(
    () =>
      Boolean(
        vaultAccounts[vaultOption] &&
          !isPracticallyZero(vaultAccounts[vaultOption]!.totalBalance, decimals)
      ),
    [decimals, vaultAccounts, vaultOption]
  );

  const content = useMemo(() => {
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

    return (
      <VaultV2DepositWithdrawForm
        vaultOption={vaultOption}
        onFormSubmit={onFormSubmit}
      />
    );
  }, [onFormSubmit, showMigrationForm, vaultAccounts, vaultOption]);

  const formExtra = useMemo(() => {
    if (vaultActionForm.actionType === ACTIONS.withdraw) {
      return <></>;
    }

    let formExtraText = <></>;

    if (showMigrationForm) {
      formExtraText = (
        <>
          IMPORTANT: Withdrawal fees do not apply for migrations from V1 to V2
        </>
      );
    } else {
      switch (vaultActionForm.actionType) {
        case ACTIONS.deposit:
          formExtraText = (
            <>
              Your deposit will be deployed in the vault’s weekly strategy on
              Friday at 11am UTC
            </>
          );
          break;
        case ACTIONS.transfer:
          formExtraText = (
            <>
              Vault transfers are <strong>FREE</strong>: withdrawal fees are
              waived when you transfer funds between{" "}
              {vaultActionForm.vaultOption} and
              {vaultActionForm.receiveVault}
            </>
          );
          break;
      }
    }

    return (
      <FormExtraContainer>
        <PrimaryText color={color}>{formExtraText}</PrimaryText>
      </FormExtraContainer>
    );
  }, [
    color,
    showMigrationForm,
    vaultActionForm.actionType,
    vaultActionForm.receiveVault,
    vaultActionForm.vaultOption,
  ]);

  return (
    <>
      <FormContainer>{content}</FormContainer>

      {/* Extra */}
      {formExtra}
    </>
  );
};

export default VaultV2ActionsForm;
