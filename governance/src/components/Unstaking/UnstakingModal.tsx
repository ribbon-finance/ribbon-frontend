import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";

import BasicModal from "shared/lib/components/Common/BasicModal";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import useVotingEscrow from "shared/lib/hooks/useVotingEscrow";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { formatBigNumber } from "shared/lib/utils/math";
import { useGovernanceGlobalState } from "../../store/store";
import ModalTransactionContent from "../Shared/ModalTransactionContent";
import UnstakingModalPreview from "./UnstakingModalPreview";

const unstakingModalModes = ["preview", "transaction"] as const;
type UnstakingModalMode = typeof unstakingModalModes[number];

const stakingModalHeight: { [mode in UnstakingModalMode]: number } = {
  preview: 428,
  transaction: 412,
};

const UnstakingModal = () => {
  const { provider } = useWeb3Context();
  const [unstakingModalState, setUnstakingModalState] =
    useGovernanceGlobalState("unstakingModal");
  const [stepNum, setStepNum] = useState<number>(0);
  const { data: rbnTokenAccount, loading } = useRBNTokenAccount();
  const { addPendingTransaction } = usePendingTransactions();

  const votingEscrowContract = useVotingEscrow();

  const onUnstake = useCallback(async () => {
    /**
     * Make sure user can unstake
     */
    if (
      loading ||
      !votingEscrowContract ||
      !rbnTokenAccount ||
      !rbnTokenAccount.lockEndTimestamp ||
      !moment().isSameOrAfter(moment.unix(rbnTokenAccount.lockEndTimestamp))
    ) {
      return;
    }

    setStepNum(unstakingModalModes.indexOf("transaction"));
    try {
      const tx = await votingEscrowContract.withdraw();
      setUnstakingModalState((prev) => ({
        ...prev,
        pendingTransaction: { hash: tx.hash },
      }));
      addPendingTransaction({
        type: "governanceUnstake",
        txhash: tx.hash,
        amount: formatBigNumber(rbnTokenAccount.lockedBalance),
      });

      await provider.waitForTransaction(tx.hash, 5);

      setUnstakingModalState((prev) => ({
        ...prev,
        show: false,
        pendingTransaction: undefined,
      }));
    } catch (e) {
      setStepNum(unstakingModalModes.indexOf("preview"));
    }
  }, [
    addPendingTransaction,
    loading,
    provider,
    rbnTokenAccount,
    setUnstakingModalState,
    votingEscrowContract,
  ]);

  const modalBody = useMemo(() => {
    switch (unstakingModalModes[stepNum]) {
      case "preview":
        return <UnstakingModalPreview onUnstake={onUnstake} />;
      case "transaction":
        return (
          <ModalTransactionContent
            title="UNLOCKING RBN"
            txhash={unstakingModalState.pendingTransaction?.hash}
          />
        );
    }
    return <></>;
  }, [onUnstake, stepNum, unstakingModalState]);

  return (
    <BasicModal
      show={unstakingModalState.show}
      height={stakingModalHeight[unstakingModalModes[stepNum]]}
      onClose={() =>
        setUnstakingModalState((state) => ({ ...state, show: false }))
      }
      headerBackground={unstakingModalModes[stepNum] === "transaction"}
    >
      {modalBody}
    </BasicModal>
  );
};

export default UnstakingModal;
