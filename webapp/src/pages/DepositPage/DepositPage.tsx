import React, { ReactNode, useMemo } from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import CapBar from "shared/lib/components/Deposit/CapBar";
import PerformanceSection from "./PerformanceSection";
import ActionsForm from "../../components/ActionsForm/ActionsForm";
import useVaultData from "shared/lib/hooks/useVaultData";
import { formatSignificantDecimals } from "shared/lib/utils/math";
import sizes from "shared/lib/designSystem/sizes";
import YourPosition from "../../components/ActionsForm/YourPosition";
import VaultActivity from "../../components/Vault/VaultActivity";
import usePullUp from "../../hooks/usePullUp";
import {
  getDisplayAssets,
  VaultList,
  VaultOptions,
} from "shared/lib/constants/constants";
import { productCopies } from "shared/lib/components/Product/productCopies";
import useVaultOption from "../../hooks/useVaultOption";
import { getVaultColor } from "shared/lib/utils/vault";
import { getAssetLogo } from "shared/lib/utils/asset";
import { Container } from "react-bootstrap";
import theme from "shared/lib/designSystem/theme";

const { formatUnits } = ethers.utils;

const DepositPageContainer = styled(Container)`
  @media (min-width: ${sizes.xl}px) {
    max-width: 1140px;
  }
`;

const HeroContainer = styled.div<{ color: string }>`
  background: linear-gradient(
    96.84deg,
    ${(props) => props.color}29 1.04%,
    ${(props) => props.color}07 98.99%
  );
  padding: 40px 0;
  overflow: hidden;
`;

const HeroText = styled(Title)`
  font-size: 56px;
  line-height: 64px;
  margin-bottom: 24px;
`;

const AttributePill = styled.div`
  background: ${colors.pillBackground};
  color: ${colors.primaryText};
  border-radius: ${theme.border.radiusSmall};
  padding: 16px;
  font-family: VCR, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;

  text-align: center;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const SplashImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  right: 0;
  width: 600px;
  height: 100%;

  @media (max-width: ${sizes.xl}px) {
    display: none;
  }
`;

const DesktopActionsFormContainer = styled.div`
  @media (max-width: ${sizes.md}px) {
    display: none;
  }

  @media (min-width: ${sizes.xl}px) {
    padding: 0px 45px 0px 30px;
  }
`;

const MobilePositions = styled(YourPosition)`
  @media (max-width: ${sizes.md}px) {
    width: 100%;
    margin-left: 16px;
    margin-right: 16px;
    margin-top: -15px;
    margin-bottom: 48px;
  }

  @media (min-width: ${sizes.md + 1}px) {
    display: none !important;
  }
`;

const DepositPage = () => {
  usePullUp();
  const { account } = useWeb3React();
  const vaultOption = useVaultOption() || VaultList[0];
  const { status, deposits, vaultLimit, asset, decimals } =
    useVaultData(vaultOption);
  const isLoading = status === "loading";

  const totalDepositStr = isLoading
    ? 0
    : parseFloat(formatSignificantDecimals(formatUnits(deposits, decimals), 2));
  const depositLimitStr = isLoading
    ? 1
    : parseFloat(formatSignificantDecimals(formatUnits(vaultLimit, decimals)));

  const depositCapBar = (
    <CapBar
      loading={isLoading}
      current={totalDepositStr}
      cap={depositLimitStr}
      copies={{
        current: "Current Vault Deposits",
        cap: "Max Vault Capacity",
      }}
      asset={asset}
    />
  );

  return (
    <>
      <HeroSection depositCapBar={depositCapBar} vaultOption={vaultOption} />

      <DepositPageContainer className="py-5">
        <div className="row mx-lg-n1">
          {account && <MobilePositions vaultOption={vaultOption} />}

          <PerformanceSection vaultOption={vaultOption} />

          <DesktopActionsFormContainer className="col-xl-5 offset-xl-1 col-md-6">
            <ActionsForm vaultOption={vaultOption} variant="desktop" />
          </DesktopActionsFormContainer>
        </div>
        <VaultActivity vaultOption={vaultOption} />
      </DepositPageContainer>
    </>
  );
};

const HeroSection: React.FC<{
  depositCapBar: ReactNode;
  vaultOption: VaultOptions;
}> = ({ depositCapBar, vaultOption }) => {
  const color = getVaultColor(vaultOption);

  const logo = useMemo(() => {
    const asset = getDisplayAssets(vaultOption);
    const Logo = getAssetLogo(asset);

    switch (asset) {
      case "WETH":
        return <Logo width="55%" style={{ marginTop: 40 }} />;
      case "WBTC":
        return <Logo height="190%" style={{ marginTop: 40 }} />;
      case "USDC":
      case "yvUSDC":
        return (
          <Logo
            height="180%"
            style={{
              marginTop: 40,
            }}
          />
        );
      default:
        return <Logo />;
    }
  }, [vaultOption]);

  return (
    <HeroContainer className="position-relative" color={color}>
      <DepositPageContainer className="container">
        <div className="row mx-lg-n1 position-relative">
          <div style={{ zIndex: 1 }} className="col-xl-6 d-flex flex-column">
            <div className="d-flex flex-row my-3">
              {productCopies[vaultOption].tags.map((tag) => (
                <AttributePill className="mr-2 text-uppercase" key={tag}>
                  {tag}
                </AttributePill>
              ))}
            </div>

            <HeroText>{productCopies[vaultOption].title}</HeroText>

            {depositCapBar}
          </div>

          <SplashImage className="position-absolute col-xl-6">
            {logo}
          </SplashImage>
        </div>
      </DepositPageContainer>
    </HeroContainer>
  );
};

export default DepositPage;
