import React from "react";
import styled, { StyledComponent } from "styled-components";
import { USDCLogo } from "shared/lib/assets/icons/erc20Assets";
import Logo from "shared/lib/assets/icons/logo";
import { Chains, VaultOptions } from "../constants/constants";
import colors from "shared/lib/designSystem/colors";
import { Assets, Wallets } from "shared/lib/store/types";

export const assetFilterList: Assets[] = ["WETH", "USDC"];

export const isYieldAsset = (asset: Assets): boolean => {
  switch (asset) {
    case "sAVAX":
    case "stETH":
    case "rETH":
    case "wstETH":
    case "yvUSDC":
      return true;
    default:
      return false;
  }
};

export const getYieldAssetUnderlying = (asset: Assets): Assets | undefined => {
  switch (asset) {
    case "sAVAX":
      return "WAVAX";
    case "stETH":
    case "wstETH":
      return "WETH";
    case "yvUSDC":
      return "USDC";
  }
};

export const getChainByAsset = (asset: Assets): Chains => {
  return Chains.Ethereum;
};

export const getChainByVaultOption = (vault: VaultOptions): Chains => {
  return Chains.Ethereum;
};

export const getAssetDisplay = (asset: Assets): string => {
  return asset;
};

export const getAssetDecimals = (asset: Assets): number => {
  switch (asset) {
    case "USDC":
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
    case 9:
      return 4;
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
export const getWalletColor = (wallet: Wallets): string =>
  colors.wallets[wallet];

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
    default:
      return Logo;
  }
};
