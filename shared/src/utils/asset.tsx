import React from "react";
import styled, { StyledComponent } from "styled-components";
import {
  AAVELogo,
  STETHLogo,
  USDCLogo,
  WBTCLogo,
  WETHLogo,
  WAVAXLogo,
  YVUSDcLogo,
} from "../assets/icons/erc20Assets";
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
    case "yvUSDC":
      return 6;
    default:
      return 18;
  }
};

export const getDefaultSignificantDecimalsFromAssetDecimals = (
  decimals: number
) => {
  switch (decimals) {
    case 18:
      return 6;
    case 8:
      return 5;
    case 6:
    default:
      return 2;
  }
};

export const getAssetDefaultSignificantDecimals = (asset: Assets): number => {
  return getDefaultSignificantDecimalsFromAssetDecimals(
    getAssetDecimals(asset)
  );
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
      props.backgroundColor ? props.backgroundColor : `${colors.asset.USDC}29`};
  }

  && .content {
    fill: ${colors.asset.USDC};
  }
`;

const ColoredYVUSDCLogo = styled(YVUSDcLogo)<{ backgroundColor?: string }>`
  margin: -8px;
  width: 100%;

  && .background {
    fill: ${(props) =>
      props.backgroundColor ? props.backgroundColor : `${colors.asset.USDC}29`};
  }

  && .content {
    fill: ${colors.asset.USDC};
  }
`;

export const LidoThemedETHLogo = styled(WETHLogo)`
  path {
    fill: ${colors.asset.stETH};
  }
`;

export const getAssetLogo: (asset: Assets) =>
  | StyledComponent<
      React.FC<React.SVGAttributes<SVGElement>>,
      any,
      { backgroundColor?: string },
      never
    >
  | React.FC<React.SVGAttributes<SVGElement>>
  | React.FC<
      React.SVGAttributes<SVGElement> & {
        markerConfig?: {
          height?: number;
          width?: number;
          right?: string;
          bottom?: string;
          border?: string;
        };
      }
    >
  | React.FC<React.SVGAttributes<SVGElement> & { showBackground?: boolean }> = (
  asset
) => {
  switch (asset) {
    case "USDC":
      return ColoredUSDCLogo;
    case "WBTC":
      return ColoredWBTCLogo;
    case "WETH":
      return WETHLogo;
    case "yvUSDC":
      return ColoredYVUSDCLogo;
    case "stETH":
      return STETHLogo;
    case "AAVE":
      return AAVELogo;
    case "WAVAX":
      return WAVAXLogo;
  }
};
