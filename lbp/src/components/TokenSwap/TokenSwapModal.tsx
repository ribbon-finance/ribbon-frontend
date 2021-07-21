import React, { useState, useCallback } from "react";

import BasicModal from "shared/lib/components/Common/BasicModal";
import { useLBPGlobalState } from "../../store/store";
import TokenSwapForm from "./TokenSwapForm";

const TokenSwapModal = () => {
  const [swapModal, setSwapModal] = useLBPGlobalState("swapModal");
  const [swapAmount, setSwapAmount] = useState<string>("");

  const handleClose = useCallback(() => {
    setSwapModal((currentSwapModal) => ({
      ...currentSwapModal,
      show: false,
    }));
  }, [setSwapModal]);

  return (
    <BasicModal
      show={swapModal.show}
      onClose={handleClose}
      height={516}
      headerBackground
    >
      <TokenSwapForm
        swapAmount={parseFloat(swapAmount)}
        onSwapAmountChange={(amount) => {
          const parsedInput = parseFloat(amount);
          setSwapAmount(
            isNaN(parsedInput) || parsedInput < 0 ? "" : `${parsedInput}`
          );
        }}
      />
    </BasicModal>
  );
};

export default TokenSwapModal;
