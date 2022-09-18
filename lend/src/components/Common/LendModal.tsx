import { StyledModal } from "shared/lib/components/Common/BasicModal";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { CloseIcon } from "shared/lib/assets/icons/icons";
import styled from "styled-components";
import { ContentEnum, ModalContent } from "./ModalContent";
import { useMemo } from "react";

const borderStyle = `1px solid ${colors.primaryText}1F`;

const Header = styled.div`
  padding-left: 24px;
  border-bottom: ${borderStyle};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  width: 80px;
  height: 80px;
  border-left: ${borderStyle};
`;

interface InfoModalProps {
  content?: ContentEnum;
  show?: boolean;
  onHide: () => void;
}

const LendModal: React.FC<InfoModalProps> = ({ show, onHide, content }) => {
  return (
    <StyledModal centered show={show} maxWidth={343} onHide={onHide} backdrop>
      <Header>
        <Title>{content}</Title>
        <CloseButton onClick={onHide}>
          <CloseIcon />
        </CloseButton>
      </Header>
      <ModalContent content={content} />
    </StyledModal>
  );
};

export default LendModal;
