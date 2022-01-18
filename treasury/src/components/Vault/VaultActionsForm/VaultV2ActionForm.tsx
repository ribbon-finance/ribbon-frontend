import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";

import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { getAssetDisplay } from "shared/lib/utils/asset";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import VaultV2MigrationForm from "./v2/VaultV2MigrationForm";
import { FormStepProps } from "./types";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import { Title, PrimaryText, SecondaryText } from "shared/lib/designSystem";
import { getVaultColor } from "shared/lib/utils/vault";
import VaultV2DepositWithdrawForm from "./v2/VaultV2DepositWithdrawForm";
import useVaultActionForm from "../../../hooks/useVaultActionForm";
import { ACTIONS } from "./Modal/types";
import { useV2VaultData } from "shared/lib/hooks/web3DataContext";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { getVaultURI } from "../../../constants/constants";
import { WithdrawIcon } from "shared/lib/assets/icons/icons";
import { RibbonVaultMigrationMap } from "shared/lib/constants/constants";

const FormContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: ${theme.border.radius};
  background: ${colors.background.two};
  z-index: 1;
`;

const FormExtraContainer = styled.div`
  background: ${colors.background.three};
  padding: 32px 24px 16px 24px;
  margin-top: -20px;
  border-radius: ${theme.border.radius};
  text-align: center;
  z-index: 0;
`;

const CompleteWithdrawLogo = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}14;
`;

const CompleteWithdrawTitle = styled(Title)`
  letter-spacing: 1px;
`;

const VaultV2ActionsForm: React.FC<FormStepProps> = ({
  vaultOption,
  onFormSubmit,
}) => {
  const history = useHistory();
  const { vaultAccounts: v1VaultAccounts } = useVaultAccounts("v1");
  const {
    data: {
      asset,
      decimals,
      depositBalanceInAsset,
      lockedBalanceInAsset,
      round,
      withdrawals,
    },
  } = useV2VaultData(vaultOption);
  const [hideMigrationForm, setHideMigrationForm] = useState(false);
  const [hideCompleteWithdrawReminder, setHideCompleteWithdrawReminder] =
    useState(false);

  const color = getVaultColor(vaultOption);
  const { vaultActionForm, handleActionTypeChange } =
    useVaultActionForm(vaultOption);

  const migrateSourceVault = useMemo(
    () =>
      RibbonVaultMigrationMap[vaultOption]?.v2?.find((_vaultOption) =>
        Boolean(
          v1VaultAccounts[_vaultOption] &&
            !isPracticallyZero(
              v1VaultAccounts[_vaultOption]!.totalBalance,
              decimals
            )
        )
      ),

    [decimals, v1VaultAccounts, vaultOption]
  );

  const canCompleteWithdraw = useMemo(() => {
    return (
      vaultActionForm.withdrawOption !== "instant" &&
      !withdrawals.amount.isZero() &&
      withdrawals.round !== round
    );
  }, [round, vaultActionForm.withdrawOption, withdrawals]);

  /**
   * Make sure action type cannot be migrate when user cannot migrate
   */
  useEffect(() => {
    if (!migrateSourceVault && vaultActionForm.actionType === "migrate") {
      handleActionTypeChange(ACTIONS.deposit, "v2");
    }
  }, [migrateSourceVault, vaultActionForm.actionType, handleActionTypeChange]);

  const content = useMemo(() => {
    /**
     * Show migration form if user has balance in v1
     */
    if (migrateSourceVault && !hideMigrationForm) {
      return (
        <VaultV2MigrationForm
          vaultOption={vaultOption}
          migrateSourceVault={migrateSourceVault}
          onFormSubmit={onFormSubmit}
          onHideForm={() => setHideMigrationForm(true)}
        />
      );
    }

    /**
     * Show withdrawal reminder
     */
    if (canCompleteWithdraw && !hideCompleteWithdrawReminder) {
      return (
        <div className="d-flex flex-column align-items-center p-4">
          <CompleteWithdrawLogo color={color} className="mt-3">
            <WithdrawIcon color={color} height={32} width={32} />
          </CompleteWithdrawLogo>

          <CompleteWithdrawTitle
            fontSize={22}
            lineHeight={28}
            className="mt-3 text-center"
          >
            Complete your initiated withdrawal
          </CompleteWithdrawTitle>

          <PrimaryText
            fontSize={14}
            lineHeight={20}
            className="mt-3 text-center"
            color={colors.text}
          >
            You can now complete your withdrawal of{" "}
            {formatBigNumber(withdrawals.amount, decimals)}{" "}
            {getAssetDisplay(asset)} from the vault.
          </PrimaryText>

          {/* Migrate button */}
          <ActionButton
            color={color}
            className="py-3 mt-4"
            onClick={() => {
              setHideCompleteWithdrawReminder(true);
              /**
               * Push complete withdraw history
               */
              history.push(
                getVaultURI(vaultOption, "v2") +
                  "?initialAction=completeWithdraw"
              );
            }}
          >
            Complete Withdrawal
          </ActionButton>

          <SecondaryText
            className="mt-4 "
            color={colors.primaryText}
            role="button"
            onClick={() => setHideCompleteWithdrawReminder(true)}
          >
            <u>Skip</u>
          </SecondaryText>
        </div>
      );
    }

    return (
      <VaultV2DepositWithdrawForm
        vaultOption={vaultOption}
        onFormSubmit={onFormSubmit}
      />
    );
  }, [
    asset,
    canCompleteWithdraw,
    migrateSourceVault,
    color,
    decimals,
    hideCompleteWithdrawReminder,
    hideMigrationForm,
    history,
    onFormSubmit,
    vaultOption,
    withdrawals.amount,
  ]);

  const formExtra = useMemo(() => {
    let formExtraText: JSX.Element | undefined = undefined;

    if (migrateSourceVault && !hideMigrationForm) {
      formExtraText = (
        <>
          IMPORTANT: Withdrawal fees do not apply for migrations from V1 to V2
        </>
      );
    } else if (!canCompleteWithdraw || hideCompleteWithdrawReminder) {
      switch (vaultActionForm.actionType) {
        case ACTIONS.deposit:
          formExtraText = (
            <>
              Your deposit will be deployed in the vault’s strategy in the next
              round
            </>
          );
          break;
        case ACTIONS.withdraw:
          if (!isPracticallyZero(depositBalanceInAsset, decimals)) {
            formExtraText =
              vaultActionForm.withdrawOption === "instant" ? (
                <>
                  IMPORTANT: instant withdrawals are only available before 11am
                  UTC on Friday for funds that have not been deployed in the
                  vault's strategy
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
            break;
          }

          if (!isPracticallyZero(lockedBalanceInAsset, decimals)) {
            if (vaultActionForm.withdrawOption === "instant") {
              formExtraText = (
                <>
                  Instant withdrawals are unavailable because your funds have
                  been deployed in the vault's strategy. To withdraw your funds
                  you need to initiate a withdrawal using standard withdrawals.
                </>
              );
            }
            break;
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
        <PrimaryText fontSize={14} lineHeight={20} color={color}>
          {formExtraText}
        </PrimaryText>
      </FormExtraContainer>
    );
  }, [
    asset,
    canCompleteWithdraw,
    migrateSourceVault,
    color,
    decimals,
    depositBalanceInAsset,
    hideCompleteWithdrawReminder,
    hideMigrationForm,
    lockedBalanceInAsset,
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
