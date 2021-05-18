import React, { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

import { PrimaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { Waves } from "shared/lib/assets";

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

const Pole = styled.div<{ animate?: boolean }>`
  width: 160px;
  height: 320px;
  background: #ffffff0a;
  border-radius: ${theme.border.radius};

  ${(props) => {
    if (!props.animate) {
      return null;
    }

    return css`
      animation: 12s ${changingColorBackground} linear infinite;
    `;
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

interface AirdropClaimProps {
  setCanModalClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const AirdropClaim: React.FC<AirdropClaimProps> = ({ setCanModalClose }) => {
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setClaiming(true);
    }, 5000);
  }, []);

  useEffect(() => {
    setCanModalClose(claiming ? false : true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claiming]);

  return (
    <>
      {claiming ? (
        <>
          <FloatingContainer>
            <Pole animate={true} />
          </FloatingContainer>
          <FloatingContainer>
            <ClaimingText>Claiming $RBN</ClaimingText>
          </FloatingContainer>
          <ContentColumn marginTop="auto">
            <ColorChangingWaves />
          </ContentColumn>
        </>
      ) : (
        <>
          <ContentColumn marginTop={-24}>
            <Title>CONFIRM Transaction</Title>
          </ContentColumn>
          <ContentColumn marginTop="auto">
            <PrimaryText>Confirm this transaction in your wallet</PrimaryText>
          </ContentColumn>
          <FloatingContainer>
            <Pole />
          </FloatingContainer>
        </>
      )}
    </>
  );
};

export default AirdropClaim;
