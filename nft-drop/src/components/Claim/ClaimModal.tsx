import React, { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";

import RBNClaimModalContent from "shared/lib/components/Common/RBNClaimModalContent";
import { setTimeout } from "timers";
import BasicModal from "shared/lib/components/Common/BasicModal";
import { useNFTDropGlobalState } from "../../store/store";

const ClaimModal = () => {
  const [show, setShow] = useNFTDropGlobalState("showClaimModal");
  const [step, setStep] = useState<"claim" | "claiming" | "claimed">("claim");
  const [currentTx, setCurrentTx] = useState<string>();

  const onClaim = useCallback(() => {
    // Perform contract call and set claiming after that
    setTimeout(() => {
      setCurrentTx("0x29Cd242278018b719172e85D79DaB27691d07440");
      setStep("claiming");
    }, 1500);
  }, []);

  // Trigger wallet approval on modal show
  useEffect(() => {
    setStep((prevStep) => {
      switch (prevStep) {
        case "claim":
          if (show) {
            onClaim();
          }
          return prevStep;
        case "claiming":
        case "claimed":
          return prevStep;
      }
    });
  }, [show, onClaim]);

  // Wait for current tx and set state accordingly
  useEffect(() => {
    if (currentTx) {
      setTimeout(() => {
        setCurrentTx(undefined);
        setStep("claimed");
      }, 1500);
    }
  }, [currentTx]);

  const onClose = useCallback(() => {
    setShow(false);
    if (step === "claimed") {
      setStep("claim");
    }
  }, [setShow, step]);

  return (
    <BasicModal show={show} onClose={onClose} height={580}>
      <RBNClaimModalContent step={step} />
    </BasicModal>
  );
};

export default ClaimModal;
