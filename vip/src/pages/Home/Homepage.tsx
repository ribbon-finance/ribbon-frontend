import styled, { css, keyframes } from "styled-components";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import { URLS } from "shared/lib/constants/constants";
import usePullUp from "webapp/lib/hooks/usePullUp";
import { useHistory } from "react-router-dom";
import colors from "shared/lib/designSystem/colors";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { useCallback, useEffect, useState } from "react";
import Chevron from "../../img/scroll-chevron.svg";
import { useWebappGlobalState } from "../../store/store";
import BackgroundLoader from "../../components/BackgroundLoader";

const HomepageContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: calc(100vh - ${theme.header.height}px);

  @media (max-width: ${sizes.md}px) {
    // display: block;
    // position: relative;
    // height: calc(100vh - ${theme.header.height}px + 120px);
    height: 100%;
  }
`;

const FloatingContainer = styled.div<{ footerHeight?: number }>`
  width: 100%;
  height: calc(
    100vh - ${theme.header.height}px -
      ${(props) => (props.footerHeight ? props.footerHeight + 48 : 48)}px
  );
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 600px;
  position: relative;

  @media (max-width: ${sizes.md}px) {
    flex-direction: column;
    height: fit-content;
    display: flex;
  }
`;

const LandingContent = styled.div`
  text-align: center;
  position: relative;

  > *:not(:last-child) {
    margin-bottom: 16px !important;
  }

  h1 {
    color: white;
    font-size: 56px;
    font-family: VCR;
    text-transform: uppercase;
  }

  p {
    font-size: 16px;
    color: ${colors.text};
  }

  @media (max-width: ${sizes.md}px) {
    margin: auto;
  }
`;

const ProductText = styled.p`
  font-size: 10px !important;

  > * {
    display: inline-flex;
  }

  a {
    color: ${colors.text};
    text-decoration: underline;

    span {
      display: block;
      margin-left: 4px;
    }
  }
`;

const AccessLink = styled.a`
  font-size: 14px;
  color: ${colors.primaryText};
  padding: 8px 16px;
  background: none;
  border: 1px solid white;
  border-radius: 6px;
  display: block;
  margin: auto;
  font-family: VCR;
  text-transform: uppercase;
  width: fit-content;

  &:hover {
    background-color: ${colors.primaryText};
    color: black;
    text-decoration: none;
  }
`;

const LandingSteps = styled.div<{ totalSteps: number }>`
  position: absolute;
  bottom: 48px;
  display: flex;
  transition: 0.2s;

  @media (max-width: calc(${sizes.md}px)) {
    display: block;
    // bottom: 120px;
    top: calc(${theme.header.height}px + 600px);
    height: fit-content;
    padding-bottom: calc(120px + 104px);
  }
`;

const StepContainer = styled.div`
  width: 280px;
  position: relative;

  @media (min-width: ${sizes.md}px) {
    width: 250px;
    &:not(:last-of-type) {
      margin-right: 10px;
    }
  }

  @media (min-width: ${sizes.lg}px) {
    &:not(:last-of-type) {
      margin-right: 50px;
    }
  }

  @media (max-width: ${sizes.md}px) {
    margin: auto;

    &:not(:last-of-type) {
      margin-bottom: 80px;
    }
  }
`;

const StepTitle = styled.h6<{ active: boolean }>`
  transition: 0.2s;
  color: ${(props) =>
    props.active ? colors.primaryText : colors.quaternaryText};
  font-family: VCR;
  text-align: center;

  @media (max-width: ${sizes.md}px) {
    color: ${colors.primaryText};
  }
`;

const StepContent = styled.p<{ active: boolean }>`
  transition: 0.2s;
  color: ${(props) => (props.active ? colors.text : colors.quaternaryText)};
  text-align: center;
  font-size: 14px;

  @media (max-width: ${sizes.md}px) {
    color: ${colors.text};
  }
`;

const StepProgressContainer = styled.div`
  position: absolute;
  bottom: 0px;
  height: 4px;
  background: ${colors.background.four};
  width: 100%;

  @media (max-width: calc(${sizes.md}px)) {
    display: none;
  }

  @media (max-width: ${sizes.md}px) {
    color: ${colors.text};
  }
`;

const progress = keyframes`
  0% {
    width: 0%;
    left: 0;
    right: unset;
  }

  80% {
    width: 100%;
    left: 0;
    right: 0;
  }

  85% {
    width: 100%;
    left: auto;
    right: 0;
  }

  100% {
    width: 0%;
    left: auto;
    right: 0;
  }
`;

const stepAnimation = css<{ interval: number }>`
  animation: ${(props) => props.interval}s ${progress} infinite;
  background: white;
  position: absolute;
`;

const StepProgress = styled.div<{ active: boolean; interval: number }>`
  height: 4px;
  transition: 0.2s;

  ${(props) => (props.active ? stepAnimation : "width: 0%")};
`;

const scroll = keyframes`
  0% {
    transform: translateY(0);
  }

  75% {
    transform: translateY(16px);
  }

  100% {
    transform: translateY(0);
  }
`;

const ScrollText = styled.div`
  display: none;

  @media (max-width: calc(${sizes.md}px)) {
    display: initial;
    position: absolute;
    bottom: 104px;
    margin: 0;
    color: ${colors.text};
    font-size: 12px;
  }

  img {
    display: block;
    margin-left: 4px;
    animation: 2s ${scroll} infinite;
  }
`;

interface Step {
  title: string;
  content: string;
  interval?: number;
}

const Homepage = () => {
  usePullUp();
  const history = useHistory();
  const { width } = useScreenSize();
  const auth = localStorage.getItem("auth");
  const [footerRef, setFooterRef] = useState<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const interval = 5;
  const [, setAccessModal] = useWebappGlobalState("isAccessModalVisible");

  useEffect(() => {
    if (width > sizes.md) {
      const stepTimer = setTimeout(() => {
        if (activeStep < steps.length - 1) {
          setActiveStep(activeStep + 1);
        } else {
          setActiveStep(0);
        }
      }, interval * 1000);

      return () => clearTimeout(stepTimer);
    }
  });

  const steps: Step[] = [
    {
      title: "01",
      content: "Exclusive access to custom tactical trades via VIP vaults",
    },
    {
      title: "02",
      content: "24/7 support with a direct line to the Ribbon Labs team",
    },
    {
      title: "03",
      content: "Early previews of new products and features",
    },
  ];

  if (auth) {
    const userAddress = JSON.parse(auth).pop();
    if (userAddress) {
      history.push("/vip/");
    }
  }

  const onSetFooterRef = useCallback((ref) => {
    setFooterRef(ref);
  }, []);

  return (
    <HomepageContainer>
      <BackgroundLoader active={true} />
      <FloatingContainer footerHeight={footerRef?.offsetHeight}>
        <LandingContent>
          <h1>Ribbon VIP</h1>
          <p>
            A suite of prime services offered to Ribbon’s largest stakeholders
          </p>
          <AccessLink role="button" onClick={() => setAccessModal(true)}>
            Open VIP Vaults
          </AccessLink>
          <ProductText>
            A product by{" "}
            <a
              href={URLS.ribbonFinance}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ribbon Finance <ExternalIcon height={12} width={12} />
            </a>
          </ProductText>
        </LandingContent>
        <ScrollText>
          Scroll <img src={Chevron} alt="chevron" />
        </ScrollText>
      </FloatingContainer>
      <LandingSteps ref={onSetFooterRef} totalSteps={steps.length}>
        {steps.map((step, i) => (
          <StepContainer>
            <StepTitle active={activeStep === i}>{step.title}</StepTitle>
            <StepContent active={activeStep === i}>{step.content}</StepContent>
            <StepProgressContainer>
              <StepProgress interval={interval} active={activeStep === i} />
            </StepProgressContainer>
          </StepContainer>
        ))}
      </LandingSteps>
    </HomepageContainer>
  );
};

export default Homepage;
