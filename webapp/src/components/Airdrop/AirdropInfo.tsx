import React, { useCallback, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import styled, { keyframes } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

import Logo from "shared/lib/assets/icons/logo";
import {
  BaseLink,
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import { BarChartIcon, ExternalIcon } from "shared/lib/assets/icons/icons";
import colors from "shared/lib/designSystem/colors";
import {
  ActionButton,
  ConnectWalletButton,
} from "shared/lib/components/Common/buttons";
import useConnectWalletModal from "../../hooks/useConnectWalletModal";
import theme from "shared/lib/designSystem/theme";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";

type BreakdownVariant = "charm" | "hegic" | "opyn" | "discord" | "ribbon";

const getBreakdownVariantColor = (variant: BreakdownVariant) => {
  switch (variant) {
    case "charm":
      return colors.brands.charm;
    case "discord":
      return colors.brands.discord;
    case "hegic":
      return colors.brands.hegic;
    case "opyn":
      return colors.brands.opyn;
    case "ribbon":
      return colors.red;
  }
};

const ContentColumn = styled.div<{ marginTop?: number | "auto" }>`
  display: flex;
  justify-content: center;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop || 24}px`};
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const RotatingLogo = styled(Logo)`
  animation: ${rotate} 4s linear infinite;
`;

const UnclaimLabel = styled(Subtitle)`
  color: ${colors.text};
  letter: 1.5px;
`;

const Description = styled(SecondaryText)`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
`;

const ViewBreakdownPill = styled.div`
  display: flex;
  background: ${colors.green}14;
  padding: 8px 16px;
  border-radius: 100px;
`;

const ViewBreakdownPillText = styled(Subtitle)`
  color: ${colors.green}A3;
  margin-right: 8px;
`;

const UnclaimData = styled(Title)<{ variant: "big" | "small" }>`
  ${(props) => {
    switch (props.variant) {
      case "big":
        return `
          font-size: 96px;
          line-height: 96px;
        `;
      case "small":
        return `
          font-size: 64px;
          line-height: 64px;
        `;
    }
  }}
`;

const LearnMoreLink = styled(BaseLink)`
  display: flex;
  align-items: center;

  span {
    text-decoration: underline;
  }
`;

const LearnMoreIcon = styled(ExternalIcon)`
  margin-left: 8px;
`;

const BreakdownContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  position: absolute;
  top: -16px;
  left: 0;
  width: 100%;
  height: calc(100%);
  background: ${colors.background};
  padding: 0 16px;
  z-index: 2;
`;

const HideBreakdownButton = styled.div`
  position: absolute;
  top: 0;
  left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 48px;
  color: ${colors.text};
`;

const BreakdownPill = styled.div<{
  variant: BreakdownVariant;
  entitled: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin: 0 16px;
  width: 100%;
  background: ${(props) => getBreakdownVariantColor(props.variant)}14;
  border: ${theme.border.width} ${theme.border.style}
    ${(props) => getBreakdownVariantColor(props.variant)};
  border-radius: 100px;
  opacity: ${(props) => (props.entitled ? "1" : "0.24")};
`;

const BreakdwonPillIndicator = styled.div<{ variant: BreakdownVariant }>`
  height: 8px;
  width: 8px;
  background: ${(props) => getBreakdownVariantColor(props.variant)};
  margin-right: 8px;
  border-radius: 4px;
`;

const BreakdownPillToken = styled(Subtitle)<{ variant: BreakdownVariant }>`
  color: ${(props) => getBreakdownVariantColor(props.variant)};
  margin-left: auto;
`;

const AirdropInfo = () => {
  const { account } = useWeb3React();
  const [, setShowConnectModal] = useConnectWalletModal();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const renderTopLogo = useCallback(
    () => (
      <ContentColumn marginTop={-8}>
        <RotatingLogo height="64px" width="64px" />
      </ContentColumn>
    ),
    []
  );

  const renderInfo = useCallback(() => {
    if (!account) {
      return (
        <>
          {renderTopLogo()}
          <ContentColumn marginTop={64}>
            <UnclaimLabel>UNCLAIMED $RIBBON</UnclaimLabel>
          </ContentColumn>
          <ContentColumn marginTop={8}>
            <UnclaimData variant="small">---</UnclaimData>
          </ContentColumn>
          <ContentColumn marginTop={16}>
            <Description>
              Please connect your wallet to check for unclaimed $RIBBON
            </Description>
          </ContentColumn>
          <ContentColumn marginTop="auto">
            <LearnMoreLink to="https://ribbon.finance/faq">
              <PrimaryText>Read about $RIBBON</PrimaryText>
              <LearnMoreIcon height="20px" width="20px" color="white" />
            </LearnMoreLink>
          </ContentColumn>
          <ContentColumn>
            <ConnectWalletButton
              onClick={() => setShowConnectModal(true)}
              type="button"
              className="btn py-3 mb-2"
            >
              Connect Wallet
            </ConnectWalletButton>
          </ContentColumn>
        </>
      );
    }

    return (
      <>
        {renderTopLogo()}
        <ContentColumn marginTop={64}>
          <UnclaimLabel>UNCLAIMED $RIBBON</UnclaimLabel>
        </ContentColumn>
        <ContentColumn marginTop={8}>
          <UnclaimData variant="big">0</UnclaimData>
        </ContentColumn>
        <ContentColumn marginTop={16}>
          <ViewBreakdownPill
            role="button"
            onClick={() => setShowBreakdown(true)}
          >
            <ViewBreakdownPillText>View Breakdown</ViewBreakdownPillText>
            <BarChartIcon width="20px" height="20px" color={colors.green} />
          </ViewBreakdownPill>
        </ContentColumn>
        <ContentColumn marginTop="auto">
          <LearnMoreLink to="https://ribbon.finance/faq">
            <PrimaryText>Read about $RIBBON</PrimaryText>
            <LearnMoreIcon height="20px" width="20px" color="white" />
          </LearnMoreLink>
        </ContentColumn>
        <ContentColumn>
          <ActionButton className="btn py-3 mb-2">CLAIM $RIBBON</ActionButton>
        </ContentColumn>
      </>
    );
  }, [account, renderTopLogo, setShowConnectModal]);

  const renderBreakdownPill = useCallback(
    (
      title: string,
      token: number,
      entitled: boolean,
      variant: BreakdownVariant,
      first: boolean
    ) => (
      <ContentColumn marginTop={first ? 24 : 16}>
        <BreakdownPill variant={variant} entitled={entitled}>
          <BreakdwonPillIndicator variant={variant} />
          <Subtitle>{title}</Subtitle>
          <BreakdownPillToken variant={variant}>{token} BRN</BreakdownPillToken>
        </BreakdownPill>
      </ContentColumn>
    ),
    []
  );

  const renderBreakdown = useCallback(
    () => (
      <>
        <ContentColumn>
          <UnclaimLabel>UNCLAIMED $RIBBON</UnclaimLabel>
        </ContentColumn>
        <ContentColumn marginTop={8}>
          <UnclaimData variant="small">320</UnclaimData>
        </ContentColumn>
        {renderBreakdownPill("Charm Option Seller", 15, false, "charm", true)}
        {renderBreakdownPill("HEGIC OPTION SELLER", 15, true, "hegic", false)}
        {renderBreakdownPill("OPYN OPTION SELLER", 15, false, "opyn", false)}
        {renderBreakdownPill("DISCORD CONTRIBUTER", 45, true, "discord", false)}
        {renderBreakdownPill("STRANGLE BUYER", 60, true, "ribbon", false)}
        {renderBreakdownPill("VAULT USER", 85, true, "ribbon", false)}
        {renderBreakdownPill("VAULT USER BONUS", 85, true, "ribbon", false)}
        <ContentColumn marginTop={24}>
          <LearnMoreLink to="https://ribbon.finance/faq">
            <PrimaryText>Read about $RIBBON</PrimaryText>
            <LearnMoreIcon height="20px" width="20px" color="white" />
          </LearnMoreLink>
        </ContentColumn>
        <HideBreakdownButton
          role="button"
          onClick={() => setShowBreakdown(false)}
        >
          <ButtonArrow isOpen={false} />
        </HideBreakdownButton>
      </>
    ),
    [renderBreakdownPill]
  );

  return (
    <>
      {renderInfo()}
      <AnimatePresence>
        {showBreakdown && (
          <BreakdownContainer
            key={showBreakdown ? 1 : 0}
            transition={{
              duration: 0.25,
              type: "keyframes",
              ease: "easeInOut",
            }}
            initial={{
              y: 100,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: 100,
              opacity: 0,
            }}
          >
            {renderBreakdown()}
          </BreakdownContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default AirdropInfo;
