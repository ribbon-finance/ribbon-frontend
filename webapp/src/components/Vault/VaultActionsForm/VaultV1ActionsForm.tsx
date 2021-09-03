import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import moment from "moment";

import {
  BaseLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { formatBigNumber } from "shared/lib/utils/math";
import {
  VaultAddressMap,
  VaultMaxDeposit,
} from "shared/lib/constants/constants";
import useVaultData from "shared/lib/hooks/useVaultData";
import { getVaultColor, isETHVault, isVaultFull } from "shared/lib/utils/vault";
import colors from "shared/lib/designSystem/colors";
import { getAssetDisplay } from "shared/lib/utils/asset";
import { ERC20Token } from "shared/lib/models/eth";
import theme from "shared/lib/designSystem/theme";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import YourPosition from "../YourPosition";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import SwapBTCDropdown from "./common/SwapBTCDropdown";
import useVaultActivity from "../../../hooks/useVaultActivity";
import { VaultActivityMeta, VaultShortPosition } from "shared/lib/models/vault";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "../../Common/HelpInfo";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { FormStepProps, VaultValidationErrors } from "./types";
import useVaultActionForm from "../../../hooks/useVaultActionForm";
import { ACTIONS } from "./Modal/types";
import VaultV1TransferForm from "./v1/VaultV1TransferForm";
import VaultApprovalForm from "./common/VaultApprovalForm";
import VaultBasicAmountForm from "./common/VaultBasicAmountForm";
import { MigrateIcon } from "shared/lib/assets/icons/icons";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { getVaultURI } from "../../../constants/constants";

const { parseUnits, formatUnits } = ethers.utils;

const Container = styled.div<{ variant: "desktop" | "mobile" }>`
  display: flex;
  flex-direction: column;
  ${(props) =>
    props.variant === "mobile" &&
    `
    height: 100%;
    align-items: center;
    justify-content:center;
  `}
`;

const FormContainer = styled.div`
  font-family: VCR, sans-serif;
  color: #f3f3f3;
  width: 100%;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  box-sizing: border-box;
  border-radius: ${theme.border.radius};
  background: ${colors.background};
  z-index: 1;
`;

const FormContainerExtra = styled.div<{ variant: "desktop" | "mobile" }>`
  background: ${colors.primaryText}0a;
  margin-top: -20px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  text-align: center;
  z-index: 0;

  ${(props) => {
    switch (props.variant) {
      case "desktop":
        return `padding: 32px 24px 16px 24px;`;
      case "mobile":
        return `padding: 24px 24px 12px 24px;`;
    }
  }}
`;

const FormContainerExtraText = styled(PrimaryText)`
  font-size: 14px;
  line-height: 20px;
`;

const FormTitleContainer = styled.div`
  justify-content: space-evenly;
  position: relative;

  &:before {
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    content: " ";
    background-color: ${colors.background};
    z-index: -1;
  }
`;

const FormTitleDiv = styled.div<{ active: boolean }>`
  width: 100%;
  padding: 24px 0;
  background-color: ${(props) =>
    props.active ? "rgb(28, 26, 25,0.95)" : "rgba(255,255,255,0.04)"};
  cursor: pointer;

  &:after {
    background-color: white;
  }

  &:first-child {
    border-top-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const FormTitle = styled(Title)<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 24px;
  text-transform: uppercase;
  color: ${(props) => (props.active ? "#f3f3f3" : "rgba(255, 255, 255, 0.64)")};
`;

const ContentContainer = styled.div`
  background: ${colors.background};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

type WalletBalanceStates = "active" | "inactive" | "vaultFull" | "error";

const WalletBalance = styled.div<{ state: WalletBalanceStates }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  text-transform: uppercase;

  ${(props) => {
    switch (props.state) {
      case "active":
        return `
          color: "#FFFFFFA3";
        `;
      case "inactive":
        return `
          color: rgba(255, 255, 255, 0.16);
        `;
      case "vaultFull":
        return `
          color: ${colors.red}
        `;
      case "error":
        return `
          color: ${colors.red};
          font-family: "Inter", sans-serif;
          text-transform: none;
        `;
      default:
        return `
          color: rgba(255, 255, 255, 0.16);
        `;
    }
  }}
`;

const SwapTriggerContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SwapTriggerButton = styled.div`
  margin-top: 24px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 100px;
  padding: 8px 16px;
  width: 300px;
  display: flex;
  align-items: center;
`;

const SwapTriggerButtonText = styled(SecondaryText)`
  flex: 1;
`;

const MigrateLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}14;
`;

const MigrationTitle = styled(Title)`
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
`;

const MigrationDescription = styled(PrimaryText)`
  font-size: 14px;
  line-height: 20px;
  color: ${colors.text};
`;

const MigrationDescriptionHighlight = styled.span`
  color: ${colors.primaryText};
`;

const PillButton = styled.div`
  padding: 10px 16px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 100px;
`;

interface VaultV1ActionsFormProps {
  variant: "desktop" | "mobile";
}

const VaultV1ActionsForm: React.FC<VaultV1ActionsFormProps & FormStepProps> = ({
  variant,
  vaultOption,
  onFormSubmit,
}) => {
  const color = getVaultColor(vaultOption);
  const {
    status,
    userAssetBalance,
    deposits,
    vaultLimit,
    vaultBalanceInAsset,
    maxWithdrawAmount,
    asset,
    decimals,
    vaultMaxWithdrawAmount,
  } = useVaultData(vaultOption, { poll: true });
  const {
    canTransfer,
    handleActionTypeChange,
    handleMaxClick,
    vaultActionForm,
  } = useVaultActionForm(vaultOption);
  const vaultOptions = useMemo(() => [vaultOption], [vaultOption]);
  const { vaultAccounts } = useVaultAccounts(vaultOptions, "v1", {
    poll: true,
  });
  const { active, account } = useWeb3React();

  // state hooks
  const isLoadingData = status === "loading";
  const [showTokenApproval, setShowTokenApproval] = useState(false);
  const tokenAllowance = useTokenAllowance(
    isETHVault(vaultOption) ? undefined : (asset.toLowerCase() as ERC20Token),
    VaultAddressMap[vaultOption].v1
  );
  const [swapContainerOpen, setSwapContainerOpen] = useState(false);
  const { activities } = useVaultActivity(vaultOption);

  const allowanceStr = tokenAllowance?.toString();

  // Calculate the latest option short position
  const withdrawalFreeUpTime = useMemo(() => {
    const sortedActivities = activities
      .filter((activity) => activity.type === "minting")
      .sort((a, b) => (a.date.valueOf() < b.date.valueOf() ? 1 : -1));

    if (sortedActivities.length <= 0) {
      return "coming Friday";
    }

    return moment(
      (sortedActivities[0] as VaultShortPosition & VaultActivityMeta).expiry,
      "X"
    )
      .add(2, "hours")
      .format("MMMM Do, YYYY");
  }, [activities]);

  /**
   * Default to deposit at v1
   */
  useEffect(() => {
    handleActionTypeChange(ACTIONS.deposit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show token approval when needed
  useEffect(() => {
    if (
      allowanceStr &&
      BigNumber.from(allowanceStr).isZero() &&
      !isETHVault(vaultOption)
    ) {
      setShowTokenApproval(true);
      return;
    }

    setShowTokenApproval(false);
  }, [allowanceStr, vaultOption]);

  // derived states
  const vaultMaxDepositAmount = VaultMaxDeposit[vaultOption];
  const connected = Boolean(active && account);
  const isInputNonZero = parseFloat(vaultActionForm.inputAmount) > 0;

  /**
   * Error validation
   */
  const error = useMemo((): VaultValidationErrors | undefined => {
    const vaultAccount = vaultAccounts[vaultOption];

    /** Check for error without input requirement */
    switch (vaultActionForm.actionType) {
      case ACTIONS.deposit:
        /** Vault full */
        if (isVaultFull(deposits, vaultLimit, decimals)) {
          return "vaultFull";
        }

        /** Max deposited */
        if (vaultBalanceInAsset.gte(vaultMaxDepositAmount)) {
          return "maxDeposited";
        }
        break;
      case ACTIONS.withdraw:
        /** Withdraw limit reached */
        if (!vaultBalanceInAsset.isZero() && maxWithdrawAmount.isZero()) {
          return "withdrawLimitReached";
        }

        /** All balance staked */
        if (
          vaultAccount &&
          !vaultAccount.totalBalance.isZero() &&
          vaultAccount.totalBalance.eq(vaultAccount.totalStakedBalance)
        ) {
          return "allBalanceStaked";
        }
        break;
    }

    try {
      /** Check block with input requirement */
      if (isInputNonZero && !isLoadingData && connected) {
        const amountBigNumber = parseUnits(
          vaultActionForm.inputAmount,
          decimals
        );

        switch (vaultActionForm.actionType) {
          case ACTIONS.deposit:
            /** Insufficient balance */
            if (amountBigNumber.gt(userAssetBalance)) {
              return "insufficientBalance";
            }

            /** Check amount more than vault max deposit amount */
            if (
              amountBigNumber.gt(vaultMaxDepositAmount.sub(vaultBalanceInAsset))
            ) {
              return "maxExceeded";
            }

            /** Check if deposit amount more than vault available */
            if (amountBigNumber.gt(vaultLimit.sub(deposits))) {
              return "capacityOverflow";
            }
            break;
          case ACTIONS.withdraw:
            /** Check if vault withdrawal hitting limit */
            if (
              amountBigNumber.gt(maxWithdrawAmount) &&
              amountBigNumber.lte(vaultBalanceInAsset)
            ) {
              return "withdrawLimitExceeded";
            }

            /** Check if amount staked when withdraw */
            if (
              amountBigNumber.gt(maxWithdrawAmount) &&
              vaultAccount &&
              amountBigNumber.lte(vaultAccount.totalBalance)
            ) {
              return "withdrawAmountStaked";
            }

            /** Check if user has enough balance to withdraw */
            if (amountBigNumber.gt(maxWithdrawAmount)) {
              return "insufficientBalance";
            }

            break;
        }
      }
    } catch (err) {
      // Ignore, this happen when unable to parse input during first load bcuz of value from other assets
    }
  }, [
    connected,
    decimals,
    deposits,
    isInputNonZero,
    isLoadingData,
    maxWithdrawAmount,
    userAssetBalance,
    vaultAccounts,
    vaultActionForm,
    vaultBalanceInAsset,
    vaultLimit,
    vaultMaxDepositAmount,
    vaultOption,
  ]);

  const formWalletContent = useMemo(() => {
    const vaultAccount = vaultAccounts[vaultOption];
    const stakedAmountText = vaultAccount ? (
      <>
        AVAILABLE TO WITHDRAW: {formatBigNumber(maxWithdrawAmount, decimals)}{" "}
        {getAssetDisplay(asset)}
        <TooltipExplanation
          title="AVAILABLE TO WITHDRAW"
          explanation={
            <>
              You have staked{" "}
              {formatBigNumber(vaultAccount.totalStakedBalance, decimals)}{" "}
              {vaultOption} tokens, leaving you with{" "}
              {formatBigNumber(maxWithdrawAmount, decimals)}{" "}
              {getAssetDisplay(asset)} available for withdrawal.
              <br />
              <br />
              To increase the amount available for withdrawal, you must unstake
              your {vaultOption} tokens from the staking pool.
            </>
          }
          renderContent={({ ref, ...triggerHandler }) => (
            <HelpInfo containerRef={ref} {...triggerHandler}>
              ?
            </HelpInfo>
          )}
        />
      </>
    ) : (
      <></>
    );

    switch (error) {
      case "vaultFull":
        return "The Vault is currently full";
      case "maxDeposited":
        return `This vault has a max deposit of ${parseInt(
          formatUnits(vaultMaxDepositAmount, decimals)
        ).toLocaleString()} ${getAssetDisplay(asset)} per depositor`;
      case "allBalanceStaked":
        return `You have staked all your ${vaultOption} tokens. You must unstake your ${vaultOption} tokens before you can withdraw from the vault.`;
      case "withdrawLimitReached":
        return `The vault’s weekly withdrawal limit has been reached. Withdrawals
          will be enabled again at 1000 UTC on ${withdrawalFreeUpTime}.`;
      case "withdrawLimitExceeded":
        return (
          <>
            Weekly Withdraw Limit:{" "}
            {formatBigNumber(maxWithdrawAmount, decimals)}{" "}
            {getAssetDisplay(asset)}
            <TooltipExplanation
              title="WEEKLY WITHDRAWAL LIMIT"
              explanation={`Withdrawing ${formatBigNumber(
                maxWithdrawAmount,
                decimals
              )} ${getAssetDisplay(
                asset
              )} will result in the vault hitting its weekly withdrawal limit. If the withdrawal limit is reached, withdrawals will be disabled until ${withdrawalFreeUpTime}.`}
              renderContent={({ ref, ...triggerHandler }) => (
                <HelpInfo containerRef={ref} {...triggerHandler}>
                  ?
                </HelpInfo>
              )}
            />
          </>
        );
      case "withdrawAmountStaked":
        return stakedAmountText;
    }

    if (!account || isLoadingData) {
      return "---";
    }

    switch (vaultActionForm.actionType) {
      case ACTIONS.deposit:
        return `Wallet Balance: ${formatBigNumber(
          userAssetBalance,
          decimals
        )} ${getAssetDisplay(asset)}`;
      case ACTIONS.withdraw:
        const position = formatBigNumber(vaultBalanceInAsset, decimals);

        /**
         * Condition to check withdraw is limited by staked
         * 1. Max withdraw amount must match total balance
         * 2. Staked amount is bigger than 0
         */
        if (
          vaultAccount &&
          vaultBalanceInAsset.eq(maxWithdrawAmount) &&
          !vaultAccount.totalStakedShares.isZero()
        ) {
          return stakedAmountText;
        }

        /**
         * Over here, we show unstaked position instead
         */
        if (vaultAccount && !vaultAccount.totalStakedShares.isZero()) {
          return (
            <>
              unstaked position: {position} {getAssetDisplay(asset)}
              <TooltipExplanation
                title="AVAILABLE TO WITHDRAW"
                explanation={
                  <>
                    You have staked{" "}
                    {formatBigNumber(vaultAccount.totalStakedBalance, decimals)}{" "}
                    {vaultOption} tokens, leaving you with {position}{" "}
                    {getAssetDisplay(asset)} unstaked balance.
                    <br />
                    <br />
                    To increase the balance for withdrawal, you must unstake
                    your {vaultOption} tokens from the staking pool.
                  </>
                }
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    ?
                  </HelpInfo>
                )}
              />
            </>
          );
        }

        return `Your Position: ${position} ${getAssetDisplay(asset)}`;
    }
  }, [
    account,
    asset,
    decimals,
    error,
    isLoadingData,
    maxWithdrawAmount,
    userAssetBalance,
    vaultAccounts,
    vaultActionForm.actionType,
    vaultBalanceInAsset,
    vaultMaxDepositAmount,
    vaultOption,
    withdrawalFreeUpTime,
  ]);

  const actionButtonText = useMemo(() => {
    switch (error) {
      case "insufficientBalance":
        return "Insufficient Balance";
      case "withdrawLimitExceeded":
        return "WEEKLY LIMIT EXCEEDED";
      case "withdrawLimitReached":
        return "WithdrawALS DISABLED";
      case "capacityOverflow":
        return "Exceed Vault Balance";
      case "withdrawAmountStaked":
        return "AVAILABLE LIMIT EXCEEDED";
      case "maxExceeded":
        return `Maximum ${parseInt(
          formatUnits(vaultMaxDepositAmount, decimals)
        ).toLocaleString()} ${getAssetDisplay(asset)} Exceeded`;
    }

    switch (vaultActionForm.actionType) {
      case ACTIONS.deposit:
        if (isInputNonZero) {
          return `Preview Deposit`;
        }

        return `Deposit ${getAssetDisplay(asset)}`;
      case ACTIONS.withdraw:
        if (isInputNonZero) {
          return `Preview Withdrawal`;
        }

        return `Withdraw ${getAssetDisplay(asset)}`;
      case ACTIONS.transfer:
        return "Preview Transfer";
    }

    return "";
  }, [
    asset,
    decimals,
    error,
    isInputNonZero,
    vaultActionForm.actionType,
    vaultMaxDepositAmount,
  ]);

  const walletBalanceState = useMemo(() => {
    switch (error) {
      case "vaultFull":
      case "maxDeposited":
        return "vaultFull";
      case "withdrawLimitExceeded":
      case "withdrawAmountStaked":
      case "insufficientBalance":
      case "maxExceeded":
      case "capacityOverflow":
        return "active";
      case undefined:
        break;
      default:
        return "error";
    }

    return connected ? "active" : "inactive";
  }, [connected, error]);

  const formContent = useMemo(() => {
    /**
     * Approval before deposit
     */
    if (vaultActionForm.actionType === ACTIONS.deposit && showTokenApproval) {
      return <VaultApprovalForm vaultOption={vaultOption} version="v1" />;
    }

    switch (vaultActionForm.actionType) {
      case ACTIONS.deposit:
      case ACTIONS.withdraw:
        return (
          <VaultBasicAmountForm
            vaultOption={vaultOption}
            error={error}
            onFormSubmit={onFormSubmit}
            actionButtonText={actionButtonText}
          />
        );
      case ACTIONS.transfer:
        return (
          <VaultV1TransferForm
            vaultOption={vaultOption}
            vaultAccount={vaultAccounts[vaultOption]}
            transferVaultData={{
              vaultBalanceInAsset,
              maxWithdrawAmount,
              vaultMaxWithdrawAmount,
            }}
            actionButtonText={actionButtonText}
            onFormSubmit={onFormSubmit}
          />
        );
    }
  }, [
    actionButtonText,
    error,
    maxWithdrawAmount,
    onFormSubmit,
    showTokenApproval,
    vaultAccounts,
    vaultActionForm,
    vaultBalanceInAsset,
    vaultMaxWithdrawAmount,
    vaultOption,
  ]);

  const swapContainerTrigger = useMemo(() => {
    switch (asset) {
      case "WBTC":
        return (
          <SwapTriggerContainer>
            <SwapTriggerButton
              role="button"
              onClick={() => setSwapContainerOpen((open) => !open)}
            >
              <SwapTriggerButtonText>
                Swap your BTC or renBTC for wBTC
              </SwapTriggerButtonText>
              <ButtonArrow isOpen={swapContainerOpen} />
            </SwapTriggerButton>
          </SwapTriggerContainer>
        );

      default:
        return <></>;
    }
  }, [asset, swapContainerOpen]);

  const swapContainer = useMemo(() => {
    switch (asset) {
      case "WBTC":
        return <SwapBTCDropdown open={swapContainerOpen} />;
      default:
        return <></>;
    }
  }, [asset, swapContainerOpen]);

  const handleWithdraw = useCallback(() => {
    handleActionTypeChange(ACTIONS.withdraw);
    handleMaxClick();
    onFormSubmit();
  }, [handleActionTypeChange, handleMaxClick, onFormSubmit]);

  const body = useMemo(() => {
    if (!isLoadingData && vaultLimit.isZero()) {
      const vaultAccount = vaultAccounts[vaultOption];
      const balanceToMigrate = vaultAccount
        ? vaultAccount.totalBalance
        : BigNumber.from(0);

      return (
        <div className="d-flex flex-column align-items-center p-4">
          <MigrateLogoContainer color={color} className="mt-3">
            <MigrateIcon color={color} />
          </MigrateLogoContainer>

          <MigrationTitle className="mt-3">MIRGATE TO V2</MigrationTitle>

          <MigrationDescription className="mt-3 text-center">
            You can now move your V1 deposit balance of{" "}
            <MigrationDescriptionHighlight>
              {formatBigNumber(balanceToMigrate, decimals)}{" "}
              {getAssetDisplay(asset)}
            </MigrationDescriptionHighlight>{" "}
            to the V2 vault
          </MigrationDescription>

          {/* Migrate button */}
          <BaseLink to={getVaultURI(vaultOption, "v2")} className="w-100">
            <ActionButton color={color} className="py-3 mt-4">
              MIGRATE {getAssetDisplay(asset)}
            </ActionButton>
          </BaseLink>

          <SecondaryText className="mt-3">OR</SecondaryText>

          {/* Withdraw button */}
          <PillButton className="mt-3" role="button" onClick={handleWithdraw}>
            <PrimaryText>Withdraw {getAssetDisplay(asset)}</PrimaryText>
          </PillButton>
        </div>
      );
    }

    return (
      <>
        <FormTitleContainer className="d-flex flex-row align-items-center">
          <FormTitleDiv
            active={vaultActionForm.actionType === ACTIONS.deposit}
            onClick={() => handleActionTypeChange(ACTIONS.deposit)}
          >
            <FormTitle active={vaultActionForm.actionType === ACTIONS.deposit}>
              Deposit
            </FormTitle>
          </FormTitleDiv>
          <FormTitleDiv
            active={vaultActionForm.actionType === ACTIONS.withdraw}
            onClick={() => handleActionTypeChange(ACTIONS.withdraw)}
          >
            <FormTitle active={vaultActionForm.actionType === ACTIONS.withdraw}>
              Withdraw
            </FormTitle>
          </FormTitleDiv>
          {canTransfer && (
            <FormTitleDiv
              active={vaultActionForm.actionType === ACTIONS.transfer}
              onClick={() => handleActionTypeChange(ACTIONS.transfer)}
            >
              <FormTitle
                active={vaultActionForm.actionType === ACTIONS.transfer}
              >
                Transfer
              </FormTitle>
            </FormTitleDiv>
          )}
        </FormTitleContainer>
        <ContentContainer className="px-4 py-4">
          {formContent}
          <WalletBalance state={walletBalanceState}>
            {formWalletContent}
          </WalletBalance>
          {swapContainerTrigger}
        </ContentContainer>
        {swapContainer}
      </>
    );
  }, [
    asset,
    canTransfer,
    color,
    decimals,
    formContent,
    formWalletContent,
    handleActionTypeChange,
    handleWithdraw,
    isLoadingData,
    swapContainer,
    swapContainerTrigger,
    vaultAccounts,
    vaultActionForm.actionType,
    vaultLimit,
    vaultOption,
    walletBalanceState,
  ]);

  const formExtra = useMemo(() => {
    if (!isLoadingData && vaultLimit.isZero()) {
      return (
        <FormContainerExtra variant={variant}>
          <FormContainerExtraText color={color}>
            IMPORTANT: Withdrawal fees do not apply for migrations from V1 to V2
          </FormContainerExtraText>
        </FormContainerExtra>
      );
    }

    switch (vaultActionForm.actionType) {
      case ACTIONS.transfer:
        return (
          <FormContainerExtra variant={variant}>
            <FormContainerExtraText color={color}>
              Vault transfers are <strong>FREE</strong>: withdrawal fees are
              waived when you transfer funds between T-USDC-P-ETH and
              T-yvUSDC-P-ETH
            </FormContainerExtraText>
          </FormContainerExtra>
        );
    }
  }, [color, isLoadingData, variant, vaultLimit, vaultActionForm.actionType]);

  return (
    <Container variant={variant}>
      <FormContainer>{body}</FormContainer>
      {formExtra}

      {connected && variant === "desktop" && (
        <YourPosition
          vault={{ vaultOption, vaultVersion: "v1" }}
          className="mt-4"
        />
      )}
    </Container>
  );
};

export default VaultV1ActionsForm;
