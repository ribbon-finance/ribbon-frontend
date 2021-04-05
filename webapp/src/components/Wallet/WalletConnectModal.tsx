import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

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
import Indicator from "../Indicator/Indicator";
import useConnectWalletModal from "../../hooks/useConnectWalletModal";

const ConnectorButton = styled(BaseButton)<ConnectorButtonProps>`
  background-color: ${colors.backgroundDarker};
  margin-bottom: 16px;
  align-items: center;

  &:hover {
    opacity: ${theme.hover.opacity};
  }

  ${(props) => {
    switch (props.status) {
      case "connected":
        return `
          border: ${theme.border.width} ${theme.border.style} ${colors.green};
        `;
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

const IndicatorContainer = styled.div`
  margin-left: auto;
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

const WalletConnectModal: React.FC = () => {
  const {
    connector,
    activate: activateWeb3,
    library,
    account,
    active,
  } = useWeb3React();
  const [
    connectingConnector,
    setConnectingConnector,
  ] = useState<connectorType>();
  const initializingText = useTextAnimation(
    ["INITIALIZING", "INITIALIZING .", "INITIALIZING ..", "INITIALIZING ..."],
    250,
    !!connectingConnector
  );
  const [show, setShow] = useConnectWalletModal();

  const onClose = useCallback(() => {
    setShow(false);
  }, [setShow]);

  const handleConnect = useCallback(
    async (type: connectorType) => {
      setConnectingConnector(type);

      // Disconnect wallet if currently connected already
      if (active && connector instanceof WalletConnectConnector)
        await connector.close();

      // Connect wallet
      switch (type) {
        case "metamask":
          await activateWeb3(injectedConnector);
          break;
        case "walletConnect":
          await activateWeb3(getWalletConnectConnector());
      }
      setConnectingConnector(undefined);
    },
    [activateWeb3, connector, active]
  );

  useEffect(() => {
    if (library && account) {
      onClose();
    }
  }, [library, account, onClose]);

  const getConnectorStatus = useCallback(
    (connectorType: connectorType) => {
      // If connected, check if current button is connected
      if (active) {
        switch (connectorType) {
          case "metamask":
            if (connector instanceof InjectedConnector) return "connected";
            break;
          case "walletConnect":
            if (connector instanceof WalletConnectConnector) return "connected";
            break;
        }
      }

      // Check initializing status
      switch (connectingConnector) {
        case undefined:
          return "normal";
        case connectorType:
          return "initializing";
      }
      return "neglected";
    },
    [active, connector, connectingConnector]
  );

  const renderConnectorIcon = useCallback((type: connectorType) => {
    switch (type) {
      case "metamask":
        return <MetamaskIcon height={40} width={40} />;
      case "walletConnect":
        return <WalletConnectIcon height={40} width={40} />;
    }
  }, []);

  const renderConnectorButton = useCallback(
    (type: connectorType, title: string) => (
      <ConnectorButton
        role="button"
        onClick={() => handleConnect(type)}
        status={getConnectorStatus(type)}
      >
        {renderConnectorIcon(type)}
        <ConnectorButtonText>
          {connectingConnector === type ? initializingText : title}
        </ConnectorButtonText>
        {getConnectorStatus(type) === "connected" && (
          <IndicatorContainer>
            <Indicator connected={active} />
          </IndicatorContainer>
        )}
      </ConnectorButton>
    ),
    [
      active,
      connectingConnector,
      getConnectorStatus,
      initializingText,
      renderConnectorIcon,
      handleConnect,
    ]
  );

  return (
    <BaseModal show={show} onHide={onClose} centered>
      <BaseModalHeader closeButton>
        <Title>CONNECT WALLET</Title>
      </BaseModalHeader>
      <Modal.Body>
        {renderConnectorButton("metamask", "METAMASK")}
        {renderConnectorButton("walletConnect", "WALLET CONNECT")}
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
