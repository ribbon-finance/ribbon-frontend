import { useCallback, useEffect, useMemo, useState } from "react";
import { BaseButton, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { URLS } from "shared/lib/constants/constants";
import styled, { css } from "styled-components";
import ExternalLinkIcon from "./ExternalLinkIcon";
import twitter from "../../assets/icons/socials/twitter.svg";
import discord from "../../assets/icons/socials/discord.svg";
import github from "../../assets/icons/socials/github.svg";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

import {
  injectedConnector,
  getWalletConnectConnector,
  walletlinkConnector,
} from "../../utils/connectors";

import { ConnectorButtonProps, connectorType } from "../Wallet/types";
import {
  MetamaskIcon,
  WalletConnectIcon,
  WalletLinkIcon,
} from "shared/lib/assets/icons/connector";
import Indicator from "shared/lib/components/Indicator/Indicator";
import theme from "../../designSystem/theme";

const AboutContent = styled.div`
  color: ${colors.primaryText}A3;
  padding: 16px 24px;
`;

const CommunityContent = styled.div`
  > div:not(:last-child) {
    border-bottom: 1px solid ${colors.primaryText}1F;
  }
`;

const CommunityContentRow = styled.div.attrs({
  className: "d-flex align-items-center",
})`
  height: 80px;
  padding: 0 24px;
  font-size: 14px;
  ${(props) => {
    if (props.onClick) {
      return css`
        &:hover {
          cursor: pointer;
          > svg {
            transform: translate(2px, -2px);
          }
        }
      `;
    }
    return "";
  }}
  > img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }
  > svg {
    transition: all 0.2s ease-in-out;
    margin-left: 8px;
    width: 20px;
    height: 20px;
  }
`;

const Footer = styled.div`
  font-size: 12px;
  color: ${colors.primaryText}52;
  flex: 1;
  text-align: center;
  svg {
    transition: all 0.2s ease-in-out;
    margin-left: 4px;
    opacity: 0.32;
  }
  > a {
    color: ${colors.primaryText}52;
    text-decoration: underline;
    &:hover {
      svg {
        transform: translate(2px, -2px);
      }
    }
  }
`;

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

const StyledWalletLinkIcon = styled(WalletLinkIcon)`
  path.outerBackground {
    fill: #0000;
  }
`;

export type ModalContentMode =
  | "about"
  | "community"
  | "connectWallet"
  | undefined;

interface ModalContentProps {
  modalContentMode: ModalContentMode;
}

export const ModalContent = ({ modalContentMode }: ModalContentProps) => {
  const {
    connector,
    activate: activateWeb3,
    library,
    account,
    active,
  } = useWeb3React();

  const [connectingConnector, setConnectingConnector] =
    useState<connectorType>();

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
          break;
        case "walletLink":
          await activateWeb3(walletlinkConnector);
      }
      setConnectingConnector(undefined);
    },
    [activateWeb3, connector, active]
  );

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
          case "walletLink":
            if (connector instanceof WalletLinkConnector) return "connected";
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
      case "walletLink":
        return <StyledWalletLinkIcon height={40} width={40} />;
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
          {connectingConnector === title}
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
      renderConnectorIcon,
      handleConnect,
    ]
  );

  const modalContent = useMemo(() => {
    if (modalContentMode === "about") {
      return (
        <AboutContent>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna fringilla urna,
          porttitor rhoncus dolor purus non enim praesent elementum facilisis
          leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim
          diam quis enim lobortis scelerisque fermentum dui faucibus in ornare
          quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet
          massa vitae tortor condimentum lacinia
        </AboutContent>
      );
    }
    if (modalContentMode === "community") {
      return (
        <CommunityContent>
          <CommunityContentRow onClick={() => window.open(URLS.twitter)}>
            <img src={twitter} alt="Twitter" />
            <Title>Twitter</Title>
            <ExternalLinkIcon />
          </CommunityContentRow>
          <CommunityContentRow onClick={() => window.open(URLS.discord)}>
            <img src={discord} alt="Discord" />
            <Title>Discord</Title>
            <ExternalLinkIcon />
          </CommunityContentRow>
          <CommunityContentRow onClick={() => window.open(URLS.github)}>
            <img src={github} alt="Github" />
            <Title>Github</Title>
            <ExternalLinkIcon />
          </CommunityContentRow>
          <CommunityContentRow
            style={{
              padding: 0,
            }}
          >
            <Footer>
              Ribbon Lend is a product build by&nbsp;
              <a
                href={URLS.ribbonFinance}
                target="_blank"
                rel="noreferrer noopener"
              >
                Ribbon Finance
                <ExternalLinkIcon />
              </a>
            </Footer>
          </CommunityContentRow>
        </CommunityContent>
      );
    }
    if (modalContentMode === "connectWallet") {
      return (
        <CommunityContent>
          <CommunityContentRow onClick={() => window.open(URLS.twitter)}>
            {renderConnectorIcon("metamask")}
            <Title>Twitter</Title>
            <ExternalLinkIcon />
          </CommunityContentRow>
          <CommunityContentRow onClick={() => window.open(URLS.discord)}>
            {renderConnectorIcon("metamask")}
            <Title>Discord</Title>
            <ExternalLinkIcon />
          </CommunityContentRow>
          <CommunityContentRow onClick={() => window.open(URLS.github)}>
            <img src={github} alt="Github" />
            <Title>Github</Title>
            <ExternalLinkIcon />
          </CommunityContentRow>
          <CommunityContentRow
            style={{
              padding: 0,
            }}
          >
            <Footer>
              Ribbon Lend is a product build by&nbsp;
              <a
                href={URLS.ribbonFinance}
                target="_blank"
                rel="noreferrer noopener"
              >
                Ribbon Finance
                <ExternalLinkIcon />
              </a>
            </Footer>
          </CommunityContentRow>
        </CommunityContent>
      );
    }
    return null;
  }, [modalContentMode]);

  return modalContent;
};
