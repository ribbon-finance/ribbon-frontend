import React, { ReactNode, useMemo } from "react";
import { ethers } from "ethers";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LiveryBar from "shared/lib/components/Deposit/LiveryBar";
import { BaseLink, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import PerformanceSection from "./PerformanceSection";
import { useVaultData, useV2VaultData } from "shared/lib/hooks/web3DataContext";
import {
  formatSignificantDecimals,
  isPracticallyZero,
} from "shared/lib/utils/math";
import sizes from "shared/lib/designSystem/sizes";
import VaultActivity from "../../components/Vault/VaultActivity";
import usePullUp from "webapp/lib/hooks/usePullUp";
import {
  getDisplayAssets,
  getEtherscanURI,
  hasVaultVersion,
  isPutVault,
  VaultAddressMap,
  VaultList,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import useVaultOption from "../../hooks/useVaultOption";
import { getVaultColor } from "shared/lib/utils/vault";
import { getAssetDecimals, getAssetLogo } from "shared/lib/utils/asset";
import { Container } from "react-bootstrap";
import theme from "shared/lib/designSystem/theme";
import { getVaultURI } from "../../constants/constants";
import DesktopActionForm from "../../components/Vault/VaultActionsForm/DesktopActionForm";
import YourPosition from "../../components/Vault/YourPosition";
import { truncateAddress } from "shared/lib/utils/address";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import Banner from "shared/lib/components/Banner/Banner";
import VaultInformation from "../../components/Deposit/VaultInformation";
import useVaultActivity from "shared/lib/hooks/useVaultActivity";

const { formatUnits } = ethers.utils;

const DepositPageContainer = styled(Container)`
  @media (min-width: ${sizes.xl}px) {
    max-width: 1140px;
  }
`;

const HeroDescriptionContainer = styled(Container)`
  @media (min-width: ${sizes.xl}px) {
    max-width: 1140px;
  }
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
`;

const HeroContainer = styled.div<{ color: string }>`
  background: linear-gradient(
    96.84deg,
    ${(props) => props.color}29 1.04%,
    ${(props) => props.color}07 98.99%
  );
  height: 400px;
  padding: 40px 0;
  overflow: hidden;
`;

const HeroText = styled(Title)`
  font-size: 56px;
  line-height: 64px;
  margin-bottom: 24px;
`;

const AbsoluteContainer = styled.div<{ position: "top" | "bottom" }>`
  position: absolute;
  left: 0;
  right: 0;
  ${({ position }) => {
    if (position === "top") {
      return "top: 0;";
    } else if (position === "bottom") {
      return "bottom: 0;";
    }
    return "";
  }}
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
  const auth = localStorage.getItem("auth");

  const { vaultOption, vaultVersion } = useVaultOption();
  const { chainId } = useWeb3Wallet();

  usePullUp();

  const { status, deposits, vaultLimit } = useVaultData(
    vaultOption || VaultList[0]
  );
  const {
    data: { asset, cap, decimals, totalBalance },
    loading,
  } = useV2VaultData(vaultOption || VaultList[0]);

  const isLoading = status === "loading" || loading;
  const activities = useVaultActivity(vaultOption!, vaultVersion);
  const premiumDecimals = getAssetDecimals("USDC");

  const [totalDepositStr] = useMemo(() => {
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

  // Total lifetime yield
  const totalYields = useMemo(() => {
    if (activities.activities) {
      const yields = activities.activities
        .map((activity) => {
          return activity.type === "sales" ? Number(activity.premium) * 0.9 : 0;
        })
        .reduce((totalYield, roundlyYield) => totalYield + roundlyYield, 0);

      return parseFloat(
        formatSignificantDecimals(formatUnits(yields, premiumDecimals), 2)
      );
    } else {
      return 0;
    }
  }, [activities, premiumDecimals]);

  const vaultInformation = (
    <VaultInformation
      loading={isLoading}
      vaultDeposit={totalDepositStr}
      vaultYield={totalYields}
      asset={asset}
    />
  );

  /**
   * Redirect to homepage if no clear vault is chosen
   */

  if (!vaultOption) {
    return <Redirect to="/" />;
  }

  if (!auth || !auth.includes(vaultOption)) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <HeroSection
        vaultInformation={vaultInformation}
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
  vaultInformation: ReactNode;
  vaultOption: VaultOptions;
  variant: VaultVersion;
  v1Inactive?: boolean;
}> = ({ vaultInformation, vaultOption, variant, v1Inactive }) => {
  const { t } = useTranslation();
  const color = getVaultColor(vaultOption);

  const logo = useMemo(() => {
    const asset = getDisplayAssets(vaultOption);
    const Logo = getAssetLogo(asset);

    switch (asset) {
      case "WBTC":
      case "SOL":
      case "USDC":
        return <Logo height="200%" width="200%" />;
      case "AAVE":
      case "WAVAX":
        return <Logo showBackground />;
      case "yvUSDC":
        return (
          <Logo
            height="200%"
            width="200%"
            markerConfig={{
              right: "0px",
              border: "none",
            }}
          />
        );
      default:
        return <Logo />;
    }
  }, [vaultOption]);

  const liveryHeroSection = useMemo(() => {
    switch (variant) {
      case "v2":
        return (
          <>
            <AbsoluteContainer position="top">
              <LiveryBar color={color} animationStyle="rightToLeft" />
            </AbsoluteContainer>
            <AbsoluteContainer position="bottom">
              <LiveryBar color={color} animationStyle="leftToRight" />
            </AbsoluteContainer>
          </>
        );
      default:
        return <></>;
    }
  }, [color, variant]);

  return (
    <>
      {/* V1 top banner */}
      {variant === "v1" && hasVaultVersion(vaultOption, "v2") && (
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
        <HeroDescriptionContainer className="container">
          <div className="row mx-lg-n1 position-relative">
            <div style={{ zIndex: 1 }} className="col-xl-6 d-flex flex-column">
              <div className="d-flex flex-row my-3">
                <TagPill className="mr-2 text-uppercase" color={color}>
                  {isPutVault(vaultOption) ? "PUT-SELLING" : "COVERED CALL"}
                </TagPill>
              </div>

              <HeroText>
                {t(`shared:ProductCopies:${vaultOption}:title`)}
              </HeroText>

              {vaultInformation}
            </div>

            <SplashImage className="position-absolute col-xl-5">
              {logo}
            </SplashImage>
          </div>
        </HeroDescriptionContainer>

        {liveryHeroSection}
      </HeroContainer>
    </>
  );
};

export default DepositPage;
