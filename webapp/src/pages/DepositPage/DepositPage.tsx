import React, { ReactNode } from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import { Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import DepositCapBar from "./DepositCapBar";
import PerformanceSection from "./PerformanceSection";
import ActionsForm from "../../components/ActionsForm/ActionsForm";
import Theta from "../../components/Product/Splash/Theta";
import useVaultData from "../../hooks/useVaultData";
import { formatSignificantDecimals } from "../../utils/math";
import sizes from "../../designSystem/sizes";

const { formatEther } = ethers.utils;

const HeroContainer = styled.div`
  background: linear-gradient(
    96.84deg,
    rgba(252, 10, 84, 0.16) 1.04%,
    rgba(252, 10, 84, 0.0256) 98.99%
  );
  padding: 40px 0;
`;

const HeroText = styled(Title)`
  font-size: 72px;
  line-height: 72px;
  margin-bottom: 24px;
`;

const AttributePill = styled.div`
  background: ${colors.pillBackground};
  color: ${colors.primaryText};
  border-radius: 4px;
  padding: 16px;
  font-family: VCR;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;

  text-align: center;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const SplashImage = styled.div`
  z-index: 0;
  top: 0;
  right: 0;
  width: 600;
  overflow: hidden;
`;

const DesktopActionsFormContainer = styled.div`
  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const DepositPage = () => {
  const { status, deposits, vaultLimit } = useVaultData();
  const isLoading = status === "loading";

  const totalDepositStr = isLoading
    ? 0
    : parseFloat(formatSignificantDecimals(formatEther(deposits)));
  const depositLimitStr = isLoading
    ? 1
    : parseFloat(formatSignificantDecimals(formatEther(vaultLimit)));

  const depositCapBar = (
    <DepositCapBar
      loading={isLoading}
      totalDeposit={totalDepositStr}
      limit={depositLimitStr}
      copies={{
        totalDeposit: "Current Vault Deposits",
        limit: "Max Vault Capacity",
      }}
    />
  );

  return (
    <>
      <HeroSection depositCapBar={depositCapBar}></HeroSection>

      <div className="container py-5">
        <div className="row mx-lg-n1">
          <PerformanceSection></PerformanceSection>

          <DesktopActionsFormContainer className="col-xl-4 offset-xl-1 col-md-6">
            <ActionsForm variant="desktop" />
          </DesktopActionsFormContainer>
        </div>
      </div>
    </>
  );
};

const HeroSection: React.FC<{ depositCapBar: ReactNode }> = ({
  depositCapBar,
}) => {
  return (
    <HeroContainer className="position-relative">
      <div className="container">
        <div className="row mx-lg-n1">
          <div style={{ zIndex: 1 }} className="col-xl-6 d-flex flex-column">
            <div className="d-flex flex-row my-3">
              <AttributePill className="mr-2 text-uppercase">
                Theta Vault
              </AttributePill>
              <AttributePill className="ml-2 text-uppercase">ETH</AttributePill>
            </div>

            <HeroText>T-100-E</HeroText>

            {depositCapBar}
          </div>

          <SplashImage className="position-absolute offset-xl-6">
            <Theta viewBox="0 120 523.74982 523.74988" />
          </SplashImage>
        </div>
      </div>
    </HeroContainer>
  );
};

export default DepositPage;
