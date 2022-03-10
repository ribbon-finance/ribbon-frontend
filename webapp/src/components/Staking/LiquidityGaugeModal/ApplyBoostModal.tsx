import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import {
  getExplorerURI,
  getExplorerName,
  VaultOptions,
} from "shared/lib/constants/constants";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import {
  BaseUnderlineLink,
  PrimaryText,
  BaseModalContentColumn,
  Title,
  SecondaryText,
} from "shared/lib/designSystem";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import useLiquidityGaugeV5 from "shared/lib/hooks/useLiquidityGaugeV5";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { getVaultColor } from "shared/lib/utils/vault";
import PendingTransactionLoader from "shared/lib/components/Common/PendingTransactionLoader";
import BasicModal from "shared/lib/components/Common/BasicModal";
import { useChain } from "shared/lib/hooks/chainContext";
import { ActionButton } from "shared/lib/components/Common/buttons";

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

const BoostModalContent = styled.div.attrs({
  className: "d-flex flex-column align-items-center",
})`
  flex: 1;
`;

interface ApplyBoostModalProps {
  show: boolean;
  onClose: () => void;
  vaultOption: VaultOptions;
}

type Step = "info" | "transaction";
type StepToHeight = { [key in Step]: number };
const stepHeight: StepToHeight = {
  info: 380,
  transaction: 424,
};

// Calls user_checkpoint and shows a transaction loading screen
const ApplyBoostModal: React.FC<ApplyBoostModalProps> = ({
  show,
  onClose,
  vaultOption,
}) => {
  const [chain] = useChain();
  const { chainId, account } = useWeb3Wallet();
  const { provider } = useWeb3Context();
  const contract = useLiquidityGaugeV5(vaultOption);
  const { addPendingTransaction } = usePendingTransactions();

  const [step, setStep] = useState<Step>("info");
  const [txHash, setTxHash] = useState("");

  const color = getVaultColor(vaultOption);

  const onCloseModal = useCallback(() => {
    setStep("info");
    onClose();
  }, [onClose]);

  const onApplyBoost = useCallback(async () => {
    if (!contract || !account) {
      return;
    }

    setStep("transaction");

    try {
      const tx = await contract.user_checkpoint(account);
      const txhash = tx.hash;
      setTxHash(txhash);

      addPendingTransaction({
        txhash,
        type: "userCheckpoint",
        vault: vaultOption,
      });

      await provider.waitForTransaction(txhash, 2);
      setTxHash("");
      onCloseModal();
    } catch (err) {
      setStep("info");
      console.log(err);
    }
  }, [
    account,
    addPendingTransaction,
    provider,
    contract,
    onCloseModal,
    vaultOption,
  ]);

  const modalContent = useMemo(() => {
    switch (step) {
      case "info":
        return (
          <BoostModalContent>
            <PendingTransactionLoader
              active
              animationType="alwaysShow"
              color={color}
              width="64px"
              barHeight={6.5}
              numberOfBars={8}
            />

            {/* Title */}
            <Title className="mt-5 text-center" fontSize={28}>
              {vaultOption}
            </Title>

            {/* Description */}
            <SecondaryText className="mt-2 text-center">
              You earned an additional boost to your liquidity mining rewards
              from increasing your veRBN balance
            </SecondaryText>

            <ActionButton
              onClick={onApplyBoost}
              className="py-3 mt-auto mb-1"
              color={color}
            >
              APPLY BOOST
            </ActionButton>
          </BoostModalContent>
        );
      case "transaction":
        return (
          <>
            <BaseModalContentColumn marginTop={8}>
              <ModalTitle>
                {!txHash ? "CONFIRM Transaction" : "TRANSACTION PENDING"}
              </ModalTitle>
            </BaseModalContentColumn>
            <FloatingContainer>
              <PendingTransactionLoader
                active={Boolean(txHash)}
                color={color}
              />
            </FloatingContainer>
            {!txHash ? (
              <BaseModalContentColumn marginTop="auto">
                <PrimaryText className="mb-2">
                  Confirm this transaction in your wallet
                </PrimaryText>
              </BaseModalContentColumn>
            ) : (
              <BaseModalContentColumn marginTop="auto">
                {chainId && (
                  <BaseUnderlineLink
                    to={`${getExplorerURI(chain)}/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="d-flex"
                  >
                    <PrimaryText className="mb-2">
                      View on {getExplorerName(chain)}
                    </PrimaryText>
                  </BaseUnderlineLink>
                )}
              </BaseModalContentColumn>
            )}
          </>
        );
    }
  }, [chain, chainId, color, step, txHash, vaultOption, onApplyBoost]);

  return (
    <BasicModal
      show={show}
      onClose={onCloseModal}
      height={stepHeight[step]}
      animationProps={{
        key: step,
        transition: {
          duration: 0.25,
          type: "keyframes",
          ease: "easeInOut",
        },
        initial: {
          y: -200,
          opacity: 0,
        },
        animate: {
          y: 0,
          opacity: 1,
        },
        exit: {
          y: 200,
          opacity: 0,
        },
      }}
      headerBackground={step !== "info"}
    >
      {modalContent}
    </BasicModal>
  );
};

export default ApplyBoostModal;
