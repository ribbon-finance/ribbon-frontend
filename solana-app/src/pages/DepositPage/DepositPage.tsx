import React, { ReactNode, useMemo } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import styled, { keyframes } from "styled-components";
import { Redirect } from "react-router-dom";

import { BaseLink, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import CapBar from "shared/lib/components/Deposit/CapBar";
import PerformanceSection from "./PerformanceSection";
import { useVaultData, useV2VaultData } from "shared/lib/hooks/web3DataContext";
import { formatSignificantDecimals, isPracticallyZero } from "shared/lib/utils/math";
import sizes from "shared/lib/designSystem/sizes";
import VaultActivity from "../../components/Vault/VaultActivity";
import usePullUp from "../../hooks/usePullUp";
import {
  getDisplayAssets,
  getEtherscanURI,
  hasVaultVersion,
  VaultAddressMap,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
} from "shared/lib/constants/constants";
import { productCopies } from "shared/lib/components/Product/productCopies";
import useVaultOption from "../../hooks/useVaultOption";
import { getVaultColor } from "shared/lib/utils/vault";
import { getAssetLogo } from "shared/lib/utils/asset";
import { Container } from "react-bootstrap";
import theme from "shared/lib/designSystem/theme";
import { getVaultURI } from "../../constants/constants";
import DesktopActionForm from "../../components/Vault/VaultActionsForm/DesktopActionForm";
import YourPosition from "shared/lib/components/Vault/YourPosition";
import { truncateAddress } from "shared/lib/utils/address";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import useRedirectOnSwitchChain from "../../hooks/useRedirectOnSwitchChain";
import useRedirectOnWrongChain from "../../hooks/useRedirectOnWrongChain";
import Banner from "shared/lib/components/Banner/Banner";

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

const livelyAnimation = (position: "top" | "bottom") => keyframes`
  0% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }

  50% {
    background-position-x: ${position === "top" ? 100 : 0}%;
  }

  100% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }
`;

const LiveryBar = styled.div<{ color: string; position: "top" | "bottom" }>`
  position: absolute;
  ${(props) => props.position}: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: ${(props) => `linear-gradient(
    270deg,
    ${props.color}00 15%,
    ${props.color} 50%,
    ${props.color}00 85%
  )`};
  background-size: 200%;
  animation: 10s ${(props) => livelyAnimation(props.position)} linear infinite;
`;

const AttributePill = styled.div<{ color: string }>`
  display: flex;
  background: ${(props) => props.color}29;
  color: ${colors.primaryText};
  border-radius: ${theme.border.radiusSmall};
  font-family: VCR, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;

  text-align: center;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const TagPill = styled(AttributePill)`
  padding: 16px;
`;

const AttributeVersionSelector = styled.div<{ color: string; active: boolean }>`
  padding: 16px;
  border-radius: ${theme.border.radiusSmall};
  border: ${theme.border.width} ${theme.border.style}
    ${(props) => (props.active ? props.color : "transparent")};
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
  display: flex;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }

  @media (min-width: ${sizes.xl}px) {
    padding: 0px 45px 0px 30px;
  }
`;

const ContractButton = styled.div<{ color: string }>`
  @media (max-width: ${sizes.md}px) {
    display: flex;
    justify-content: center;
    padding: 10px 16px;
    background: ${(props) => props.color}14;
    border-radius: 100px;
    margin-left: 16px;
    margin-right: 16px;
    margin-top: -15px;
    margin-bottom: 48px;
  }
  @media (min-width: ${sizes.md + 1}px) {
    display: none !important;
  }
`;

const ContractButtonTitle = styled(Title)`
  letter-spacing: 1px;
`;

const DepositPage = () => {
  const { vaultOption, vaultVersion } = useVaultOption();
  const { chainId } = useWeb3React();
  useRedirectOnSwitchChain(chainId);
  useRedirectOnWrongChain(vaultOption, chainId);

  usePullUp();

  const { status, deposits, vaultLimit } = useVaultData(
    vaultOption || VaultList[0]
  );
  const {
    data: { asset, cap, decimals, totalBalance },
    loading,
  } = useV2VaultData(vaultOption || VaultList[0]);
  const isLoading = status === "loading" || loading;

  const [totalDepositStr, depositLimitStr] = useMemo(() => {
    switch (vaultVersion) {
      case "v1":
        return [
          parseFloat(
            formatSignificantDecimals(formatUnits(deposits, decimals), 2)
          ),
          parseFloat(
            formatSignificantDecimals(formatUnits(vaultLimit, decimals))
          ),
        ];
      case "v2":
        return [
          parseFloat(
            formatSignificantDecimals(formatUnits(totalBalance, decimals), 2)
          ),
          parseFloat(formatSignificantDecimals(formatUnits(cap, decimals))),
        ];
    }
  }, [cap, decimals, deposits, totalBalance, vaultLimit, vaultVersion]);

  const depositCapBar = (
    <CapBar
      loading={isLoading}
      current={totalDepositStr}
      cap={depositLimitStr}
      displayData={
        vaultVersion === "v1" && !isLoading && vaultLimit.isZero()
          ? { current: "---", cap: "---" }
          : undefined
      }
      copies={{
        current: "Current Vault Deposits",
        cap: "Max Vault Capacity",
      }}
      asset={asset}
    />
  );

  /**
   * Redirect to homepage if no clear vault is chosen
   */
  if (!vaultOption) {
    return <Redirect to="/" />;
  }

  /**
   * Redirect to v1 if vault version given is invalid
   */
  if (chainId && !hasVaultVersion(vaultOption, vaultVersion, chainId)) {
    const availableVaultVersions = VaultVersionList.filter((version) =>
      hasVaultVersion(vaultOption, version, chainId)
    );

    if (availableVaultVersions.length <= 0) {
      return <Redirect to="/" />;
    }

    return (
      <Redirect
        to={getVaultURI(
          vaultOption,
          availableVaultVersions[availableVaultVersions.length - 1]
        )}
      />
    );
  }

  return (
    <>
      <HeroSection
        depositCapBar={depositCapBar}
        vaultOption={vaultOption}
        variant={vaultVersion}
        v1Inactive={
          vaultVersion === "v1" ? !isLoading && vaultLimit.isZero() : undefined
        }
      />

      <DepositPageContainer className="py-5">
        <div className="row">
          {VaultAddressMap[vaultOption][vaultVersion] && chainId && (
            <BaseLink
              to={`${getEtherscanURI(chainId)}/address/${VaultAddressMap[
                vaultOption
              ][vaultVersion]!}`}
              target="_blank"
              rel="noreferrer noopener"
              className="w-100"
            >
              <ContractButton color={getVaultColor(vaultOption)}>
                <ContractButtonTitle
                  fontSize={14}
                  lineHeight={20}
                  color={getVaultColor(vaultOption)}
                  className="mr-2"
                >
                  {`CONTRACT: ${truncateAddress(
                    VaultAddressMap[vaultOption][vaultVersion]!
                  )}`}
                </ContractButtonTitle>
                <ExternalIcon color={getVaultColor(vaultOption)} />
              </ContractButton>
            </BaseLink>
          )}
          <PerformanceSection
            vault={{ vaultOption, vaultVersion }}
            active={
              !(
                vaultVersion === "v1" && isPracticallyZero(vaultLimit, decimals)
              )
            }
          />

          {/* Form for desktop */}
          <DesktopActionsFormContainer className="flex-column col-xl-5 offset-xl-1 col-md-6">
            <DesktopActionForm vault={{ vaultOption, vaultVersion }} />
          </DesktopActionsFormContainer>
        </div>
        <VaultActivity vault={{ vaultOption, vaultVersion }} />
      </DepositPageContainer>

      {/* Desktop Position Component */}
      <YourPosition vault={{ vaultOption, vaultVersion }} variant="desktop" />
    </>
  );
};

const HeroSection: React.FC<{
  depositCapBar: ReactNode;
  vaultOption: VaultOptions;
  variant: VaultVersion;
  v1Inactive?: boolean;
}> = ({ depositCapBar, vaultOption, variant, v1Inactive }) => {
  const { chainId } = useWeb3React();
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
            markerConfig={{
              right: "0px",
              border: "none",
            }}
          />
        );
      case "AAVE":
        return <Logo showBackground />;
      case "WAVAX":
        return <Logo showBackground />;
      default:
        return <Logo />;
    }
  }, [vaultOption]);

  const liveryHeroSection = useMemo(() => {
    switch (variant) {
      case "v2":
        return (
          <>
            <LiveryBar color={color} position="top" />
            <LiveryBar color={color} position="bottom" />
          </>
        );
      default:
        return <></>;
    }
  }, [color, variant]);

  return (
    <>
      {/* V1 top banner */}
      {variant === "v1" &&
        chainId &&
        hasVaultVersion(vaultOption, "v2", chainId) && (
          <Banner
            color={color}
            message={
              v1Inactive
                ? "V1 vaults are now inactive and do not accept deposits"
                : "V2 vaults are now live"
            }
            linkURI={getVaultURI(vaultOption, "v2")}
            linkText="Switch to V2"
          ></Banner>
        )}

      <HeroContainer className="position-relative" color={color}>
        <DepositPageContainer className="container">
          <div className="row mx-lg-n1 position-relative">
            <div style={{ zIndex: 1 }} className="col-xl-6 d-flex flex-column">
              <div className="d-flex flex-row my-3">
                {productCopies[vaultOption].tags.map((tag) => (
                  <TagPill
                    className="mr-2 text-uppercase"
                    key={tag}
                    color={color}
                  >
                    {tag}
                  </TagPill>
                ))}
                <AttributePill className="mr-2 text-uppercase" color={color}>
                  {[...VaultVersionList].map((version) =>
                    chainId &&
                    hasVaultVersion(vaultOption, version, chainId) ? (
                      <BaseLink
                        to={getVaultURI(vaultOption, version)}
                        key={version}
                      >
                        <AttributeVersionSelector
                          active={version === variant}
                          color={color}
                        >
                          <Title color={color}>{version}</Title>
                        </AttributeVersionSelector>
                      </BaseLink>
                    ) : null
                  )}
                </AttributePill>
              </div>

              <HeroText>{productCopies[vaultOption].title}</HeroText>

              {depositCapBar}
            </div>

            <SplashImage className="position-absolute col-xl-6">
              {logo}
            </SplashImage>
          </div>
        </DepositPageContainer>

        {liveryHeroSection}
      </HeroContainer>
    </>
  );
};

export default DepositPage;
