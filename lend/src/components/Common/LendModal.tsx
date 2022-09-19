import { StyledModal } from "shared/lib/components/Common/BasicModal";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { CloseIcon } from "shared/lib/assets/icons/icons";
import styled from "styled-components";
import { ClaimRbn, ClaimRbnPageEnum, ModalContent } from "./ModalContent";
import { useCallback, useState } from "react";

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

export enum ModalContentEnum {
  ABOUT = "ABOUT",
  COMMUNITY = "COMMUNITY",
  WALLET = "CONNECT WALLET",
  CLAIMRBN = "CLAIM RBN",
}

interface InfoModalProps {
  content?: ModalContentEnum;
  show?: boolean;
  onHide: () => void;
}

const LendModal: React.FC<InfoModalProps> = ({ show, onHide, content }) => {
  const [rbnClaimStep, setRbnClaimStep] = useState<ClaimRbnPageEnum>(
    ClaimRbnPageEnum.CLAIM_RBN
  );
  const renderRbnClaimTitle = useCallback((rbnClaimStep: ClaimRbnPageEnum) => {
    switch (rbnClaimStep) {
      case ClaimRbnPageEnum.CLAIM_RBN:
        return "CLAIM RBN";
      case ClaimRbnPageEnum.TRANSACTION_STEP:
        return "CLAIMING RBN";
      case ClaimRbnPageEnum.SUCCESS_STEP:
        return "RBN CLAIMED";
    }
  }, []);

  const renderContent = useCallback(
    (content?: ModalContentEnum) => {
      switch (content) {
        case "ABOUT":
        case "COMMUNITY":
        case "CONNECT WALLET":
          return (
            <>
              <Header>
                <Title>{content}</Title>
                <CloseButton onClick={onHide}>
                  <CloseIcon />
                </CloseButton>
              </Header>
              <ModalContent content={content} />
            </>
          );
        case "CLAIM RBN":
          return (
            <>
              <Header>
                <Title>{renderRbnClaimTitle(rbnClaimStep)}</Title>
                <CloseButton onClick={onHide}>
                  <CloseIcon />
                </CloseButton>
              </Header>
              <ClaimRbn onHide={onHide} setRbnClaimStep={setRbnClaimStep} />
            </>
          );
        default:
          return <></>;
      }
    },
    [onHide, rbnClaimStep, renderRbnClaimTitle]
  );

  return (
    <StyledModal centered show={show} maxWidth={343} onHide={onHide} backdrop>
      {renderContent(content)}
      {/* <Header>
        <Title>{content}</Title>
        <CloseButton onClick={onHide}>
          <CloseIcon />
        </CloseButton>
      </Header>
      <ModalContent content={content} /> */}
    </StyledModal>
  );
};

export default LendModal;
