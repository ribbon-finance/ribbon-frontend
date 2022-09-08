import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import Logo from "./Logo";
import colors from "shared/lib/designSystem/colors";
import sizes from "../../designSystem/sizes";
import { SecondaryText } from "../../designSystem";
import { Title } from "shared/lib/designSystem/index";
import { AnimatePresence, motion } from "framer";
import Marquee from "react-fast-marquee/dist";

const VerticalHeader = styled.div`
  display: flex;
  width: 64px;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  border-right: 1px solid ${colors.border};
  padding: 56px 23px 44px 23px;
  z-index: 1000;
`;

const ColumnContainer = styled.div`
  display: flex;
  width: calc(100% - 64px);
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const MainContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const HorizontalHeader = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  justify-content: center;
  align-items: center;
  z-index: 999;
  border-bottom: 1px solid ${colors.border};
`;

const Footer = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  align-items: center;
  z-index: 999;
  border-top: 1px solid ${colors.border};
`;

const LogoContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1000;
  top: 0;
  bottom: 0;
`;

const Panel = styled.div`
  display: flex;
  position: relative;
  width: 25%;
  height: 100%;
  overflow: hidden;
  margin-left: 40px;
  background: ${(props) => props.color};
`;

const ButtonContainer = styled.div`
  display: flex;
  z-index: 0;
  margin-left: auto;
  padding-left: 40px;
  padding-right: 40px;
  height: 100%;
  justify-content: center;
  align-items: center;
  @media (max-width: ${sizes.md}px) {
    display: none;
  }
  border-left: 1px solid ${colors.border};
`;

const Text = styled(Title)<{ size: number }>`
  text-align: center;
  color: ${colors.primaryText};
  font-size: ${(props) => props.size}px;
  line-height: 20px;
`;

const SpecialText = styled(Title)<{ size: number }>`
  color: ${colors.primaryText};
  font-size: 256px;
  line-height: 256px;
  margin-bottom: 17px;
  font-family: VCR, sans-serif;
`;

const StyledSecondaryText = styled(SecondaryText)<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 12px;
`;

const ButtonText = styled.span`
  font-family: VCR;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: ${colors.green};
  margin-left: auto;
`;

const TextInnerContainer = styled.div`
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 50%;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  text-align: center;
  height: 16px;
  position: absolute;
  margin: auto;
`;
const TextContainer2 = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  width: calc(100% / 3);
  text-align: center;
  height: 16px;
  padding-left: 30px;
  padding-right: 30px;
  border-right: 1px solid ${colors.border};
  margin: auto;
`;

const Ticker = styled.div<{ clockwise: boolean }>`
  display: flex;
  max-width: 100%;
  height: 100%;
  -webkit-transform: rotate(
    ${(props) => (props.clockwise ? `90deg` : `-90deg`)}
  );
  -moz-transform: rotate(${(props) => (props.clockwise ? `90deg` : `-90deg`)});
  text-align: center;
  align-self: center;
  align-items: center;
  justify-content: center;
`;

const Video1 = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  height: calc(50% - 16px);
  background: grey;
`;

const Video2 = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  height: calc(50% - 48px);
  top: 0;
  bottom: 0;
  margin: auto;
  background: grey;
`;

const Video3 = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  height: 104px;
  bottom: 40px;
  margin: auto;
  background: grey;
`;

const Video4 = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  height: calc(50% - 48px);
  top: 0;
  bottom: 0;
  margin: auto;
`;

const Video4Content = styled.div`
  height: 40%;
  width: 100%;
  background: grey;
`;

interface PriceTickerInterface {
  clockwise: boolean;
}

const PriceTicker: React.FC<PriceTickerInterface> = ({
  children,
  clockwise,
}) => {
  return (
    <Ticker clockwise={clockwise}>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          transition={{
            delay: 1,
            duration: 0.25,
            type: "keyframes",
            ease: "easeOut",
          }}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <Marquee
            style={{ textAlign: "center" }}
            gradient={false}
            speed={50}
            delay={1}
          >
            {children}
          </Marquee>
        </motion.div>
      </AnimatePresence>
    </Ticker>
  );
};

const ExplanationStepList = ["step1", "step2", "step3"] as const;

type ExplanationStep = typeof ExplanationStepList[number];

const Header: React.FC = () => {
  const [step, setStep] = useState<ExplanationStep>(ExplanationStepList[0]);

  useEffect(() => {
    setTimeout(() => {
      if (
        ExplanationStepList.indexOf(step) + 1 ===
        ExplanationStepList.length
      ) {
        setStep(ExplanationStepList[0]);
      } else {
        setStep(ExplanationStepList[ExplanationStepList.indexOf(step) + 1]);
      }
    }, 2000);
  }, [step]);

  const renderStep = useCallback((s: ExplanationStep) => {
    switch (s) {
      case "step1":
        return (
          <>
            <Text
              style={{ color: colors.tertiaryText, marginRight: 8 }}
              size={12}
            >
              01
            </Text>
            <StyledSecondaryText color={colors.primaryText}>
              Earn enhanced yield on USDC deposits
            </StyledSecondaryText>
          </>
        );
      case "step2":
        return (
          <>
            <Text
              style={{ color: colors.tertiaryText, marginRight: 8 }}
              size={12}
            >
              02
            </Text>
            <StyledSecondaryText color={colors.primaryText}>
              No lock-ups
            </StyledSecondaryText>
          </>
        );
      case "step3":
        return (
          <>
            <Text
              style={{ color: colors.tertiaryText, marginRight: 8 }}
              size={12}
            >
              03
            </Text>
            <StyledSecondaryText color={colors.primaryText}>
              Lend to institutions with the highest-quality credit
            </StyledSecondaryText>
          </>
        );
    }
  }, []);
  return (
    <MainContainer>
      <VerticalHeader>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <TextInnerContainer>
          <Text size={14}>Community</Text>
        </TextInnerContainer>

        <TextInnerContainer>
          <Text size={14}>About</Text>
        </TextInnerContainer>
      </VerticalHeader>
      <ColumnContainer>
        <HorizontalHeader>
          <TextContainer>
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={step}
                transition={{
                  delay: 0.25,
                  duration: 0.5,
                  type: "keyframes",
                  ease: "easeOut",
                }}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                {renderStep(step)}
              </motion.div>
            </AnimatePresence>
            {/* <Text
              style={{ color: colors.tertiaryText, marginRight: 8 }}
              size={12}
            >
              01
            </Text>
            <StyledSecondaryText color={colors.primaryText}>
              Earn enhanced yield on USDC deposits
            </StyledSecondaryText> */}
          </TextContainer>
          <ButtonContainer>
            <a href="https://app.ribbon.finance">
              <ButtonText>OPEN APP</ButtonText>
            </a>
          </ButtonContainer>
        </HorizontalHeader>
        <ContentContainer>
          <Panel>
            <Video1 />
            <PriceTicker clockwise={false}>
              <SpecialText size={256}>Ribbon</SpecialText>
            </PriceTicker>
          </Panel>
          <Panel>
            <Video2 />
          </Panel>
          <Panel>
            <Video3 />
          </Panel>
          <Panel>
            <Video4>
              <Video4Content />
            </Video4>
            <PriceTicker clockwise={true}>
              <SpecialText size={256}>Lend</SpecialText>
            </PriceTicker>
          </Panel>
        </ContentContainer>
        <Footer>
          <TextContainer2>
            <StyledSecondaryText color={colors.tertiaryText}>
              Total Value Locked:
            </StyledSecondaryText>
            <Text style={{ marginLeft: 8 }} size={14}>
              $112,458,199.02
            </Text>
          </TextContainer2>
          <TextContainer2>
            <StyledSecondaryText color={colors.tertiaryText}>
              Total Loans Originated:
            </StyledSecondaryText>
            <Text style={{ marginLeft: 8 }} size={14}>
              $112,458,199.02
            </Text>
          </TextContainer2>
          <TextContainer2>
            <StyledSecondaryText color={colors.tertiaryText}>
              Total Interest Accrued:
            </StyledSecondaryText>
            <Text style={{ marginLeft: 8 }} size={14}>
              {" "}
              $112,458,199.02
            </Text>
          </TextContainer2>
        </Footer>
      </ColumnContainer>
    </MainContainer>
  );
};

export default Header;
