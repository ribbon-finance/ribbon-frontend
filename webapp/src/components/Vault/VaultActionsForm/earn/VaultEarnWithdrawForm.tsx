import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Frame, TargetAndTransition } from "framer";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { BigNumber } from "ethers";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import {
  ACTIONS,
  V2WithdrawOption,
  V2WithdrawOptionList,
} from "../Modal/types";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import {
  getAssets,
  isSolanaVault,
  VaultMaxDeposit,
  VaultOptions,
} from "shared/lib/constants/constants";
import {
  ActionButton,
  ConnectWalletButton,
} from "shared/lib/components/Common/buttons";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import { VaultInputValidationErrorList, VaultValidationErrors } from "../types";
import { getVaultColor } from "shared/lib/utils/vault";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import AssetCircleContainer from "shared/lib/components/Common/AssetCircleContainer";
import { useTranslation } from "react-i18next";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import useVaultPriceHistory from "shared/lib/hooks/useVaultPerformanceUpdate";
import { useV2VaultData } from "shared/lib/hooks/web3DataContext";
import { parseUnits } from "ethers/lib/utils";

const WithdrawTypeSegmentControlContainer = styled.div`
  display: flex;
  margin-top: 8px;
  border-radius: ${theme.border.radiusBig};
  background: ${colors.primaryText}0A;
  position: relative;
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

const InfoData = styled(Title)`
  font-size: 14px;
  line-height: 24px;
  margin-left: auto;
`;

const FormFooterButton = styled.div<{ color: string }>`
  background: ${(props) => props.color}14;
  border-radius: 100px;
  padding: 10px 16px;
`;

const WithdrawButtonLogo = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background: ${(props) => props.color};
`;

const AllTokenStakedMessage = styled.div`
  padding-top: 16px;
  text-align: center;
`;

interface VaultV2WithdrawFormProps {
  vaultOption: VaultOptions;
  error?: string;
  // onFormSubmit: () => void;
  depositBalanceInAsset: BigNumber;
  lockedBalanceInAsset: BigNumber;
  initiatedWithdrawAmount: BigNumber;
}

const VaultEarnWithdrawForm: React.FC<VaultV2WithdrawFormProps> = ({
  vaultOption,
  error,
  // onFormSubmit,
  depositBalanceInAsset,
  lockedBalanceInAsset,
  initiatedWithdrawAmount,
}) => {
  const { t } = useTranslation();
  const asset = getAssets(vaultOption);
  const assetDisplay = getAssetDisplay(asset);
  const color = getVaultColor(vaultOption);
  const withdrawOptionRefs = useMemo(
    () =>
      V2WithdrawOptionList.reduce<any>((acc, curr) => {
        acc[curr] = React.createRef();
        return acc;
      }, {}),
    []
  );

  const [, setShowConnectModal] = useConnectWalletModal();
  const [inputAmount, changeInputAmount] = useState<string>("");
  const [withdrawOption, setWithdrawOption] =
    useState<V2WithdrawOption>("standard");
  const [activeBackgroundState, setActiveBackgroundState] =
    useState<TargetAndTransition>();

  const {
    data: { cap, decimals, totalBalance, withdrawals },
    loading,
  } = useV2VaultData(vaultOption);

  const { active } = useWeb3Wallet();
  const { vaultAccounts } = useVaultAccounts("earn");
  const vaultAccount = vaultAccounts["rEARN"];
  const { priceHistory } = useVaultPriceHistory(vaultOption, "earn");

  const isInputNonZero = useMemo((): boolean => {
    return parseFloat(inputAmount) > 0;
  }, [inputAmount]);

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

  const canStandardWithdraw = useMemo(() => {
    if (!vaultAccount) {
      return false;
    }
    return !isPracticallyZero(
      vaultAccount.totalDeposits.sub(vaultAccount.totalPendingDeposit),
      6
    );
  }, [vaultAccount]);

  useEffect(() => {
    let currentRef = withdrawOptionRefs[withdrawOption]?.current;

    if (!currentRef) {
      return;
    }

    if (!canStandardWithdraw) {
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
                  pool of investable capital every Friday at 12pm UTC and once
                  this happens users can complete their withdrawals and remove
                  their funds from the vault.
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
    []
  );

  const renderErrorText = useCallback((_error: VaultValidationErrors) => {
    if (VaultInputValidationErrorList.includes(_error)) {
      switch (_error) {
        case "withdrawLimitExceeded":
          return "Available limit exceeded";
        case "eixstingWithdraw":
          return "Existing withdraw from previous round";
      }
    }

    return "";
  }, []);

  const formExtraInfo = useMemo(() => {
    const decimals = getAssetDecimals(asset);
    switch (withdrawOption) {
      case "instant":
        return (
          <div className="d-flex align-items-center mt-3 mb-1">
            <SecondaryText>Instant withdraw limit</SecondaryText>
            <TooltipExplanation
              title="INSTANT WITHDRAW LIMIT"
              explanation="This is equal to the value of your funds that are currently not invested in the vault’s weekly strategy. These funds can withdrawn from the vault immediately."
              renderContent={({ ref, ...triggerHandler }) => (
                <HelpInfo containerRef={ref} {...triggerHandler}>
                  i
                </HelpInfo>
              )}
            />
            <InfoData
              color={error === "withdrawLimitExceeded" ? colors.red : undefined}
            >
              {formatBigNumber(depositBalanceInAsset, decimals)} {assetDisplay}
            </InfoData>
          </div>
        );
      case "standard":
      case "complete":
        return (
          <>
            <div className="d-flex align-items-center mt-3">
              <SecondaryText>Available Limit</SecondaryText>
              <TooltipExplanation
                title="AVAILABLE LIMIT"
                explanation="This is equal to the value of your funds currently deployed in the weekly strategy minus the funds you have already initiated for withdrawal."
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    i
                  </HelpInfo>
                )}
              />
              <InfoData
                color={
                  error === "withdrawLimitExceeded" ? colors.red : undefined
                }
              >
                {formatBigNumber(lockedBalanceInAsset, decimals)} {assetDisplay}
              </InfoData>
            </div>
            <div className="d-flex align-items-center mt-3 mb-1">
              <SecondaryText>Initiated Withdrawals</SecondaryText>
              <TooltipExplanation
                title="PENDING WITHDRAWALS"
                explanation={
                  <>
                    This is the total amount of {assetDisplay} you’ve requested
                    to withdraw from the vault’s pool of investable capital.
                    <br />
                    <br />
                    On Friday at 12pm UTC, the vault will close it’s weekly
                    position and remove the amount of {assetDisplay} you
                    requested from its pool of investable capital.
                    <br />
                    <br />
                    {isSolanaVault(vaultOption)
                      ? "The funds are automatically credited to your account once the vault is rolled over."
                      : "You can then complete your withdrawal and remove your funds from the vault."}
                  </>
                }
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    i
                  </HelpInfo>
                )}
              />
              <InfoData>
                {formatBigNumber(initiatedWithdrawAmount, decimals)}{" "}
                {assetDisplay}
              </InfoData>
            </div>
          </>
        );
    }

    return <></>;
  }, [
    asset,
    withdrawOption,
    error,
    depositBalanceInAsset,
    assetDisplay,
    lockedBalanceInAsset,
    vaultOption,
    initiatedWithdrawAmount,
  ]);

  const renderButton = useCallback(() => {
    if (active) {
      return (
        <ActionButton
          disabled={Boolean(error) || !isInputNonZero}
          onClick={() => {
            // onFormSubmit();
          }}
          className="mt-4 py-3 mb-0"
          color={color}
        >
          {withdrawOption! === "instant"
            ? `Withdraw ${assetDisplay}`
            : "Initiate Withdrawal"}
        </ActionButton>
      );
    }

    return (
      <ConnectWalletButton
        onClick={() => setShowConnectModal(true)}
        type="button"
        className="mt-4 btn py-3 mb-0"
      >
        Connect Wallet
      </ConnectWalletButton>
    );
  }, [
    active,
    assetDisplay,
    color,
    error,
    isInputNonZero,
    setShowConnectModal,
    withdrawOption,
  ]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      changeInputAmount(rawInput);
    },
    []
  );
  // const formFooter = useMemo(() => {
  //   if (canCompleteWithdraw) {
  //     return (
  //       <FormFooterButton
  //         className="d-flex align-items-center justify-content-center mt-4 mx-3"
  //         role="button"
  //         color={color}
  //         onClick={() => {
  //           handleActionTypeChange(ACTIONS.withdraw, "v2", {
  //             withdrawOption: "complete",
  //           });
  //           handleMaxClick();
  //           onFormSubmit();
  //         }}
  //       >
  //         <AssetCircleContainer size={24} color={color}>
  //           <WithdrawButtonLogo color={color} />
  //         </AssetCircleContainer>
  //         <SecondaryText className="ml-1" color={colors.primaryText}>
  //           Complete your withdrawals
  //         </SecondaryText>
  //       </FormFooterButton>
  //     );
  //   } else if (withdrawMetadata.allTokensStaked) {
  //     return (
  //       <AllTokenStakedMessage>
  //         <SecondaryText color={colors.red}>
  //           {t("webapp:Withdrawals:AllrTokensStakedError", {
  //             rToken: vaultOption,
  //           })}
  //         </SecondaryText>
  //       </AllTokenStakedMessage>
  //     );
  //   }
  //   return null;
  // }, [
  //   canCompleteWithdraw,
  //   color,
  //   handleActionTypeChange,
  //   handleMaxClick,
  //   onFormSubmit,
  //   withdrawMetadata,
  //   vaultOption,
  //   t,
  // ]);

  return (
    <div style={{ position: "relative" }}>
      {/* Segment Control */}
      <WithdrawTypeSegmentControlContainer>
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
              }}
            >
              <WithdrawTypeSegmentControlText
                active={active}
                disabled={withdrawOption !== "instant" && !canStandardWithdraw}
              >
                {withdrawOption}{" "}
                {renderWithdrawOptionExplanation(withdrawOption, active)}
              </WithdrawTypeSegmentControlText>
            </WithdrawTypeSegmentControl>
          );
        })}
      </WithdrawTypeSegmentControlContainer>

      {/* Input */}
      <BaseInputLabel className="mt-4">AMOUNT ({assetDisplay})</BaseInputLabel>
      <BaseInputContainer
        className="mb-2"
        error={false} //error ? VaultInputValidationErrorList.includes(error) : false
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
        {/* //&& (
          // <BaseInputButton onClick={handleMaxClick}>MAX</BaseInputButton> */}
      </BaseInputContainer>
      {error && (
        <SecondaryText color={colors.red}>
          {/* {renderErrorText(error)} */}
        </SecondaryText>
      )}
      {formExtraInfo}
      {renderButton()}
      {/* {formFooter} */}
    </div>
  );
};

export default VaultEarnWithdrawForm;
