import React, { useEffect, useState } from "react";
import styled from "styled-components";

import colors from "../../designSystem/colors";
import { ProductList, ProductType } from "../Product/types";

const Container = styled.div<{ width: number }>`
  display: flex;
  flex-wrap: wrap;
  width: ${(props) => props.width}px;
`;

const LightBar = styled.div<{
  height: number;
  spacing: number;
  active: boolean;
  product: ProductType;
  interval: number;
}>`
  height: ${(props) => props.height}px;
  width: 100%;
  background: ${(props) =>
    props.active ? colors.products[props.product] : "#FFFFFF0A"};
  box-shadow: 0px 0px 70px
    ${(props) => (props.active ? colors.products[props.product] : "none")};
  border-radius: 2px;
  ${(props) =>
    `transition: background ${props.interval}ms ease-in-out, box-shadow ${props.interval}ms ease-in-out;`}

  &:not(:first-child) {
    margin-top: ${(props) => props.spacing}px;
  }
`;

interface TrafficLightProps {
  active: boolean;
  interval?: number;
  lightBarConfig?: {
    width: number;
    height: number;
    spacing: number;
  };
}

const TrafficLight: React.FC<TrafficLightProps> = ({
  active,
  interval = 350,
  lightBarConfig = {
    width: 200,
    height: 16,
    spacing: 24,
  },
}) => {
  const [activeIndex, setActiveIndex] = useState<number>();

  useEffect(() => {
    if (!active) {
      setActiveIndex(undefined);
      return;
    }

    const timeInterval = setInterval(() => {
      setActiveIndex((curr) => {
        return curr !== undefined ? (curr + 1) % 4 : 0;
      });
    }, interval);

    return () => clearInterval(timeInterval);
  }, [active, interval]);

  return (
    <Container width={lightBarConfig.width}>
      {ProductList.map((product, index) => (
        <LightBar
          key={index}
          height={lightBarConfig.height}
          spacing={lightBarConfig.spacing}
          product={product}
          active={activeIndex === index}
          interval={interval}
        />
      ))}
    </Container>
  );
};

export default TrafficLight;
