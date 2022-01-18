import { useWeb3React } from "@web3-react/core";
import React, { ReactNode, useMemo } from "react";
import { useHistory } from "react-router";

import { BaseLink, Title } from "shared/lib/designSystem";
import PerformanceSection from "../DepositPage/PerformanceSection";
import { isProduction } from "shared/lib/utils/env";

import sizes from "shared/lib/designSystem/sizes";
import styled, { keyframes } from "styled-components";
import usePullUp from "../../hooks/usePullUp";
import { Container } from "react-bootstrap";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import TreasuryActionForm from "../../components/Vault/VaultActionsForm/TreasuryActionsForm";
import VaultInformation from "../../components/Deposit/VaultInformation";
import { useWhitelist } from "../../hooks/useWhitelist";
import { treasuryCopy } from "../../components/Product/treasuryCopies";

const RBNcolor = "#fc0a54";

type SVGProps = React.SVGAttributes<SVGElement>;

export const RBNLogo: React.FC<SVGProps> = ({ ...props }) => (
  <svg
    viewBox="0 -55 480 480"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      y="-60"
      width="480"
      height="480"
      rx="240"
      fill="#FC0A54"
      fill-opacity="0.24"
    />
    <path
      d="M239.401 86.4L33.0012 301.8C33.0012 301.8 30.2809 296.982 27.7146 292.2C26.5577 290.044 25.4321 287.896 24.6012 286.2C23.4505 283.851 23.1372 283.636 22.2012 281.4C21.2309 279.6 19.8012 276 19.8012 276L19.2012 274.2L239.401 43.8L378.601 187.8L238.201 338.4L216.601 318L337.201 187.8L239.401 86.4Z"
      fill="#FC0A54"
    />
  </svg>
);

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

const HomePage = () => {
  usePullUp();
  const { active } = useWeb3React();
  const history = useHistory();
  const web3Whitelist = useWhitelist();
  const whitelist = !isProduction()
    ? active
      ? "T-PERP-C"
      : undefined
    : web3Whitelist;

  if (whitelist) {
    history.push("/treasury/" + whitelist);
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

  return (
    <>
      <HeroSection vaultInformation={vaultInformation} />

      <DepositPageContainer className="py-5">
        <div className="row">
          <PerformanceSection active={true} />

          {/* Form for desktop */}
          <DesktopActionsFormContainer className="flex-column col-xl-5 offset-xl-1 col-md-6">
            <TreasuryActionForm variant="desktop" />
          </DesktopActionsFormContainer>
        </div>
      </DepositPageContainer>
    </>
  );
};

const HeroSection: React.FC<{
  vaultInformation: ReactNode;
}> = ({ vaultInformation }) => {
  const color = RBNcolor;

  const logo = useMemo(() => {
    const Logo = RBNLogo;
    return <Logo />;
  }, []);

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
        <HeroDescriptionContainer className="container">
          <div className="row mx-lg-n1 position-relative">
            <div style={{ zIndex: 1 }} className="col-xl-6 d-flex flex-column">
              <div className="d-flex flex-row my-3">
                {treasuryCopy.tags.map((tag) => (
                  <TagPill
                    className="mr-2 text-uppercase"
                    key={tag}
                    color={color}
                  >
                    {tag}
                  </TagPill>
                ))}
                <AttributePill className="mr-2 text-uppercase" color={color}>
                  <BaseLink to={"/"} key={"v2"}>
                    <AttributeVersionSelector active={true} color={color}>
                      <Title color={color}>v2</Title>
                    </AttributeVersionSelector>
                  </BaseLink>
                </AttributePill>
              </div>

              <HeroText>{"Treasury"}</HeroText>

              {vaultInformation}
            </div>

            <SplashImage className="position-absolute col-xl-6">
              {logo}
            </SplashImage>
          </div>
        </HeroDescriptionContainer>

        {liveryHeroSection}
      </HeroContainer>
    </>
  );
};

export default HomePage;
