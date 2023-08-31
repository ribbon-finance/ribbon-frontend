import React, { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

import {
  injectedConnector,
  getWalletConnectConnector,
  walletlinkConnector,
} from "../../utils/connectors";

import { ConnectorButtonProps, connectorType } from "./types";
import Indicator from "../Indicator/Indicator";
import { BaseButton, BaseModalContentColumn, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import {
  MetamaskIcon,
  WalletConnectIcon,
  WalletLinkIcon,
} from "../../assets/icons/connector";
import useLoadingText from "../../hooks/useLoadingText";
import BasicModal from "../Common/BasicModal";
import useConnectWalletModal from "../../hooks/useConnectWalletModal";
import LearnMoreWallet from "./LearnMoreWallet";
import { EthereumWallet, Wallet } from "../../models/wallets";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import { useChain } from "../../hooks/chainContext";

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

const WalletConnectModal: React.FC = () => {
  const {
    connector,
    provider,
    account,
    isActive,
  } = useWeb3React();

  const { activate } = useWeb3Wallet();
  const [connectingConnector, setConnectingConnector] =
    useState<connectorType>();
  const [selectedWallet, setWallet] = useState<Wallet | undefined>();

  const [ chain ] = useChain();
  const initializingText = useLoadingText();

  const [show, setShow] = useConnectWalletModal();

  const onClose = useCallback(() => {
    setShow(false);
  }, [setShow]);

  const handleConnect = useCallback(
    async (type: connectorType) => {
      setConnectingConnector(type);
      // Connect wallet
      switch (type) {
        case "metamask":
          await activate(EthereumWallet.Metamask, chain);
          break;
        case "walletConnect":
          await activate(EthereumWallet.WalletConnect, chain);
          break;
        case "walletLink":
          await activate(EthereumWallet.WalletLink, chain);
      }
      setConnectingConnector(undefined);
    },
    [activate, chain]
  );

  useEffect(() => {
    if (provider && account) {
      onClose();
    }
  }, [provider, account, onClose]);

  const getConnectorStatus = useCallback(
    (connectorType: connectorType) => {
      // If connected, check if current button is connected
      if (provider) {
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
    [provider, connectingConnector, connector]
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
          {connectingConnector === type ? initializingText : title}
        </ConnectorButtonText>
        {getConnectorStatus(type) === "connected" && (
          <IndicatorContainer>
            <Indicator connected={isActive} />
          </IndicatorContainer>
        )}
      </ConnectorButton>
    ),
    [getConnectorStatus, renderConnectorIcon, connectingConnector, initializingText, isActive, handleConnect]
  );

  return (
    <BasicModal show={show} onClose={onClose} height={354} maxWidth={500}>
      <>
        <BaseModalContentColumn marginTop={8}>
          <Title>CONNECT WALLET</Title>
        </BaseModalContentColumn>
        <BaseModalContentColumn>
          {renderConnectorButton("metamask", "METAMASK")}
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={16}>
          {renderConnectorButton("walletConnect", "WALLET CONNECT")}
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={16}>
          {renderConnectorButton("walletLink", "COINBASE WALLET")}
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={16}>
          <LearnMoreWallet />
        </BaseModalContentColumn>
      </>
    </BasicModal>
  );
};

export default WalletConnectModal;
