import React, { useMemo, useState } from "react";
import styled from "styled-components";

import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { getAssetDisplay } from "shared/lib/utils/asset";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import VaultV2MigrationForm from "./v2/VaultV2MigrationForm";
import { FormStepProps } from "./types";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import { PrimaryText } from "shared/lib/designSystem";
import { getVaultColor } from "shared/lib/utils/vault";
import VaultV2DepositWithdrawForm from "./v2/VaultV2DepositWithdrawForm";
import useVaultActionForm from "../../../hooks/useVaultActionForm";
import { ACTIONS } from "./Modal/types";
import useV2VaultData from "shared/lib/hooks/useV2VaultData";

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
  margin-top: -20px;
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
  const { vaultAccounts: v1VaultAccounts } = useVaultAccounts(
    vaultOptions,
    "v1",
    { poll: true }
  );
  const {
    data: { asset, decimals, depositBalanceInAsset },
  } = useV2VaultData(vaultOption, { poll: true });
  const [hideMigrationForm, setHideMigrationForm] = useState(false);

  const color = getVaultColor(vaultOption);
  const { vaultActionForm } = useVaultActionForm(vaultOption);

  const canMigrate = useMemo(
    () =>
      Boolean(
        v1VaultAccounts[vaultOption] &&
          !isPracticallyZero(
            v1VaultAccounts[vaultOption]!.totalBalance,
            decimals
          )
      ),
    [decimals, v1VaultAccounts, vaultOption]
  );

  const content = useMemo(() => {
    /**
     * Show migration form if user has balance in v1
     */
    if (canMigrate && !hideMigrationForm) {
      return (
        <VaultV2MigrationForm
          vaultOption={vaultOption}
          vaultAccount={v1VaultAccounts[vaultOption]!}
          onFormSubmit={onFormSubmit}
          onHideForm={() => setHideMigrationForm(true)}
        />
      );
    }

    return (
      <VaultV2DepositWithdrawForm
        vaultOption={vaultOption}
        onFormSubmit={onFormSubmit}
      />
    );
  }, [
    onFormSubmit,
    canMigrate,
    hideMigrationForm,
    v1VaultAccounts,
    vaultOption,
  ]);

  const formExtra = useMemo(() => {
    let formExtraText: JSX.Element | undefined = undefined;

    if (canMigrate && !hideMigrationForm) {
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
        case ACTIONS.withdraw:
          if (!isPracticallyZero(depositBalanceInAsset, decimals)) {
            formExtraText =
              vaultActionForm.withdrawOption === "instant" ? (
                <>
                  You can withdraw your{" "}
                  {formatBigNumber(depositBalanceInAsset, decimals)}{" "}
                  {getAssetDisplay(asset)} instantly because these funds have
                  not yet been deployed in the vault’s strategy
                </>
              ) : (
                <>
                  You can withdraw{" "}
                  {formatBigNumber(depositBalanceInAsset, decimals)}{" "}
                  {getAssetDisplay(asset)} immediately via instant withdrawals
                  because these funds have not yet been deployed in the vault’s
                  strategy
                </>
              );
          }
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

    if (!formExtraText) {
      return <></>;
    }

    return (
      <FormExtraContainer>
        <PrimaryText color={color}>{formExtraText}</PrimaryText>
      </FormExtraContainer>
    );
  }, [
    asset,
    color,
    decimals,
    depositBalanceInAsset,
    canMigrate,
    hideMigrationForm,
    vaultActionForm.actionType,
    vaultActionForm.receiveVault,
    vaultActionForm.vaultOption,
    vaultActionForm.withdrawOption,
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
