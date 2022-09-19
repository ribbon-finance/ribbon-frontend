import { StyledModal } from "shared/lib/components/Common/BasicModal";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { CloseIcon } from "shared/lib/assets/icons/icons";
import styled from "styled-components";
import { ModalContent } from "./ModalContent";
import { useMemo } from "react";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import { truncateAddress } from "shared/lib/utils/address";
import Indicator from "shared/lib/components/Indicator/Indicator";

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
}

interface InfoModalProps {
  content?: ModalContentEnum;
  show?: boolean;
  onHide: () => void;
}

const WalletButton = styled.div`
  display: flex;
  margin: auto;
  height: 100%;
  justify-content: center;
  cursor: pointer;

  > * {
    margin: auto 0;
    margin-right: 8px;
  }
`;

const LendModal: React.FC<InfoModalProps> = ({ show, onHide, content }) => {
  const { active, account } = useWeb3Wallet();

  const modalTitle = useMemo(() => {
    if (content === ModalContentEnum.WALLET) {
      return account ? (
        <WalletButton>
          <Indicator connected={active} /> {truncateAddress(account)}
        </WalletButton>
      ) : (
        content
      );
    }

    return content;
  }, [account, active, content]);

  return (
    <StyledModal centered show={show} maxWidth={343} onHide={onHide} backdrop>
      <Header>
        <Title>{modalTitle}</Title>
        <CloseButton onClick={onHide}>
          <CloseIcon />
        </CloseButton>
      </Header>
      <ModalContent content={content} onHide={onHide} />
    </StyledModal>
  );
};

export default LendModal;
