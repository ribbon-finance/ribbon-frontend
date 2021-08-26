import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import { VaultOptions } from "shared/lib/constants/constants";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import { PrimaryText, SecondaryText, Title } from "shared/lib/designSystem";
import { getAssetDisplay } from "shared/lib/utils/asset";
import { VaultAccount } from "shared/lib/models/vault";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import { MigrateIcon } from "shared/lib/assets/icons/icons";
import { getVaultColor } from "shared/lib/utils/vault";
import { ActionButton } from "shared/lib/components/Common/buttons";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import { ACTIONS } from "../Modal/types";
import useVaultData from "shared/lib/hooks/useVaultData";
import CapBar from "shared/lib/components/Deposit/CapBar";

const MigrateLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}14;
`;

const FormTitle = styled(Title)`
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
`;

const FormDescriptionHighlight = styled.span`
  color: ${colors.primaryText};
`;

const PillButton = styled.div`
  padding: 10px 16px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 100px;
`;

const MigratinFormModeList = ["options", "migrate"] as const;
type MigrationFormMode = typeof MigratinFormModeList[number];

interface VaultV2MigrationFormProps {
  vaultOption: VaultOptions;
  vaultAccount: VaultAccount;
  onFormSubmit: () => void;
}

const VaultV2MigrationForm: React.FC<VaultV2MigrationFormProps> = ({
  vaultOption,
  vaultAccount,
  onFormSubmit,
}) => {
  /** V1 Vault data */
  const { deposits, vaultMaxWithdrawAmount, asset, decimals } =
    useVaultData(vaultOption);
  const color = getVaultColor(vaultOption);
  const { handleActionTypeChange, handleMaxClick } =
    useVaultActionForm(vaultOption);

  const [mode, setMode] = useState<MigrationFormMode>(MigratinFormModeList[0]);

  const [weeklyMigrationAmount, weeklyMigrationAmountLimit] = useMemo((): [
    BigNumber,
    BigNumber
  ] => {
    const vaultCollaterizedAmount = deposits.sub(vaultMaxWithdrawAmount);
    const vaultMinimumUncollaterizedAmount = vaultCollaterizedAmount
      .mul(100)
      .div(90)
      .div(10);
    const weeklyMigration = vaultMinimumUncollaterizedAmount.sub(
      vaultMaxWithdrawAmount
    );

    return [
      weeklyMigration.isNegative() ? BigNumber.from(0) : weeklyMigration,
      vaultMaxWithdrawAmount.gte(vaultMinimumUncollaterizedAmount)
        ? vaultMaxWithdrawAmount
        : vaultMinimumUncollaterizedAmount,
    ];
  }, [deposits, vaultMaxWithdrawAmount]);

  const error = useMemo(() => {
    if (!isPracticallyZero(vaultAccount.totalStakedBalance, decimals)) {
      return "amountStaked";
    }

    if (vaultAccount.totalBalance.gt(vaultMaxWithdrawAmount)) {
      return "insufficientWithdrawalLimit";
    }

    return undefined;
  }, [
    decimals,
    vaultAccount.totalBalance,
    vaultAccount.totalStakedBalance,
    vaultMaxWithdrawAmount,
  ]);

  /**
   * Show v1 withdraw form here
   */
  const handleWithdraw = useCallback(() => {
    handleActionTypeChange(ACTIONS.withdraw);
    handleMaxClick();
    onFormSubmit();
  }, [handleActionTypeChange, handleMaxClick, onFormSubmit]);

  /**
   * Show migration form here
   */
  const handleMigrate = useCallback(() => {
    handleActionTypeChange(ACTIONS.migrate);
    handleMaxClick();
    onFormSubmit();
  }, [handleActionTypeChange, handleMaxClick, onFormSubmit]);

  const errorText = useMemo(() => {
    switch (error) {
      case "amountStaked":
        return (
          <SecondaryText className="mt-3 text-center" color={colors.red}>
            Before you migrate to V2 you must unstake your funds from the
            rETH-THETA staking pool
          </SecondaryText>
        );
      case "insufficientWithdrawalLimit":
        return (
          <SecondaryText className="mt-3 text-center" color={colors.red}>
            Migrating your ETH from V1 to V2 will breach the weekly migration
            limit. Please try again on Friday at 10am UTC when the weekly
            migration limit is reset.
          </SecondaryText>
        );
    }

    return <></>;
  }, [error]);

  const body = useMemo(() => {
    switch (mode) {
      case "options":
        return (
          <>
            <PrimaryText className="mt-3 text-center" color={colors.text}>
              You can now move your V1 deposit balance of{" "}
              <FormDescriptionHighlight>
                {formatBigNumber(vaultAccount.totalBalance, 6, decimals)}{" "}
                {getAssetDisplay(asset)}
              </FormDescriptionHighlight>{" "}
              to the V2 vault
            </PrimaryText>

            {/* Migrate button */}
            <ActionButton
              color={color}
              className="py-3 mt-4"
              onClick={() => {
                setMode("migrate");
              }}
            >
              MIGRATE {getAssetDisplay(asset)}
            </ActionButton>

            <SecondaryText className="mt-3">OR</SecondaryText>

            {/* Withdraw button */}
            <PillButton className="mt-3" role="button" onClick={handleWithdraw}>
              <PrimaryText>Withdraw {getAssetDisplay(asset)}</PrimaryText>
            </PillButton>
          </>
        );
      case "migrate":
        return (
          <>
            <PrimaryText className="mt-3 text-center" color={colors.text}>
              ETH deposits can now be migrated over from the V1 vault
            </PrimaryText>

            {/* V1 Balance */}
            <div className="d-flex w-100 align-items-center mt-4">
              <SecondaryText>Your V1 Balance</SecondaryText>
              <Title className="ml-auto">
                {formatBigNumber(vaultAccount.totalBalance, 6, decimals)}{" "}
                {getAssetDisplay(asset)}
              </Title>
            </div>

            <div className="d-flex w-100 mt-3">
              <CapBar
                loading={false}
                current={parseFloat(
                  formatUnits(weeklyMigrationAmount, decimals)
                )}
                cap={parseFloat(
                  formatUnits(weeklyMigrationAmountLimit, decimals)
                )}
                copies={{
                  current: "Weekly Migrations",
                  cap: "Weekly Migration Limit",
                }}
                labelConfig={{
                  fontSize: 14,
                }}
                statsConfig={{
                  fontSize: 16,
                }}
                barConfig={{
                  height: 4,
                  extraClassNames: "my-2",
                  radius: 2,
                }}
                asset={asset}
              />
            </div>

            {/* Migrate button */}
            <ActionButton
              color={color}
              className="py-3 mt-4"
              disabled={Boolean(error)}
              onClick={handleMigrate}
            >
              MIGRATE {getAssetDisplay(asset)}
            </ActionButton>
            {errorText}
          </>
        );
    }
  }, [
    asset,
    color,
    decimals,
    error,
    errorText,
    handleMigrate,
    handleWithdraw,
    mode,
    vaultAccount.totalBalance,
    weeklyMigrationAmount,
    weeklyMigrationAmountLimit,
  ]);

  return (
    <div className="d-flex flex-column align-items-center p-4">
      {/* Logo */}
      <MigrateLogoContainer color={color} className="mt-3">
        <MigrateIcon color={color} />
      </MigrateLogoContainer>

      <FormTitle className="mt-3">MIRGATE TO V2</FormTitle>
      {body}
    </div>
  );
};

export default VaultV2MigrationForm;
