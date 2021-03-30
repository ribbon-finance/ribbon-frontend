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
  margin-top: 28px;
  margin-bottom: 50px;
  padding-left: 14px;
  padding-right: 14px;
`;

const ArrowBack = styled.i`
  color: ${colors.primaryText};
  height: 14px;
  margin-right: 20px;
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
    >
      <ModalContainer className="d-flex flex-column">
        <ModalHeader className="d-flex flex-row align-items-center">
          <div onClick={onClose}>
            <ArrowBack className="fas fa-arrow-left"></ArrowBack>
            <Title>Back</Title>
          </div>
        </ModalHeader>
        <ActionsForm variant="mobile"></ActionsForm>
      </ModalContainer>
    </MobileOverlayMenu>
  );
};

export default ActionsFormModal;
