import React from "react";
import styled from "styled-components";
import MobileOverlayMenu from "../Common/MobileOverlayMenu";
import ActionsForm from "../ActionsForm/ActionsForm";
import colors from "../../designSystem/colors";
import { Title } from "../../designSystem";

interface ActionsFormModalProps {
  show: boolean;
  onClose: () => void;
}

const ModalContainer = styled.div`
  padding-left: 18px;
  padding-right: 18px;
`;

const ModalHeader = styled.div`
  position: absolute;
  top: 28px;
  padding-left: 14px;
  padding-right: 14px;
`;

const ArrowBack = styled.i`
  color: ${colors.primaryText};
  height: 14px;
  margin-right: 20px;
`;

const ModalBody = styled.div`
  background: #1c1a19;
  border: 1px solid #2b2b2b;
  box-sizing: border-box;
  border-radius: 8px;
`;

const ActionsFormModal: React.FC<ActionsFormModalProps> = ({
  show,
  onClose,
}) => {
  return (
    <MobileOverlayMenu
      isMenuOpen={show}
      onOverlayClick={() => {}}
      mountRoot="div#root"
      boundingDivProps={{ style: { width: "100%" } }}
    >
      <ModalContainer className="d-flex flex-column h-100">
        <ModalHeader className="d-flex flex-row align-items-center">
          <div onClick={onClose}>
            <ArrowBack className="fas fa-arrow-left"></ArrowBack>
            <Title>Back</Title>
          </div>
        </ModalHeader>
        <div className="h-100">
          <ActionsForm variant="mobile"></ActionsForm>
        </div>
      </ModalContainer>
    </MobileOverlayMenu>
  );
};

export default ActionsFormModal;
