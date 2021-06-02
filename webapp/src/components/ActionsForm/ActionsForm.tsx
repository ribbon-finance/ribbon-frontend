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
  BaseLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { formatSignificantDecimals } from "shared/lib/utils/math";

import {
  ActionButton,
  ConnectWalletButton,
} from "shared/lib/components/Common/buttons";
import {
  GAS_LIMITS,
  VaultAddressMap,
  VaultMaxDeposit,
  VaultOptions,
  VaultWithdrawalFee,
} from "shared/lib/constants/constants";
import useVaultData from "shared/lib/hooks/useVaultData";
import useVault from "shared/lib/hooks/useVault";
import { isETHVault, isVaultFull } from "shared/lib/utils/vault";
import colors from "shared/lib/designSystem/colors";
import { useLatestAPY } from "shared/lib/hooks/useAirtableData";
import { getAssetDisplay } from "shared/lib/utils/asset";
import { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { ERC20Token } from "shared/lib/models/eth";
import { WBTCLogo, USDCLogo } from "shared/lib/assets/icons/erc20Assets";
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

const InputGuide = styled.div`
  color: #ffffff;
  opacity: 0.4;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1.5px;
`;

const ContentContainer = styled.div`
  background: ${colors.background};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom: ${theme.border.width} ${theme.border.style} ${colors.border};
`;

const FormInputContainer = styled.div`
  width: 100%;
  height: 80px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
`;

const FormInput = styled.input`
  width: 80%;
  height: 100%;
  font-size: 40px;
  line-height: 64px;
  color: #ffffff;
  border: none;
  background: none;

  &:focus {
    color: #ffffff;
    background: none;
    border: none;
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    border: rgba(255, 255, 255, 0);
  }
`;

const MaxAccessory = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  right: 0;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 8px;
  height: 32px;
  font-size: 11px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 1.5px;
  cursor: pointer;
`;

type WalletBalanceStates = "active" | "inactive" | "error";

const WalletBalance = styled.div<{ state: WalletBalanceStates }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  text-transform: uppercase;
  color: ${(props) => {
    switch (props.state) {
      case "active":
        return "#FFFFFFA3";
      case "inactive":
        return "rgba(255, 255, 255, 0.16)";
      case "error":
        return colors.red;
      default:
        return "rgba(255, 255, 255, 0.16)";
    }
  }};
`;

const WithdrawLimitText = styled(SecondaryText)`
  display: flex;
  color: ${colors.red};
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

const HelpContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  width: 16px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 100px;
  margin-left: 8px;
`;

const ApprovalIconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
`;

const ApprovalIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  padding: 8px;
  border-radius: 100px;
  background-color: ${colors.green}29;
`;

const GreenWBTCLogo = styled(WBTCLogo)`
  width: 100%;
  && * {
    fill: ${colors.green};
  }
`;

const GreenUSDCLogo = styled(USDCLogo)`
  margin: -8px;
  width: 100%;

  && .background {
    fill: none;
  }

  && .content {
    fill: ${colors.green};
  }
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
  | "max_exceeded"
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
  const vaultMaxDepositAmount = VaultMaxDeposit[vaultOption];
  const maxDeposited = vaultBalanceInAsset.gte(vaultMaxDepositAmount);
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
        const allowedMaxAmount = maxAmount.lte(
          vaultMaxDepositAmount.sub(vaultBalanceInAsset)
        )
          ? maxAmount
          : vaultMaxDepositAmount.sub(vaultBalanceInAsset);
        const actualMaxAmount = allowedMaxAmount.isNegative()
          ? BigNumber.from("0")
          : allowedMaxAmount;

        setInputAmount(formatUnits(actualMaxAmount, decimals));
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
          if (isDeposit && amount.gt(userAssetBalance)) {
            setError("insufficient_balance");
            return;
          } else if (
            isDeposit &&
            amount.gt(vaultMaxDepositAmount.sub(vaultBalanceInAsset))
          ) {
            setError("max_exceeded");
            return;
          } else if (
            !isDeposit &&
            amount.gt(maxWithdrawAmount) &&
            amount.lte(vaultBalanceInAsset)
          ) {
            setError("withdraw_limit_exceeded");
            return;
          } else if (!isDeposit && amount.gt(maxWithdrawAmount)) {
            setError("insufficient_balance");
            return;
          }
        }
      }

      setError("none");
    });
  }, [
    inputAmount,
    connected,
    decimals,
    isDeposit,
    isLoadingData,
    maxWithdrawAmount,
    userAssetBalance,
    vaultBalanceInAsset,
    vaultMaxDepositAmount,
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
  }, [isDeposit, inputAmount, vaultBalanceStr, latestAPY.res, decimals]);

  const handleClickActionButton = () => {
    isDesktop && isInputNonZero && connected && setShowActionModal(true);
    !isDesktop && isInputNonZero && connected && onSubmit(previewStepProps);
  };

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
        await provider.waitForTransaction(txhash);
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

  let walletText = "";

  if (vaultFull) {
    walletText = "The Vault is currently full";
  } else if (maxDeposited) {
    walletText = `This vault has a max deposit of ${parseInt(
      formatUnits(vaultMaxDepositAmount, decimals)
    )} ${getAssetDisplay(asset)} per depositor`;
  } else if (isDeposit) {
    const position =
      account && !isLoadingData && userAssetBalance
        ? formatSignificantDecimals(formatUnits(userAssetBalance, decimals))
        : "---";
    walletText = `Wallet Balance: ${position} ${getAssetDisplay(asset)}`;
  } else {
    const position =
      account && !isLoadingData && userAssetBalance
        ? formatSignificantDecimals(formatUnits(vaultBalanceInAsset, decimals))
        : "---";
    walletText = `Your Position: ${position} ${getAssetDisplay(asset)}`;
  }

  let disabled = true;
  let actionButtonText = "";
  if (error === "insufficient_balance") {
    actionButtonText = "Insufficient Balance";
    disabled = true;
  } else if (error === "max_exceeded") {
    actionButtonText = `Maximum ${parseInt(
      formatUnits(vaultMaxDepositAmount, decimals)
    )} ${getAssetDisplay(asset)} Exceeded`;
    disabled = true;
  } else if (error === "withdraw_limit_exceeded") {
    actionButtonText = `WEEKLY LIMIT EXCEEDED`;
    disabled = true;
  } else if (error === "withdraw_limit_reached") {
    actionButtonText = `WithdrawALS DISABLED`;
    disabled = true;
  } else if (isDeposit && isInputNonZero) {
    if (vaultFull || maxDeposited) {
      actionButtonText = `Deposit ${getAssetDisplay(asset)}`;
      disabled = true;
    } else {
      actionButtonText = "Preview Deposit";
      disabled = false;
    }
  } else if (isDeposit) {
    actionButtonText = `Deposit ${getAssetDisplay(asset)}`;
    disabled = true;
  } else if (!isDeposit && isInputNonZero) {
    actionButtonText = "Preview Withdrawal";
    disabled = false;
  } else {
    actionButtonText = `Withdraw ${getAssetDisplay(asset)}`;
    disabled = true;
  }

  let walletBalanceState: WalletBalanceStates = "inactive";
  if (vaultFull || maxDeposited) {
    walletBalanceState = "error";
  } else {
    walletBalanceState = connected ? "active" : "inactive";
  }

  let button;

  if (connected) {
    button = (
      <ActionButton
        disabled={disabled}
        onClick={handleClickActionButton}
        className="py-3 mb-4"
      >
        {actionButtonText}
      </ActionButton>
    );
  } else {
    button = (
      <ConnectWalletButton
        onClick={() => setShowConnectModal(true)}
        type="button"
        className="btn py-3 mb-4"
      >
        Connect Wallet
      </ConnectWalletButton>
    );
  }

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
    switch (asset) {
      case "WBTC":
        return <GreenWBTCLogo />;
      case "USDC":
        return <GreenUSDCLogo />;
      default:
        return <></>;
    }
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

  const renderWalletBalance = useCallback(() => {
    if (error === "withdraw_limit_reached") {
      // In case if no latest short position detected
      return (
        <WithdrawLimitText>
          The vault’s weekly withdrawal limit has been reached. Withdrawals will
          be enabled again at 1000 UTC on {withdrawalFreeUpTime}.
        </WithdrawLimitText>
      );
    }

    if (error === "withdraw_limit_exceeded") {
      return (
        <WalletBalance state={walletBalanceState}>
          Weekly Withdraw Limit:{" "}
          {formatSignificantDecimals(formatUnits(maxWithdrawAmount, decimals))}{" "}
          {getAssetDisplay(asset)}
          <TooltipExplanation
            title="WEEKLY WITHDRAWAL LIMIT"
            explanation={`Withdrawing ${formatSignificantDecimals(
              formatUnits(maxWithdrawAmount, decimals)
            )} ${getAssetDisplay(
              asset
            )} will result in the vault hitting its weekly withdrawal limit. If the withdrawal limit is reached, withdrawals will be disabled until ${withdrawalFreeUpTime}.`}
            renderContent={({ ref, ...triggerHandler }) => (
              <HelpContainer ref={ref} {...triggerHandler}>
                ?
              </HelpContainer>
            )}
          />
        </WalletBalance>
      );
    }

    return (
      <WalletBalance state={walletBalanceState}>{walletText}</WalletBalance>
    );
  }, [
    error,
    walletBalanceState,
    walletText,
    maxWithdrawAmount,
    decimals,
    asset,
    withdrawalFreeUpTime,
  ]);

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
                <ApprovalIcon>{renderApprovalAssetLogo()}</ApprovalIcon>
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
                disabled={vaultFull || maxDeposited}
              >
                {waitingApproval
                  ? waitingApprovalLoadingText
                  : `Approve ${getAssetDisplay(asset)}`}
              </ActionButton>
            </>
          ) : (
            <>
              <InputGuide>AMOUNT ({getAssetDisplay(asset)})</InputGuide>
              <FormInputContainer className="position-relative mt-2 mb-5 px-1">
                <FormInput
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
                  <MaxAccessory onClick={handleClickMax}>MAX</MaxAccessory>
                )}
              </FormInputContainer>
              {button}
            </>
          )}
          {renderWalletBalance()}
          {renderSwapContainerTrigger()}
        </ContentContainer>
        {renderSwapContainer()}
      </FormContainer>

      {connected && isDesktop && (
        <YourPosition vaultOption={vaultOption} className="mt-4 px-4" />
      )}
    </Container>
  );
};

export default ActionsForm;
