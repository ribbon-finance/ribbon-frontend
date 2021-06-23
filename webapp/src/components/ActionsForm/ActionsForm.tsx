import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import moment from "moment";

import {
  BaseInput,
  BaseInputButton,
  BaseInputContianer,
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
  GAS_LIMITS,
  VaultAddressMap,
  VaultOptions,
  VaultWithdrawalFee,
} from "shared/lib/constants/constants";
import useVaultData from "shared/lib/hooks/useVaultData";
import useVault from "shared/lib/hooks/useVault";
import { getVaultColor, isETHVault, isVaultFull } from "shared/lib/utils/vault";
import colors from "shared/lib/designSystem/colors";
import { useLatestAPY } from "shared/lib/hooks/useAirtableData";
import { getAssetDisplay, getAssetLogo } from "shared/lib/utils/asset";
import { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { ERC20Token } from "shared/lib/models/eth";
import theme from "shared/lib/designSystem/theme";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import { Assets } from "shared/lib/store/types";

import YourPosition from "./YourPosition";
import ActionModal from "../ActionModal/ActionModal";
import { ACTIONS, PreviewStepProps } from "../ActionModal/types";
import useGasPrice from "../../hooks/useGasPrice";
import useConnectWalletModal from "../../hooks/useConnectWalletModal";
import usePendingTransactions from "../../hooks/usePendingTransactions";
import useTokenAllowance from "../../hooks/useTokenAllowance";
import SwapBTCDropdown from "./SwapBTCDropdown";
import useVaultActivity from "../../hooks/useVaultActivity";
import { VaultActivityMeta, VaultShortPosition } from "shared/lib/models/vault";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "../Common/HelpInfo";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";

const { parseUnits, formatUnits } = ethers.utils;

const Container = styled.div<ActionFormVariantProps>`
  ${(props) =>
    props.variant === "mobile" &&
    `
    height: 100%;
    display:flex;
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

  ${(props) =>
    props.left
      ? "border-top-left-radius: 8px;"
      : "border-top-right-radius: 8px;"}
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
  | "none"
  | "insufficient_balance"
  | "capacity_overflow"
  | "withdraw_amount_staked"
  | "withdraw_limit_reached"
  | "withdraw_limit_exceeded";

export interface FormStepProps {
  onSubmit?: (previewStepProps: PreviewStepProps) => void;
  vaultOption: VaultOptions;
}

interface ActionFormVariantProps {
  variant: "desktop" | "mobile";
}

const ActionsForm: React.FC<ActionFormVariantProps & FormStepProps> = ({
  variant,
  vaultOption,
  onSubmit = () => {},
}) => {
  // constants
  const DEPOSIT_TAB = true;
  const WITHDRAWAL_TAB = false;
  const isDesktop = variant === "desktop";

  // refs
  const inputRef = useRef<HTMLInputElement | null>(null);

  // network hooks
  const vault = useVault(vaultOption);
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
  } = useVaultData(vaultOption);
  const vaultOptions = useMemo(() => [vaultOption], [vaultOption]);
  const { vaultAccounts } = useVaultAccounts(vaultOptions);
  const gasPrice = useGasPrice();
  const { active, account, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const latestAPY = useLatestAPY(vaultOption);
  const [, setPendingTransactions] = usePendingTransactions();

  // state hooks
  const isLoadingData = status === "loading";
  const [isDeposit, setIsDeposit] = useState(true);
  const [inputAmount, setInputAmount] = useState("");
  const [, setShowConnectModal] = useConnectWalletModal();
  const [showActionModal, setShowActionModal] = useState(false);
  const [error, setError] = useState<ValidationErrors>("none");
  const [showTokenApproval, setShowTokenApproval] = useState(false);
  const tokenAllowance = useTokenAllowance(
    isETHVault(vaultOption) ? undefined : (asset.toLowerCase() as ERC20Token),
    VaultAddressMap[vaultOption]()
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
  const vaultFull = isVaultFull(deposits, vaultLimit, decimals);
  const allBalanceStaked = useMemo(() => {
    const vaultAccount = vaultAccounts[vaultOption];

    /**
     * When total balance is non-zero and equal to staked amount, it mean the person has staked all his amount into the vault
     */
    return (
      vaultAccount &&
      !vaultAccount.totalBalance.isZero() &&
      vaultAccount.totalBalance.eq(vaultAccount.totalStakedBalance)
    );
  }, [vaultAccounts, vaultOption]);
  const connected = Boolean(active && account);
  const isInputNonZero = parseFloat(inputAmount) > 0;

  const handleClickMax = async () => {
    if (!isLoadingData && connected && vault && account) {
      if (isDeposit && gasPrice !== "") {
        const gasLimit = isDeposit
          ? GAS_LIMITS[vaultOption].deposit
          : GAS_LIMITS[vaultOption].withdraw;
        const gasFee = BigNumber.from(gasLimit.toString()).mul(
          BigNumber.from(gasPrice)
        );
        const total = BigNumber.from(userAssetBalance);
        // TODO: Optimize the code to request gas fees only when needed
        const maxAmount = isETHVault(vaultOption) ? total.sub(gasFee) : total;
        const userMaxAmount = maxAmount.isNegative()
          ? BigNumber.from("0")
          : maxAmount;
        
        // Fringe case: if amt of deposit greater than vault limit, return 0
        const vaultAvailableBalance = deposits.gt(vaultLimit)
          ? BigNumber.from("0")
          : vaultLimit.sub(deposits);
        
        // Check if max is vault availableBalance
        const finalMaxAmount = userMaxAmount.gt(vaultAvailableBalance)
          ? vaultAvailableBalance
          : userMaxAmount;
          
        setInputAmount(formatUnits(finalMaxAmount, decimals));
      }
      // Withdraw flow
      else {
        setInputAmount(formatUnits(maxWithdrawAmount, decimals));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;

    // Do not allow user to enter smaller than 0
    if (rawInput && parseFloat(rawInput) < 0) {
      setInputAmount("");
      return;
    }

    setInputAmount(rawInput); // Let's flush out the input changes first.
  };

  // Listen to amount and set error accordingly
  useEffect(() => {
    // Make sure we schedule the error updates after the input updates
    requestAnimationFrame(() => {
      if (
        !isDeposit &&
        !vaultBalanceInAsset.isZero() &&
        maxWithdrawAmount.isZero()
      ) {
        setError("withdraw_limit_reached");
        return;
      }

      if (inputAmount) {
        const amount = parseUnits(inputAmount, decimals);

        if (!isLoadingData && connected) {
          const vaultAccount = vaultAccounts[vaultOption];

          /** Check if amount to deposit more than balance */
          if (isDeposit && amount.gt(userAssetBalance)) {
            setError("insufficient_balance");
            return;
          }

          /** Check if deposit amount more than vault available */
          if (isDeposit && amount.gt(vaultLimit.sub(deposits))) {
            setError("capacity_overflow");
            return;
          }

          /** Check if vault withdrawal hitting limit */
          if (
            !isDeposit &&
            amount.gt(maxWithdrawAmount) &&
            amount.lte(vaultBalanceInAsset)
          ) {
            setError("withdraw_limit_exceeded");
            return;
          }

          /** Check if amount staked when withdraw */
          if (
            !isDeposit &&
            amount.gt(maxWithdrawAmount) &&
            vaultAccount &&
            amount.lte(vaultAccount.totalBalance)
          ) {
            setError("withdraw_amount_staked");
            return;
          }

          /** Check if user has enough balance to withdraw */
          if (!isDeposit && amount.gt(maxWithdrawAmount)) {
            setError("insufficient_balance");
            return;
          }
        }
      }

      setError("none");
    });
  }, [
    vaultOption,
    vaultAccounts,
    deposits,
    vaultLimit,
    inputAmount,
    connected,
    decimals,
    isDeposit,
    isLoadingData,
    maxWithdrawAmount,
    userAssetBalance,
    vaultBalanceInAsset,
  ]);

  const vaultBalanceStr = vaultBalanceInAsset.toString();

  const previewStepProps = useMemo(() => {
    const actionParams = isDeposit
      ? { action: ACTIONS.deposit, yield: latestAPY.res }
      : {
          action: ACTIONS.withdraw,
          withdrawalFee: parseFloat(VaultWithdrawalFee[vaultOption]),
        };

    return {
      actionType: isDeposit ? ACTIONS.deposit : ACTIONS.withdraw,
      amount: inputAmount
        ? parseUnits(inputAmount, decimals)
        : BigNumber.from("0"),
      positionAmount: BigNumber.from(vaultBalanceStr),
      actionParams,
    };
  }, [
    vaultOption,
    isDeposit,
    inputAmount,
    vaultBalanceStr,
    latestAPY.res,
    decimals,
  ]);

  const handleClickActionButton = useCallback(() => {
    isDesktop && isInputNonZero && connected && setShowActionModal(true);
    !isDesktop && isInputNonZero && connected && onSubmit(previewStepProps);
  }, [connected, isDesktop, isInputNonZero, onSubmit, previewStepProps]);

  const handleApproveToken = async () => {
    setWaitingApproval(true);
    if (tokenContract) {
      const amount =
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

      try {
        const tx = await tokenContract.approve(
          VaultAddressMap[vaultOption](),
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
  };

  const onCloseActionsModal = useCallback(() => {
    setShowActionModal(false);
  }, []);

  const onInputWheel = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const onSuccess = useCallback(() => {
    setIsDeposit(true);
    setInputAmount("");
    setError("none");
  }, [setInputAmount, setError]);

  const switchToTab = (switchingToDepositTab: boolean) => {
    // Resets the input amount if switching to a different tab
    return () => {
      if (
        (isDeposit && !switchingToDepositTab) ||
        (!isDeposit && switchingToDepositTab)
      ) {
        setIsDeposit(switchingToDepositTab);
        setInputAmount("");
        setError("none");
      }
    };
  };

  const formWalletContent = useMemo(() => {
    if (isDeposit && vaultFull) {
      return "The Vault is currently full";
    }

    if (!isDeposit && allBalanceStaked) {
      return `You have staked all your ${vaultOption} tokens. You must unstake your ${vaultOption} tokens before you can withdraw from the vault.`;
    }

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

    if (error !== "none") {
      switch (error) {
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
    }

    if (!account || isLoadingData) {
      return "---";
    }

    if (isDeposit) {
      const position = formatBigNumber(userAssetBalance, 6, decimals);

      return `Wallet Balance: ${position} ${getAssetDisplay(asset)}`;
    }

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
                {formatBigNumber(vaultAccount.totalStakedBalance, 6, decimals)}{" "}
                {vaultOption} tokens, leaving you with {position}{" "}
                {getAssetDisplay(asset)} unstaked balance.
                <br />
                <br />
                To increase the balance for withdrawal, you must unstake your{" "}
                {vaultOption} tokens from the staking pool.
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
  }, [
    account,
    allBalanceStaked,
    asset,
    decimals,
    error,
    isDeposit,
    isLoadingData,
    maxWithdrawAmount,
    userAssetBalance,
    vaultAccounts,
    vaultBalanceInAsset,
    vaultOption,
    vaultFull,
    withdrawalFreeUpTime,
  ]);

  const actionButtonText = useMemo(() => {
    if (error !== "none") {
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
      }
    }

    /** Deposit */
    if (isDeposit) {
      if (isInputNonZero) {
        return `Preview Deposit`;
      }

      return `Deposit ${getAssetDisplay(asset)}`;
    }

    if (isInputNonZero) {
      return `Preview Withdrawal`;
    }

    return `Withdraw ${getAssetDisplay(asset)}`;
  }, [asset, error, isDeposit, isInputNonZero]);

  const actionDisabled = useMemo(() => {
    if (
      error === "none" &&
      isInputNonZero &&
      ((isDeposit && !vaultFull) || !isDeposit)
    ) {
      return false;
    }

    return true;
  }, [error, isDeposit, isInputNonZero, vaultFull]);

  const walletBalanceState = useMemo(() => {
    if (isDeposit && vaultFull) {
      return "vaultFull";
    }

    if (!isDeposit && allBalanceStaked) {
      return "error";
    }

    switch (error) {
      case "withdraw_limit_exceeded":
      case "withdraw_amount_staked":
      case "insufficient_balance":
        return "active";

      case "none":
        break;
      default:
        return "error";
    }

    return connected ? "active" : "inactive";
  }, [allBalanceStaked, connected, error, isDeposit, vaultFull]);

  const button = useMemo(() => {
    if (connected) {
      return (
        <ActionButton
          disabled={actionDisabled}
          onClick={handleClickActionButton}
          className="py-3 mb-4"
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
  }, [
    color,
    actionButtonText,
    connected,
    actionDisabled,
    handleClickActionButton,
    setShowConnectModal,
  ]);

  const desktopActionModal = useMemo(
    () => (
      <ActionModal
        vaultOption={vaultOption}
        variant={"desktop"}
        show={showActionModal}
        onClose={onCloseActionsModal}
        previewStepProps={previewStepProps}
        onSuccess={onSuccess}
      ></ActionModal>
    ),
    [
      vaultOption,
      showActionModal,
      previewStepProps,
      onSuccess,
      onCloseActionsModal,
    ]
  );

  const renderApprovalAssetLogo = useCallback(() => {
    const Logo = getAssetLogo(asset);

    return <Logo />;
  }, [asset]);

  const getSwapTriggerText = useCallback((_asset: Assets) => {
    switch (_asset) {
      case "WBTC":
        return "Swap your BTC or renBTC for wBTC";
      default:
        return "";
    }
  }, []);

  const renderSwapContainerTrigger = useCallback(() => {
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

  const renderSwapContainer = useCallback(() => {
    switch (asset) {
      case "WBTC":
        return <SwapBTCDropdown open={swapContainerOpen} />;
      default:
        return <></>;
    }
  }, [asset, swapContainerOpen]);

  return (
    <Container variant={variant}>
      {isDesktop && desktopActionModal}

      <FormContainer>
        <FormTitleContainer className="d-flex flex-row align-items-center">
          <FormTitleDiv
            left
            active={isDeposit}
            onClick={switchToTab(DEPOSIT_TAB)}
          >
            <FormTitle active={isDeposit}>Deposit</FormTitle>
          </FormTitleDiv>
          <FormTitleDiv
            left={false}
            active={!isDeposit}
            onClick={switchToTab(WITHDRAWAL_TAB)}
          >
            <FormTitle active={!isDeposit}>Withdraw</FormTitle>
          </FormTitleDiv>
        </FormTitleContainer>

        <ContentContainer className="px-4 py-4">
          {isDeposit && showTokenApproval ? (
            <>
              <ApprovalIconContainer>
                <ApprovalIcon color={color}>
                  {renderApprovalAssetLogo()}
                </ApprovalIcon>
              </ApprovalIconContainer>
              <ApprovalDescription>
                Before you deposit, the vault needs your permission to invest
                your {getAssetDisplay(asset)} in the vault’s strategy.
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
                disabled={vaultFull}
                color={color}
              >
                {waitingApproval
                  ? waitingApprovalLoadingText
                  : `Approve ${getAssetDisplay(asset)}`}
              </ActionButton>
            </>
          ) : (
            <>
              <BaseInputLabel>AMOUNT ({getAssetDisplay(asset)})</BaseInputLabel>
              <BaseInputContianer className="position-relative mb-5">
                <BaseInput
                  ref={inputRef}
                  type="number"
                  className="form-control"
                  aria-label="ETH"
                  placeholder="0"
                  value={inputAmount}
                  onChange={handleChange}
                  onWheel={onInputWheel}
                />
                {connected && (
                  <BaseInputButton onClick={handleClickMax}>
                    MAX
                  </BaseInputButton>
                )}
              </BaseInputContianer>
              {button}
            </>
          )}
          <WalletBalance state={walletBalanceState}>
            {formWalletContent}
          </WalletBalance>
          {renderSwapContainerTrigger()}
        </ContentContainer>
        {renderSwapContainer()}
      </FormContainer>

      {connected && isDesktop && (
        <YourPosition vaultOption={vaultOption} className="mt-4" />
      )}
    </Container>
  );
};

export default ActionsForm;
