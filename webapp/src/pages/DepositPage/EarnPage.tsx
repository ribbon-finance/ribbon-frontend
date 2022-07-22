import React, { ReactNode, useMemo, useState, useCallback } from "react";
import { BigNumber, ethers } from "ethers";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BaseLink, SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import CapBar from "shared/lib/components/Deposit/CapBar";
import LiveryBar from "shared/lib/components/Deposit/LiveryBar";
import { AnimatePresence, motion } from "framer-motion";
import { useVaultData, useV2VaultData } from "shared/lib/hooks/web3DataContext";
import {
  formatBigNumber,
  formatSignificantDecimals,
  isPracticallyZero,
} from "shared/lib/utils/math";
import sizes from "shared/lib/designSystem/sizes";
import VaultActivity from "../../components/Vault/VaultActivity";
import usePullUp from "../../hooks/usePullUp";
import {
  getVaultChain,
  getDisplayAssets,
  getExplorerURI,
  hasVaultVersion,
  VaultAddressMap,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
  isPutVault,
} from "shared/lib/constants/constants";
import { BaseModalContentColumn, Subtitle } from "shared/lib/designSystem";
import useVaultOption from "../../hooks/useVaultOption";
import { getVaultColor } from "shared/lib/utils/vault";
import { getAssetLogo, getChainByVaultOption } from "shared/lib/utils/asset";
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
import EarnStrategyExplainer from "../../components/Deposit/EarnStrategyExplainer";
import { useGlobalState } from "shared/lib/store/store";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { keyframes } from "styled-components";
import { ActionButton } from "shared/lib/components/Common/buttons";
const { formatUnits } = ethers.utils;

const ProductAssetLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  width: 56px;
  margin-top: calc(-56px / 2);
  background-color: ${colors.background.one};
  border-radius: 50%;
  position: relative;
  box-shadow: 0px 0px 0px 2px ${colors.background.two};

  &:before {
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    content: " ";
    background: ${(props) => props.color}29;
    border-radius: 50%;
  }
`;

const BalanceTitle = styled.div`
  font-size: 14px;
  font-family: VCR;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 1px;
  color: ${colors.primaryText}7A;
`;

const Circle = styled.div<{
  size: number;
  color: string;
  circleIndex: number;
}>`
  z-index: 0;
  overflow: show;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  border: 1px dashed #3e73c4;
  opacity: 0.24;
  max-height: 100vh;
`;

const BigCircle = styled.div<{
  size: number;
  color: string;
}>`
  z-index: 0;
  overflow: hidden;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  border: 4px dashed #3e73c4;
  box-shadow: 1px 2px 40px 8px rgba(62, 115, 196, 0.25);
  opacity: 0.24;
  max-height: 100vh;
`;

const DepositPageContainer = styled(Container)`
  @media (min-width: ${sizes.xl}px) {
    max-width: 1140px;
    max-height: 100vh;
  }
`;

const VaultContainer = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 80vh;
  flex-direction: column;
  opacity: 1;
  z-index: 1;
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

const HeroText = styled(Title)`
  font-size: 56px;
  line-height: 64px;
  margin-bottom: 16px;
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

const ViewDetailsButton = styled.div`
  display: flex;
  flex-direction: column;
  width: 136px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  border-radius: 100px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 24px;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
  gap: 8px;
  line-height: 20px;
  font-size: 12px;
  z-index: 1000;
`;

const DepositAssetButton = styled.div`
  position: absolute;
  top: 50%;
  right: 48px;
  transform: translate(-16px, -50%);
  height: 32px;
  width: 56px;
  background: ${colors.background.four};
  border-radius: 100px;
`;

const EarnPage = () => {
  const { vaultOption, vaultVersion } = useVaultOption();
  const { chainId } = useWeb3Wallet();
  useRedirectOnWrongChain(vaultOption, chainId);
  const { t } = useTranslation();
  usePullUp();
  console.log(vaultOption);
  let color;
  if (vaultOption) {
    color = getVaultColor(vaultOption);
  }
  const [showVault] = useGlobalState("showEarnVault");
  const { status, deposits, vaultLimit } = useVaultData(
    vaultOption || VaultList[0]
  );

  const {
    data: { asset, cap, decimals, totalBalance },
    loading,
  } = useV2VaultData(vaultOption || VaultList[0]);
  useRedirectOnSwitchChain(getChainByVaultOption(vaultOption as VaultOptions));
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
      case "earn":
      case "v2":
        return [
          parseFloat(
            formatSignificantDecimals(formatUnits(totalBalance, decimals), 2)
          ),
          parseFloat(formatSignificantDecimals(formatUnits(cap, decimals))),
        ];
    }
  }, [cap, decimals, deposits, totalBalance, vaultLimit, vaultVersion]);

  const { vaultAccounts } = useVaultAccounts(vaultVersion);

  const vaultAccount = vaultAccounts["rEARN"];

  const Logo = getAssetLogo("USDC");

  let logo = <Logo height="100%" />;

  const [investedInStrategy, queuedAmount, yieldEarned] = useMemo(() => {
    switch (vaultVersion) {
      case "v1":
      case "v2":
      case "earn":
        if (!vaultAccount) {
          return [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)];
        }
        return [
          vaultAccount.totalBalance.sub(vaultAccount.totalPendingDeposit),
          vaultAccount.totalPendingDeposit,
          vaultAccount.totalYieldEarned,
        ];
    }
  }, [vaultAccount, vaultVersion]);
  const [roi, yieldColor] = useMemo(() => {
    const vaultAccount = vaultAccounts["rEARN"];
    if (
      !vaultAccount ||
      isPracticallyZero(vaultAccount.totalDeposits, decimals)
    ) {
      return [0, colors.green];
    }

    const roiTemp =
      (parseFloat(
        formatUnits(
          vaultAccount.totalBalance.sub(vaultAccount.totalDeposits),
          decimals
        )
      ) /
        parseFloat(formatUnits(vaultAccount.totalDeposits, decimals))) *
      100;

    const roiColor = roiTemp >= 0 ? colors.green : colors.red;
    return [
      (parseFloat(
        formatUnits(
          vaultAccount.totalBalance.sub(vaultAccount.totalDeposits),
          decimals
        )
      ) /
        parseFloat(formatUnits(vaultAccount.totalDeposits, decimals))) *
        100,
      roiColor,
    ];
  }, [vaultAccounts, vaultOption, decimals]);
  /**
   * Redirect to homepage if no clear vault is chosen
   */
  if (!vaultOption) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <VaultContainer>
        {showVault.show ? (
          <AnimatePresence exitBeforeEnter initial={true}>
            <motion.div
              key={"showVault"}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
                type: "keyframes",
                ease: "easeInOut",
              }}
            >
              <VaultContainer>
                <ProductAssetLogoContainer className={`mb-3`} color={"blue"}>
                  {logo}
                </ProductAssetLogoContainer>
                <BalanceTitle className={`py-3`}>Your Balance</BalanceTitle>
                <HeroText>
                  {formatBigNumber(investedInStrategy, decimals)}
                </HeroText>
                <Subtitle color={yieldColor}>+{roi}%</Subtitle>
                <ViewDetailsButton className={`mt-4 py-3 mb-4`}>
                  View Details
                </ViewDetailsButton>

                <ActionButton className={`mt-4 py-3 mb-0`} color={color}>
                  Deposit
                </ActionButton>
                <ActionButton className={`py-3 mb-1`} color={"none"}>
                  <div color={colors.background.one}>Withdraw</div>
                </ActionButton>
              </VaultContainer>
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence exitBeforeEnter initial={true}>
            <motion.div
              key={"showIntro"}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
                type: "keyframes",
                ease: "easeInOut",
              }}
            >
              <EarnStrategyExplainer />
            </motion.div>
          </AnimatePresence>
        )}
        <BigCircle size={976} color={"blue"}></BigCircle>
        <Circle size={800} color={"blue"} circleIndex={1}></Circle>
        <Circle size={640} color={"blue"} circleIndex={0}></Circle>
      </VaultContainer>
    </>
  );
};

export default EarnPage;
