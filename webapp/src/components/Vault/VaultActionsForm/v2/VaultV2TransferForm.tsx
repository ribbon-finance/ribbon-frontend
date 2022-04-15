import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { TargetAndTransition } from "framer";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { BigNumber, utils } from "ethers";
import colors from "shared/lib/designSystem/colors";
import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { ACTIONS, V2WithdrawOptionList } from "../Modal/types";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";
import {
  ActionButton,
  ConnectWalletButton,
} from "shared/lib/components/Common/buttons";
import useV2VaultContract from "shared/lib/hooks/useV2VaultContract";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import { VaultInputValidationErrorList, VaultValidationErrors } from "../types";
import { getVaultColor } from "shared/lib/utils/vault";
import {
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import {
  formatSignificantDecimals,
  formatBigNumber,
} from "shared/lib/utils/math";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import AssetCircleContainer from "shared/lib/components/Common/AssetCircleContainer";
import { useTranslation } from "react-i18next";

const TransferInfoContainer = styled.div<{ asset: string }>`
  height: 70px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  display: flex;
  align-items: center;
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
  error?: VaultValidationErrors;
  onFormSubmit: () => void;
  depositBalanceInAsset: BigNumber;
  lockedBalanceInAsset: BigNumber;
  initiatedWithdrawAmount: BigNumber;
  canCompleteWithdraw: boolean;
}

const VaultV2TransferForm: React.FC<VaultV2WithdrawFormProps> = ({
  vaultOption,
  error,
  onFormSubmit,
  depositBalanceInAsset,
  lockedBalanceInAsset,
  initiatedWithdrawAmount,
  canCompleteWithdraw,
}) => {
  const { t } = useTranslation();
  const asset = getAssets(vaultOption);
  const assetDisplay = getAssetDisplay(asset);
  const color = getVaultColor(vaultOption);
  const Logo = getAssetLogo(asset);
  const withdrawOptionRefs = useMemo(
    () =>
      V2WithdrawOptionList.reduce<any>((acc, curr) => {
        acc[curr] = React.createRef();
        return acc;
      }, {}),
    []
  );

  const {
    canTransfer,
    handleActionTypeChange,
    handleInputChange,
    handleMaxClick,
    vaultActionForm,
    withdrawMetadata,
  } = useVaultActionForm(vaultOption);

  const dstV2Vault = useV2VaultContract(canTransfer);
  const { active } = useWeb3Wallet();
  const [, setShowConnectModal] = useConnectWalletModal();
  const [dstV2VaultCap, setDstV2VaultCap] = useState("0");
  const [, setActiveBackgroundState] = useState<TargetAndTransition>();
  const isInputNonZero = parseFloat(vaultActionForm.inputAmount) > 0;

  useEffect(() => {
    const currentRef =
      withdrawOptionRefs[
        vaultActionForm.withdrawOption! === "complete"
          ? "standard"
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

  useEffect(() => {
    const fetchCap = async () => {
      if (dstV2Vault) {
        const cap = parseFloat(
          formatSignificantDecimals(
            utils.formatUnits(
              await dstV2Vault.cap(),
              await dstV2Vault.decimals()
            )
          )
        );
        setDstV2VaultCap(cap);
      }
    };
    fetchCap();
  }, [dstV2Vault]);

  const RenderErrorText = (error: VaultValidationErrors) => {
    if (VaultInputValidationErrorList.includes(_error)) {
      switch (_error) {
        case "withdrawLimitExceeded":
          return "Available limit exceeded";
        case "eixstingWithdraw":
          return "Existing withdraw from previous round";
      }
    }

    return "";
  };

  const formExtraInfo = useMemo(() => {
    const decimals = getAssetDecimals(asset);
    return (
      <>
        <div className="d-flex align-items-center mt-3">
          <SecondaryText>
            {t("webapp:VaultV2TransferForm:availableLimit")}
          </SecondaryText>
          <TooltipExplanation
            title={t("webapp:VaultV2TransferForm:availableLimitTooltip:title")}
            explanation={t(
              "webapp:VaultV2TransferForm:availableLimitTooltip:explanation"
            )}
            renderContent={({ ref, ...triggerHandler }) => (
              <HelpInfo containerRef={ref} {...triggerHandler}>
                i
              </HelpInfo>
            )}
          />
          <InfoData
            color={error === "withdrawLimitExceeded" ? colors.red : undefined}
          >
            {formatBigNumber(lockedBalanceInAsset, decimals)} {assetDisplay}
          </InfoData>
        </div>
        <div className="d-flex align-items-center mt-3 mb-1">
          <SecondaryText>
            {t("webapp:VaultV2TransferForm:weeklyTransferLimit")}
          </SecondaryText>
          <TooltipExplanation
            title={t(
              "webapp:VaultV2TransferForm:weeklyTransferLimitTooltip:title"
            )}
            explanation={t(
              "webapp:VaultV2TransferForm:weeklyTransferLimitTooltip:explanation"
            )}
            renderContent={({ ref, ...triggerHandler }) => (
              <HelpInfo containerRef={ref} {...triggerHandler}>
                i
              </HelpInfo>
            )}
          />
          <InfoData>
            {formatBigNumber(initiatedWithdrawAmount, decimals)} {assetDisplay}
          </InfoData>
        </div>
      </>
    );
  }, [
    asset,
    assetDisplay,
    error,
    initiatedWithdrawAmount,
    lockedBalanceInAsset,
    t,
  ]);

  const renderButton = useCallback(() => {
    if (active) {
      return (
        <ActionButton
          disabled={Boolean(error) || !isInputNonZero}
          onClick={() => {
            onFormSubmit();
          }}
          className="mt-4 py-3 mb-0"
          color={color}
        >
          {t("webapp:VaultV2TransferForm:previewTransfer")}
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
    color,
    error,
    isInputNonZero,
    onFormSubmit,
    setShowConnectModal,
    t,
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
    } else if (withdrawMetadata.allTokensStaked) {
      return (
        <AllTokenStakedMessage>
          <SecondaryText color={colors.red}>
            {t("webapp:Withdrawals:AllrTokensStakedError", {
              rToken: vaultOption,
            })}
          </SecondaryText>
        </AllTokenStakedMessage>
      );
    }
    return null;
  }, [
    canCompleteWithdraw,
    color,
    handleActionTypeChange,
    handleMaxClick,
    onFormSubmit,
    withdrawMetadata,
    vaultOption,
    t,
  ]);

  return (
    <>
      <BaseInputLabel className="mb-2">
        {t("webapp:VaultV2TransferForm:transferTo")}
      </BaseInputLabel>
      <TransferInfoContainer>
        <Logo className="pl-2 mr-3" showBackground width="58" height="58" />
        <div>
          <Title normalCased className="d-block">
            {canTransfer}
          </Title>
          <SecondaryText>
            {t("webapp:VaultV2TransferForm:availableCapacity", {
              asset,
              amount: dstV2VaultCap.toString(),
            })}
          </SecondaryText>
        </div>
      </TransferInfoContainer>
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
          <RenderErrorText error={error} />
        </SecondaryText>
      )}
      {formExtraInfo}
      {renderButton()}
      {formFooter}
    </>
  );
};

export default VaultV2TransferForm;
