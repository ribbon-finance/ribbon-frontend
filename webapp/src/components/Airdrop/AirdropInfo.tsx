import React, { useCallback, useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import styled, { keyframes } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

import Logo from "shared/lib/assets/icons/logo";
import {
  BaseLink,
  BaseModalContentColumn,
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
import useAirdrop from "../../hooks/useAirdrop";
import AirdropBreakdown from "./AirdropBreakdown";

const rotate = keyframes`
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(360deg);
  }
`;

const RotatingLogo = styled(Logo)`
  animation: ${rotate} 2.5s linear infinite;
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
  position: relative;

  &:after {
    position: absolute;
    height: 100%;
    width: 100%;
    content: " ";
    top: 0;
    left: 0;
    background-color: ${colors.background};
    border-radius: 100px;
    z-index: -1;
  }
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
          font-size: 84px;
          line-height: 84px;
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
  top: 16;
  left: 0;
  width: 100%;
  height: calc(100% - 32px);
  background: ${colors.background};
  padding: 0 16px;
  z-index: 10;
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
  z-index: 10;
`;

const BackgroundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const marquee = keyframes`
  from {
    transform: translateX(750px);
  }

  to {
    transform: translateX(-750px);
  }
`;

const BackgroundText = styled(Title)`
  font-size: 160px;
  color: ${colors.primaryText}0A;
  animation: ${marquee} 30s linear infinite;
  white-space: nowrap;
`;

interface AirdropInfoProps {
  onClaim: () => void;
}

const AirdropInfo: React.FC<AirdropInfoProps> = ({ onClaim }) => {
  const { account } = useWeb3React();
  const [, setShowConnectModal] = useConnectWalletModal();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const airdrop = useAirdrop();

  const airdropAmountStr = useMemo(() => {
    if (!airdrop) {
      return "0";
    }

    return airdrop.total.toLocaleString();
  }, [airdrop]);

  const renderTopLogo = useCallback(
    () => (
      <BaseModalContentColumn>
        <RotatingLogo height="64px" width="64px" />
      </BaseModalContentColumn>
    ),
    []
  );

  const readMore = useMemo(
    () => (
      <LearnMoreLink
        to="https://ribbonfinance.medium.com/rbn-airdrop-distribution-70b6cb0b870c"
        target="_blank"
        rel="noreferrer noopener"
      >
        <PrimaryText>Read about $RBN</PrimaryText>
        <LearnMoreIcon height="20px" width="20px" color="white" />
      </LearnMoreLink>
    ),
    []
  );

  const renderInfo = useCallback(() => {
    if (!account) {
      return (
        <>
          {renderTopLogo()}
          <BaseModalContentColumn marginTop={64}>
            <UnclaimLabel>UNCLAIMED $RBN</UnclaimLabel>
          </BaseModalContentColumn>
          <BaseModalContentColumn marginTop={8}>
            <UnclaimData variant="small">---</UnclaimData>
          </BaseModalContentColumn>
          <BaseModalContentColumn marginTop={16}>
            <Description>
              Please connect your wallet to check for unclaimed $RBN
            </Description>
          </BaseModalContentColumn>
          <BaseModalContentColumn marginTop="auto">
            {readMore}
          </BaseModalContentColumn>
          <BaseModalContentColumn>
            <ConnectWalletButton
              onClick={() => setShowConnectModal(true)}
              type="button"
              className="btn py-3 mb-2"
            >
              Connect Wallet
            </ConnectWalletButton>
          </BaseModalContentColumn>
        </>
      );
    }

    return (
      <>
        {renderTopLogo()}
        <BaseModalContentColumn marginTop={64}>
          <UnclaimLabel>UNCLAIMED $RBN</UnclaimLabel>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={8}>
          <UnclaimData variant="big">{airdropAmountStr}</UnclaimData>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={16}>
          <ViewBreakdownPill
            role="button"
            onClick={() => setShowBreakdown(true)}
          >
            <ViewBreakdownPillText>View Breakdown</ViewBreakdownPillText>
            <BarChartIcon width="20px" height="20px" color={colors.green} />
          </ViewBreakdownPill>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop="auto">
          {readMore}
        </BaseModalContentColumn>
        <BaseModalContentColumn>
          <ActionButton
            className="btn py-3 mb-2"
            onClick={onClaim}
            disabled={!airdrop?.total}
          >
            CLAIM $RBN
          </ActionButton>
        </BaseModalContentColumn>
      </>
    );
  }, [
    account,
    renderTopLogo,
    setShowConnectModal,
    airdropAmountStr,
    onClaim,
    airdrop,
    readMore,
  ]);

  const renderBreakdown = useCallback(
    () => (
      <>
        <BaseModalContentColumn>
          <UnclaimLabel>UNCLAIMED $RBN</UnclaimLabel>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={24}>
          <UnclaimData variant="small">{airdropAmountStr}</UnclaimData>
        </BaseModalContentColumn>
        <BaseModalContentColumn>
          <AirdropBreakdown />
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop="auto">
          {readMore}
        </BaseModalContentColumn>
        <HideBreakdownButton
          role="button"
          onClick={() => setShowBreakdown(false)}
        >
          <ButtonArrow isOpen={false} />
        </HideBreakdownButton>
      </>
    ),
    [airdropAmountStr, readMore]
  );

  return (
    <>
      {renderInfo()}
      <BackgroundContainer>
        <BackgroundText>$RBN AIRDROP</BackgroundText>
      </BackgroundContainer>
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
