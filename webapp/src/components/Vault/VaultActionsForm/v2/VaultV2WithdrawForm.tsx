import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Frame } from "framer";
import { useWeb3React } from "@web3-react/core";
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
import { getAssets, VaultOptions } from "shared/lib/constants/constants";
import {
  ActionButton,
  ConnectWalletButton,
} from "shared/lib/components/Common/buttons";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import { VaultInputValidationErrorList, VaultValidationErrors } from "../types";
import { getVaultColor } from "shared/lib/utils/vault";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { formatBigNumber } from "shared/lib/utils/math";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "../../../Common/HelpInfo";

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

interface VaultV2WithdrawFormProps {
  vaultOption: VaultOptions;
  error?: VaultValidationErrors;
  onFormSubmit: () => void;
  depositBalanceInAsset: BigNumber;
  lockedBalanceInAsset: BigNumber;
  initiatedWithdrawAmount: BigNumber;
}

const VaultV2WithdrawForm: React.FC<VaultV2WithdrawFormProps> = ({
  vaultOption,
  error,
  onFormSubmit,
  depositBalanceInAsset,
  lockedBalanceInAsset,
  initiatedWithdrawAmount,
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
  const { active } = useWeb3React();
  const [, setShowConnectModal] = useConnectWalletModal();

  const [activeBackgroundState, setActiveBackgroundState] = useState<
    object | boolean
  >(false);
  const isInputNonZero = parseFloat(vaultActionForm.inputAmount) > 0;

  useEffect(() => {
    const currentRef =
      withdrawOptionRefs[vaultActionForm.withdrawOption!]?.current;

    if (!currentRef) {
      return;
    }

    setActiveBackgroundState({
      left: currentRef.offsetLeft,
      top: currentRef.offsetTop,
      height: currentRef.clientHeight,
      width: currentRef.clientWidth,
    });
  }, [vaultActionForm.withdrawOption, withdrawOptionRefs]);

  const renderWithdrawOptionExplanation = useCallback(
    (withdrawOption: V2WithdrawOption, active: boolean) => {
      switch (withdrawOption) {
        case "instant":
          return (
            <TooltipExplanation
              title="INSTANT WITHDRAWAL"
              explanation="Instant withdrawals are for funds that have not been deposited but not yet deployed in the vault’s weekly strategy. Because these funds haven’t been deployed they can be withdrawn immediately."
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
                  pool of investable capital every Friday at 10am UTC and once
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
            <InfoData
              color={error === "withdrawLimitExceeded" ? colors.red : undefined}
            >
              {formatBigNumber(depositBalanceInAsset, decimals)} {assetDisplay}
            </InfoData>
          </div>
        );
      case "standard":
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
                    This is the total amount of ETH you’ve requested to withdraw
                    from the vault’s pool of investable capital.
                    <br />
                    <br />
                    On Friday at 10am UTC, the vault will close it’s weekly
                    position and remove the amount of ETH you requested from its
                    pool of investable capital. You can then complete your
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
          onClick={onFormSubmit}
          className="mt-4 py-3"
          color={color}
        >
          {vaultActionForm.withdrawOption! === "standard"
            ? "Initiate Withdrawal"
            : `Withdraw ${assetDisplay}`}
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
    vaultActionForm,
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
        {V2WithdrawOptionList.map((withdrawOption) => (
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
              active={vaultActionForm.withdrawOption === withdrawOption}
              disabled={
                withdrawOption === "standard" &&
                !withdrawMetadata.allowStandardWithdraw
              }
            >
              {withdrawOption}{" "}
              {renderWithdrawOptionExplanation(
                withdrawOption,
                vaultActionForm.withdrawOption === withdrawOption
              )}
            </WithdrawTypeSegmentControlText>
          </WithdrawTypeSegmentControl>
        ))}
      </WithdrawTypeSegmentControlContainer>

      {/* Input */}
      <BaseInputLabel className="mt-4">AMOUNT ({assetDisplay})</BaseInputLabel>
      <BaseInputContainer
        className="position-relative mb-2"
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
    </>
  );
};

export default VaultV2WithdrawForm;
