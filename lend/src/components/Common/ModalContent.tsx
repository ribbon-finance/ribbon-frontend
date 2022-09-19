import { useCallback, useEffect, useMemo, useState } from "react";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { getExplorerURI, URLS } from "shared/lib/constants/constants";
import styled, { css } from "styled-components";
import ExternalLinkIcon from "./ExternalLinkIcon";
import twitter from "../../assets/icons/socials/twitter.svg";
import etherscan from "../../assets/icons/socials/etherscan.svg";
import discord from "../../assets/icons/socials/discord.svg";
import github from "../../assets/icons/socials/github.svg";
import disconnect from "../../assets/icons/disconnect.svg";
import { ProductDisclaimer } from "../ProductDisclaimer";
import { ModalContentEnum } from "./LendModal";
import WalletLogo from "shared/lib/components/Wallet/WalletLogo";
import LearnMoreWallet from "shared/lib/components/Wallet/LearnMoreWallet";
import { Button } from "../../designSystem";
import { motion } from "framer-motion";
import {
  EthereumWallet,
  ETHEREUM_WALLETS,
  WALLET_TITLES,
} from "shared/lib/models/wallets";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import { Chains } from "../../constants/constants";
import { AssetsList } from "../../store/types";
import { getAssetDisplay, getAssetLogo } from "../../utils/asset";
import currency from "currency.js";

const TextContent = styled.div`
  color: ${colors.primaryText}A3;
  padding: 16px 24px;
`;

const hoveredContentRow = css`
  cursor: pointer;
  transition: 0.2s ease-in-out;
  border: 1px solid ${colors.primaryText} !important;
  box-shadow: inset 0 0 5px ${colors.primaryText};

  > svg:last-of-type {
    transform: translate(4px, -4px);
  }
`;

const ContentRow = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 24px;
  font-size: 14px;
  transition: 0.2s ease-in-out;
  border: 1px solid transparent;

  &:hover {
    ${hoveredContentRow}
  }

  ${({ active }) => {
    if (active) return hoveredContentRow;
  }}

  > img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }

  > svg {
    transition: all 0.2s ease-in-out;

    &:first-of-type {
      margin-right: 20px;
    }

    &:last-of-type {
      margin-left: 8px;
      width: 20px;
      height: 20px;
    }
  }
`;

const ContentWrapper = styled.div`
  > ${ContentRow} {
    &:not(:last-of-type) {
      border-bottom: 1px solid ${colors.primaryText}1F;
    }
  }
`;

const ContentFooter = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0;
  font-size: 14px;
`;

interface ModalContentProps {
  content?: ModalContentEnum;
  onHide: () => void;
}

export const ModalContent = ({ content, onHide }: ModalContentProps) => {
  const modalContent = useMemo(() => {
    switch (content) {
      case ModalContentEnum.ABOUT:
        return <AboutPage />;
      case ModalContentEnum.COMMUNITY:
        return <CommunityPage />;
      case ModalContentEnum.WALLET:
        return <WalletPage onHide={onHide} />;
      default:
        return null;
    }
  }, [content, onHide]);

  return (
    <motion.div
      key={content}
      transition={{
        delay: 0.2,
        duration: 0.5,
        type: "keyframes",
        ease: "easeInOut",
      }}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      {modalContent}
    </motion.div>
  );
};

const AboutPage = () => {
  return (
    <TextContent>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus
      sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus
      dolor purus non enim praesent elementum facilisis leo, vel fringilla est
      ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis
      scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu
      volutpat odio facilisis mauris sit amet massa vitae tortor condimentum
      lacinia
    </TextContent>
  );
};

interface CommunityLink {
  title: string;
  img: string;
  url: string;
}

const CommunityPage = () => {
  const links: CommunityLink[] = [
    {
      title: "Twitter",
      img: twitter,
      url: URLS.twitter,
    },
    {
      title: "Discord",
      img: discord,
      url: URLS.discord,
    },
    {
      title: "Github",
      img: github,
      url: URLS.github,
    },
  ];

  return (
    <ContentWrapper>
      {links.map((link) => (
        <ContentRow onClick={() => window.open(link.url)}>
          <img src={link.img} alt={link.title} />
          <Title>{link.title}</Title>
          <ExternalLinkIcon />
        </ContentRow>
      ))}
      <ContentFooter>
        <ProductDisclaimer />
      </ContentFooter>
    </ContentWrapper>
  );
};

enum WalletPageEnum {
  DISCLAIMER,
  CONNECT_WALLET,
  ACCOUNT,
}

const ButtonWrapper = styled.div`
  border-top: 1px solid ${colors.primaryText}1F;
  display: block;
  width: 100%;
  padding: 16px 24px;
  text-align: center;

  a {
    display: block;
    margin-top: 16px;
  }

  > * {
    width: 100%;
  }
`;

const ContinueButton = styled(Button)`
  background-color: ${colors.primaryText};
  color: #000000;
  height: 64px;
`;

const ConnectButton = styled(Button)`
  background: ${colors.buttons.secondaryBackground};
  color: ${colors.buttons.secondaryText};
  border: none;
  padding: 12px 30px;
  height: 64px;

  &:disabled {
    opacity: 0.6 !important;
    cursor: default !important;
  }
`;

const ContentLogoWrapper = styled.div`
  background-color: ${colors.background.three};
  padding: 8px;
  margin-right: 16px;
  border-radius: 8px;

  img {
    width: 24px;
    height: 24px;
  }
`;

const AssetRowWrapper = styled.div`
  border-bottom: 1px solid ${colors.primaryText}1F;
`;

const AssetRow = styled.div`
  display: flex;
  padding: 24px;
`;

const AssetStat = styled.div`
  display: block;
  flex-direction: column;
  text-transform: uppercase;
  margin-left: 16px;

  > * {
    display: flex;
    font-family: VCR;
    line-height: 1;
  }

  label {
    color: ${colors.tertiaryText};
    font-size: 10px;
  }

  span {
    color: white;
  }
`;

interface WalletPageProps {
  onHide: () => void;
}

const WalletPage = ({ onHide }: WalletPageProps) => {
  const [page, setPage] = useState<WalletPageEnum>(WalletPageEnum.DISCLAIMER);
  const [selectedWallet, setWallet] = useState<EthereumWallet>();
  const { active, account, activate, deactivate } = useWeb3Wallet();

  useEffect(() => {
    setTimeout(() => {
      if (active) setPage(WalletPageEnum.ACCOUNT);
    }, 200);
  });

  const onActivate = useCallback(async () => {
    if (selectedWallet) {
      try {
        await activate(selectedWallet as EthereumWallet, Chains.Ethereum);
        onHide();
      } catch (error) {
        console.error(error);
      }
    }
  }, [activate, onHide, selectedWallet]);

  const content = useMemo(() => {
    if (page === WalletPageEnum.DISCLAIMER) {
      return (
        <ContentWrapper>
          <TextContent>
            By continuing, you are confirming that you are not a resident of the
            following countries: United States of America, Belarus, Cuba,
            Democratic People's Republic of Korea (DPRK), Democratic Republic of
            Congo, Iran, Iraq, Lebanon, Libya, Mali, Myanmar, Nicaragua, Russia,
            Somalia, South Sudan, Sudan, Syria.
          </TextContent>
          <ButtonWrapper>
            <ContinueButton
              onClick={() => setPage(WalletPageEnum.CONNECT_WALLET)}
            >
              Continue
            </ContinueButton>
          </ButtonWrapper>
        </ContentWrapper>
      );
    }

    if (page === WalletPageEnum.CONNECT_WALLET) {
      return (
        <>
          <ContentWrapper>
            {ETHEREUM_WALLETS.map((wallet) => (
              <ContentRow
                key={wallet}
                active={selectedWallet === wallet}
                onClick={() => setWallet(wallet)}
              >
                <WalletLogo wallet={wallet} />
                <Title>{WALLET_TITLES[wallet]}</Title>
                <ExternalLinkIcon />
              </ContentRow>
            ))}
          </ContentWrapper>
          <ButtonWrapper>
            <ConnectButton
              disabled={!!!selectedWallet}
              onClick={() => onActivate()}
            >
              Connect Wallet
            </ConnectButton>
            <LearnMoreWallet />
          </ButtonWrapper>
        </>
      );
    }

    if (page === WalletPageEnum.ACCOUNT) {
      const actions = [
        {
          img: etherscan,
          title: "Change wallet",
          showExternalIcon: false,
          onClick: async () => {
            await deactivate().then(() => {
              setPage(WalletPageEnum.CONNECT_WALLET);
            });
          },
        },
        {
          img: etherscan,
          title: "Etherscan",
          showExternalIcon: true,
          onClick: () => window.open(getExplorerURI(Chains.Ethereum)),
        },
        {
          img: disconnect,
          title: "Disconnect",
          showExternalIcon: false,
          onClick: async () => {
            await deactivate().then(() => {
              onHide();
            });
          },
        },
      ];

      return (
        <>
          <AssetRowWrapper>
            {AssetsList.map((asset) => {
              const Logo = getAssetLogo(asset);
              const name = getAssetDisplay(asset);

              return (
                <AssetRow>
                  <Logo height={40} width={40} />
                  <AssetStat>
                    <label>{name} Balance</label>
                    <span>{currency(0).format({ symbol: "" })}</span>
                  </AssetStat>
                </AssetRow>
              );
            })}
          </AssetRowWrapper>
          <ContentWrapper>
            {actions.map((action) => (
              <ContentRow onClick={() => action.onClick()}>
                <ContentLogoWrapper>
                  <img src={action.img} alt={action.title} />
                </ContentLogoWrapper>
                <Title>{action.title}</Title>
                {action.showExternalIcon && <ExternalLinkIcon />}
              </ContentRow>
            ))}
          </ContentWrapper>
        </>
      );
    }

    return <></>;
  }, [deactivate, onActivate, onHide, page, selectedWallet]);

  return content;
};
