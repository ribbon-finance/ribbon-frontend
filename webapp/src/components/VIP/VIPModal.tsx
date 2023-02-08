import React, { useCallback } from "react";
import BasicModal from "shared/lib/components/Common/BasicModal";
import VIPInfo from "./VIPInfo";

interface VIPModalProps {
  show: boolean;
  onClose: () => void;
}
const VIPModal: React.FC<VIPModalProps> = ({ show, onClose }) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <BasicModal show={show} onClose={handleClose} height={580} headerBackground>
      <VIPInfo />
    </BasicModal>
  );
};

export default VIPModal;
