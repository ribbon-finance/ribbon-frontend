import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Frame } from "framer";
import { useWeb3Wallet } from "webapp/lib/hooks/useWeb3Wallet";
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
} from "webapp/lib/components/Vault/VaultActionsForm/Modal/types";
import useVaultActionForm from "webapp/lib/hooks/useVaultActionForm";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";
import {
  ActionButton,
  ConnectWalletButton,
} from "shared/lib/components/Common/buttons";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import {
  VaultInputValidationErrorList,
  VaultValidationErrors,
} from "webapp/lib/components/Vault/VaultActionsForm/types";
import { getVaultColor } from "shared/lib/utils/vault";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { formatBigNumber } from "shared/lib/utils/math";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import AssetCircleContainer from "shared/lib/components/Common/AssetCircleContainer";

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

interface VaultV2WithdrawFormProps {
  vaultOption: VaultOptions;
  error?: VaultValidationErrors;
  onFormSubmit: () => void;
  depositBalanceInAsset: BigNumber;
  lockedBalanceInAsset: BigNumber;
  initiatedWithdrawAmount: BigNumber;
  canCompleteWithdraw: boolean;
}

const VaultV2WithdrawForm: React.FC<VaultV2WithdrawFormProps> = ({
  vaultOption,
  error,
  onFormSubmit,
  depositBalanceInAsset,
  lockedBalanceInAsset,
  initiatedWithdrawAmount,
  canCompleteWithdraw,
}) => {
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

  const {
    handleActionTypeChange,
    handleInputChange,
    handleMaxClick,
    vaultActionForm,
    withdrawMetadata,
  } = useVaultActionForm(vaultOption);
  const { active } = useWeb3Wallet();
  const [, setShowConnectModal] = useConnectWalletModal();

  const [activeBackgroundState, setActiveBackgroundState] = useState<
    object | boolean
  >(false);
  const isInputNonZero = parseFloat(vaultActionForm.inputAmount) > 0;

  useEffect(() => {
    const currentRef =
      withdrawOptionRefs[
        vaultActionForm.withdrawOption! === "complete"
          ? "stamdard"
          : vaultActionForm.withdrawOption!
      ]?.current;

    if (!currentRef) {
      return;
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
  }, [vaultActionForm.withdrawOption, withdrawOptionRefs]);

  /**
   * Check to make sure user only use complete when they can complete withdraw
   */
  useEffect(() => {
    if (!canCompleteWithdraw && vaultActionForm.withdrawOption === "complete") {
      handleActionTypeChange(ACTIONS.withdraw, "v2", {
        withdrawOption: "standard",
      });
    }
  }, [
    canCompleteWithdraw,
    handleActionTypeChange,
    vaultActionForm.withdrawOption,
  ]);

  const renderWithdrawOptionExplanation = useCallback(
    (withdrawOption: V2WithdrawOption, active: boolean) => {
      switch (withdrawOption) {
        case "instant":
          return (
            <TooltipExplanation
              title="INSTANT WITHDRAWAL"
              explanation="Instant withdrawals are for funds that have been deposited but not yet deployed in the vault’s strategy. Because these funds haven’t been deployed they can be withdrawn immediately."
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
                  the vault's strategy and involve a 2-step withdrawal process.
                  <br />
                  <br />
                  Step 1: Users need to remove their funds from the vault's pool
                  of investable capital by initiating a withdrawal.
                  <br />
                  <br />
                  Step 2: Initiated withdrawals are removed from the vault's
                  pool of investable capital in the following round and once
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
    switch (vaultActionForm.withdrawOption) {
      case "instant":
        return (
          <div className="d-flex align-items-center mt-3 mb-1">
            <SecondaryText>Instant withdraw limit</SecondaryText>
            <TooltipExplanation
              title="INSTANT WITHDRAW LIMIT"
              explanation="This is equal to the value of your funds that are currently not invested in the vault’s strategy. These funds can withdrawn from the vault immediately."
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
                    This is the total amount of tokens you’ve requested to
                    withdraw from the vault’s pool of investable capital.
                    <br />
                    <br />
                    On the next round's closing, the vault will close its
                    position and remove the amount of tokens you requested from
                    its pool of investable capital. You can then complete your
                    withdrawal and remove your funds from the vault.
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
    assetDisplay,
    depositBalanceInAsset,
    error,
    initiatedWithdrawAmount,
    lockedBalanceInAsset,
    vaultActionForm.withdrawOption,
  ]);

  const renderButton = useCallback(() => {
    if (active) {
      return (
        <ActionButton
          disabled={Boolean(error) || !isInputNonZero}
          onClick={() => {
            onFormSubmit();
          }}
          className="mt-4 py-3"
          color={color}
        >
          {vaultActionForm.withdrawOption! === "instant"
            ? `Withdraw ${assetDisplay}`
            : "Initiate Withdrawal"}
        </ActionButton>
      );
    }

    return (
      <ConnectWalletButton
        onClick={() => setShowConnectModal(true)}
        type="button"
        className="mt-4 btn py-3 mb-4"
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
    onFormSubmit,
    setShowConnectModal,
    vaultActionForm.withdrawOption,
  ]);

  const formFooter = useMemo(() => {
    if (canCompleteWithdraw) {
      return (
        <FormFooterButton
          className="d-flex align-items-center justify-content-center mt-4 mx-3"
          role="button"
          color={color}
          onClick={() => {
            handleActionTypeChange(ACTIONS.withdraw, "v2", {
              withdrawOption: "complete",
            });
            handleMaxClick();
            onFormSubmit();
          }}
        >
          <AssetCircleContainer size={24} color={color}>
            <WithdrawButtonLogo color={color} />
          </AssetCircleContainer>
          <SecondaryText className="ml-1" color={colors.primaryText}>
            Complete your withdrawals
          </SecondaryText>
        </FormFooterButton>
      );
    }
  }, [
    canCompleteWithdraw,
    color,
    handleActionTypeChange,
    handleMaxClick,
    onFormSubmit,
  ]);

  return (
    <>
      {/* Segment Control */}
      <WithdrawTypeSegmentControlContainer>
        <WithdrawTypeSegmentControlBackground
          transition={{
            type: "keyframes",
            ease: "easeOut",
          }}
          initial={{
            height: 0,
            width: 0,
          }}
          animate={activeBackgroundState}
        />
        {V2WithdrawOptionList.map((withdrawOption) => {
          /**
           * Complete withdraw is also consider as standard
           */
          const active =
            vaultActionForm.withdrawOption === withdrawOption ||
            (withdrawOption === "standard" &&
              vaultActionForm.withdrawOption === "complete");
          return (
            <WithdrawTypeSegmentControl
              key={withdrawOption}
              ref={withdrawOptionRefs[withdrawOption]}
              role="button"
              onClick={() => {
                handleActionTypeChange(ACTIONS.withdraw, "v2", {
                  withdrawOption: withdrawOption,
                });
              }}
            >
              <WithdrawTypeSegmentControlText
                active={active}
                disabled={
                  withdrawOption !== "instant" &&
                  !withdrawMetadata.allowStandardWithdraw
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
      <BaseInputLabel className="mt-4">AMOUNT ({assetDisplay})</BaseInputLabel>
      <BaseInputContainer
        className="mb-2"
        error={error ? VaultInputValidationErrorList.includes(error) : false}
      >
        <BaseInput
          type="number"
          className="form-control"
          aria-label="ETH"
          placeholder="0"
          value={vaultActionForm.inputAmount}
          onChange={handleInputChange}
        />
        {active && (
          <BaseInputButton onClick={handleMaxClick}>MAX</BaseInputButton>
        )}
      </BaseInputContainer>
      {error && (
        <SecondaryText color={colors.red}>
          {renderErrorText(error)}
        </SecondaryText>
      )}
      {formExtraInfo}
      {renderButton()}
      {formFooter}
    </>
  );
};

export default VaultV2WithdrawForm;
