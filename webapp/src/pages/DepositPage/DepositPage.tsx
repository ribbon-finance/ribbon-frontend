import React, { ReactNode, useMemo } from "react";
import { ethers } from "ethers";
import styled from "styled-components";

import {
  BaseIndicator,
  BaseLink,
  PrimaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import CapBar from "shared/lib/components/Deposit/CapBar";
import PerformanceSection from "./PerformanceSection";
import {
  useVaultData,
  useV2VaultData,
} from "shared/lib/hooks/vaultDataContext";
import {
  formatSignificantDecimals,
  isPracticallyZero,
} from "shared/lib/utils/math";
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
import { Redirect } from "react-router-dom";
import YourPosition from "shared/lib/components/Vault/YourPosition";
import { truncateAddress } from "shared/lib/utils/address";
import { ExternalIcon } from "shared/lib/assets/icons/icons";

const { formatUnits } = ethers.utils;

const DepositPageContainer = styled(Container)`
  @media (min-width: ${sizes.xl}px) {
    max-width: 1140px;
  }
`;

const BannerContainer = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: ${(props) => `${props.color}29`};
  padding: 12px 0px;
`;

const BannerButton = styled.div<{ color: string }>`
  padding: 10px 16px;
  border: ${theme.border.width} ${theme.border.style} ${(props) => props.color};
  border-radius: 100px;
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

const DepositPage = () => {
  usePullUp();
  const { vaultOption, vaultVersion } = useVaultOption();
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
   * Redirect to homepage if no clear vault is choosen
   */
  if (!vaultOption) {
    return <Redirect to="/" />;
  }

  /**
   * Redirect to v1 if vault version given is invalid
   */
  if (vaultVersion !== "v1" && !hasVaultVersion(vaultOption, vaultVersion)) {
    return <Redirect to={getVaultURI(vaultOption, "v1")} />;
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
          {VaultAddressMap[vaultOption][vaultVersion] && (
            <BaseLink
              to={`${getEtherscanURI()}/address/${VaultAddressMap[vaultOption][
                vaultVersion
              ]!}`}
              target="_blank"
              rel="noreferrer noopener"
              className="w-100"
            >
              <ContractButton color={getVaultColor(vaultOption)}>
                <Title color={getVaultColor(vaultOption)} className="mr-2">
                  {`CONTRACT: ${truncateAddress(
                    VaultAddressMap[vaultOption][vaultVersion]!
                  )}`}
                </Title>
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
            }}
          />
        );
      default:
        return <Logo />;
    }
  }, [vaultOption]);

  return (
    <>
      {/* V1 top banner */}
      {variant === "v1" && hasVaultVersion(vaultOption, "v2") && (
        <BannerContainer color={color}>
          <BaseIndicator size={8} color={color} className="mr-2" />
          <PrimaryText
            fontSize={14}
            lineHeight={20}
            color={color}
            className="mr-3"
          >
            {v1Inactive
              ? "V1 vaults are now inactive and do not accept deposits"
              : "V2 vaults are now live"}
          </PrimaryText>
          <BaseLink to={getVaultURI(vaultOption, "v2")}>
            <BannerButton color={color} role="button">
              <PrimaryText fontSize={14} lineHeight={20} color={color}>
                Switch to V2
              </PrimaryText>
            </BannerButton>
          </BaseLink>
        </BannerContainer>
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
                  {[...VaultVersionList].reverse().map((version) =>
                    version === "v1" ||
                    hasVaultVersion(vaultOption, version) ? (
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
      </HeroContainer>
    </>
  );
};

export default DepositPage;
