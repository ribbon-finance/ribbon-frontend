import React, { ReactNode, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { useHistory } from "react-router";

import {
  BaseLink,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import VaultInformation from "../../components/Deposit/VaultInformation";
import PerformanceSection from "./PerformanceSection";
import { useWhitelist } from "../../hooks/useWhitelist";
import sizes from "shared/lib/designSystem/sizes";
import usePullUp from "../../hooks/usePullUp";
import { treasuryCopies } from "../../components/Product/productCopies";
import { getAssetLogo } from "../../utils/asset";
import { Container } from "react-bootstrap";
import theme from "shared/lib/designSystem/theme";
import YourPosition from "../../components/Vault/YourPosition";
import TreasuryActionForm from "../../components/Vault/VaultActionsForm/TreasuryActionsForm";

const RBNcolor = "#fc0a54";

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

const DepositPage = () => {
  usePullUp();
  const history = useHistory();
  const whitelist = useWhitelist();

  if (whitelist) {
    history.push("/treasury/" + whitelist)
  }

  const vaultInformation = (
    <VaultInformation
      loading={false}
      vaultDeposit={0}
      vaultYield={0}
      displayData={{ deposit: "---", yield: "---" }}
      asset={"USDC"}
    />
  );

  const vaultOption = "rBZRX-TSRY";
  const vaultVersion = "v2";

  return (
    <>
      <HeroSection
        vaultInformation={vaultInformation}
      />

      <DepositPageContainer className="py-5">
        <div className="row">
          <PerformanceSection
            vault={{ vaultOption, vaultVersion }}
            active={true}
          />

          {/* Form for desktop */}
          <DesktopActionsFormContainer className="flex-column col-xl-5 offset-xl-1 col-md-6">
            <TreasuryActionForm variant="desktop"/>
          </DesktopActionsFormContainer>
        </div>

      </DepositPageContainer>

    </>
  );
};

const HeroSection: React.FC<{
  vaultInformation: ReactNode;
}> = ({vaultInformation}) => {
  const color = RBNcolor;
  const vaultOption = "Treasury"

  const logo = useMemo(() => {
    const Logo = getAssetLogo("RBN");
    return <Logo />
  }, [vaultOption]);

  const liveryHeroSection = useMemo(() => {
    return (
      <>
        <LiveryBar color={color} position="top" />
        <LiveryBar color={color} position="bottom" />
      </>
    );
  }, [color]);

  return (
    <>
      <HeroContainer className="position-relative" color={color}>
        <DepositPageContainer className="container">
          <div className="row mx-lg-n1 position-relative">
            <div style={{ zIndex: 1 }} className="col-xl-6 d-flex flex-column">
              <div className="d-flex flex-row my-3">
                {treasuryCopies[vaultOption].tags.map((tag) => (
                  <TagPill
                    className="mr-2 text-uppercase"
                    key={tag}
                    color={color}
                  >
                    {tag}
                  </TagPill>
                ))}
                <AttributePill className="mr-2 text-uppercase" color={color}>
                  <BaseLink
                    to={"/"}
                    key={"v2"}
                  >
                    <AttributeVersionSelector
                      active={true}
                      color={color}
                    >
                      <Title color={color}>v2</Title>
                    </AttributeVersionSelector>
                  </BaseLink>
                </AttributePill>
              </div>

              <HeroText>{treasuryCopies[vaultOption].title}</HeroText>

              {vaultInformation}
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
