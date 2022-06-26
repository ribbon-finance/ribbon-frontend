import BasicModal from "shared/lib/components/Common/BasicModal";
import { BaseModalContentColumn, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import MenuButton from "shared/lib/components/Common/MenuButton";
import theme from "shared/lib/designSystem/theme";

const InfoModalContainer = styled.div`
  padding: 0 24px;
`;

const InfoModalExplainer = styled.p`
  color: ${colors.text};
`;

const CloseButtonContainer = styled.div`
  width: 40px;
  height: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.primaryText}0A;
  border-radius: 48px;
  color: ${colors.text};
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

interface InfoModalProps {
  isVisible: boolean;
  setShow: (set: boolean) => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isVisible, setShow }) => {
  return (
    <BasicModal
      closeButton={false}
      show={isVisible}
      height={376}
      onClose={() => setShow(false)}
    >
      <InfoModalContainer style={{ padding: "0 24px" }}>
        <BaseModalContentColumn marginTop={8}>
          <Title>Ribbon Treasury</Title>
        </BaseModalContentColumn>
        <BaseModalContentColumn>
          <InfoModalExplainer>
            Ribbon Treasury is a private Ribbon vault built specifically for
            DAOs to run customisable covered call strategies on their native
            tokens, generate income from these covered call premiums and build a
            healthy diversified portfolio of treasury assets.
          </InfoModalExplainer>
        </BaseModalContentColumn>
        <BaseModalContentColumn>
          <CloseButtonContainer onClick={() => setShow(false)}>
            <MenuButton
              isOpen
              onToggle={() => setShow(false)}
              size={20}
              color="#FFFFFFA3"
            />
          </CloseButtonContainer>
        </BaseModalContentColumn>
      </InfoModalContainer>
    </BasicModal>
  );
};
