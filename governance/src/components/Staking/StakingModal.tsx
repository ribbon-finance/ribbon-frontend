import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import moment, { duration, Duration } from "moment";

import BasicModal from "shared/lib/components/Common/BasicModal";
import useVotingEscrow from "shared/lib/hooks/useVotingEscrow";
import { useGovernanceGlobalState } from "../../store/store";
import StakingModalExplainer from "./StakingModalExplainer";
import StakingModalForm from "./StakingModalForm";
import StakingModalPreview from "./StakingModalPreview";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import StakingModalApprove from "./StakingModalApprove";
import useERC20Token from "shared/lib/hooks/useERC20Token";
import ModalTransactionContent from "../Shared/ModalTransactionContent";
import { VotingEscrowAddress } from "shared/lib/constants/constants";
import StakeUpdatePicker from "./StakingModalUpdatePicker";
import { StakingUpdateMode } from "./types";
import StakingModalncreaseAmountForm from "./StakingModalIncreaseAmountForm";
import StakingModalUpdatePreview from "./StakingModalUpdatePreview";
import StakingModalIncreaseDurationForm from "./StakingModalIncreaseDurationForm";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { formatBigNumber } from "shared/lib/utils/math";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";

const stakingModalModes = [
  "approve",
  "explainer",
  "picker",
  "form",
  "preview",
  "transaction",
] as const;
type StakingModalMode = typeof stakingModalModes[number];
const stakingModesMap: {
  [key in "approve" | "stake" | "increase"]: StakingModalMode[];
} = {
  approve: ["approve", "transaction"],
  stake: ["explainer", "form", "preview", "transaction"],
  increase: ["picker", "form", "preview", "transaction"],
};

const stakingModalHeight: { [mode in StakingModalMode]: number } = {
  approve: 448,
  explainer: 528,
  picker: 426,
  form: 620,
  preview: 524,
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
  const { data: rbnTokenAccount } = useRBNTokenAccount();

  const [stakingUpdateMode, setStakingUpdateMode] =
    useState<StakingUpdateMode>();
  const { addPendingTransaction } = usePendingTransactions();

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
      addPendingTransaction({
        type: "governanceApproval",
        txhash: tx.hash,
        amount: amount,
      });

      await provider.waitForTransaction(tx.hash, 5);

      setStakingModalState((prev) => ({
        ...prev,
        show: false,
        pendingTransaction: undefined,
      }));
    } catch (e) {
      setStepNum(stakingModesMap[stakingModalState.mode].indexOf("approve"));
    }
  }, [
    addPendingTransaction,
    provider,
    rbnTokenContract,
    setStakingModalState,
    stakingModalState,
  ]);

  /**
   * Callback for user staking
   */
  const onStake = useCallback(async () => {
    setStepNum(stakingModesMap[stakingModalState.mode].indexOf("transaction"));
    try {
      const expiryMoment = moment().add(stakingData.duration);
      const tx = await votingEscrowContract.create_lock(
        stakingData.amount,
        expiryMoment.unix()
      );
      setStakingModalState((prev) => ({
        ...prev,
        pendingTransaction: { hash: tx.hash, type: "stake" },
      }));
      addPendingTransaction({
        type: "governanceStake",
        txhash: tx.hash,
        amount: formatBigNumber(stakingData.amount),
        expiry: expiryMoment,
      });

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
    addPendingTransaction,
    votingEscrowContract,
    provider,
    setStakingModalState,
    stakingData,
    stakingModalState.mode,
  ]);

  /**
   * Callback for stake update
   */
  const onStakeUpdate = useCallback(async () => {
    setStepNum(stakingModesMap[stakingModalState.mode].indexOf("transaction"));
    try {
      const expiryMoment = moment().add(stakingData.duration);
      const tx = await (stakingUpdateMode === "increaseAmount"
        ? votingEscrowContract.increase_amount(stakingData.amount)
        : votingEscrowContract.increase_unlock_time(expiryMoment.unix()));
      setStakingModalState((prev) => ({
        ...prev,
        pendingTransaction: {
          hash: tx.hash,
          type: stakingUpdateMode || "increaseAmount",
        },
      }));
      addPendingTransaction({
        type:
          stakingUpdateMode === "increaseAmount"
            ? "governanceIncreaseAmount"
            : "governanceIncreaseDuration",
        txhash: tx.hash,
        amount: formatBigNumber(
          stakingUpdateMode === "increaseAmount"
            ? stakingData.amount.add(
                rbnTokenAccount?.lockedBalance || BigNumber.from(0)
              )
            : rbnTokenAccount?.lockedBalance || BigNumber.from(0)
        ),
        expiry: expiryMoment,
      });

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
    addPendingTransaction,
    provider,
    rbnTokenAccount,
    setStakingModalState,
    stakingData,
    stakingModalState,
    stakingUpdateMode,
    votingEscrowContract,
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
      case "picker":
        return (
          <StakeUpdatePicker
            onSelect={(mode) => {
              setStepNum(
                stakingModesMap[stakingModalState.mode].indexOf("form")
              );
              setStakingUpdateMode(mode);
            }}
          />
        );
      case "form":
        switch (stakingModalState.mode) {
          case "stake":
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
          case "increase":
            switch (stakingUpdateMode) {
              case "increaseAmount":
                return (
                  <StakingModalncreaseAmountForm
                    initialStakingData={stakingData}
                    proceedToPreview={(amount, duration) => {
                      setStakingData({ amount, duration });
                      setStepNum(
                        stakingModesMap[stakingModalState.mode].indexOf(
                          "preview"
                        )
                      );
                    }}
                  />
                );
              case "increaseDuration":
                return (
                  <StakingModalIncreaseDurationForm
                    initialStakingData={stakingData}
                    proceedToPreview={(amount, duration) => {
                      setStakingData({ amount, duration });
                      setStepNum(
                        stakingModesMap[stakingModalState.mode].indexOf(
                          "preview"
                        )
                      );
                    }}
                  />
                );
              default:
                return <></>;
            }
          default:
            return <></>;
        }
      case "preview":
        switch (stakingModalState.mode) {
          case "stake":
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
          case "increase":
            return (
              <StakingModalUpdatePreview
                stakingData={stakingData}
                stakingUpdateMode={stakingUpdateMode!}
                onConfirm={onStakeUpdate}
                onBack={() =>
                  setStepNum(
                    stakingModesMap[stakingModalState.mode].indexOf("form")
                  )
                }
              />
            );
          default:
            return <></>;
        }
      case "transaction":
        let title = "Confirm Transaction";
        if (stakingModalState.pendingTransaction?.hash) {
          title =
            stakingModalState.mode === "approve" ? "APPROVING RBN" : "LOCK RBN";
        }

        return (
          <ModalTransactionContent
            title={title}
            txhash={stakingModalState.pendingTransaction?.hash}
          />
        );
    }
  }, [
    onApprove,
    onStake,
    onStakeUpdate,
    stakingData,
    stakingUpdateMode,
    stakingModalState,
    stepNum,
  ]);

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
