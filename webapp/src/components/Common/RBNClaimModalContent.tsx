import React, { useCallback } from "react";
import styled, { css, keyframes } from "styled-components";

import { PrimaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { Waves } from "shared/lib/assets";
import Logo from "shared/lib/assets/icons/logo";
import Lightning from "./Lightning";

const ContentColumn = styled.div<{ marginTop?: number | "auto" }>`
  display: flex;
  justify-content: center;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop || 24}px`};
`;

const FloatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -16px;
  left: 0;
  width: 100%;
  height: calc(100%);
  padding: 0 16px;
`;

const changingColorBackground = keyframes`
  0% {
    background: ${colors.products.yield};
    box-shadow: 16px 24px 160px ${colors.products.yield};
  }

  23% {
    background: ${colors.products.yield};
    box-shadow: 16px 24px 160px ${colors.products.yield};
  }

  25% {
    background: ${colors.products.volatility};
    box-shadow: 16px 24px 160px ${colors.products.volatility};
  }

  48% {
    background: ${colors.products.volatility};
    box-shadow: 16px 24px 160px ${colors.products.volatility};
  }

  50% {
    background: ${colors.products.principalProtection};
    box-shadow: 16px 24px 160px ${colors.products.principalProtection};
  }

  73% {
    background: ${colors.products.principalProtection};
    box-shadow: 16px 24px 160px ${colors.products.principalProtection};
  }

  75% {
    background: ${colors.products.capitalAccumulation};
    box-shadow: 16px 24px 160px ${colors.products.capitalAccumulation};
  }

  98% {
    background: ${colors.products.capitalAccumulation};
    box-shadow: 16px 24px 160px ${colors.products.capitalAccumulation};
  }

  100% {
    background: ${colors.products.yield};
    box-shadow: 16px 24px 160px ${colors.products.yield};
  }
`;

const Pole = styled.div<{ type?: "animate" | "ribbon" }>`
  width: 160px;
  height: 320px;
  border-radius: ${theme.border.radius};

  ${(props) => {
    switch (props.type) {
      case "animate":
        return css`
          animation: 12s ${changingColorBackground} linear infinite;
        `;
      case "ribbon":
        return `
          box-shadow: 16px 24px 160px ${colors.products.yield};
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
      default:
        return `
          background: #ffffff0a;
        `;
    }
  }}
`;

const marquee = keyframes`
  from {
    transform: translateX(650px);
  }

  to {
    transform: translateX(-650px);
  }
`;

const ClaimingText = styled(Title)`
  font-size: 120px;
  animation: ${marquee} 20s linear infinite;
  white-space: nowrap;
`;

const changingColorStroke = keyframes`
  0% {
    stroke: ${colors.products.yield};
  }

  23% {
    stroke: ${colors.products.yield};
  }

  25% {
    stroke: ${colors.products.volatility};
  }

  48% {
    stroke: ${colors.products.volatility};
  }

  50% {
    stroke: ${colors.products.principalProtection};
  }

  73% {
    stroke: ${colors.products.principalProtection};
  }

  75% {
    stroke: ${colors.products.capitalAccumulation};
  }

  98% {
    stroke: ${colors.products.capitalAccumulation};
  }

  100% {
    stroke: ${colors.products.yield};
  }
`;

const ColorChangingWaves = styled(Waves)`
  margin-bottom: -16px;
  min-width: 500px;
  max-height: 80px;
  opacity: 0.24;

  path {
    animation: 12s ${changingColorStroke} linear infinite;
  }
`;

const PoleLogo = styled(Logo)`
  min-width: 500px;
  min-height: 500px;
  margin-top: 50px;
`;

interface RBNClaimModalContentProps {
  step: "claim" | "claiming" | "claimed";
  setStep: React.Dispatch<
    React.SetStateAction<"info" | "claim" | "claiming" | "claimed">
  >;
}

const RBNClaimModalContent: React.FC<RBNClaimModalContentProps> = ({
  step,
  setStep,
}) => {
  const renderLightning = useCallback(
    () => (
      <>
        <Lightning height={16} width={80} left={183} top={48} />
        <Lightning height={16} width={40} left={24} top={152} />
        <Lightning height={16} width={24} left={319} top={232} />
        <Lightning height={16} width={64} left={0} top={362} />
        <Lightning height={16} width={16} left={276} top={426} />
      </>
    ),
    []
  );

  switch (step) {
    case "claim":
      return (
        <>
          <ContentColumn marginTop={-24}>
            <Title>CONFIRM Transaction</Title>
          </ContentColumn>
          <ContentColumn marginTop="auto">
            <PrimaryText className="text-center">
              Confirm this transaction in your wallet
            </PrimaryText>
          </ContentColumn>
          <FloatingContainer>
            <Pole />
          </FloatingContainer>
        </>
      );
    case "claiming":
      return (
        <>
          <ContentColumn marginTop={-24}>
            <Title>CONFIRM Transaction</Title>
          </ContentColumn>
          <FloatingContainer>
            <Pole type="animate" />
          </FloatingContainer>
          <FloatingContainer>
            <ClaimingText>Claiming $RBN</ClaimingText>
          </FloatingContainer>
          <ContentColumn marginTop="auto">
            <ColorChangingWaves />
          </ContentColumn>
        </>
      );
    case "claimed":
      return (
        <>
          <ContentColumn marginTop={-24}>
            <Title>$RBN CLAIMED</Title>
          </ContentColumn>
          <ContentColumn marginTop="auto">
            <PrimaryText className="text-center">
              Thank you for being part of the community!
            </PrimaryText>
          </ContentColumn>
          <FloatingContainer>
            <Pole type="ribbon">
              <PoleLogo />
            </Pole>
          </FloatingContainer>
          {renderLightning()}
        </>
      );
  }
};

export default RBNClaimModalContent;
