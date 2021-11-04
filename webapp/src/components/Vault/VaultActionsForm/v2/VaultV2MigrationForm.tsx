import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";

import { VaultOptions } from "shared/lib/constants/constants";
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
import { useVaultData, useV2VaultData } from "shared/lib/hooks/web3DataContext";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";

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

const FormDescription = styled(PrimaryText)`
  font-size: 14px;
  line-height: 20px;
  color: ${colors.text};
`;

const FormColumnData = styled(Title)`
  font-size: 14px;
  line-height: 20px;
`;

interface VaultV2MigrationFormProps {
  vaultOption: VaultOptions;
  vaultAccount: VaultAccount;
  onFormSubmit: () => void;
  onHideForm: () => void;
}

const VaultV2MigrationForm: React.FC<VaultV2MigrationFormProps> = ({
  vaultOption,
  vaultAccount,
  onFormSubmit,
  onHideForm,
}) => {
  const { vaultMaxWithdrawAmount, asset, decimals } = useVaultData(vaultOption);
  const {
    data: { totalBalance, cap },
  } = useV2VaultData(vaultOption);
  const color = getVaultColor(vaultOption);
  const { handleActionTypeChange, handleMaxClick } =
    useVaultActionForm(vaultOption);

  const migrationLimit = useMemo(() => {
    const v2Capacity = cap.sub(totalBalance);
    const normalizedV2capacity = v2Capacity.isNegative()
      ? BigNumber.from(0)
      : v2Capacity;

    return vaultMaxWithdrawAmount.gte(normalizedV2capacity)
      ? normalizedV2capacity
      : vaultMaxWithdrawAmount;
  }, [cap, totalBalance, vaultMaxWithdrawAmount]);

  const error = useMemo(() => {
    if (!isPracticallyZero(vaultAccount.totalStakedBalance, decimals)) {
      return "amountStaked";
    }

    if (vaultAccount.totalBalance.gt(migrationLimit)) {
      return "insufficientMigrationLimit";
    }

    return undefined;
  }, [
    decimals,
    migrationLimit,
    vaultAccount.totalBalance,
    vaultAccount.totalStakedBalance,
  ]);

  /**
   * Show migration form here
   */
  const handleMigrate = useCallback(() => {
    handleActionTypeChange(ACTIONS.migrate, "v1");
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
      case "insufficientMigrationLimit":
        return (
          <SecondaryText className="mt-3 text-center" color={colors.red}>
            Migrating your {getAssetDisplay(asset)} from V1 to V2 will breach
            the weekly migration limit. Please try again on Friday at 10am UTC
            when the weekly migration limit is reset.
          </SecondaryText>
        );
    }

    return <></>;
  }, [error, asset]);

  return (
    <div className="d-flex flex-column align-items-center p-4">
      {/* Logo */}
      <MigrateLogoContainer color={color} className="mt-3">
        <MigrateIcon color={color} />
      </MigrateLogoContainer>

      <FormTitle className="mt-3">MIGRATE TO V2</FormTitle>

      <FormDescription className="mt-3 text-center">
        {getAssetDisplay(asset)} deposits can now be migrated over from the V1
        vault
      </FormDescription>

      {/* V1 Balance */}
      <div className="d-flex w-100 align-items-center mt-4">
        <SecondaryText>Your V1 Balance</SecondaryText>
        <FormColumnData className="ml-auto">
          {formatBigNumber(vaultAccount.totalBalance, decimals)}{" "}
          {getAssetDisplay(asset)}
        </FormColumnData>
      </div>

      {/* Migration limit */}
      <div className="d-flex w-100 align-items-center mt-4">
        <SecondaryText>Migration Limit</SecondaryText>
        <TooltipExplanation
          title="MIGRATION LIMIT"
          explanation="The weekly migration limit is the max amount that can be migrated to the v2 vault. This amount takes into account the v1 vault's weekly withdrawal limit and the v2 vault's initial capacity."
          renderContent={({ ref, ...triggerHandler }) => (
            <HelpInfo containerRef={ref} {...triggerHandler}>
              i
            </HelpInfo>
          )}
        />
        <FormColumnData
          className="ml-auto"
          color={
            error === "insufficientMigrationLimit" ? colors.red : undefined
          }
        >
          {formatBigNumber(migrationLimit, decimals)} {getAssetDisplay(asset)}
        </FormColumnData>
      </div>

      {/* Migrate button */}
      <ActionButton
        color={color}
        className="py-3 mt-4"
        disabled={Boolean(error)}
        onClick={handleMigrate}
      >
        Migrate {getAssetDisplay(asset)}
      </ActionButton>
      {errorText}
      <SecondaryText
        className="mt-4 "
        color={colors.primaryText}
        role="button"
        onClick={onHideForm}
      >
        <u>Skip Migration</u>
      </SecondaryText>
    </div>
  );
};

export default VaultV2MigrationForm;
