import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import {
  EthereumWallet,
  ETHEREUM_WALLETS,
  SolanaWallet,
  SOLANA_WALLETS,
  Wallet,
  WALLET_TITLES,
} from "../../models/wallets";
import { ConnectorButtonProps } from "./types";
import { ConnectorButtonStatus } from "./types";
import { BaseButton, BaseLink, BaseModalContentColumn, BaseText, Title } from "shared/lib/designSystem";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import {
  MetamaskIcon,
  PhantomIcon,
  SolflareIcon,
  WalletConnectIcon,
  WalletLinkIcon,
} from "shared/lib/assets/icons/connector";
import Indicator from "shared/lib/components/Indicator/Indicator";
import colors from "shared/lib/designSystem/colors";
import { Chains, useChain } from "../../hooks/chainContext";
import theme from "shared/lib/designSystem/theme";
import usePrevious from "../../hooks/usePrevious";

const ModalContainer = styled.div`
  padding: 10px 16px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`;

const ConnectorButton = styled(BaseButton)<ConnectorButtonProps>`
  background-color: ${colors.background.three};
  align-items: center;
  width: 100%;
  padding: 12px 16px;

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

const StyledWalletLinkIcon = styled(WalletLinkIcon)`
  path.outerBackground {
    fill: #0000;
  }
`;

const ConnectorButtonPill = styled(ConnectorButton)`
  border-radius: 100px;
`;

const ConnectWalletBody: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activate, active, connectingWallet, connectedWallet } = useWeb3Wallet();

  // When the user wants to switch between wallets, we need to track that state
  const prevConnectedWallet = usePrevious<Wallet | undefined>(connectedWallet);

  const [chain] = useChain();

  const handleConnect = useCallback(
    async (wallet: Wallet) => {
      console.log(wallet, chain);
      await activate(wallet);
    },
    [activate]
  );

  // useEffect(() => {
  //   const changeWalletsOnSameChain =
  //     prevConnectedWallet && prevConnectedWallet !== connectedWallet;

  //   const connectNewWallet = !prevConnectedWallet && connectedWallet;

  //   // console.log(prevConnectedWallet, connectedWallet);

  //   // Change between different wallets on the same network
  //   if (changeWalletsOnSameChain || connectNewWallet) {
  //     onClose();
  //   }
  // }, [onClose, prevConnectedWallet, connectedWallet]);

  const getWalletStatus = useCallback(
    (wallet: Wallet): ConnectorButtonStatus => {
      if (connectedWallet === wallet) {
        return "connected";
      }

      if (!connectingWallet) {
        return "normal";
      } else if (connectingWallet === wallet) {
        return "initializing";
      }

      return "neglected";
    },
    [connectedWallet, connectingWallet]
  );

  const wallets: Wallet[] = useMemo(() => {
    switch (chain) {
      case Chains.Ethereum:
      case Chains.Avalanche:
        return ETHEREUM_WALLETS;
      case Chains.Solana:
        return SOLANA_WALLETS;
      case Chains.NotSelected:
      default:
        return [];
    }
  }, [chain]);

  return (
    <ModalContainer>
      <TitleContainer>
        <Title>Connect Wallet</Title>
      </TitleContainer>

      {wallets.map((wallet: Wallet, index: number) => {
        return (
          <BaseModalContentColumn key={wallet} {...(index === 0 ? {} : { marginTop: 16 })}>
            <WalletButton
              wallet={wallet as Wallet}
              status={getWalletStatus(wallet as Wallet)}
              onConnect={() => handleConnect(wallet as Wallet)}
            ></WalletButton>
          </BaseModalContentColumn>
        );
      })}

      <BaseModalContentColumn marginTop={16}>
        <LearnMoreLink
          to={chain === Chains.Solana ? "https://docs.solana.com/wallet-guide" : "https://ethereum.org/en/wallets/"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-100"
        >
          <LearnMoreText>Learn more about wallets</LearnMoreText>
          <LearnMoreArrow>&#8594;</LearnMoreArrow>
        </LearnMoreLink>
      </BaseModalContentColumn>
    </ModalContainer>
  );
};

export default ConnectWalletBody;

interface WalletButtonProps {
  wallet: Wallet;
  status: ConnectorButtonStatus;
  onConnect: () => Promise<void>;
}

const WalletButton: React.FC<WalletButtonProps> = ({ wallet, status, onConnect }) => {
  const initializingText = useTextAnimation(Boolean(status === "initializing"), {
    texts: ["INITIALIZING", "INITIALIZING .", "INITIALIZING ..", "INITIALIZING ..."],
    interval: 250,
  });

  const title = WALLET_TITLES[wallet];

  return (
    <ConnectorButtonPill role="button" onClick={onConnect} status={status}>
      <WalletIcon wallet={wallet}></WalletIcon>
      <ConnectorButtonText>{status === "initializing" ? initializingText : title}</ConnectorButtonText>
      {status === "connected" && (
        <IndicatorContainer>
          <Indicator connected={true} />
        </IndicatorContainer>
      )}
    </ConnectorButtonPill>
  );
};

const WalletIcon: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
  switch (wallet) {
    case EthereumWallet.Metamask:
      return <MetamaskIcon height={40} width={40} />;
    case EthereumWallet.WalletConnect:
      return <WalletConnectIcon height={40} width={40} />;
    case EthereumWallet.WalletLink:
      return <StyledWalletLinkIcon height={40} width={40} />;
    case SolanaWallet.Phantom:
      return <PhantomIcon height={40} width={40} />;
    case SolanaWallet.Solflare:
      return <SolflareIcon height={40} width={40} />;
    default:
      return null;
  }
};
