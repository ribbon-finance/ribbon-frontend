import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { useTranslation, Trans } from "react-i18next";
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
import useVaultPriceHistory from "shared/lib/hooks/useVaultPerformanceUpdate";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";

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
  const { t } = useTranslation();
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
  const { priceHistory } = useVaultPriceHistory(vaultOption, "v2");
  const [hideMigrationForm, setHideMigrationForm] = useState(false);
  const [hideCompleteWithdrawReminder, setHideCompleteWithdrawReminder] =
    useState(false);

  const color = getVaultColor(vaultOption);
  const { vaultActionForm, handleActionTypeChange } =
    useVaultActionForm(vaultOption);
  const withdrawalAmount = useMemo(
    () =>
      withdrawals.shares
        .mul(
          priceHistory.find((history) => history.round === withdrawals.round)
            ?.pricePerShare || BigNumber.from(0)
        )
        .div(parseUnits("1", decimals)),
    [decimals, priceHistory, withdrawals.round, withdrawals.shares]
  );

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
      !withdrawals.shares.isZero() &&
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
            {formatBigNumber(withdrawalAmount, decimals)}{" "}
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
    withdrawalAmount,
  ]);

  const FormExtra = () => {
    return (
      <FormExtraContainer>
        <PrimaryText fontSize={14} lineHeight={20} color={color}>
          {migrateSourceVault &&
            !hideMigrationForm &&
            t("webapp:VaultV2ActionForm:migrationFees")}
          {(!canCompleteWithdraw || hideCompleteWithdrawReminder) &&
            {
              [ACTIONS.deposit]: t("webapp:VaultV2ActionForm:actions:deposit"),
              [ACTIONS.withdraw]: () => {
                if (
                  !isPracticallyZero(depositBalanceInAsset, decimals) &&
                  vaultActionForm.vaultOption !== "rSOL-THETA"
                ) {
                  return vaultActionForm.withdrawOption === "instant"
                    ? t(
                        "webapp:VaultV2ActionForm:actions:withdraw:instantNotice"
                      )
                    : t("webapp:VaultV2ActionForm:actions:withdraw:available", {
                        amount: formatBigNumber(
                          depositBalanceInAsset,
                          decimals
                        ),
                        asset: getAssetDisplay(asset),
                      });
                }
                if (!isPracticallyZero(lockedBalanceInAsset, decimals)) {
                  if (vaultActionForm.withdrawOption === "instant") {
                    return t("webapp:VaultV2ActionForm:actions:unavailable");
                  }
                }
                return;
              },
              [ACTIONS.transfer]: (
                <Trans
                  i18nKey="webapp:VaultV2ActionForm:actions:transfer"
                  values={{
                    srcVault: vaultActionForm.vaultOption,
                    dstVault: vaultActionForm.receiveVault,
                  }}
                >
                  <strong></strong>
                </Trans>
              ),
            }[vaultActionForm.actionType]}
        </PrimaryText>
      </FormExtraContainer>
    );
  };

  return (
    <>
      <FormContainer>{content}</FormContainer>
      <FormExtra />
    </>
  );
};

export default VaultV2ActionsForm;
