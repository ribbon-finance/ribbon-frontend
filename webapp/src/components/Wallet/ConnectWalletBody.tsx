import React, { useCallback } from "react";
import styled from "styled-components";
import {
  EthereumWallet,
  SolanaWallet,
  Wallet,
  WALLET_TITLES,
} from "../../models/wallets";
import { ConnectorButtonProps } from "./types";
import { ConnectorButtonStatus } from "./types";
import {
  BaseButton,
  BaseIndicator,
  BaseModalContentColumn,
  Title,
} from "shared/lib/designSystem";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import {
  MetamaskIcon,
  PhantomIcon,
  SolflareIcon,
  WalletConnectIcon,
  WalletLinkIcon,
} from "shared/lib/assets/icons/connector";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { BackIcon } from "shared/lib/assets/icons/icons";

const ModalContainer = styled.div`
  padding: 10px 0px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`;

const BackButton = styled(BaseButton)`
  position: absolute;
  left: 16px;
  padding: 0;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  color: ${colors.text};
  align-items: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  justify-content: center;
  cursor: pointer;
  opacity: ${theme.hover.opacity};
  transition: 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const ConnectorButton = styled(BaseButton)<ConnectorButtonProps>`
  background-color: ${colors.background.three};
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  height: 56px;

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

const StyledBaseIndicator = styled(BaseIndicator)`
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

const ConnectorButtonPill = styled(ConnectorButton)`
  border-radius: 100px;
  margin-bottom: 16px;

  ${(props) => {
    switch (props.status) {
      case "connected":
      case "initializing":
        return `
          border: ${theme.border.width} ${theme.border.style} ${props.color};
        `;
      default:
        return `border: ${theme.border.width} ${theme.border.style} transparent`;
    }
  }}
`;

const ConnectWalletBody: React.FC<{
  onSelectWallet: (wallet: Wallet) => void;
  onBack: () => void;
  selectedWallet: Wallet | undefined;
  connectingWallet: Wallet | undefined;
  wallets: Wallet[];
}> = ({
  onSelectWallet,
  onBack,
  selectedWallet,
  connectingWallet,
  wallets,
}) => {
  const getWalletStatus = useCallback(
    (wallet: Wallet): ConnectorButtonStatus => {
      if (selectedWallet === wallet) {
        return "connected";
      }

      if (!connectingWallet) {
        return "normal";
      } else if (connectingWallet === wallet) {
        return "initializing";
      }

      return "neglected";
    },
    [selectedWallet, connectingWallet]
  );

  return (
    <ModalContainer>
      <TitleContainer>
        <BackButton onClick={() => onBack()}>
          <BackIcon />
        </BackButton>
        <Title>Connect Wallet</Title>
      </TitleContainer>
      {wallets.map((wallet: Wallet, index: number) => {
        return (
          <BaseModalContentColumn key={index} marginTop={0}>
            <WalletButton
              wallet={wallet as Wallet}
              status={getWalletStatus(wallet as Wallet)}
              onConnect={async () => onSelectWallet(wallet as Wallet)}
            ></WalletButton>
          </BaseModalContentColumn>
        );
      })}
    </ModalContainer>
  );
};

export default ConnectWalletBody;

interface WalletButtonProps {
  wallet: Wallet;
  status: ConnectorButtonStatus;
  onConnect: () => Promise<void>;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  wallet,
  status,
  onConnect,
}) => {
  const initializingText = useLoadingText();

  const title = WALLET_TITLES[wallet];
  const walletColors = {
    [EthereumWallet.Metamask]: colors.wallets.Metamask,
    [EthereumWallet.WalletConnect]: colors.wallets.WalletConnect,
    [EthereumWallet.WalletLink]: colors.wallets.WalletLink,
    [SolanaWallet.Phantom]: colors.wallets.Phantom,
    [SolanaWallet.Solflare]: colors.wallets.Solflare,
  };

  return (
    <ConnectorButtonPill
      role="button"
      onClick={onConnect}
      status={status}
      color={walletColors[wallet]}
    >
      <WalletIcon wallet={wallet}></WalletIcon>
      <ConnectorButtonText>
        {status === "initializing" ? initializingText : title}
      </ConnectorButtonText>
      {status === "connected" && (
        <StyledBaseIndicator
          size={8}
          color={walletColors[wallet]}
        ></StyledBaseIndicator>
      )}
    </ConnectorButtonPill>
  );
};

const WalletIcon: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
  switch (wallet) {
    case EthereumWallet.Metamask:
      return <MetamaskIcon height={32} width={32} />;
    case EthereumWallet.WalletConnect:
      return <WalletConnectIcon height={32} width={32} />;
    case EthereumWallet.WalletLink:
      return <StyledWalletLinkIcon height={32} width={32} />;
    case SolanaWallet.Phantom:
      return <PhantomIcon height={32} width={32} />;
    case SolanaWallet.Solflare:
      return <SolflareIcon height={32} width={32} />;
    default:
      return null;
  }
};
