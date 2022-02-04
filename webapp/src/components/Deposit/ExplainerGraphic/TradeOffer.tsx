import React, { useMemo, useRef } from "react";
import styled, { keyframes } from "styled-components";

import useElementSize from "shared/lib/hooks/useElementSize";
import { Title } from "shared/lib/designSystem";
import Logo from "shared/lib/assets/icons/logo";
import colors from "shared/lib/designSystem/colors";
import { Assets } from "shared/lib/store/types";
import { getAssetLogo } from "shared/lib/utils/asset";
import { MoneyLogo } from "../../../assets/icons/vaultExplainer/tradeOffer";
import sizes from "shared/lib/designSystem/sizes";
import { GnosisLogo } from "shared/lib/assets/icons/defiApp";
import { WETHLogo } from "shared/lib/assets/icons/erc20Assets";

const TargetContainer = styled.div`
  display: flex;
  height: 75%;
  width: 80%;

  @media (max-width: ${sizes.lg}px) {
    width: 90%;
  }
`;

const TargetCircle = styled.div<{ color: string; dimension: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.dimension / 2}px;
  height: ${(props) => props.dimension}px;
  width: ${(props) => props.dimension}px;
  background: ${(props) => props.color}14;
  border: 1px dashed ${(props) => props.color};
`;

const ColoredLogo = styled(Logo)<{ color: string }>`
  circle {
    fill: ${(props) => props.color}3D;
  }

  path {
    stroke: ${(props) => props.color};
  }
`;

const ColoredGnosisLogo = styled(GnosisLogo)<{ color: string }>`
  g {
    fill: ${(props) => props.color};
  }
`;

const TradeTunnelContainer = styled.div<{
  color: string;
  variant: "from" | "to";
  oneSidedTrade: boolean;
}>`
  position: absolute;
  display: flex;
  width: 50%;
  height: 40%;
  background: linear-gradient(
    90deg,
    ${(props) => props.color}34 0%,
    ${(props) => props.color}14 47.92%,
    transparent 100%
  );
  border-radius: 100px 0 0 100px;

  @media (max-width: ${sizes.lg}px) {
    width: 40%;
  }

  ${(props) => {
    if (props.oneSidedTrade) {
      return `
        top: calc((100% - 40%) / 2);
      `;
    }

    switch (props.variant) {
      case "from":
        return `
          top: calc(20% / 3);
        `;
      case "to":
        return `
          bottom: calc(20% / 3);
        `;
    }
  }}

  ${(props) => {
    switch (props.variant) {
      case "from":
        return `
          left: calc(50% * 17 / 30);

          @media (max-width: ${sizes.lg}px) {
            left: 31%;
          }
        `;
      case "to":
        return `
          right: calc(50% * 17 / 30);
          transform: rotate(-180deg);

          @media (max-width: ${sizes.lg}px) {
            right: 31%;
          }

          & .token {
            transform: rotate(-180deg);
          }
        `;
    }
  }}
`;

const tradeTokenKeyframe = (
  width: number,
  containerMargin: number
) => keyframes`
  0% {
    left: ${containerMargin}px;
    opacity: 0;
  }

  14.29% {
    left: ${containerMargin}px;
    opacity: 1;
  }

  28.57% {
    left: ${containerMargin}px;
    opacity: 1;
  }

  42.86% {
    left: ${(width * 2) / 3}px;
    opacity: 1;
  }

  57.14% {
    left: ${(width * 2) / 3}px;
    opacity: 1;
  }

  71.43% {
    left: ${(width * 2) / 3}px;
    opacity: 0;
  }

  100% {
    left: ${(width * 2) / 3}px;
    opacity: 0;
  }
`;

const TradeTokenContainer = styled.div<{
  dimension: number;
  containerMargin: number;
  containerWidth: number;
  color: string;
}>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.background.one};
  height: ${(props) => props.dimension}px;
  width: ${(props) => props.dimension}px;
  border-radius: ${(props) => props.dimension / 2}px;
  top: ${(props) => props.containerMargin}px;
  animation: 5.6s
    ${(props) =>
      tradeTokenKeyframe(props.containerWidth, props.containerMargin)}
    linear infinite;

  &:before {
    position: absolute;
    content: " ";
    width: 100%;
    height: 100%;
    background: ${(props) => `${props.color}14`};
    border-radius: ${(props) => props.dimension / 2}px;
  }
`;

const OTokenLogo = styled.div<{ dimension: number; color: string }>`
  width: ${(props) => props.dimension}px;
  height: ${(props) => props.dimension}px;
  border: ${(props) => Math.ceil(props.dimension / 12)}px solid
    ${(props) => props.color};
  border-radius: ${(props) => props.dimension / 2}px;
`;

const ColoredWETHLogo = styled(WETHLogo)<{ color: string }>`
  path {
    fill: ${(props) => props.color};
  }
`;

type OfferTokenType = "oToken" | "money" | Assets;

interface TradeTunnelProps {
  color: string;
  variant: "from" | "to";
  tradeToken: OfferTokenType;
  oneSidedTrade: boolean;
}

const TradeTunnel: React.FC<TradeTunnelProps> = ({
  color,
  variant,
  tradeToken,
  oneSidedTrade,
}) => {
  const ref = useRef(null);
  const { height, width } = useElementSize(ref);

  const token = useMemo(() => {
    switch (tradeToken) {
      case "oToken":
        return (
          <OTokenLogo dimension={((height * 5) / 6) * 0.6} color={color} />
        );
      case "money":
        return (
          <MoneyLogo
            height={`${((height * 5) / 6) * 0.5}px`}
            width={`${((height * 5) / 6) * 0.5}px`}
            baseColor={color}
          />
        );
      default:
        if (color === colors.asset.stETH && tradeToken === "WETH") {
          return <ColoredWETHLogo color={color} height="100%" width="100%" />;
        }

        const AssetLogo = getAssetLogo(tradeToken);

        if (tradeToken === "yvUSDC") {
          return (
            <AssetLogo
              markerConfig={{
                height: ((height * 5) / 6) * 0.35,
                width: ((height * 5) / 6) * 0.35,
              }}
            />
          );
        }
        if (tradeToken === "WETH") {
          return <AssetLogo height="100%" width="100%" />;
        }
        return <AssetLogo height="100%" width="100%" />;
    }
  }, [color, height, tradeToken]);

  return (
    <TradeTunnelContainer
      ref={ref}
      color={color}
      variant={variant}
      oneSidedTrade={oneSidedTrade}
    >
      <div className="d-flex w-100 h-100 position-relative">
        <TradeTokenContainer
          containerWidth={width}
          dimension={(height * 5) / 6}
          containerMargin={height / 12}
          color={color}
          className="token"
        >
          {token}
        </TradeTokenContainer>
      </div>
    </TradeTunnelContainer>
  );
};

interface TradeOfferProps {
  color: string;
  offerParty?: string;
  tradeTarget: string;
  offerToken?: OfferTokenType;
  receiveToken?: OfferTokenType;
}

const TradeOffer: React.FC<TradeOfferProps> = ({
  color,
  offerParty,
  tradeTarget,
  offerToken,
  receiveToken,
}) => {
  const ref = useRef(null);
  const { height } = useElementSize(ref);

  const renderParty = (party?: string) => {
    if (!party) {
      return (
        <ColoredLogo
          width={`${height * 0.75 * 0.3}px`}
          height={`${height * 0.75 * 0.3}px`}
          color={color}
        />
      );
    }

    switch (party?.toLocaleLowerCase()) {
      case "gnosis":
        return (
          <ColoredGnosisLogo
            width={`${height * 0.75 * 0.3}px`}
            height={`${height * 0.75 * 0.3}px`}
            color={color}
          />
        );
      default:
        return (
          <Title
            color={color}
            fontSize={height * 0.75 * 0.1}
            lineHeight={height * 0.75 * 0.1 * 1.2}
          >
            {party}
          </Title>
        );
    }
  };

  return (
    <div
      ref={ref}
      className="d-flex flex-column w-100 h-100 align-items-center justify-content-center"
    >
      <TargetContainer className="position-relative">
        {/* From circle */}
        <TargetCircle
          color={color}
          dimension={height * 0.75}
          className="mr-auto"
        >
          {renderParty(offerParty)}
        </TargetCircle>

        {/* To circle */}
        <TargetCircle color={color} dimension={height * 0.75}>
          {renderParty(tradeTarget)}
        </TargetCircle>

        {/* Offer Tunnel */}
        {offerToken && (
          <TradeTunnel
            color={color}
            variant="from"
            tradeToken={offerToken}
            oneSidedTrade={!Boolean(receiveToken)}
          />
        )}

        {/* Receive Tunnel */}
        {receiveToken && (
          <TradeTunnel
            color={color}
            variant="to"
            tradeToken={receiveToken}
            oneSidedTrade={!Boolean(offerToken)}
          />
        )}
      </TargetContainer>
    </div>
  );
};

export default TradeOffer;
