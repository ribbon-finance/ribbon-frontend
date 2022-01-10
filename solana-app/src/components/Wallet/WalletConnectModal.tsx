import React, { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

import { ConnectorButtonProps, connectorType } from "./types";
import Indicator from "shared/lib/components/Indicator/Indicator";
import {
  BaseButton,
  BaseLink,
  BaseModalContentColumn,
  BaseText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import BasicModal from "shared/lib/components/Common/BasicModal";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import { PhantomIcon, SolflareIcon } from "../../assets/icons/wallets";

const ConnectorButton = styled(BaseButton)<ConnectorButtonProps>`
  background-color: ${colors.background.three};
  align-items: center;
  width: 100%;

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

  const [connectingConnector, setConnectingConnector] =
    useState<connectorType>();

  const initializingText = useTextAnimation(Boolean(connectingConnector), {
    texts: [
      "INITIALIZING",
      "INITIALIZING .",
      "INITIALIZING ..",
      "INITIALIZING ...",
    ],
    interval: 250,
  });

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
      //   switch (type) {
      //     case "metamask":
      //       await activateWeb3(injectedConnector);
      //       break;
      //     case "walletConnect":
      //       await activateWeb3(getWalletConnectConnector());
      //       break;
      //     case "walletLink":
      //       await activateWeb3(walletlinkConnector);
      //   }
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
          case "phantom":
            if (connector instanceof InjectedConnector) return "connected";
            break;
          case "solflare":
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
      case "phantom":
        return <PhantomIcon height={40} width={40}></PhantomIcon>;
      case "solflare":
        return <SolflareIcon height={40} width={40} />;
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
    <BasicModal show={show} onClose={onClose} height={354} maxWidth={500}>
      <>
        <BaseModalContentColumn marginTop={8}>
          <Title>CONNECT WALLET</Title>
        </BaseModalContentColumn>
        <BaseModalContentColumn>
          {renderConnectorButton("phantom", "PHANTOM")}
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={16}>
          {renderConnectorButton("solflare", "SOLFLARE")}
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={16}>
          <LearnMoreLink
            to="https://docs.solana.com/wallet-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="w-100"
          >
            <LearnMoreText>Learn more about wallets</LearnMoreText>
            <LearnMoreArrow>&#8594;</LearnMoreArrow>
          </LearnMoreLink>
        </BaseModalContentColumn>
      </>
    </BasicModal>
  );
};

export default WalletConnectModal;
