import React, { useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  getAssets,
  VaultList,
  getExplorerURI,
  getExplorerName,
  VaultAddressMap,
} from "shared/lib/constants/constants";
import BasicModal from "shared/lib/components/Common/BasicModal";
import { getVaultColor } from "shared/lib/utils/vault";
import {
  BaseUnderlineLink,
  PrimaryText,
  SecondaryText,
  BaseModalContentColumn,
  Title,
} from "shared/lib/designSystem";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { useGlobalState } from "shared/lib/store/store";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { ResumeIcon } from "shared/lib/assets/icons/icons";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import PendingTransactionLoader from "shared/lib/components/Common/PendingTransactionLoader";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { useChain } from "shared/lib/hooks/chainContext";
import { RibbonVaultPauser } from "shared/lib/codegen";
import useVaultPauser from "shared/lib/hooks/useV2VaultPauserContract";
import { useLatestOption } from "shared/lib/hooks/useLatestOption";
import { formatBigNumber } from "shared/lib/utils/math";
import { usePausedPosition } from "shared/lib/hooks/usePausedPosition";
const FloatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const ModalTitle = styled(Title)`
  z-index: 2;
`;

const ActionLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 1000px;
  background: ${(props) => props.color}14;
`;

const TextContainer = styled.div`
  border-radius: 4px;
  background: #1c1c22;
  padding: 16px 16px 16px 16px;
`;

const FormTitle = styled(Title)`
  font-size: 22px;
  line-height: 28px;
`;

const ResumePositionModal: React.FC = () => {
  const [vaultResumeModal, setVaultResumeModal] =
    useGlobalState("vaultResumeModal");
  const vaultOption = vaultResumeModal.vaultOption || VaultList[0];
  const vaultVersion = vaultResumeModal.vaultVersion;
  const { option: currentOption } = useLatestOption(vaultOption, vaultVersion);
  const color = getVaultColor(vaultOption);
  const asset = getAssets(vaultOption);
  const decimals = getAssetDecimals(asset);
  const { chainId } = useWeb3Wallet();
  const { provider } = useWeb3Context();
  const [chain] = useChain();
  const { t } = useTranslation();
  const [step, setStep] = useState<"preview" | "walletAction" | "processing">(
    "preview"
  );
  const { addPendingTransaction } = usePendingTransactions();
  const [txId, setTxId] = useState("");
  const contract = useVaultPauser(chainId || 1) as RibbonVaultPauser;
  const vaultAddress = VaultAddressMap[vaultOption][vaultVersion];
  const { pausedAmount: resumeAmount } = usePausedPosition(
    vaultOption,
    vaultVersion
  );

  // get the date of next option expiry
  const expiryTime = useMemo(() => {
    if (!currentOption) {
      return;
    }

    let nextOptionTime = currentOption.expiry;

    return `${nextOptionTime.format("DD")} ${nextOptionTime.format(
      "MMM"
    )}, ${nextOptionTime.year()}`;
  }, [currentOption]);

  const handleClose = useCallback(() => {
    setVaultResumeModal((prev) => ({ ...prev, show: false }));
    if (step === "preview" || step === "walletAction") {
      setStep("preview");
    }
    if (step !== "processing") {
    }
  }, [step, setVaultResumeModal]);

  const handleActionPressed = useCallback(async () => {
    setStep("walletAction");

    try {
      if (!contract || !vaultAddress) {
        return;
      }

      const tx = await contract.resumePosition(vaultAddress);

      setStep("processing");
      const txhash = tx.hash;
      setTxId(txhash.toString());

      addPendingTransaction({
        txhash: txhash,
        type: "resume",
        amount: resumeAmount.toString(),
        vault: vaultOption,
        asset: asset,
      });

      await provider.waitForTransaction(txhash, 2);
      setStep("preview");
      setTxId("");
      handleClose();
    } catch (err) {
      console.log(err);
      setStep("preview");
    }
  }, [
    asset,
    contract,
    addPendingTransaction,
    resumeAmount,
    vaultAddress,
    provider,
    vaultOption,
    handleClose,
  ]);

  const body = useMemo(() => {
    switch (step) {
      case "preview":
        return (
          <>
            {/* Logo */}
            <BaseModalContentColumn>
              <ActionLogoContainer color={color}>
                <ResumeIcon color={color} width={64} />
              </ActionLogoContainer>
            </BaseModalContentColumn>
            {/* Position Info */}
            <BaseModalContentColumn marginTop={8}>
              {/* Title */}
              <FormTitle className="mt-2 text-center">
                RESUME POSITION
              </FormTitle>
            </BaseModalContentColumn>
            <div className="pl-2 pr-2">
              <BaseModalContentColumn marginTop={8}>
                {/* Description */}
                <SecondaryText className=" text-center">
                  {t("shared:ProductCopies:Resume:explanation")}
                </SecondaryText>
              </BaseModalContentColumn>
            </div>
            {/* Secondary Info */}
            <div className="mt-4">
              <TextContainer>
                <BaseModalContentColumn marginTop={0}>
                  <div className="d-flex w-100 align-items-center ">
                    <SecondaryText fontWeight={500} color="#FFFFFF7A">
                      Position
                    </SecondaryText>
                    <Title fontSize={14} className="ml-auto">
                      {formatBigNumber(resumeAmount, decimals)}{" "}
                      {getAssetDisplay(asset)}
                    </Title>
                  </div>
                </BaseModalContentColumn>
                <BaseModalContentColumn marginTop={16}>
                  <div className="d-flex w-100 align-items-center ">
                    <SecondaryText fontWeight={500} color="#FFFFFF7A">
                      Resume From
                    </SecondaryText>
                    <Title fontSize={14} className="ml-auto">
                      {expiryTime}
                    </Title>
                  </div>
                </BaseModalContentColumn>
              </TextContainer>
            </div>
            <div className="mt-4">
              {/* Button */}
              <ActionButton
                className="btn py-3 mb-4"
                color={color}
                onClick={handleActionPressed}
              >
                Confirm
              </ActionButton>
            </div>
          </>
        );
      case "walletAction":
      case "processing":
        return (
          <>
            <BaseModalContentColumn marginTop={8}>
              <ModalTitle>
                {step === "walletAction"
                  ? "CONFIRM Transaction"
                  : "RESUMING POSITION"}
              </ModalTitle>
            </BaseModalContentColumn>
            <FloatingContainer>
              <PendingTransactionLoader
                active={step === "processing"}
                color={color}
              />
            </FloatingContainer>
            {step === "walletAction" ? (
              <BaseModalContentColumn marginTop="auto">
                <PrimaryText className="mb-2">
                  Confirm this transaction in your wallet
                </PrimaryText>
              </BaseModalContentColumn>
            ) : (
              <BaseModalContentColumn marginTop="auto">
                {chainId && (
                  <BaseUnderlineLink
                    to={`${getExplorerURI(chain)}/tx/${txId}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="d-flex"
                  >
                    <PrimaryText className="mb-2">
                      View on {getExplorerName(chain)}{" "}
                    </PrimaryText>
                  </BaseUnderlineLink>
                )}
              </BaseModalContentColumn>
            )}
          </>
        );
    }
  }, [
    asset,
    resumeAmount,
    expiryTime,
    decimals,
    t,
    color,
    handleActionPressed,
    step,
    chain,
    chainId,
    txId,
  ]);

  return (
    <BasicModal
      show={vaultResumeModal.show}
      onClose={handleClose}
      height={435}
      animationProps={{
        key: step,
        transition: {
          duration: 0.25,
          type: "keyframes",
          ease: "easeInOut",
        },
        initial:
          step !== "processing"
            ? {
                y: -200,
                opacity: 0,
              }
            : {},
        animate:
          step !== "processing"
            ? {
                y: 0,
                opacity: 1,
              }
            : {},
        exit:
          step === "preview"
            ? {
                y: 200,
                opacity: 0,
              }
            : {},
      }}
      headerBackground={step !== "preview"}
    >
      {body}
    </BasicModal>
  );
};

export default ResumePositionModal;
