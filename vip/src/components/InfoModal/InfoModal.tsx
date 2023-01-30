import BasicModal from "shared/lib/components/Common/BasicModal";
import { BaseModalContentColumn, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import MenuButton from "shared/lib/components/Common/MenuButton";
import theme from "shared/lib/designSystem/theme";
import { ExternalIcon } from "shared/lib/assets/icons/icons";

const InfoModalContainer = styled.div`
  padding: 0 12px;
`;

const InfoModalExplainer = styled.p`
  color: ${colors.text};
  margin-bottom: 0;
`;

const InfoModalColumn = styled(BaseModalContentColumn)`
  text-align: left;
  justify-content: start;
`;

const InfoModalTitle = styled(Title)`
  font-size: 22px;
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

const ReadMoreLink = styled.a`
  display: inline-flex;
  text-decoration: none;

  > * {
    font-size: 14px;
    color: ${colors.text};
    margin: auto 0;

    &:last-child {
      margin-left: 8px;
    }
  }

  &:hover {
    text-decoration: none;
    cursor: pointer;

    > * {
      color: ${colors.primaryText};
    }
  }
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
      height={368}
      onClose={() => setShow(false)}
    >
      <InfoModalContainer>
        <InfoModalColumn marginTop={8}>
          <InfoModalTitle>Ribbon Treasury</InfoModalTitle>
        </InfoModalColumn>
        <BaseModalContentColumn marginTop={16}>
          <InfoModalExplainer>
            Ribbon Treasury is a private Ribbon vault built specifically for
            DAOs to run customisable covered call strategies on their native
            tokens, generate income from these covered call premiums and build a
            healthy diversified portfolio of treasury assets.
          </InfoModalExplainer>
        </BaseModalContentColumn>
        <InfoModalColumn marginTop={16}>
          <ReadMoreLink
            href="https://www.research.ribbon.finance/blog/ribbon-treasury"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Read More</span> <ExternalIcon height={16} width={16} />
          </ReadMoreLink>
        </InfoModalColumn>
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
