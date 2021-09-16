import React, { useRef } from "react";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";

import useElementSize from "shared/lib/hooks/useElementSize";
import styled, { keyframes } from "styled-components";

const BaseLineContainer = styled.div<{
  height: number;
  position: "top" | "bottom";
}>`
  position: absolute;
  display: flex;
  align-items: center;
  width: 100%;
  height: ${(props) => props.height}px;
`;

const StrikeContainer = styled(BaseLineContainer)`
  ${(props) => {
    switch (props.position) {
      case "top":
        return `
          top: calc((100% / 3) - (12.5% / 2));
        `;
      case "bottom":
        return `
          bottom: calc((100% / 3) - (12.5% / 2));
        `;
    }
  }}
`;

const OTMPriceFluctuateAnimation = (position: "top" | "bottom") => keyframes`
  0% {
    ${position}: calc((100% / 3) - (12.5% / 2));
  }

  5% {
    ${position}: 25%;
  }

  15% {
    ${position}: 45%;
  }

  20% {
    ${position}: 33.33%;
  }

  30% {
    ${position}: 50%;
  }

  40% {
    ${position}: calc((100% / 3) - (12.5% / 2));
  }

  100% {
    ${position}: calc((100% / 3) - (12.5% / 2));
  }
`;

const ITMPriceFluctuateAnimation = (position: "top" | "bottom") => keyframes`
  0% {
    ${position}: 100%;
  }

  15% {
    ${position}: 50%;
  }

  20% {
    ${position}: 75%;
  }

  25% {
    ${position}: 66.7%;
  }

  30% {
    ${position}: 80%;
  }

  40% {
    ${position}: calc((100% / 3) - (12.5% / 2));
  }

  100% {
    ${position}: calc((100% / 3) - (12.5% / 2));
  }
`;

const PriceContainer = styled(BaseLineContainer)<{ isOTM: boolean }>`
  animation: 8s
    ${(props) =>
      props.isOTM
        ? OTMPriceFluctuateAnimation(props.position)
        : ITMPriceFluctuateAnimation(props.position)}
    linear infinite;
`;

const LineLabel = styled.div<{
  width: number;
  color: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.width}px;
  height: 100%;
  border-radius: 0px 100px 100px 0px;
  background: ${(props) => props.color};
`;

const Line = styled.div<{ color: string; variant: "price" | "strike" }>`
  flex: 1;
  ${(props) => {
    switch (props.variant) {
      case "price":
        return `
          border: 1px solid ${props.color};
        `;
      case "strike":
        return `
          border: 1px dashed ${props.color};
        `;
    }
  }}
`;

interface SettlementChartProps {
  higherPrice: boolean;
  isOTM: boolean;
}

const ExpiryChart: React.FC<SettlementChartProps> = ({
  higherPrice,
  isOTM,
}) => {
  const ref = useRef(null);
  const { height, width } = useElementSize(ref);
  const color = isOTM ? colors.green : colors.red;

  return (
    <div
      ref={ref}
      className="d-flex flex-column w-100 h-100 position-relative overflow-hidden"
    >
      <StrikeContainer
        height={height * 0.125}
        position={higherPrice ? "bottom" : "top"}
      >
        <LineLabel width={width * 0.14} color={`${color}29`}>
          <Title
            fontSize={height / 16}
            lineHeight={(height / 16) * 1.2}
            color={color}
          >
            Strike
          </Title>
        </LineLabel>
        <Line color={color} variant="strike" />
      </StrikeContainer>

      <PriceContainer
        height={height * 0.125}
        position={higherPrice ? "top" : "bottom"}
        isOTM={isOTM}
      >
        <LineLabel width={width * 0.14} color={`${colors.primaryText}0A`}>
          <Title fontSize={height / 16} lineHeight={(height / 16) * 1.2}>
            Price
          </Title>
        </LineLabel>
        <Line color={colors.primaryText} variant="price" />
      </PriceContainer>
    </div>
  );
};

export default ExpiryChart;
