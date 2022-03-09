import React, { useCallback, useEffect, useState } from "react";
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
} from "shared/lib/designSystem";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import useLiquidityGaugeV5 from "shared/lib/hooks/useLiquidityGaugeV5";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { getVaultColor } from "shared/lib/utils/vault";
import PendingTransactionLoader from "shared/lib/components/Common/PendingTransactionLoader";
import BasicModal from "shared/lib/components/Common/BasicModal";
import { useChain } from "shared/lib/hooks/chainContext";

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

interface ApplyBoostModalProps {
  show: boolean;
  onClose: () => void;
  vaultOption: VaultOptions;
}

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
  const [txHash, setTxHash] = useState("");

  const color = getVaultColor(vaultOption);

  const handleApplyBoost = useCallback(async () => {
    if (!contract || !account) {
      return;
    }

    try {
      const tx = await contract.user_checkpoint(account);
      const txhash = tx.hash;
      setTxHash(txhash);

      addPendingTransaction({
        txhash,
        type: "userCheckpoint",
      });

      await provider.waitForTransaction(txhash, 2);
      setTxHash("");
    } catch (err) {
      console.log(err);
    } finally {
      onClose();
    }
  }, [account, addPendingTransaction, provider, contract, onClose]);

  useEffect(() => {
    if (show && !txHash) {
      handleApplyBoost();
    }
  }, [show, txHash, handleApplyBoost]);

  return (
    <BasicModal
      show={show}
      onClose={onClose}
      height={424}
      animationProps={{
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
      headerBackground
    >
      <>
        <BaseModalContentColumn marginTop={8}>
          <ModalTitle>
            {!txHash ? "CONFIRM Transaction" : "TRANSACTION PENDING"}
          </ModalTitle>
        </BaseModalContentColumn>
        <FloatingContainer>
          <PendingTransactionLoader active={Boolean(txHash)} color={color} />
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
    </BasicModal>
  );
};

export default ApplyBoostModal;
