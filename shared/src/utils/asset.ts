import React from "react";
import styled, { StyledComponent } from "styled-components";
import { USDCLogo, WBTCLogo, WETHLogo } from "../assets/icons/erc20Assets";
import colors from "../designSystem/colors";
import { Assets } from "../store/types";

export const getAssetDisplay = (asset: Assets): string => {
  switch (asset) {
    case "WETH":
      return "ETH";
    default:
      return asset;
  }
};

export const getAssetDecimals = (asset: Assets): number => {
  switch (asset) {
    case "WBTC":
      return 8;
    case "USDC":
      return 6;
    case "WETH":
    default:
      return 18;
  }
};

export const getAssetColor = (asset: Assets): string => colors.asset[asset];

const ColoredWBTCLogo = styled(WBTCLogo)`
  width: 100%;
  && * {
    fill: ${colors.asset.WBTC};
  }
`;

const ColoredUSDCLogo = styled(USDCLogo)<{ backgroundColor?: string }>`
  margin: -8px;
  width: 100%;

  && .background {
    fill: ${(props) =>
      props.backgroundColor ? props.backgroundColor : "none"};
  }

  && .content {
    fill: ${colors.asset.USDC};
  }
`;

const ColoredWETHLogo = styled(WETHLogo)`
  .cls-1,
  .cls-5 {
    fill: ${colors.asset.WETH}66;
  }

  .cls-2,
  .cls-6 {
    fill: ${colors.asset.WETH}CC;
  }

  .cls-3,
  .cls-4 {
    fill: ${colors.asset.WETH};
  }
`;

export const getAssetLogo: (
  asset: Assets
) => StyledComponent<
  React.FC<React.SVGAttributes<SVGElement>>,
  any,
  { backgroundColor?: string },
  never
> = (asset) => {
  switch (asset) {
    case "USDC":
      return ColoredUSDCLogo;
    case "WBTC":
      return ColoredWBTCLogo;
    case "WETH":
      return ColoredWETHLogo;
  }
};
