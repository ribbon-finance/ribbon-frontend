import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import sizes from "../../designSystem/sizes";
import { SecondaryText, Title } from "shared/lib/designSystem/index";
import { AnimatePresence, motion } from "framer";

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  justify-content: center;
  align-items: center;
  z-index: 999;
  border-bottom: 1px solid ${colors.border};
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

const StyledTitle = styled(Title)<{
  size?: number;
  marginLeft?: number;
  marginRight?: number;
  color?: string;
}>`
  text-align: center;
  color: ${(props) =>
    props.color === undefined ? `${colors.primaryText}` : `${props.color}`};
  margin-right: ${(props) =>
    props.marginRight === undefined ? `0px` : `${props.marginRight}px`};
  margin-left: ${(props) =>
    props.marginLeft === undefined ? `0px` : `${props.marginLeft}px`};
  font-size: ${(props) =>
    props.size === undefined ? `14px` : `${props.size}px`};
  line-height: 20px;
`;

const StyledSecondaryText = styled(SecondaryText)<{ color?: string }>`
  color: ${(props) =>
    props.color === undefined ? `${colors.primaryText}` : `${props.color}`};
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

const HorizontalHeaderTextContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  text-align: center;
  height: 16px;
  position: absolute;
  margin: auto;
`;

const ExplanationStepList = ["step1", "step2", "step3"] as const;

type ExplanationStep = typeof ExplanationStepList[number];

const HorizontalHeader: React.FC = () => {
  const [step, setStep] = useState<ExplanationStep>(ExplanationStepList[0]);

  useEffect(() => {
    setTimeout(() => {
      setStep(
        ExplanationStepList.indexOf(step) + 1 === ExplanationStepList.length
          ? ExplanationStepList[0]
          : ExplanationStepList[ExplanationStepList.indexOf(step) + 1]
      );
    }, 2000);
  }, [step]);

  const renderNumber = useCallback((s: ExplanationStep) => {
    switch (s) {
      case "step1":
        return "01";
      case "step2":
        return "02";
      case "step3":
        return "03";
    }
  }, []);

  const renderExplanation = useCallback((s: ExplanationStep) => {
    switch (s) {
      case "step1":
        return "Earn enhanced yield on USDC deposits";
      case "step2":
        return "No lock-ups";
      case "step3":
        return "Lend to institutions with the highest-quality credit";
    }
  }, []);

  return (
    <HeaderContainer>
      <HorizontalHeaderTextContainer>
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
            <StyledTitle color={colors.tertiaryText} marginRight={8} size={12}>
              {renderNumber(step)}
            </StyledTitle>
            <StyledSecondaryText>{renderExplanation(step)}</StyledSecondaryText>
          </motion.div>
        </AnimatePresence>
      </HorizontalHeaderTextContainer>
      <ButtonContainer>
        <a href="https://app.ribbon.finance">
          <ButtonText>OPEN APP</ButtonText>
        </a>
      </ButtonContainer>
    </HeaderContainer>
  );
};

export default HorizontalHeader;
