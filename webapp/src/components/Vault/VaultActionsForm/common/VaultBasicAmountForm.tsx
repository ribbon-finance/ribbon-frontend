import React, { useCallback, useMemo, useState } from "react";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { BigNumber } from "ethers";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer";

import {
  BaseInput,
  BaseInputButton,
  BaseInputContainer,
  BaseInputLabel,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import {
  ActionButton,
  ConnectWalletButton,
} from "shared/lib/components/Common/buttons";
import {
  getAssetColor,
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
  getChainByAsset,
} from "shared/lib/utils/asset";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import {
  getAssets,
  VaultAllowedDepositAssets,
  VaultMaxDeposit,
  VaultOptions,
  isDisabledVault,
} from "shared/lib/constants/constants";
import { getVaultColor } from "shared/lib/utils/vault";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import { VaultInputValidationErrorList, VaultValidationErrors } from "../types";
import colors from "shared/lib/designSystem/colors";
import { formatBigNumber } from "shared/lib/utils/math";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import theme from "shared/lib/designSystem/theme";
import { ACTIONS } from "../Modal/types";
import { useChain } from "shared/lib/hooks/chainContext";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import { useFlexVault } from "shared/lib/hooks/useFlexVault";
import { MigrateIcon } from "shared/lib/assets/icons/icons";

const DepositAssetButton = styled.div`
  position: absolute;
  top: 50%;
  right: 48px;
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

          width: fit-content;
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

const InactiveLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}14;
`;

const InactiveTitle = styled(Title)`
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
`;

const InactiveDescription = styled(PrimaryText)`
  font-size: 14px;
  line-height: 20px;
  color: ${colors.text};
`;

interface VaultBasicAmountFormProps {
  vaultOption: VaultOptions;
  error?: VaultValidationErrors;
  formExtra?: {
    label: string;
    amount: BigNumber;
    unitDisplay?: string;
    error: boolean;
  };
  showSwapDepositAsset?: boolean;
  onFormSubmit: () => void;
  actionButtonText: string;
}

const VaultBasicAmountForm: React.FC<VaultBasicAmountFormProps> = ({
  vaultOption,
  error,
  formExtra,
  showSwapDepositAsset = false,
  onFormSubmit,
  actionButtonText,
}) => {
  // const asset = getAssets(vaultOption);
  const color = getVaultColor(vaultOption);
  const loadingText = useLoadingText();
  const { client } = useFlexVault();

  const {
    handleInputChange,
    handleDepositAssetChange,
    handleMaxClick,
    vaultActionForm,
  } = useVaultActionForm(vaultOption);
  const { active } = useWeb3Wallet();
  const [chain] = useChain();
  const [, setShowConnectModal] = useConnectWalletModal();
  const [showDepositAssetMenu, setShowDepositAssetMenu] = useState(false);

  const asset = useMemo(() => {
    switch (vaultActionForm.actionType) {
      case ACTIONS.deposit:
        return (
          vaultActionForm.depositAsset ||
          VaultAllowedDepositAssets[vaultOption][0]
        );
      default:
        return getAssets(vaultOption);
    }
  }, [vaultActionForm.actionType, vaultActionForm.depositAsset, vaultOption]);

  const isInputNonZero = parseFloat(vaultActionForm.inputAmount) > 0;

  const renderDepositAssetButton = useMemo(() => {
    if (active && showSwapDepositAsset && vaultActionForm.depositAsset) {
      const Logo = getAssetLogo(vaultActionForm.depositAsset);

      return (
        <DepositAssetButton
          role="button"
          onClick={() => setShowDepositAssetMenu((show) => !show)}
        >
          <div className="d-flex w-100 h-100 align-items-center position-relative p-1">
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={vaultActionForm.depositAsset}
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
                <DepositAssetButtonLogo
                  color={getAssetColor(vaultActionForm.depositAsset)}
                >
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
                      active={depositAsset === vaultActionForm.depositAsset}
                      onClick={() => handleDepositAssetChange(depositAsset)}
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
    handleDepositAssetChange,
    showDepositAssetMenu,
    showSwapDepositAsset,
    vaultActionForm.depositAsset,
    vaultOption,
  ]);

  const renderErrorText = useCallback(
    (_error: VaultValidationErrors) => {
      if (VaultInputValidationErrorList.includes(_error)) {
        switch (_error) {
          case "insufficientBalance":
            return "Insufficient balance";
          case "maxExceeded":
            const vaultMaxDepositAmount = VaultMaxDeposit[vaultOption];
            return `Maximum ${formatBigNumber(
              vaultMaxDepositAmount,
              getAssetDecimals(asset)
            )} ${getAssetDisplay(asset)} Exceeded`;
          case "capacityOverflow":
            return "Vault capacity exceeded";
          case "withdrawLimitExceeded":
            return "Withdraw limit exceeded";
          case "withdrawAmountStaked":
            return "Withdrawal amount staked";
        }
      }

      return "";
    },
    [asset, vaultOption]
  );

  const formExtraInfo = useMemo(
    () =>
      formExtra ? (
        <div className="d-flex align-items-center mt-3 mb-1">
          <SecondaryText>{formExtra.label}</SecondaryText>
          <Title
            fontSize={14}
            lineHeight={24}
            className="ml-auto"
            color={formExtra.error ? colors.red : undefined}
          >
            {formExtra.amount &&
              formatBigNumber(formExtra.amount, getAssetDecimals(asset))}{" "}
            {formExtra.unitDisplay || getAssetDisplay(asset)}
          </Title>
        </div>
      ) : (
        <></>
      ),
    [asset, formExtra]
  );

  const renderButton = useCallback(() => {
    if (active && getChainByAsset(asset) === chain) {
      if (vaultOption === "rSOL-THETA") {
        return (
          <ActionButton
            disabled={Boolean(error) || !isInputNonZero || !client}
            onClick={onFormSubmit}
            className={`mt-4 py-3 mb-0`}
            color={color}
          >
            {client ? actionButtonText : loadingText}
          </ActionButton>
        );
      } else {
        return (
          <ActionButton
            disabled={Boolean(error) || !isInputNonZero}
            onClick={onFormSubmit}
            className={`mt-4 py-3 mb-0`}
            color={color}
          >
            {actionButtonText}
          </ActionButton>
        );
      }
    }

    return (
      <ConnectWalletButton
        onClick={() => setShowConnectModal(true)}
        type="button"
        className="btn mt-4 mb-0 py-3"
      >
        Connect Wallet
      </ConnectWalletButton>
    );
  }, [
    active,
    asset,
    chain,
    actionButtonText,
    color,
    error,
    isInputNonZero,
    onFormSubmit,
    setShowConnectModal,
    client,
    loadingText,
    vaultOption,
  ]);

  if (isDisabledVault(vaultOption)) {
    return (
      <div className="d-flex flex-column align-items-center p-4">
        <InactiveLogoContainer color={color} className="mt-3">
          <MigrateIcon color={color} height={27} />
        </InactiveLogoContainer>

        <InactiveTitle className="mt-3">VAULT IS INACTIVE</InactiveTitle>

        <InactiveDescription className="mx-3 mt-2 text-center">
          The vault is inactive and does not accept new deposits. If you are a
          depositor, you can withdraw your assets.
        </InactiveDescription>
      </div>
    );
  }

  return (
    <>
      <BaseInputLabel>AMOUNT ({getAssetDisplay(asset)})</BaseInputLabel>
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
          inputWidth={showSwapDepositAsset ? "65%" : "80%"}
        />
        {renderDepositAssetButton}
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

export default VaultBasicAmountForm;
