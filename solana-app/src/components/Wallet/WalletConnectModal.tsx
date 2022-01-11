import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

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
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-wallets";

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
    wallet,
    connected: active,
    connect: activateWeb3,
    connecting,
    publicKey: account,
    select: selectWallet,
  } = useWallet();

  const [connectingWallet, setConnectingWallet] = useState<connectorType>();

  const initializingText = useTextAnimation(Boolean(connecting), {
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
      let walletName: WalletName;
      switch (type) {
        case "phantom":
          walletName = WalletName.Phantom;
          break;
        case "solflare":
          walletName = WalletName.Solflare;
          break;
        default:
          throw new Error(`No wallet ${type}`);
      }
      selectWallet(walletName);
      setConnectingWallet(type);
    },
    [wallet, selectWallet, activateWeb3]
  );

  useEffect(() => {
    (async () => {
      if (connectingWallet) {
        try {
          await activateWeb3();
        } catch (e) {}
      }
    })();
  }, [connectingWallet, activateWeb3]);

  useEffect(() => {
    if (wallet && account) {
      onClose();
    }
  }, [wallet, account, onClose]);

  const getConnectorStatus = useCallback(
    (type: connectorType) => {
      if (active && wallet) {
        switch (type) {
          case "phantom":
            if (wallet.name === WalletName.Phantom) return "connected";
            break;
          case "solflare":
            if (wallet.name === WalletName.Solflare) return "connected";
            break;
        }
      }
      if (connecting && connectingWallet) {
        if (type === connectingWallet) {
          return "initializing";
        }
        return "neglected";
      }
      return "normal";
    },
    [active, wallet, connecting, connectingWallet]
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
          {getConnectorStatus(type) === "initializing"
            ? initializingText
            : title}
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
