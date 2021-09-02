import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

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

  return (
    <div className="d-flex flex-column align-items-center p-4">
      {/* Logo */}
      <MigrateLogoContainer color={color} className="mt-3">
        <MigrateIcon color={color} />
      </MigrateLogoContainer>

      <FormTitle className="mt-3">MIRGATE TO V2</FormTitle>

      <FormDescription className="mt-3 text-center">
        ETH deposits can now be migrated over from the V1 vault
      </FormDescription>

      {/* V1 Balance */}
      <div className="d-flex w-100 align-items-center mt-4">
        <SecondaryText>Your V1 Balance</SecondaryText>
        <FormColumnData className="ml-auto">
          {formatBigNumber(vaultAccount.totalBalance, decimals)}{" "}
          {getAssetDisplay(asset)}
        </FormColumnData>
      </div>

      <div className="d-flex w-100 mt-3">
        <CapBar
          loading={false}
          current={parseFloat(formatUnits(weeklyMigrationAmount, decimals))}
          cap={parseFloat(formatUnits(weeklyMigrationAmountLimit, decimals))}
          copies={{
            current: "Weekly Migrations",
            cap: "Weekly Migration Limit",
          }}
          labelConfig={{
            fontSize: 14,
          }}
          statsConfig={{
            fontSize: 14,
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
        Migration Preview
      </ActionButton>
      {errorText}
    </div>
  );
};

export default VaultV2MigrationForm;
