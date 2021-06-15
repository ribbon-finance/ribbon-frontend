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
  getAssets,
  VaultList,
  VaultOptions,
} from "shared/lib/constants/constants";
import { productCopies } from "shared/lib/components/Product/productCopies";
import useVaultOption from "../../hooks/useVaultOption";
import { getVaultColor } from "shared/lib/utils/vault";
import { getAssetLogo } from "shared/lib/utils/asset";

const { formatUnits } = ethers.utils;

const HeroContainer = styled.div<{ color: string }>`
  background: linear-gradient(
    96.84deg,
    ${(props) => props.color}14 1.04%,
    ${(props) => props.color}03 98.99%
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
  border-radius: 4px;
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
  z-index: 0;
  top: 0;
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
`;

const MobilePositions = styled(YourPosition)`
  @media (max-width: ${sizes.md}px) {
    width: 100%;
    margin-left: 16px;
    margin-right: 16px;
    margin-top: -15px;
    margin-bottom: 48px;
    padding: 18px;
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

      <div className="container py-5">
        <div className="row mx-lg-n1">
          {account && <MobilePositions vaultOption={vaultOption} />}

          <PerformanceSection vaultOption={vaultOption} />

          <DesktopActionsFormContainer className="col-xl-4 offset-xl-1 col-md-6">
            <ActionsForm vaultOption={vaultOption} variant="desktop" />
          </DesktopActionsFormContainer>
        </div>
        <VaultActivity vaultOption={vaultOption} />
      </div>
    </>
  );
};

const HeroSection: React.FC<{
  depositCapBar: ReactNode;
  vaultOption: VaultOptions;
}> = ({ depositCapBar, vaultOption }) => {
  const logo = useMemo(() => {
    const asset = getAssets(vaultOption);
    const Logo = getAssetLogo(asset);

    switch (asset) {
      case "WETH":
        return <Logo width="55%" style={{ marginTop: 40 }} />;
      case "WBTC":
        return <Logo height="130%" style={{ marginTop: 40 }} />;
      case "USDC":
        return <Logo height="180%" style={{ marginTop: 40 }} />;
      default:
        return <Logo />;
    }
  }, [vaultOption]);
  return (
    <HeroContainer
      className="position-relative"
      color={getVaultColor(vaultOption)}
    >
      <div className="container">
        <div className="row mx-lg-n1">
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

          <SplashImage className="position-absolute offset-xl-6">
            {logo}
          </SplashImage>
        </div>
      </div>
    </HeroContainer>
  );
};

export default DepositPage;
