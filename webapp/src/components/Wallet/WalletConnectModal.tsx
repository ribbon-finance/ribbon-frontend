import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";

import {
  BaseButton,
  BaseLink,
  BaseModal,
  BaseModalHeader,
  BaseText,
  Title,
} from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import {
  injectedConnector,
  getWalletConnectConnector,
} from "../../utils/connectors";
import { MetamaskIcon, WalletConnectIcon } from "../../utils/icon";
import { ConnectorButtonProps, connectorType } from "./types";
import useTextAnimation from "../../hooks/useTextAnimation";

interface WalletConnectModalProps {
  show: boolean;
  onClose: () => void;
}

const ConnectorButton = styled(BaseButton)<ConnectorButtonProps>`
  background-color: ${colors.backgroundDarker};
  margin-bottom: 16px;
  align-items: center;

  &:hover {
    opacity: ${theme.hover.opacity};
  }

  ${(props) => {
    switch (props.status) {
      case "neglected":
        return `
          opacity: 0.24;

          &:hover {
            opacity: 0.24;
          }
        `;
      case "initializing":
        return `
          border: ${theme.border.width} ${theme.border.style} ${colors.green};

          &:hover {
            opacity: 1;
          }
        `;
      default:
        return ``;
    }
  }}
`;

const ConnectorButtonText = styled(Title)`
  margin-left: 16px;
`;

const LearnMoreLink = styled(BaseLink)`
  margin: 24px 0px;

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const LearnMoreText = styled(BaseText)`
  text-decoration: underline;
`;

const LearnMoreArrow = styled(BaseText)`
  text-decoration: none;
  margin-left: 5px;
`;

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  show,
  onClose,
}) => {
  const { activate: activateWeb3, library, account } = useWeb3React();
  const [
    connectingConnector,
    setConnectingConnector,
  ] = useState<connectorType>();
  const initializingText = useTextAnimation(
    ["INITIALIZING", "INITIALIZING .", "INITIALIZING ..", "INITIALIZING ..."],
    250
  );

  const handleMetamaskConnect = useCallback(async () => {
    setConnectingConnector("metamask");
    await activateWeb3(injectedConnector);
    setConnectingConnector(undefined);
  }, [activateWeb3]);

  const handleWalletconnectConnect = useCallback(async () => {
    setConnectingConnector("walletConnect");
    await activateWeb3(getWalletConnectConnector());
    setConnectingConnector(undefined);
  }, [activateWeb3]);

  useEffect(() => {
    if (library && account) {
      onClose();
    }
  }, [library, account, onClose]);

  const renderStatus = (connector?: connectorType) => {
    switch (connectingConnector) {
      case undefined:
        return "normal";
      case connector:
        return "initializing";
    }
    return "neglected";
  };

  return (
    <BaseModal show={show} onHide={onClose} centered>
      <BaseModalHeader closeButton>
        <Title>CONNECT WALLET</Title>
      </BaseModalHeader>
      <Modal.Body>
        <ConnectorButton
          role="button"
          onClick={handleMetamaskConnect}
          status={renderStatus("metamask")}
        >
          <MetamaskIcon height={40} width={40} />
          <ConnectorButtonText>
            {connectingConnector === "metamask" ? initializingText : "METAMASK"}
          </ConnectorButtonText>
        </ConnectorButton>
        <ConnectorButton
          role="button"
          onClick={handleWalletconnectConnect}
          status={renderStatus("walletConnect")}
        >
          <WalletConnectIcon height={40} width={40} />
          <ConnectorButtonText>
            {connectingConnector === "walletConnect"
              ? initializingText
              : "WALLET CONNECT"}
          </ConnectorButtonText>
        </ConnectorButton>
        <LearnMoreLink
          to="https://ethereum.org/en/wallets/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LearnMoreText>Learn more about wallets</LearnMoreText>
          <LearnMoreArrow>&#8594;</LearnMoreArrow>
        </LearnMoreLink>
      </Modal.Body>
    </BaseModal>
  );
};

export default WalletConnectModal;
