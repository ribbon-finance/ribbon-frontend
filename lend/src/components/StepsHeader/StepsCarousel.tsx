import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import { SecondaryText, Title } from "shared/lib/designSystem/index";
import { AnimatePresence, motion } from "framer";

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

const StepsHeaderTextContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  text-align: center;
  height: 64px;
  width: 100%;
  position: absolute;
  margin: auto;
`;

const ExplanationStepList = ["step1", "step2", "step3"] as const;

type ExplanationStep = typeof ExplanationStepList[number];

const StepsCarousel: React.FC = () => {
  const [step, setStep] = useState<ExplanationStep>(ExplanationStepList[0]);

  useEffect(() => {
    setTimeout(() => {
      setStep(
        ExplanationStepList.indexOf(step) + 1 === ExplanationStepList.length
          ? ExplanationStepList[0]
          : ExplanationStepList[ExplanationStepList.indexOf(step) + 1]
      );
    }, 4000);
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
    <StepsHeaderTextContainer>
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
    </StepsHeaderTextContainer>
  );
};

export default StepsCarousel;
