import { useMemo, useState } from "react";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { URLS } from "shared/lib/constants/constants";
import styled, { css } from "styled-components";
import ExternalLinkIcon from "./ExternalLinkIcon";
import twitter from "../../assets/icons/socials/twitter.svg";
import discord from "../../assets/icons/socials/discord.svg";
import github from "../../assets/icons/socials/github.png";
import { ProductDisclaimer } from "../ProductDisclaimer";
import { ModalContentEnum } from "./LendModal";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import WalletLogo from "shared/lib/components/Wallet/WalletLogo";
import { Button } from "../../designSystem";
import { motion } from "framer-motion";
import { ETHEREUM_WALLETS, WALLET_TITLES } from "shared/lib/models/wallets";

const TextContent = styled.div`
  color: ${colors.primaryText}A3;
  padding: 16px 24px;
`;

const CommunityContent = styled.div`
  > div:not(:last-child) {
    border: 1px solid transparent;
    border-bottom: 1px solid ${colors.primaryText}1F;
  }
`;

const CommunityContentRow = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 24px;
  font-size: 14px;
  transition: 0.2s ease-in-out;
  border: 1px solid transparent;

  &:hover {
    cursor: pointer;
    transition: 0.2s ease-in-out;
    border: 1px solid ${colors.primaryText} !important;
    box-shadow: inset 0 0 5px ${colors.primaryText};

    > svg:last-of-type {
      transform: translate(4px, -4px);
    }
  }

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

const CommunityContentFooter = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0;
  font-size: 14px;
`;

interface ModalContentProps {
  content?: ModalContentEnum;
}

export const ModalContent = ({ content }: ModalContentProps) => {
  const modalContent = useMemo(() => {
    if (content === ModalContentEnum.ABOUT) return <About />;
    if (content === ModalContentEnum.COMMUNITY) return <Community />;
    if (content === ModalContentEnum.WALLET) return <Wallet />;
    return null;
  }, [content]);

  return (
    <motion.div
      key={content}
      transition={{
        delay: 0.25,
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

const About = () => {
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

const Community = () => {
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
    <CommunityContent>
      {links.map((link) => (
        <CommunityContentRow onClick={() => window.open(link.url)}>
          <img src={link.img} alt={link.title} />
          <Title>{link.title}</Title>
          <ExternalLinkIcon />
        </CommunityContentRow>
      ))}
      <CommunityContentFooter>
        <ProductDisclaimer />
      </CommunityContentFooter>
    </CommunityContent>
  );
};

enum WalletPageEnum {
  DISCLAIMER,
  CONNECT_WALLET,
  ACCOUNT,
}

const ButtonWrapper = styled.div`
  border-top: 1px solid ${colors.border};
  display: block;
  width: 100%;
  padding: 16px 24px;

  > * {
    width: 100%;
  }
`;

const ContinueButton = styled(Button)`
  background-color: ${colors.primaryText};
  color: #000000;
`;

interface Wallet {}

const Wallet = () => {
  const [page, setPage] = useState<WalletPageEnum>(WalletPageEnum.DISCLAIMER);
  const { active, account } = useWeb3Wallet();

  const content = useMemo(() => {
    if (page === WalletPageEnum.DISCLAIMER) {
      return (
        <>
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
        </>
      );
    }

    if (page === WalletPageEnum.CONNECT_WALLET) {
      return (
        <>
          {ETHEREUM_WALLETS.map((wallet) => (
            <CommunityContentRow>
              <WalletLogo wallet={wallet} />
              <Title>{WALLET_TITLES[wallet]}</Title>
              <ExternalLinkIcon />
            </CommunityContentRow>
          ))}
        </>
      );
    }

    return <></>;
  }, [page]);

  return content;
};
