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

const unstakingModes = ["preview", "transaction"] as const;
type UnstakingMode = typeof unstakingModes[number];
const unstakingScenarios = ["early", "default"] as const;
type UnstakingScenario = typeof unstakingScenarios[number];

const stakingModalHeight: {
  preview: { [scenario in UnstakingScenario]: number };
  transaction: number;
} = {
  preview: { early: 300, default: 300 },
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
      !rbnTokenAccount.lockEndTimestamp
    ) {
      return;
    }

    setStepNum(unstakingModes.indexOf("transaction"));

    try {
      // Is early unlock
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

      await provider.waitForTransaction(tx.hash, 2);

      setUnstakingModalState((prev) => ({
        ...prev,
        show: false,
        pendingTransaction: undefined,
      }));
    } catch (e) {
      setStepNum(unstakingModes.indexOf("preview"));
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
    switch (unstakingModes[stepNum]) {
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
  }, [onUnstake, stepNum, unstakingModalState]);

  const [unstakingMode, unstakingScenario] = useMemo((): [
    UnstakingMode,
    UnstakingScenario
  ] => {
    let scenario: UnstakingScenario = "default";

    if (
      rbnTokenAccount?.lockEndTimestamp &&
      !moment().isSameOrAfter(moment.unix(rbnTokenAccount.lockEndTimestamp))
    ) {
      scenario = "early";
    }
    return [unstakingModes[stepNum], scenario];
  }, [rbnTokenAccount?.lockEndTimestamp, stepNum]);

  return (
    <BasicModal
      show={unstakingModalState.show}
      height={
        unstakingMode !== "preview"
          ? stakingModalHeight[unstakingMode]
          : stakingModalHeight[unstakingMode][unstakingScenario]
      }
      onClose={() =>
        setUnstakingModalState((state) => ({ ...state, show: false }))
      }
      headerBackground={unstakingModes[stepNum] === "transaction"}
    >
      {modalBody}
    </BasicModal>
  );
};

export default UnstakingModal;
