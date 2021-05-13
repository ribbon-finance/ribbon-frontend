import React, { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import {
  BaseLink,
  BaseModal,
  BaseModalHeader,
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import Logo from "shared/lib/assets/icons/logo";
import colors from "shared/lib/designSystem/colors";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { ConnectWalletButton } from "shared/lib/components/Common/buttons";
import useConnectWalletModal from "../../hooks/useConnectWalletModal";

const StyledModal = styled(BaseModal)`
  .modal-content {
    max-width: 343px;
  }
`;

const ModalContent = styled(Modal.Body)`
  display: flex;
  flex-wrap: wrap;
`;

const ContentColumn = styled.div<{ marginTop?: number }>`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 24)}px;
  width: 100%;
`;

const UnclaimLabel = styled(Subtitle)`
  color: ${colors.text};
  letter: 1.5px;
`;

const Description = styled(SecondaryText)`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
`;

const UnclaimData = styled(Title)<{ variant: "big" | "small" }>`
  ${(props) => {
    switch (props.variant) {
      case "big":
        return `
          font-size: 96px;
        `;
      case "small":
        return `
          font-size: 64px;
        `;
    }
  }}
`;

const LearnMoreLink = styled(BaseLink)`
  display: flex;
  align-items: center;

  span {
    text-decoration: underline;
  }
`;

const LearnMoreIcon = styled(ExternalIcon)`
  margin-left: 8px;
`;

interface AirdropModalProps {
  show: boolean;
  onClose: () => void;
}

const AirdropModal: React.FC<AirdropModalProps> = ({ show, onClose }) => {
  const [steps] = useState<"info">("info");
  const { account } = useWeb3React();
  const [, setShowConnectModal] = useConnectWalletModal();

  const content = useMemo(() => {
    if (!account) {
      return (
        <>
          <ContentColumn marginTop={-24}>
            <Logo height="64px" width="64px" />
          </ContentColumn>
          <ContentColumn>
            <UnclaimLabel>UNCLAIMED $RIBBON</UnclaimLabel>
          </ContentColumn>
          <ContentColumn marginTop={8}>
            <UnclaimData variant="small">---</UnclaimData>
          </ContentColumn>
          <ContentColumn>
            <Description>
              Please connect your wallet to check for unclaimed $RIBBON
            </Description>
          </ContentColumn>
          <ContentColumn marginTop={16}>
            <LearnMoreLink to="https://ribbon.finance/faq">
              <PrimaryText>Read about $RIBBON</PrimaryText>
              <LearnMoreIcon height="20px" width="20px" color="white" />
            </LearnMoreLink>
          </ContentColumn>
          <ContentColumn marginTop={80}>
            <ConnectWalletButton
              onClick={() => setShowConnectModal(true)}
              type="button"
              className="btn py-3 mb-2"
            >
              Connect Wallet
            </ConnectWalletButton>
          </ContentColumn>
        </>
      );
    }

    switch (steps) {
      case "info":
        return (
          <>
            <ContentColumn marginTop={-24}>
              <Logo height="64px" width="64px" />
            </ContentColumn>
            <ContentColumn marginTop={56}>
              <UnclaimLabel>UNCLAIMED $RIBBON</UnclaimLabel>
            </ContentColumn>
          </>
        );
    }
  }, [account, steps, setShowConnectModal]);
  return (
    <StyledModal show={show} onHide={onClose} centered backdrop={true}>
      <BaseModalHeader closeButton></BaseModalHeader>
      <ModalContent>{content}</ModalContent>
    </StyledModal>
  );
};

export default AirdropModal;
