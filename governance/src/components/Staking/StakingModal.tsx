import { BigNumber } from "@ethersproject/bignumber";
import moment, { duration, Duration } from "moment";
import React, { useEffect, useMemo, useState } from "react";

import BasicModal from "shared/lib/components/Common/BasicModal";
import useInventizedVotingLockup from "../../hooks/useIncentivizedVotingLockup";
import { useGovernanceGlobalState } from "../../store/store";
import StakingModalExplainer from "./StakingModalExplainer";
import StakingModalForm from "./StakingModalForm";
import StakingModalPreview from "./StakingModalPreview";

const stakingModalModes = [
  "explainer",
  "form",
  "preview",
  "confirm",
  "submitted",
] as const;
type StakingModalMode = typeof stakingModalModes[number];

const stakingModalHeight: { [mode in StakingModalMode]: number } = {
  explainer: 528,
  form: 620,
  preview: 476,
  confirm: 412,
  submitted: 412,
};

const StakingModal = () => {
  const [show, setShow] = useGovernanceGlobalState("showStakingModal");
  const [mode, setMode] = useState<StakingModalMode>(stakingModalModes[0]);
  const [stakingData, setStakingData] = useState<{
    amount: BigNumber;
    duration: Duration;
  }>({ amount: BigNumber.from(0), duration: duration() });
  const lockupContract = useInventizedVotingLockup();

  /**
   * Reset modal after close
   */
  useEffect(() => {
    if (!show) {
      setMode(stakingModalModes[0]);
    }
  }, [show]);

  /**
   * Prevent to proceed to preview with unallowed data
   */
  useEffect(() => {
    if (!show || mode !== "preview") {
      return;
    }

    if (
      stakingData.amount.lte(BigNumber.from(0)) ||
      stakingData.duration.asDays() < 7
    ) {
      setMode("form");
    }
  }, [mode, show, stakingData]);

  const modalBody = useMemo(() => {
    switch (mode) {
      case "explainer":
        return <StakingModalExplainer proceedToForm={() => setMode("form")} />;
      case "form":
        return (
          <StakingModalForm
            initialStakingData={stakingData}
            proceedToPreview={(amount, duration) => {
              setStakingData({ amount, duration });
              setMode("preview");
            }}
          />
        );
      case "preview":
        return (
          <StakingModalPreview
            stakingData={stakingData}
            onConfirm={async () => {
              setMode("confirm");
              try {
                console.log(lockupContract);
                console.log(
                  stakingData.amount.toString(),
                  moment().add(stakingData.duration).unix()
                );
                const res = await lockupContract.createLock(
                  stakingData.amount,
                  moment().add(stakingData.duration).unix()
                );
                setMode("submitted");
              } catch (e) {
                console.log(e);
                setMode("preview");
              }
            }}
            onBack={() => setMode("form")}
          />
        );
      default:
        return <></>;
    }
  }, [lockupContract, mode, stakingData]);

  return (
    <BasicModal
      show={show}
      height={stakingModalHeight[mode]}
      onClose={() => setShow(false)}
    >
      {modalBody}
    </BasicModal>
  );
};

export default StakingModal;
