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
import {
  MetamaskIcon,
  WalletConnectIcon,
  WalletLinkIcon,
} from "shared/lib/assets/icons/connector";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import BasicModal from "shared/lib/components/Common/BasicModal";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import { useChain } from "../../hooks/chainContext";
import {
  EthereumWallet,
  ETHEREUM_WALLETS,
  Wallet,
  WALLET_TITLES,
} from "../../models/wallets";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import { ConnectorButtonStatus } from "./types";

type WalletStatus = "connected" | "neglected" | "initializing";

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

const StyledWalletLinkIcon = styled(WalletLinkIcon)`
  path.outerBackground {
    fill: #0000;
  }
`;

const WalletConnectModal: React.FC = () => {
  const { activate, account, active, connectingWallet, connectedWallet } =
    useWeb3Wallet();
  const [show, setShow] = useConnectWalletModal();

  const onClose = useCallback(() => {
    setShow(false);
  }, [setShow]);

  const handleConnect = useCallback(
    async (wallet: Wallet) => {
      await activate(wallet);
    },
    [activate]
  );

  useEffect(() => {
    if (active && account) {
      onClose();
    }
  }, [active, account, onClose]);

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

  return (
    <BasicModal show={show} onClose={onClose} height={354} maxWidth={500}>
      <>
        <BaseModalContentColumn marginTop={8}>
          <Title>CONNECT WALLET</Title>
        </BaseModalContentColumn>

        {ETHEREUM_WALLETS.map((wallet: Wallet | string, index: number) => {
          return (
            <BaseModalContentColumn {...(index === 0 ? {} : { marginTop: 16 })}>
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
            to="https://ethereum.org/en/wallets/"
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
  const initializingText = useTextAnimation(
    Boolean(status === "initializing"),
    {
      texts: [
        "INITIALIZING",
        "INITIALIZING .",
        "INITIALIZING ..",
        "INITIALIZING ...",
      ],
      interval: 250,
    }
  );

  const title = WALLET_TITLES[wallet];

  return (
    <ConnectorButton role="button" onClick={onConnect} status={status}>
      <WalletIcon wallet={wallet}></WalletIcon>
      <ConnectorButtonText>
        {status === "initializing" ? initializingText : title}
      </ConnectorButtonText>
      {status === "connected" && (
        <IndicatorContainer>
          <Indicator connected={true} />
        </IndicatorContainer>
      )}
    </ConnectorButton>
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
    default:
      return null;
  }
};

export default WalletConnectModal;
