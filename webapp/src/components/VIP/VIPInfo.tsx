import React, { useCallback, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { VIPLogo } from "shared/lib/assets/icons/logo";
import {
  BaseLink,
  BaseModalContentColumn,
  PrimaryText,
  Title,
} from "shared/lib/designSystem";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import colors from "shared/lib/designSystem/colors";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { URLS } from "shared/lib/constants/constants";

const livelyAnimation = (position: "top" | "bottom") => keyframes`
  0% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }

  50% {
    background-position-x: ${position === "top" ? 100 : 0}%; 
  }

  100% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }
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

const ModalColumn = styled.div<{
  marginTop?: number | "auto";
}>`
  display: flex;
  justify-content: center;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop === undefined ? 24 : props.marginTop}px`};
`;

const AssetContainer = styled.div<{ size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => props.size}px;
  width: 100%;
  background: linear-gradient(
    102.28deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  border-bottom: 1px solid ${colors.primaryText}1F;
`;

const ProductAssetLogoContainer = styled.div<{ size: number; delay?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  border-radius: 50%;
  position: relative;
`;

const FrameBar = styled.div<{
  color: string;
  position: "top" | "bottom";
  height: number;
}>`
  width: 100%;
  height: ${(props) => props.height}px;
  background: ${(props) => `linear-gradient(
    270deg,
    ${props.color}00 5%,
    ${props.color} 50%,
    ${props.color}00 95%
  )`};
  background-size: 200%;
  animation: 10s ${(props) => livelyAnimation(props.position)} linear infinite;

  &:before {
    content: "";
    z-index: -1;
    position: absolute;
    ${(props) => props.position}: 0;
    right: 0;
    left: 0;
    background: inherit;
    filter: blur(${(props) => props.height * 4}px);
    opacity: 1;
    transition: opacity 0.3s;
    height: ${(props) => props.height * 2}px;
  }
`;

const TextContent = styled.div`
  color: ${colors.primaryText}A3;
  overflow: hidden;
  font-size: 16px;
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

const Highlight = styled.text`
  color: ${colors.primaryText};
`;

const VIPInfo: React.FC = () => {
  const readMore = useMemo(
    () => (
      <LearnMoreLink
        to="https://www.research.ribbon.finance/blog/introducing-ribbon-vip"
        target="_blank"
        rel="noreferrer noopener"
      >
        <PrimaryText>Learn more about Ribbon VIP</PrimaryText>
        <LearnMoreIcon height="20px" width="20px" color="white" />
      </LearnMoreLink>
    ),
    []
  );

  const renderInfo = useCallback(() => {
    return (
      <>
        <ModalColumn marginTop={8}>
          <Title style={{ zIndex: 1 }}>RIBBON VIP</Title>
        </ModalColumn>
        <div style={{ marginLeft: -16, marginRight: -16, marginTop: 24 }}>
          <FrameBar color={colors.primaryText} position="top" height={4} />
          <BaseModalContentColumn marginTop={0}>
            <AssetContainer size={160}>
              <ProductAssetLogoContainer size={80}>
                <VIPLogo width={80} height={80} />
              </ProductAssetLogoContainer>
            </AssetContainer>
          </BaseModalContentColumn>
          <FrameBar color={colors.primaryText} position="bottom" height={4} />
        </div>
        <BaseModalContentColumn marginTop={16}>
          <TextContent>
            <>
              <p>
                As a Ribbon VIP, you now have access to a suite of prime
                services including:
              </p>
              <Point>
                <BulletPoint />
                Exclusive&nbsp;
                <Highlight>custom vaults</Highlight>
              </Point>
              <Point>
                <BulletPoint />
                <Highlight>24/7 support</Highlight>
                &nbsp;with a direct line to the
              </Point>
              <Point>
                <BulletPoint hide={true} />
                team
              </Point>
              <Point>
                <BulletPoint />
                Access to&nbsp;
                <Highlight>new product features</Highlight> &nbsp;and
              </Point>
              <Point>
                <BulletPoint hide={true} />
                <Highlight>private events</Highlight>
              </Point>
            </>
          </TextContent>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={16}>
          <ActionButton
            className="btn"
            color={colors.primaryText}
            onClick={() => window.open(URLS.treasury)}
          >
            VIEW CUSTOM VAULTS
          </ActionButton>
        </BaseModalContentColumn>
        <BaseModalContentColumn marginTop={16}>
          {readMore}
        </BaseModalContentColumn>
      </>
    );
  }, [readMore]);

  return <>{renderInfo()}</>;
};

export default VIPInfo;
