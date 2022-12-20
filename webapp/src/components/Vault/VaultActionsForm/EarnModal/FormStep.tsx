import React, { useCallback, useMemo, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { BigNumber } from "ethers";
import {
  SecondaryText,
  Title,
  PrimaryText,
  BaseInputLabel,
  BaseInputContainer,
  BaseInput,
  BaseInputButton,
} from "shared/lib/designSystem";
import { AnimatePresence, Frame, motion, TargetAndTransition } from "framer";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { ActionType, V2WithdrawOption, V2WithdrawOptionList } from "./types";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import {
  getAssetColor,
  getAssetDefaultSignificantDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import { Assets } from "shared/lib/store/types";
import {
  VaultOptions,
  VaultVersion,
  VaultMaxDeposit,
  VaultAllowedDepositAssets,
  VaultAddressMap,
  isNativeToken,
  GAS_LIMITS,
} from "shared/lib/constants/constants";
import { getVaultColor } from "shared/lib/utils/vault";
import {
  DepositGlowIcon,
  WithdrawGlowIcon,
} from "shared/lib/assets/icons/icons";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  useAssetBalance,
  useV2VaultData,
} from "shared/lib/hooks/web3DataContext";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import currency from "currency.js";
import { useEarnStrategyTime } from "../../../../constants/constants";
import { fadeIn } from "shared/lib/designSystem/keyframes";
import useVaultPriceHistory from "shared/lib/hooks/useVaultPerformanceUpdate";
import { VaultValidationErrors } from "../types";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import { ERC20Token } from "shared/lib/models/eth";
import VaultApprovalForm from "../common/VaultApprovalForm";
import useGasPrice from "shared/lib/hooks/useGasPrice";

const Logo = styled.div<{ delay?: number; show?: boolean }>`
  margin-top: -40px;
  margin-bottom: -40px;

  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const StyledBaseInputLabel = styled(BaseInputLabel)<{
  delay?: number;
  show?: boolean;
}>`
  margin-top: 24px;
  width: 100%;

  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const InputContainer = styled(BaseInputContainer)<{
  delay?: number;
  show?: boolean;
}>`
  z-index: 2000;
  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const FormTitle = styled(Title)<{ delay?: number; show?: boolean }>`
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
  text-align: center;

  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const StyledTitle = styled(Title)<{ color?: string }>`
  color: ${(props) => props.color};
`;

const WarningContainer = styled.div<{
  color: string;
  delay?: number;
  show?: boolean;
}>`
  padding: 8px;
  background: ${(props) => props.color}14;
  border-radius: ${theme.border.radiusSmall};

  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const ErrorText = styled(SecondaryText)`
  color: ${colors.red};
  width: 100%;
`;

const DetailRow = styled.div<{ delay?: number; show?: boolean }>`
  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const ActionButtonContainer = styled.div<{
  delay?: number;
  show?: boolean;
  isStandard?: boolean;
}>`
  margin-top: ${(props) =>
    props.isStandard ? `40px !important` : `20px !important`};
  width: 100%;
  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;

        &:disabled {
          opacity: 0;
        }

        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const FormButton = styled(ActionButton)<{ delay?: number; show?: boolean }>``;

const WithdrawTypeSegmentControlContainer = styled.div<{
  delay?: number;
  show?: boolean;
}>`
  display: flex;
  margin-top: 8px;
  border-radius: ${theme.border.radiusBig};
  background: ${colors.primaryText}0A;
  position: relative;
  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;

        &:disabled {
          opacity: 0;
        }

        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const WithdrawTypeSegmentControl = styled.div`
  display: flex;
  padding: 10px 0;
  justify-content: center;
  flex: 1;
`;

const WithdrawTypeSegmentControlText = styled(Title)<{
  active: boolean;
  disabled: boolean;
}>`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => (props.active ? colors.green : colors.text)};
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
`;

const WithdrawTypeSegmentControlBackground = styled(Frame)`
  max-width: 50%;
  border: ${theme.border.width} ${theme.border.style} ${colors.green};
  border-radius: ${theme.border.radiusBig} !important;
  background-color: ${colors.green}0A !important;
`;

const DepositAssetButton = styled.div`
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translate(-16px, -50%);
  height: 32px;
  width: 56px;
  background: ${colors.background.four};
  border-radius: 100px;
`;

const DepositAssetButtonLogo = styled.div<{ color: string }>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  border-radius: 100px;
  border: 1px solid ${(props) => props.color};
  background: ${colors.background.one};

  &:before {
    position: absolute;
    content: " ";
    width: 100%;
    height: 100%;
    background: ${(props) => `${props.color}14`};
    border-radius: 100px;
  }
`;

const DepositAssetsDropdown = styled(motion.div)<{
  isOpen: boolean;
}>`
  ${(props) =>
    props.isOpen
      ? `
          position: absolute;
          z-index: 2000;
          padding: 8px;

          background-color: ${colors.background.four};
          border-radius: ${theme.border.radius};
          top: 36px;
          right: 0;
        `
      : `
          display: none;
        `}
`;

const DepositAssetsDropdownItem = styled.div<{
  color: string;
  active: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 4px;
  opacity: 0.48;
  border-radius: 100px;
  background: ${(props) => `${props.color}14`};
  margin-bottom: 8px;
  border: ${theme.border.width} ${theme.border.style} transparent;
  transition: border 150ms;

  &:last-child {
    margin-bottom: 0px;
  }

  ${(props) => {
    if (props.active) {
      return `
        opacity: 1;
        border: ${theme.border.width} ${theme.border.style} ${props.color};
      `;
    }
    return `
      &:hover {
        opacity: 1;
      }
    `;
  }}
`;

const FormStep: React.FC<{
  onClickUpdateInput: (amount: string | undefined) => void;
  inputAmount: string | undefined;
  actionType: ActionType;
  onClickUpdateWithdrawOption: (withdrawOption: V2WithdrawOption) => void;
  onClickConfirmButton: () => Promise<void>;
  asset: Assets;
  vaultOption: VaultOptions;
  vaultVersion: VaultVersion;
  show: boolean;
  showSwapDepositAsset: boolean;
  earnHandleDepositAssetChange: (asset: Assets) => void;
}> = ({
  onClickUpdateInput,
  inputAmount,
  actionType,
  onClickUpdateWithdrawOption,
  onClickConfirmButton,
  asset,
  vaultOption,
  vaultVersion,
  show,
  showSwapDepositAsset,
  earnHandleDepositAssetChange,
}) => {
  const [showDepositAssetMenu, setShowDepositAssetMenu] = useState(false);
  const color = getVaultColor(vaultOption);
  const {
    data: {
      cap,
      decimals,
      depositBalanceInAsset,
      lockedBalanceInAsset,
      totalBalance,
      withdrawals,
    },
    loading,
  } = useV2VaultData(vaultOption);
  const decimalPlaces = getAssetDefaultSignificantDecimals(asset);
  const tokenAllowance = useTokenAllowance(
    isNativeToken(asset)
      ? undefined
      : ((asset?.toLowerCase() ||
          VaultAllowedDepositAssets[
            vaultOption
          ][0].toLowerCase()) as ERC20Token),
    VaultAddressMap[vaultOption][vaultVersion]
  );

  const showTokenApproval = useMemo(() => {
    if (actionType === "deposit" && asset !== "USDC") {
      return (
        !isNativeToken(asset || VaultAllowedDepositAssets[vaultOption][0]) &&
        tokenAllowance &&
        isPracticallyZero(tokenAllowance, decimals)
      );
    }

    return false;
  }, [actionType, asset, decimals, tokenAllowance, vaultOption]);
  const gasPrice = useGasPrice();
  const { balance: userAssetBalance } = useAssetBalance(asset);
  const vaultBalanceInAsset = depositBalanceInAsset.add(lockedBalanceInAsset);
  const { active } = useWeb3Wallet();
  const vaultMaxDepositAmount = VaultMaxDeposit[vaultOption];
  const { vaultAccounts } = useVaultAccounts(vaultVersion);
  const vaultAccount = vaultAccounts[vaultOption];
  const { strategyStartTime, withdrawalDate, depositWithdrawalDate } =
    useEarnStrategyTime(vaultOption);
  const assetDisplay = getAssetDisplay(asset);
  const [withdrawOption, setWithdrawOption] =
    useState<V2WithdrawOption>("standard");
  const [activeBackgroundState, setActiveBackgroundState] =
    useState<TargetAndTransition>();
  const { priceHistory } = useVaultPriceHistory(vaultOption, "earn");
  const withdrawOptionRefs = useMemo(
    () =>
      V2WithdrawOptionList.reduce<any>((acc, curr) => {
        acc[curr] = React.createRef();
        return acc;
      }, {}),
    []
  );

  const withdrawalAmount = useMemo(
    () =>
      withdrawals.shares
        .mul(
          priceHistory.find(
            (history) => history.round === withdrawals.round - 1
          )?.pricePerShare || BigNumber.from(0)
        )
        .div(parseUnits("1", decimals)),
    [decimals, priceHistory, withdrawals.round, withdrawals.shares]
  );

  const canStandardWithdraw = useMemo(() => {
    if (!vaultAccount) {
      return undefined;
    }
    return !isPracticallyZero(
      vaultAccount.totalDeposits.sub(vaultAccount.totalPendingDeposit),
      decimals
    );
  }, [decimals, vaultAccount]);

  const stakedBalance = useMemo(() => {
    if (!vaultAccount) {
      return BigNumber.from("0");
    }
    return vaultAccount.totalStakedBalance;
  }, [vaultAccount]);

  useEffect(() => {
    let currentRef = withdrawOptionRefs[withdrawOption]?.current;

    if (!currentRef) {
      return;
    }

    if (canStandardWithdraw === false) {
      setWithdrawOption("instant");
    }
    const handleResize = () => {
      setActiveBackgroundState({
        left: currentRef.offsetLeft,
        top: currentRef.offsetTop,
        height: currentRef.clientHeight,
        width: currentRef.clientWidth,
      });
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canStandardWithdraw, withdrawOption, withdrawOptionRefs]);

  const investedInStrategy = useMemo(() => {
    if (!vaultAccount) {
      return BigNumber.from(0.0);
    }
    return vaultAccount.totalBalance;
  }, [vaultAccount]);

  const isInputNonZero = useMemo((): boolean => {
    return inputAmount ? parseFloat(inputAmount) > 0 : false;
  }, [inputAmount]);

  const renderWithdrawOptionExplanation = useCallback(
    (withdrawOption: V2WithdrawOption, active: boolean) => {
      switch (withdrawOption) {
        case "instant":
          return (
            <TooltipExplanation
              title="INSTANT WITHDRAWAL"
              explanation={
                "Instant withdrawals are for funds that have been deposited but not yet deployed in the vault’s weekly strategy. Because these funds haven’t been deployed they can be withdrawn immediately."
              }
              renderContent={({ ref, ...triggerHandler }) => (
                <HelpInfo
                  containerRef={ref}
                  {...triggerHandler}
                  color={active ? colors.green : colors.text}
                >
                  i
                </HelpInfo>
              )}
            />
          );
        case "standard":
        case "complete":
          return (
            <TooltipExplanation
              title="STANDARD WITHDRAWAL"
              explanation={
                <>
                  Standard withdrawals are for funds that have been deployed in
                  the vault's weekly strategy and involve a 2-step withdrawal
                  process.
                  <br />
                  <br />
                  Step 1: Users need to remove their funds from the vault's pool
                  of investable capital by initiating a withdrawal.
                  <br />
                  <br />
                  Step 2: Initiated withdrawals are removed from the vault's
                  pool of investable capital at 12pm UTC on {withdrawalDate} and
                  once this happens users can complete their withdrawals and
                  remove their funds from the vault.
                </>
              }
              renderContent={({ ref, ...triggerHandler }) => (
                <HelpInfo
                  containerRef={ref}
                  {...triggerHandler}
                  color={active ? colors.green : colors.text}
                >
                  i
                </HelpInfo>
              )}
            />
          );
      }
    },
    [withdrawalDate]
  );

  const renderDepositAssetButton = useMemo(() => {
    if (active && showSwapDepositAsset && asset) {
      const Logo = getAssetLogo(asset);

      return (
        <DepositAssetButton
          role="button"
          onClick={() => setShowDepositAssetMenu((show) => !show)}
        >
          <div className="d-flex w-100 h-100 align-items-center position-relative p-1">
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={asset}
                initial={{
                  rotate: -180,
                  opacity: 0,
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                }}
                exit={{
                  rotate: 180,
                  opacity: 0,
                }}
                transition={{
                  type: "keyframes",
                  duration: 0.1,
                }}
              >
                <DepositAssetButtonLogo color={getAssetColor(asset)}>
                  <Logo height="20px" width="20px" />
                </DepositAssetButtonLogo>
              </motion.div>
            </AnimatePresence>
            <div className="d-flex flex-grow-1 justify-content-center">
              <ButtonArrow
                color={colors.primaryText}
                isOpen={showDepositAssetMenu}
                fontSize={12}
              />
            </div>
            <AnimatePresence>
              <DepositAssetsDropdown
                key={showDepositAssetMenu.toString()}
                isOpen={showDepositAssetMenu}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                }}
                transition={{
                  type: "keyframes",
                  duration: 0.2,
                }}
              >
                {VaultAllowedDepositAssets[vaultOption].map((depositAsset) => {
                  const Logo = getAssetLogo(depositAsset);
                  return (
                    <DepositAssetsDropdownItem
                      color={getAssetColor(depositAsset)}
                      active={asset === depositAsset}
                      onClick={() => {
                        earnHandleDepositAssetChange(depositAsset);
                      }}
                    >
                      <DepositAssetButtonLogo
                        color={getAssetColor(depositAsset)}
                      >
                        <Logo height="20px" width="20px" />
                      </DepositAssetButtonLogo>
                      <Title fontSize={11} lineHeight={16} className="ml-1">
                        {getAssetDisplay(depositAsset)}
                      </Title>
                    </DepositAssetsDropdownItem>
                  );
                })}
              </DepositAssetsDropdown>
            </AnimatePresence>
          </div>
        </DepositAssetButton>
      );
    }

    return <></>;
  }, [
    active,
    asset,
    earnHandleDepositAssetChange,
    showDepositAssetMenu,
    showSwapDepositAsset,
    vaultOption,
  ]);
  const error = useMemo((): VaultValidationErrors | undefined => {
    try {
      /** Check block with input requirement */
      if (isInputNonZero && inputAmount && !loading && active) {
        const amountBigNumber = parseUnits(inputAmount, decimals);
        switch (actionType) {
          case "deposit":
            if (isNativeToken(asset)) {
              // check that user balance - estimate gas fee is gt deposit amount
              const gasLimit = GAS_LIMITS[vaultOption].earn!.deposit;
              const gasFee = BigNumber.from(gasLimit.toString()).mul(
                BigNumber.from(gasPrice || "0")
              );
              if (amountBigNumber.gt(userAssetBalance.sub(gasFee))) {
                return "insufficientBalance";
              }
            } else {
              if (amountBigNumber.gt(userAssetBalance)) {
                return "insufficientBalance";
              }
            }

            if (
              amountBigNumber.gt(vaultMaxDepositAmount.sub(vaultBalanceInAsset))
            ) {
              return "maxExceeded";
            }

            if (amountBigNumber.gt(cap.sub(totalBalance))) {
              return "capacityOverflow";
            }
            break;
          case "withdraw":
            if (withdrawOption === "standard") {
              if (amountBigNumber.gt(lockedBalanceInAsset)) {
                return "withdrawLimitExceeded";
              }
            } else {
              if (amountBigNumber.gt(depositBalanceInAsset)) {
                return "withdrawLimitExceeded";
              }
            }
        }
      }
    } catch (err) {
      // Assume no error because empty input unable to parse
    }

    return undefined;
  }, [
    actionType,
    active,
    asset,
    cap,
    decimals,
    depositBalanceInAsset,
    gasPrice,
    inputAmount,
    isInputNonZero,
    loading,
    lockedBalanceInAsset,
    totalBalance,
    userAssetBalance,
    vaultBalanceInAsset,
    vaultMaxDepositAmount,
    vaultOption,
    withdrawOption,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleConfirm = () => {
    onClickConfirmButton();
    onClickUpdateWithdrawOption(withdrawOption);
    onClickUpdateInput(inputAmount);
  };

  const detailRows: ActionDetail[] = useMemo(() => {
    const actionDetails: ActionDetail[] = [];
    switch (actionType) {
      case "deposit":
        actionDetails.push({
          key: "Current Position",
          value: `${currency(formatUnits(investedInStrategy, decimals), {
            precision: decimalPlaces,
            symbol: "",
          })} ${assetDisplay}`,
          tooltip: {
            title: "Current Position",
            explanation: `Current amount of ${assetDisplay} deposited by your address in the vault.`,
          },
        });

        actionDetails.push({
          key: "Wallet Balance",
          value: `${currency(formatUnits(userAssetBalance, decimals), {
            precision: decimalPlaces,
            symbol: "",
          }).format()} ${assetDisplay}`,
          tooltip: {
            title: "Wallet Balance",
            explanation: `Current amount of ${assetDisplay} available in your wallet.`,
          },
          error: "insufficientBalance",
        });

        actionDetails.push({
          key: "Vault Capacity",
          value: `${currency(formatUnits(cap.sub(totalBalance), decimals), {
            precision: decimalPlaces,
            symbol: "",
          }).format()} ${assetDisplay}`,
          error: "capacityOverflow",
          tooltip: {
            title: "Vault Capacity",
            explanation: `Total capacity of the vault in ${assetDisplay}. Once this amount is filled, no additional deposit can be made`,
          },
        });

        actionDetails.push({
          key: "Strategy Start Time",
          value: `${strategyStartTime}`,
          tooltip: {
            title: "Strategy Start Time",
            explanation:
              "Time until the next epoch is started and funds are deployed.",
          },
        });
        break;
      case "withdraw":
        if (withdrawOption === "standard") {
          actionDetails.push({
            key: "Available Limit",
            value: `${formatBigNumber(
              lockedBalanceInAsset,
              decimals
            )} ${assetDisplay}`,
            error: "withdrawLimitExceeded",
            tooltip: {
              title: "AVAILABLE LIMIT",
              explanation:
                "This is equal to the value of your funds currently deployed in the weekly strategy minus the funds you have already initiated for withdrawal.",
            },
          });
          actionDetails.push({
            key: "Initiated Withdrawals",
            value: `${formatBigNumber(
              withdrawalAmount,
              decimals
            )} ${assetDisplay}`,
            tooltip: {
              title: "PENDING WITHDRAWALS",
              explanation: `This is the total amount of ${assetDisplay} you’ve requested to withdraw from the vault’s pool of investable capital. At 12pm UTC on ${withdrawalDate}, the vault will close it’s monthly position and remove the amount of ${assetDisplay} you requested from its pool of investable capital.`,
            },
          });
          actionDetails.push({
            key: "Staked Balance",
            value: `${formatBigNumber(
              stakedBalance,
              decimals
            )} ${assetDisplay}`,
            tooltip: {
              title: "STAKED BALANCE",
              explanation: `This is the total amount of ${assetDisplay} you’ve staked. You will need to unstake before you can initiate a withdrawal of this balance`,
            },
          });
        }
        if (withdrawOption === "instant") {
          actionDetails.push({
            key: "Withdraw Limit",
            value: `${formatBigNumber(
              depositBalanceInAsset,
              decimals
            )} ${assetDisplay}`,
            error: "withdrawLimitExceeded",
            tooltip: {
              title: "INSTANT WITHDRAW LIMIT",
              explanation:
                "This is equal to the value of your funds that are currently not invested in the vault’s weekly strategy. These funds can withdrawn from the vault immediately.",
            },
          });
          // tofix: placeholder to handle animation issues
          actionDetails.push({
            key: "",
            value: "",
          });
          actionDetails.push({
            key: "",
            value: "",
          });
        }
        break;
    }
    return actionDetails;
  }, [
    actionType,
    investedInStrategy,
    decimals,
    decimalPlaces,
    assetDisplay,
    userAssetBalance,
    cap,
    totalBalance,
    strategyStartTime,
    withdrawOption,
    lockedBalanceInAsset,
    withdrawalAmount,
    withdrawalDate,
    stakedBalance,
    depositBalanceInAsset,
  ]);

  const renderButton = useCallback(() => {
    return (
      <ActionButtonContainer
        delay={0.5 + detailRows.length * 0.1}
        show={show}
        isStandard={withdrawOption === "standard"}
      >
        <ActionButton
          disabled={Boolean(error) || !isInputNonZero}
          onClick={handleConfirm}
          className="py-3 mb-4"
          color={color}
        >
          {withdrawOption! === "instant"
            ? `Withdraw ${assetDisplay}`
            : "Initiate Withdrawal"}
        </ActionButton>
      </ActionButtonContainer>
    );
  }, [
    assetDisplay,
    color,
    detailRows.length,
    error,
    handleConfirm,
    isInputNonZero,
    show,
    withdrawOption,
  ]);
  const isButtonDisabled = useMemo((): boolean => {
    return error ? true : !isInputNonZero;
  }, [error, isInputNonZero]);

  interface Tooltip {
    title: string;
    explanation: string;
  }
  interface ActionDetail {
    key: string;
    value: string;
    error?: VaultValidationErrors;
    tooltip?: Tooltip;
  }

  const renderErrorText = useCallback((_error: VaultValidationErrors) => {
    switch (_error) {
      case "insufficientBalance":
        return "Insufficient balance";
      case "maxExceeded":
        break;
      case "capacityOverflow":
        return "Insufficient vault capacity";
      case "withdrawLimitExceeded":
        return "Available limit exceeded";
      case "existingWithdraw":
        return "Existing withdraw from previous round";
      default:
        return "";
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      onClickUpdateInput(rawInput && parseFloat(rawInput) < 0 ? "" : rawInput);
    },
    [onClickUpdateInput]
  );
  const handleMaxClick = useCallback(() => {
    switch (actionType) {
      case "withdraw":
        const maxAmount =
          withdrawOption === "standard"
            ? lockedBalanceInAsset
            : depositBalanceInAsset;
        onClickUpdateInput(formatUnits(maxAmount, decimals));
        break;
      case "deposit":
        if (isNativeToken(asset)) {
          // account for eth gas fee if deposit token is eth
          const gasLimit = GAS_LIMITS[vaultOption].earn!.deposit;
          const gasFee = BigNumber.from(gasLimit.toString()).mul(
            BigNumber.from(gasPrice || "0")
          );
          const maxAmount = userAssetBalance.sub(gasFee);
          onClickUpdateInput(formatUnits(maxAmount, decimals));
        } else {
          onClickUpdateInput(formatUnits(userAssetBalance, decimals));
        }
    }
  }, [
    asset,
    actionType,
    vaultOption,
    gasPrice,
    userAssetBalance,
    onClickUpdateInput,
    decimals,
    withdrawOption,
    lockedBalanceInAsset,
    depositBalanceInAsset,
  ]);

  /**
   * IMPORTANT
   * Do note over here that the fallthrough case currently will only allow V1 withdraw and v2 instant withdraw to fall through.
   * Exercise great caution when introducing further fallthrough to avoid unintended consequences.
   */

  const actionLogo = useMemo(() => {
    switch (actionType) {
      case "deposit":
        return <DepositGlowIcon color={color} width={176} />;
      case "withdraw":
        return <WithdrawGlowIcon color={color} width={176} />;
    }
  }, [actionType, color]);

  const warning = useMemo(() => {
    switch (actionType) {
      case "deposit":
        return (
          <WarningContainer
            show={show}
            delay={0.6 + detailRows.length * 0.1}
            className="mt-2 mb-3 w-100 text-center"
            color={color}
          >
            <PrimaryText
              style={{ padding: 0 }}
              fontSize={14}
              lineHeight={20}
              color={color}
            >
              IMPORTANT: Your funds will be available for withdrawal at 12pm UTC
              on {depositWithdrawalDate}
            </PrimaryText>
          </WarningContainer>
        );
      case "withdraw":
        if (withdrawOption === "instant") {
          if (canStandardWithdraw) {
            return (
              <WarningContainer
                show={show}
                delay={0.7 + detailRows.length * 0.1}
                className="mb-4 w-100 text-center"
                color={color}
              >
                <PrimaryText fontSize={14} lineHeight={20} color={color}>
                  IMPORTANT: You can withdraw{" "}
                  {formatBigNumber(depositBalanceInAsset, decimals)}{" "}
                  {assetDisplay} via instant withdrawals as these funds have not
                  yet been deployed in the vault’s strategy
                </PrimaryText>
              </WarningContainer>
            );
          }
        } else {
          return <></>;
        }
    }
  }, [
    actionType,
    assetDisplay,
    canStandardWithdraw,
    color,
    decimals,
    depositBalanceInAsset,
    depositWithdrawalDate,
    detailRows.length,
    show,
    withdrawOption,
  ]);

  if (showTokenApproval) {
    return (
      <VaultApprovalForm
        vaultOption={vaultOption}
        version={vaultVersion}
        showDepositAssetSwap={VaultAllowedDepositAssets[vaultOption].length > 1}
        earnHandleDepositAssetChange={earnHandleDepositAssetChange}
        earnDepositAsset={asset}
      />
    );
  }
  return (
    <div className="d-flex flex-column align-items-center">
      {/* Logo */}
      <Logo delay={0.1} show={show}>
        {actionLogo}
      </Logo>
      <FormTitle delay={0.2} show={show}>
        {actionType}
      </FormTitle>
      {actionType === "deposit" ? (
        <>
          <StyledBaseInputLabel delay={0.3} show={show}>
            AMOUNT ({assetDisplay})
          </StyledBaseInputLabel>
          <InputContainer
            delay={0.4}
            show={show}
            className="mb-2"
            error={error ? true : false}
          >
            <BaseInput
              type="number"
              className="form-control"
              aria-label="USDC"
              placeholder="0"
              value={inputAmount}
              onChange={handleInputChange}
              inputWidth={vaultOption === "rEARN-stETH" ? "65%" : "85%"}
            />
            {renderDepositAssetButton}
            {active && (
              <BaseInputButton onClick={handleMaxClick}>MAX</BaseInputButton>
            )}
          </InputContainer>
          {error && <ErrorText>{renderErrorText(error)}</ErrorText>}
          {detailRows.map((detail, index) => (
            <DetailRow
              className="d-flex w-100 flex-row align-items-center justify-content-between mt-4"
              key={index}
              delay={0.4 + (index + 1) * 0.1}
              show={show}
            >
              <div className="d-flex flex-row align-items-center">
                <SecondaryText>{detail.key} </SecondaryText>
                {detail.tooltip && (
                  <TooltipExplanation
                    title={detail.tooltip.title}
                    explanation={detail.tooltip.explanation}
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HelpInfo
                        containerRef={ref}
                        {...triggerHandler}
                        style={{ marginLeft: "4px" }}
                      >
                        i
                      </HelpInfo>
                    )}
                  />
                )}
              </div>

              <StyledTitle
                color={
                  error && detail.error
                    ? error === detail.error
                      ? colors.red
                      : colors.primaryText
                    : colors.primaryText
                }
                className="text-right"
              >
                {detail.value}
              </StyledTitle>
            </DetailRow>
          ))}
          <ActionButtonContainer
            delay={0.5 + detailRows.length * 0.1}
            show={show}
          >
            <FormButton
              onClick={handleConfirm}
              disabled={isButtonDisabled}
              className="btn py-3 mt-4 mb-2"
              color={color}
            >
              Next
            </FormButton>
          </ActionButtonContainer>
          {warning}
        </>
      ) : (
        <div style={{ position: "relative", marginTop: 16 }}>
          {/* Segment Control */}
          <WithdrawTypeSegmentControlContainer delay={0.3} show={show}>
            <WithdrawTypeSegmentControlBackground
              transition={{
                type: "keyframes",
                ease: "easeOut",
              }}
              initial={{
                height: "100%",
              }}
              animate={activeBackgroundState}
            />
            {V2WithdrawOptionList.map((withdrawOption) => {
              /**
               * Complete withdraw is also consider as standard
               */
              return (
                <WithdrawTypeSegmentControl
                  key={withdrawOption}
                  ref={withdrawOptionRefs[withdrawOption]}
                  role="button"
                  onClick={() => {
                    setWithdrawOption(withdrawOption);
                    onClickUpdateInput("");
                  }}
                >
                  <WithdrawTypeSegmentControlText
                    active={active}
                    disabled={
                      withdrawOption !== "instant" && !canStandardWithdraw
                    }
                  >
                    {withdrawOption}{" "}
                    {renderWithdrawOptionExplanation(withdrawOption, active)}
                  </WithdrawTypeSegmentControlText>
                </WithdrawTypeSegmentControl>
              );
            })}
          </WithdrawTypeSegmentControlContainer>

          {/* Input */}
          <StyledBaseInputLabel className="mt-4" delay={0.4} show={show}>
            AMOUNT ({assetDisplay})
          </StyledBaseInputLabel>
          <InputContainer
            className="mb-2"
            delay={0.5}
            show={show}
            error={error ? true : false}
          >
            <BaseInput
              type="number"
              className="form-control"
              aria-label="ETH"
              placeholder="0"
              value={inputAmount}
              onChange={handleInputChange}
            />
            {active}
            <BaseInputButton onClick={handleMaxClick}>MAX</BaseInputButton>
          </InputContainer>
          {error && (
            <SecondaryText color={colors.red}>
              {renderErrorText(error)}
            </SecondaryText>
          )}
          {detailRows.map((detail, index) => (
            <DetailRow
              className="d-flex w-100 flex-row align-items-center justify-content-between mt-4"
              key={index}
              delay={0.5 + (index + 1) * 0.1}
              show={show}
            >
              <div className="d-flex flex-row align-items-center">
                <SecondaryText>{detail.key} </SecondaryText>
                {detail.tooltip && (
                  <TooltipExplanation
                    title={detail.tooltip.title}
                    explanation={detail.tooltip.explanation}
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HelpInfo
                        containerRef={ref}
                        {...triggerHandler}
                        style={{ marginLeft: "4px" }}
                      >
                        i
                      </HelpInfo>
                    )}
                  />
                )}
              </div>
              <StyledTitle
                color={
                  error && detail.error
                    ? error === detail.error
                      ? colors.red
                      : colors.primaryText
                    : colors.primaryText
                }
                className="text-right"
              >
                {detail.value}
              </StyledTitle>
            </DetailRow>
          ))}
          {renderButton()}
        </div>
      )}
    </div>
  );
};

export default FormStep;
