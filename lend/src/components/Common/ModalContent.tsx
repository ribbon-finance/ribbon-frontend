import { useMemo } from "react";
import { motion } from "framer-motion";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { URLS } from "shared/lib/constants/constants";
import styled, { css } from "styled-components";
import ExternalLinkIcon from "./ExternalLinkIcon";
import twitter from "../../assets/icons/socials/twitter.svg";
import discord from "../../assets/icons/socials/discord.svg";
import github from "../../assets/icons/socials/github.svg";
import { ProductDisclaimer } from "../ProductDisclaimer";
import { ModalContentEnum } from "./LendModal";
import { BaseLink } from "../../designSystem";

const TextContent = styled.div`
  color: ${colors.primaryText}A3;
  padding: 16px 24px;
  overflow: hidden;
  font-size: 16px;
`;

const hoveredContentRow = css`
  cursor: pointer;
  transition: 0.2s ease-in-out;
  border: 1px solid ${colors.primaryText} !important;
  box-shadow: inset 0 0 5px ${colors.primaryText};
`;

const ContentRow = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 24px;
  font-size: 14px;
  transition: 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
  }

  ${({ active }) => {
    if (active) return hoveredContentRow;
  }}

  > img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }
`;

const CommunityContentRow = styled(ContentRow)`
  border: 1px solid transparent;

  &:hover {
    > svg:last-of-type {
      transform: translate(4px, -4px);
    }
  }

  > svg {
    transition: all 0.2s ease-in-out;

    &:first-of-type {
      margin-right: 20px;
      height: 40px;
      width: 40px;
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

const Point = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const BulletPoint = styled.div<{ hide?: boolean }>`
  display: flex;
  align-items: center;
  border-radius: 100px;
  width: 4px;
  height: 4px;
  background: ${(props) =>
    props.hide ? "transparent" : `${colors.primaryText}A3`};
  margin-left: 8px;
  margin-right: 8px;
`;

const AboutFooterText = styled.div`
  margin-top: 16px;
  font-size: 12px;
  > * {
    margin: auto 0;
  }

  svg {
    transition: all 0.2s ease-in-out;
    margin-left: 4px;
    opacity: 0.64;
  }

  > a {
    color: ${colors.primaryText}A3;
    text-decoration: underline;

    &:hover {
      svg {
        transform: translate(2px, -2px);
      }
    }
  }
`;

const Highlight = styled.text`
  color: ${colors.primaryText};
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
      default:
        return null;
    }
  }, [content]);

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
      <>
        <p>
          Ribbon Lend is Ribbon Finance’s second product line alongside Ribbon
          pools. Ribbon Lend allows depositors to lend unsecured to KYC/AML’d
          institutional market makers of their choosing with high liquidity.
          Ribbon Lend offers the best of both worlds between TradFi and DeFi:
        </p>
        <Point>
          <BulletPoint />
          <Highlight>High yields</Highlight>
          &nbsp;from unsecured lending
        </Point>
        <Point>
          <BulletPoint />
          <Highlight>No lockups</Highlight>
          &nbsp;from Aave’s money
        </Point>
        <Point>
          <BulletPoint hide={true} />
          market model
        </Point>
        <Point>
          <BulletPoint />
          <Highlight>Off-chain enforcement/credit</Highlight>
        </Point>
        <Point>
          <BulletPoint hide={true} />
          <Highlight>enforcement</Highlight>
        </Point>
        <Point>
          <BulletPoint />
          <Highlight>Built-in insurance</Highlight>
        </Point>
        <AboutFooterText>
          <BaseLink
            to="https://www.research.ribbon.finance/blog/introducing-ribbon-lend"
            target="_blank"
            rel="noreferrer noopener"
          >
            Learn more about Ribbon Lend
            <ExternalLinkIcon />
          </BaseLink>
        </AboutFooterText>
      </>
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
        <CommunityContentRow onClick={() => window.open(link.url)}>
          <img src={link.img} alt={link.title} />
          <Title>{link.title}</Title>
          <ExternalLinkIcon />
        </CommunityContentRow>
      ))}
      <ContentFooter>
        <ProductDisclaimer />
      </ContentFooter>
    </ContentWrapper>
  );
};
