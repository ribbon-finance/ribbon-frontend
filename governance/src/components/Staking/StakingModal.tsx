import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import moment, { duration, Duration } from "moment";

import BasicModal from "shared/lib/components/Common/BasicModal";
import useVotingEscrow from "../../hooks/useVotingEscrow";
import { useGovernanceGlobalState } from "../../store/store";
import StakingModalExplainer from "./StakingModalExplainer";
import StakingModalForm from "./StakingModalForm";
import StakingModalPreview from "./StakingModalPreview";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import StakingModalApprove from "./StakingModalApprove";
import useERC20Token from "shared/lib/hooks/useERC20Token";
import ModalTransactionContent from "../Shared/ModalTransactionContent";
import { VotingEscrowAddress } from "shared/lib/constants/constants";

const stakingModalModes = [
  "approve",
  "explainer",
  "form",
  "preview",
  "transaction",
] as const;
type StakingModalMode = typeof stakingModalModes[number];
const stakingModesMap: { [key in "approve" | "stake"]: StakingModalMode[] } = {
  approve: ["approve", "transaction"],
  stake: ["explainer", "form", "preview", "transaction"],
};

const stakingModalHeight: { [mode in StakingModalMode]: number } = {
  approve: 448,
  explainer: 528,
  form: 620,
  preview: 476,
  transaction: 412,
};

const StakingModal = () => {
  const { provider } = useWeb3Context();
  const [stakingModalState, setStakingModalState] =
    useGovernanceGlobalState("stakingModal");
  const [stepNum, setStepNum] = useState<number>(0);
  const [stakingData, setStakingData] = useState<{
    amount: BigNumber;
    duration: Duration;
  }>({ amount: BigNumber.from(0), duration: duration() });

  const votingEscrowContract = useVotingEscrow();
  const rbnTokenContract = useERC20Token("rbn");

  useEffect(() => {
    /**
     * Reset step number on modal close, but only when there isn't ongoing transaction
     */
    if (!stakingModalState.show && !stakingModalState.pendingTransaction) {
      setStepNum(0);
    }

    /**
     * Prevent step number overflow
     */
    if (stepNum >= stakingModesMap[stakingModalState.mode].length) {
      setStepNum(stakingModesMap[stakingModalState.mode].length - 1);
    }
  }, [stakingModalState, stepNum]);

  /**
   * Prevent to proceed to preview with unallowed data
   */
  useEffect(() => {
    if (
      stakingModalState.mode !== "stake" ||
      !stakingModalState.show ||
      stakingModesMap[stakingModalState.mode][stepNum] !== "preview"
    ) {
      return;
    }

    if (
      stakingData.amount.lte(BigNumber.from(0)) ||
      stakingData.duration.asDays() < 7
    ) {
      setStepNum(stakingModesMap[stakingModalState.mode].indexOf("form"));
    }
  }, [stakingModalState, stakingData, stepNum]);

  /**
   * Callback for approval
   */
  const onApprove = useCallback(async () => {
    setStepNum(stakingModesMap[stakingModalState.mode].indexOf("transaction"));
    try {
      const amount =
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      const tx = await rbnTokenContract.approve(VotingEscrowAddress, amount);
      setStakingModalState((prev) => ({
        ...prev,
        pendingTransaction: { hash: tx.hash, type: "approve" },
      }));

      await provider.waitForTransaction(tx.hash, 5);

      setStakingModalState((prev) => ({
        ...prev,
        show: false,
        pendingTransaction: undefined,
      }));
    } catch (e) {
      setStepNum(stakingModesMap[stakingModalState.mode].indexOf("approve"));
    }
  }, [provider, rbnTokenContract, setStakingModalState, stakingModalState]);

  /**
   * Callback for user staking
   */
  const onStake = useCallback(async () => {
    setStepNum(stakingModesMap[stakingModalState.mode].indexOf("transaction"));
    try {
      const tx = await votingEscrowContract.create_lock(
        stakingData.amount,
        moment().add(stakingData.duration).unix()
      );
      setStakingModalState((prev) => ({
        ...prev,
        pendingTransaction: { hash: tx.hash, type: "stake" },
      }));

      await provider.waitForTransaction(tx.hash, 5);

      setStakingModalState((prev) => ({
        ...prev,
        show: false,
        pendingTransaction: undefined,
      }));
    } catch (e) {
      setStepNum(stakingModesMap[stakingModalState.mode].indexOf("preview"));
    }
  }, [
    votingEscrowContract,
    provider,
    setStakingModalState,
    stakingData,
    stakingModalState.mode,
  ]);

  const modalBody = useMemo(() => {
    switch (stakingModesMap[stakingModalState.mode][stepNum]) {
      case "approve":
        return <StakingModalApprove onApprove={onApprove} />;
      case "explainer":
        return (
          <StakingModalExplainer
            proceedToForm={() =>
              setStepNum(
                stakingModesMap[stakingModalState.mode].indexOf("form")
              )
            }
          />
        );
      case "form":
        return (
          <StakingModalForm
            initialStakingData={stakingData}
            proceedToPreview={(amount, duration) => {
              setStakingData({ amount, duration });
              setStepNum(
                stakingModesMap[stakingModalState.mode].indexOf("preview")
              );
            }}
          />
        );
      case "preview":
        return (
          <StakingModalPreview
            stakingData={stakingData}
            onConfirm={onStake}
            onBack={() =>
              setStepNum(
                stakingModesMap[stakingModalState.mode].indexOf("form")
              )
            }
          />
        );
      case "transaction":
        let title = "Confirm Transaction";
        if (stakingModalState.pendingTransaction?.hash) {
          title =
            stakingModalState.mode === "approve"
              ? "APPROVING RBN"
              : "STAKE RBN";
        }

        return (
          <ModalTransactionContent
            title={title}
            txhash={stakingModalState.pendingTransaction?.hash}
          />
        );
    }
  }, [onApprove, onStake, stakingData, stakingModalState, stepNum]);

  return (
    <BasicModal
      show={stakingModalState.show}
      height={
        stakingModalHeight[stakingModesMap[stakingModalState.mode][stepNum]]
      }
      onClose={() =>
        setStakingModalState((state) => ({ ...state, show: false }))
      }
      headerBackground={
        stakingModesMap[stakingModalState.mode][stepNum] === "transaction"
      }
    >
      {modalBody}
    </BasicModal>
  );
};

export default StakingModal;
