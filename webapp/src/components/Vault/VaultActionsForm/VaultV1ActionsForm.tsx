import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import moment from "moment";

import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
  BaseLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { formatBigNumber } from "shared/lib/utils/math";
import {
  ActionButton,
  ConnectWalletButton,
} from "shared/lib/components/Common/buttons";
import {
  VaultAddressMap,
  VaultMaxDeposit,
} from "shared/lib/constants/constants";
import useVaultData from "shared/lib/hooks/useVaultData";
import { getVaultColor, isETHVault, isVaultFull } from "shared/lib/utils/vault";
import colors from "shared/lib/designSystem/colors";
import { getAssetDisplay, getAssetLogo } from "shared/lib/utils/asset";
import { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { ERC20Token } from "shared/lib/models/eth";
import theme from "shared/lib/designSystem/theme";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import { Assets } from "shared/lib/store/types";
import YourPosition from "../YourPosition";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import usePendingTransactions from "../../../hooks/usePendingTransactions";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import SwapBTCDropdown from "./SwapBTCDropdown";
import useVaultActivity from "../../../hooks/useVaultActivity";
import { VaultActivityMeta, VaultShortPosition } from "shared/lib/models/vault";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "../../Common/HelpInfo";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { FormStepProps } from "./types";
import useVaultActionForm from "../../../hooks/useVaultActionForm";
import { ACTIONS } from "./Modal/types";
import VaultV1TransferForm from "./VaultV1TransferForm";

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
  margin-top: -16px;
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

const FormTitleDiv = styled.div<{ left: boolean; active: boolean }>`
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

const ApprovalIconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
`;

const ApprovalIcon = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  padding: 8px;
  border-radius: 100px;
  background-color: ${(props) => props.color}29;
`;

const ApprovalDescription = styled(PrimaryText)`
  display: block;
  text-align: center;
  margin-bottom: 16px;
`;

const ApprovalHelp = styled(BaseLink)`
  display: flex;
  justify-content: center;
  text-decoration: underline ${colors.text};
  margin-bottom: 40px;

  &:hover {
    text-decoration: underline ${colors.text}A3;

    span {
      color: ${colors.text}A3;
    }
  }
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

type ValidationErrors =
  | "vaultFull"
  | "maxDeposited"
  | "allBalanceStaked"
  | "insufficient_balance"
  | "capacity_overflow"
  | "max_exceeded"
  | "withdraw_amount_staked"
  | "withdraw_limit_reached"
  | "withdraw_limit_exceeded";

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
  } = useVaultData(vaultOption);
  const {
    canTransfer,
    handleActionTypeChange,
    handleInputChange,
    handleMaxClick,
    transferData,
    vaultActionForm,
  } = useVaultActionForm(vaultOption);
  const vaultOptions = useMemo(() => [vaultOption], [vaultOption]);
  const { vaultAccounts } = useVaultAccounts(vaultOptions);
  const { active, account, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [, setPendingTransactions] = usePendingTransactions();

  // state hooks
  const isLoadingData = status === "loading";
  const [, setShowConnectModal] = useConnectWalletModal();
  const [showTokenApproval, setShowTokenApproval] = useState(false);
  const tokenAllowance = useTokenAllowance(
    isETHVault(vaultOption) ? undefined : (asset.toLowerCase() as ERC20Token),
    VaultAddressMap[vaultOption].v1
  );
  const [waitingApproval, setWaitingApproval] = useState(false);
  const waitingApprovalLoadingText = useTextAnimation(
    ["Approving", "Approving .", "Approving ..", "Approving ..."],
    250,
    waitingApproval
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
    setWaitingApproval(false);
  }, [allowanceStr, vaultOption]);

  const tokenContract = useMemo(() => {
    if (isETHVault(vaultOption)) {
      return;
    }

    // @ts-ignore
    return getERC20Token(library, asset.toLowerCase());
  }, [vaultOption, asset, library]);

  // derived states
  const vaultMaxDepositAmount = VaultMaxDeposit[vaultOption];
  const connected = Boolean(active && account);
  const isInputNonZero = parseFloat(vaultActionForm.inputAmount) > 0;

  /**
   * Error validation
   */
  const error = useMemo((): ValidationErrors | undefined => {
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
          return "withdraw_limit_reached";
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

    /** Check block with input requirement */
    if (isInputNonZero && !isLoadingData && connected) {
      const amount = parseUnits(vaultActionForm.inputAmount, decimals);

      switch (vaultActionForm.actionType) {
        case ACTIONS.deposit:
          /** Insufficient balance */
          if (amount.gt(userAssetBalance)) {
            return "insufficient_balance";
          }

          /** Check amount more than vault max deposit amount */
          if (amount.gt(vaultMaxDepositAmount.sub(vaultBalanceInAsset))) {
            return "max_exceeded";
          }

          /** Check if deposit amount more than vault available */
          if (amount.gt(vaultLimit.sub(deposits))) {
            return "capacity_overflow";
          }
          break;
        case ACTIONS.withdraw:
          /** Check if vault withdrawal hitting limit */
          if (amount.gt(maxWithdrawAmount) && amount.lte(vaultBalanceInAsset)) {
            return "withdraw_limit_exceeded";
          }

          /** Check if amount staked when withdraw */
          if (
            amount.gt(maxWithdrawAmount) &&
            vaultAccount &&
            amount.lte(vaultAccount.totalBalance)
          ) {
            return "withdraw_amount_staked";
          }

          /** Check if user has enough balance to withdraw */
          if (amount.gt(maxWithdrawAmount)) {
            return "insufficient_balance";
          }

          break;
      }
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

  const handleApproveToken = useCallback(async () => {
    setWaitingApproval(true);
    if (tokenContract) {
      const amount =
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

      try {
        const tx = await tokenContract.approve(
          VaultAddressMap[vaultOption].v1,
          amount
        );

        const txhash = tx.hash;

        setPendingTransactions((pendingTransactions) => [
          ...pendingTransactions,
          {
            txhash,
            type: "approval",
            amount: amount,
            vault: vaultOption,
          },
        ]);

        // Wait for transaction to be approved
        await provider.waitForTransaction(txhash, 5);
      } catch (err) {
        setWaitingApproval(false);
      }
    }
  }, [provider, setPendingTransactions, tokenContract, vaultOption]);

  const formWalletContent = useMemo(() => {
    const vaultAccount = vaultAccounts[vaultOption];
    const stakedAmountText = vaultAccount ? (
      <>
        AVAILABLE TO WITHDRAW: {formatBigNumber(maxWithdrawAmount, 6, decimals)}{" "}
        {getAssetDisplay(asset)}
        <TooltipExplanation
          title="AVAILABLE TO WITHDRAW"
          explanation={
            <>
              You have staked{" "}
              {formatBigNumber(vaultAccount.totalStakedBalance, 6, decimals)}{" "}
              {vaultOption} tokens, leaving you with{" "}
              {formatBigNumber(maxWithdrawAmount, 6, decimals)}{" "}
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
      case "withdraw_limit_reached":
        return `The vault’s weekly withdrawal limit has been reached. Withdrawals
          will be enabled again at 1000 UTC on ${withdrawalFreeUpTime}.`;
      case "withdraw_limit_exceeded":
        return (
          <>
            Weekly Withdraw Limit:{" "}
            {formatBigNumber(maxWithdrawAmount, 6, decimals)}{" "}
            {getAssetDisplay(asset)}
            <TooltipExplanation
              title="WEEKLY WITHDRAWAL LIMIT"
              explanation={`Withdrawing ${formatBigNumber(
                maxWithdrawAmount,
                6,
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
      case "withdraw_amount_staked":
        return stakedAmountText;
    }

    if (!account || isLoadingData) {
      return "---";
    }

    switch (vaultActionForm.actionType) {
      case ACTIONS.deposit:
        return `Wallet Balance: ${formatBigNumber(
          userAssetBalance,
          6,
          decimals
        )} ${getAssetDisplay(asset)}`;
      case ACTIONS.withdraw:
        const position = formatBigNumber(vaultBalanceInAsset, 6, decimals);

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
                    {formatBigNumber(
                      vaultAccount.totalStakedBalance,
                      6,
                      decimals
                    )}{" "}
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
      case "insufficient_balance":
        return "Insufficient Balance";
      case "withdraw_limit_exceeded":
        return "WEEKLY LIMIT EXCEEDED";
      case "withdraw_limit_reached":
        return "WithdrawALS DISABLED";
      case "capacity_overflow":
        return "Exceed Vault Balance";
      case "withdraw_amount_staked":
        return "AVAILABLE LIMIT EXCEEDED";
      case "max_exceeded":
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
      case "withdraw_limit_exceeded":
      case "withdraw_amount_staked":
      case "insufficient_balance":
      case "max_exceeded":
        return "active";
      case undefined:
        break;
      default:
        return "error";
    }

    return connected ? "active" : "inactive";
  }, [connected, error]);

  const renderButton = useCallback(
    (error: string | undefined) => {
      if (connected) {
        return (
          <ActionButton
            disabled={Boolean(error) || !isInputNonZero}
            onClick={onFormSubmit}
            className={`py-3 ${
              vaultActionForm.actionType !== ACTIONS.transfer ? "mb-4" : ""
            }`}
            color={color}
          >
            {actionButtonText}
          </ActionButton>
        );
      }

      return (
        <ConnectWalletButton
          onClick={() => setShowConnectModal(true)}
          type="button"
          className="btn py-3 mb-4"
        >
          Connect Wallet
        </ConnectWalletButton>
      );
    },
    [
      actionButtonText,
      color,
      connected,
      isInputNonZero,
      onFormSubmit,
      setShowConnectModal,
      vaultActionForm,
    ]
  );

  const renderApprovalAssetLogo = useCallback(() => {
    const Logo = getAssetLogo(asset);

    return <Logo />;
  }, [asset]);

  const formContent = useMemo(() => {
    /**
     * Approval before deposit
     */
    if (vaultActionForm.actionType === ACTIONS.deposit && showTokenApproval) {
      return (
        <>
          <ApprovalIconContainer>
            <ApprovalIcon color={color}>
              {renderApprovalAssetLogo()}
            </ApprovalIcon>
          </ApprovalIconContainer>
          <ApprovalDescription>
            Before you deposit, the vault needs your permission to invest your{" "}
            {getAssetDisplay(asset)} in the vault’s strategy.
          </ApprovalDescription>
          <ApprovalHelp
            to="https://ribbon.finance/faq"
            target="__blank"
            rel="noreferrer noopener"
          >
            <SecondaryText>Why do I have to do this?</SecondaryText>
          </ApprovalHelp>
          <ActionButton
            onClick={handleApproveToken}
            className="py-3 mb-4"
            disabled={Boolean(error)}
            color={color}
          >
            {waitingApproval
              ? waitingApprovalLoadingText
              : `Approve ${getAssetDisplay(asset)}`}
          </ActionButton>
        </>
      );
    }

    switch (vaultActionForm.actionType) {
      case ACTIONS.deposit:
      case ACTIONS.withdraw:
        return (
          <>
            <BaseInputLabel>AMOUNT ({getAssetDisplay(asset)})</BaseInputLabel>
            <BaseInputContainer className="position-relative mb-5">
              <BaseInput
                type="number"
                className="form-control"
                aria-label="ETH"
                placeholder="0"
                value={vaultActionForm.inputAmount}
                onChange={handleInputChange}
              />
              {connected && (
                <BaseInputButton onClick={handleMaxClick}>MAX</BaseInputButton>
              )}
            </BaseInputContainer>
            {renderButton(error)}
          </>
        );
      case ACTIONS.transfer:
        return (
          <VaultV1TransferForm
            vaultOption={vaultOption}
            receiveVault={vaultActionForm.receiveVault!}
            vaultAccount={vaultAccounts[vaultOption]}
            transferVaultData={{
              maxWithdrawAmount,
              vaultMaxWithdrawAmount,
            }}
            transferData={transferData}
            inputAmount={vaultActionForm.inputAmount}
            handleInputChange={handleInputChange}
            handleMaxClick={handleMaxClick}
            renderActionButton={renderButton}
          />
        );
    }
  }, [
    asset,
    renderButton,
    color,
    connected,
    error,
    handleApproveToken,
    handleInputChange,
    handleMaxClick,
    maxWithdrawAmount,
    renderApprovalAssetLogo,
    showTokenApproval,
    transferData,
    vaultAccounts,
    vaultActionForm,
    vaultMaxWithdrawAmount,
    vaultOption,
    waitingApproval,
    waitingApprovalLoadingText,
  ]);

  const getSwapTriggerText = useCallback((_asset: Assets) => {
    switch (_asset) {
      case "WBTC":
        return "Swap your BTC or renBTC for wBTC";
      default:
        return "";
    }
  }, []);

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
                {getSwapTriggerText(asset)}
              </SwapTriggerButtonText>
              <ButtonArrow isOpen={swapContainerOpen} />
            </SwapTriggerButton>
          </SwapTriggerContainer>
        );

      default:
        return <></>;
    }
  }, [asset, getSwapTriggerText, swapContainerOpen]);

  const swapContainer = useMemo(() => {
    switch (asset) {
      case "WBTC":
        return <SwapBTCDropdown open={swapContainerOpen} />;
      default:
        return <></>;
    }
  }, [asset, swapContainerOpen]);

  return (
    <Container variant={variant}>
      <FormContainer>
        <FormTitleContainer className="d-flex flex-row align-items-center">
          <FormTitleDiv
            left
            active={vaultActionForm.actionType === ACTIONS.deposit}
            onClick={() => handleActionTypeChange(ACTIONS.deposit)}
          >
            <FormTitle active={vaultActionForm.actionType === ACTIONS.deposit}>
              Deposit
            </FormTitle>
          </FormTitleDiv>
          <FormTitleDiv
            left={false}
            active={vaultActionForm.actionType === ACTIONS.withdraw}
            onClick={() => handleActionTypeChange(ACTIONS.withdraw)}
          >
            <FormTitle active={vaultActionForm.actionType === ACTIONS.withdraw}>
              Withdraw
            </FormTitle>
          </FormTitleDiv>
          {canTransfer && (
            <FormTitleDiv
              left={false}
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
      </FormContainer>
      {vaultActionForm.actionType === "transfer" && (
        <FormContainerExtra variant={variant}>
          <FormContainerExtraText color={color}>
            Vault transfers are <strong>FREE</strong>: withdrawal fees are
            waived when you transfer funds between T-USDC-P-ETH and
            T-yvUSDC-P-ETH
          </FormContainerExtraText>
        </FormContainerExtra>
      )}

      {connected && variant === "desktop" && (
        <YourPosition vaultOption={vaultOption} className="mt-4" />
      )}
    </Container>
  );
};

export default VaultV1ActionsForm;
