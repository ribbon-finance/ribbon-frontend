import React, { useEffect, useMemo, useState } from "react";

import BasicModal from "shared/lib/components/Common/BasicModal";
import { useGovernanceGlobalState } from "../../store/store";
import StakingModalExplainer from "./StakingModalExplainer";

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
  form: 580,
  preview: 476,
  confirm: 412,
  submitted: 412,
};

const StakingModal = () => {
  const [show, setShow] = useGovernanceGlobalState("showStakingModal");
  const [mode, setMode] = useState<StakingModalMode>(stakingModalModes[0]);

  /**
   * Reset modal after close
   */
  useEffect(() => {
    if (!show) {
      setMode(stakingModalModes[0]);
    }
  }, [show]);

  const modalBody = useMemo(() => {
    switch (mode) {
      case "explainer":
        return <StakingModalExplainer proceedToForm={() => setMode("form")} />;
      default:
        return <></>;
    }
  }, [mode]);

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
