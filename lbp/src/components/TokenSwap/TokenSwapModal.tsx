import React from "react";
import { useCallback } from "react";

import BasicModal from "shared/lib/components/Common/BasicModal";
import { useLBPGlobalState } from "../../store/store";
import TokenSwapForm from "./TokenSwapForm";

const TokenSwapModal = () => {
  const [swapModal, setSwapModal] = useLBPGlobalState("swapModal");

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
      <TokenSwapForm />
    </BasicModal>
  );
};

export default TokenSwapModal;
