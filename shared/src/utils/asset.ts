import React from "react";
import styled, { StyledComponent } from "styled-components";
import {
  AAVELogo,
  STETHLogo,
  USDCLogo,
  WBTCLogo,
  WETHLogo,
  WAVAXLogo,
  SAVAXLogo,
  YVUSDcLogo,
  PERPLogo,
  WNEARLogo,
  AURORALogo,
} from "../assets/icons/erc20Assets";
import Logo from "../assets/icons/logo";
import { SolanaLogo } from "../assets/icons/solAssets";
import { Chains, VaultOptions } from "../constants/constants";
import colors from "../designSystem/colors";
import { Assets, Wallets } from "../store/types";

export const assetFilterList: Assets[] = [
  "AAVE",
  "WETH",
  "stETH",
  "USDC",
  "WBTC",
  "WAVAX",
  "sAVAX",
  "SOL",
];

export const getIntegralAsset = (derivative: Assets): Assets => {
  switch (derivative) {
    // Per design, we only consider USDC.e and USDC the same asset.
    // We consider stETH/ETH, sAVAX/AVAX, and yvUSDC/USDC differet assets.
    /*
    case "stETH":
      return "ETH"
    case "sAVAX":
      return "WAVAX";
    case "yvUSDC":
    */
    case "USDC.e":
      return "USDC";
    default:
      return derivative;
  }
};

export const isYieldAsset = (asset: Assets): boolean => {
  switch (asset) {
    case "sAVAX":
    case "stETH":
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
  switch (asset) {
    case "SOL":
      return Chains.Solana;
    case "WAVAX":
    case "sAVAX":
    case "USDC.e":
      return Chains.Avalanche;
    default:
      return Chains.Ethereum;
  }
};

export const getChainByVaultOption = (vault: VaultOptions): Chains => {
  switch (vault) {
    case "rETH-THETA":
    case "ryvUSDC-ETH-P-THETA":
    case "rUSDC-ETH-P-THETA":
    case "rstETH-THETA":
    case "rBTC-THETA":
    case "rAAVE-THETA":
      return Chains.Ethereum;

    case "rAVAX-THETA":
    case "rsAVAX-THETA":
    case "rUSDC-AVAX-P-THETA":
      return Chains.Avalanche;

    case "rSOL-THETA":
      return Chains.Solana;

    case "rAURORA-THETA":
    case "rNEAR-THETA":
    default:
      return Chains.NotSelected;
  }
};

export const getAssetDisplay = (asset: Assets): string => {
  switch (asset) {
    case "WETH":
      return "ETH";
    case "WAVAX":
      return "AVAX";
    default:
      return asset;
  }
};

export const getAssetDecimals = (asset: Assets): number => {
  switch (asset) {
    case "WNEAR":
      return 24;
    case "WBTC":
      return 8;
    case "USDC":
    case "USDC.e":
    case "yvUSDC":
      return 6;
    case "SOL":
      return 9;
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
    case "USDC.e":
      return ColoredUSDCLogo;
    case "WBTC":
      return ColoredWBTCLogo;
    case "WETH":
      return WETHLogo;
    case "yvUSDC":
      return ColoredYVUSDCLogo;
    case "stETH":
    case "wstETH":
      return STETHLogo;
    case "AAVE":
      return AAVELogo;
    case "WAVAX":
      return WAVAXLogo;
    case "sAVAX":
      return SAVAXLogo;
    case "PERP":
      return PERPLogo;
    case "SOL":
      return SolanaLogo;
    case "WNEAR":
      return WNEARLogo;
    case "AURORA":
      return AURORALogo;
    default:
      return Logo;
  }
};
