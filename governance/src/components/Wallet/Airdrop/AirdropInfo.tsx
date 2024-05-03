import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useMemo, useState } from "react";
import { BarChartIcon, ExternalIcon } from "shared/lib/assets/icons/icons";
import Logo from "shared/lib/assets/icons/logo";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import {
  ActionButton,
  ConnectWalletButton,
} from "shared/lib/components/Common/buttons";
import {
  BaseLink,
  BaseModalContentColumn,
  SecondaryText,
  Subtitle,
  Title
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { GovernanceAirdropInfoData } from "shared/lib/store/types";
import styled, { keyframes } from "styled-components";
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
    background-color: ${colors.background.one};
    border-radius: 100px;
    z-index: -1;
  }
`;

const ViewBreakdownPillText = styled(Subtitle)`
  color: ${colors.green}A3;
  margin-right: 8px;
`;

const AirdropExplanationText = styled(Subtitle)`
  margin: 16px;
  text-align: center;
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
  background: ${colors.background.two};
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
  loading: boolean;
  airdropInfo?: GovernanceAirdropInfoData;
  onClaim: () => void;
}

const AirdropInfo: React.FC<AirdropInfoProps> = ({
  loading,
  airdropInfo,
  onClaim,
}) => {
  const { account } = useWeb3Wallet();
  const [, setShowConnectModal] = useConnectWalletModal();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const loadingText = useLoadingText("");

  const airdropAmountStr = useMemo(() => {
    if (!airdropInfo) {
      return "0";
    }

    return airdropInfo.total.toLocaleString();
  }, [airdropInfo]);

  const renderTopLogo = useCallback(
    () => (
      <BaseModalContentColumn>
        <RotatingLogo height="64px" width="64px" />
      </BaseModalContentColumn>
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
            <Title fontSize={64} lineHeight={64}>
              ---
            </Title>
          </BaseModalContentColumn>
          <BaseModalContentColumn marginTop={16}>
            <Description>
              Please connect your wallet to check for unclaimed $RBN
            </Description>
          </BaseModalContentColumn>
          <BaseModalContentColumn marginTop="auto">
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
          <UnclaimLabel>
            {airdropInfo?.unclaimedAmount.isZero()
              ? "CLAIMED $RBN AIRDROP"
              : "UNCLAIMED $RBN AIRDROP"}
          </UnclaimLabel>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={8}>
          <Title fontSize={56} lineHeight={56}>
            {loading ? loadingText : airdropAmountStr}
          </Title>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={16}>
          <AirdropExplanationText>
            A total of 1,933,802 RBN was distributed to accounts that locked
            their $RBN for two years.
          </AirdropExplanationText>
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
          <ActionButton
            className="btn py-3 mb-2"
            onClick={onClaim}
            disabled={airdropInfo?.unclaimedAmount.isZero()}
          >
            CLAIM $RBN AIRDROP
          </ActionButton>
        </BaseModalContentColumn>
      </>
    );
  }, [
    loading,
    loadingText,
    account,
    renderTopLogo,
    setShowConnectModal,
    airdropAmountStr,
    onClaim,
    airdropInfo,
  ]);

  const renderBreakdown = useCallback(
    () => (
      <>
        <BaseModalContentColumn>
          <UnclaimLabel>
            {airdropInfo?.unclaimedAmount.isZero()
              ? "CLAIMED $RBN AIRDROP"
              : "UNCLAIMED $RBN AIRDROP"}
          </UnclaimLabel>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={24}>
          <Title fontSize={48} lineHeight={48}>
            {airdropAmountStr}
          </Title>
        </BaseModalContentColumn>
        <BaseModalContentColumn>
          <AirdropBreakdown breakdown={airdropInfo?.breakdown} />
        </BaseModalContentColumn>
        <HideBreakdownButton
          role="button"
          onClick={() => setShowBreakdown(false)}
        >
          <ButtonArrow isOpen={false} />
        </HideBreakdownButton>
      </>
    ),
    [airdropInfo, airdropAmountStr]
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

// export const x = ""
