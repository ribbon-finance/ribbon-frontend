import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import colors from "shared/lib/designSystem/colors";
import { SecondaryText, Title } from "shared/lib/designSystem";
import SegmentPagination from "shared/lib/components/Common/SegmentPagination";

import { useGlobalState } from "shared/lib/store/store";

const ExplainerContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 480px;
  z-index: 1;
`;

const ExplainerSection = styled.div<{ height: number }>`
  text-align: center;
  justify-content: center;
  overflow: show;
  align-items: center;
  height: fit-content;
  width: 480px;
  z-index: 1;
`;

const ScrollerSection = styled.div`
  margin-right: auto;
  margin-left: auto;
  width: 360px;
`;

const HeroText = styled(Title)`
  font-size: 56px;
  line-height: 64px;
  margin-bottom: 16px;
`;

const InfoDescription = styled(SecondaryText)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  margin-bottom: 16px;
`;

const SkipButton = styled.div<{ isLast?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 120px;
  height: 40px;
  background: ${(props) =>
    props.isLast ? `${colors.asset.USDC}14;` : `rgba(255, 255, 255, 0.08)`};
  border-radius: 100px;
  justify-content: center;
  text-align: center;
  color: ${(props) => (props.isLast ? `${colors.asset.USDC}` : `#FFFFFF`)};
  border-radius: 100px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 24px;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`;

const ExplanationStepList = ["step1", "step2", "step3"] as const;

type ExplanationStep = typeof ExplanationStepList[number];

interface EarnStrategyExplainerProps {
  expectedYield: number;
}
const EarnStrategyExplainer: React.FC<EarnStrategyExplainerProps> = ({
  expectedYield,
}) => {
  const containerRef = useRef(null);
  const [, setShowEarnVault] = useGlobalState("showEarnVault");
  const [step, setStep] = useState<ExplanationStep>(ExplanationStepList[0]);

  const setShowOnboardingCallback = useCallback(
    (e) => {
      setShowEarnVault((prev) => ({ ...prev, show: true }));
    },
    [setShowEarnVault]
  );

  const renderDescription = useCallback(
    (s: ExplanationStep) => {
      switch (s) {
        case "step1":
          return (
            <>
              Earn {(expectedYield * 100).toFixed(2)}% yield with full principal
              protection
            </>
          );
        case "step2":
          return (
            <>Capitalise on intra-week ETH movements in either direction</>
          );
        case "step3":
          return (
            <>
              Set it and forget it - deposit and start earning a base APY of 4%
              with full principal protection
            </>
          );
      }
    },
    [expectedYield]
  );

  const renderButton = useCallback(
    (s: ExplanationStep) => {
      switch (s) {
        case "step1":
        case "step2":
          return (
            <SkipButton
              role="button"
              onClick={(e) => {
                setShowOnboardingCallback(e);
              }}
            >
              Skip
            </SkipButton>
          );
        case "step3":
          return (
            <SkipButton
              isLast={true}
              role="button"
              onClick={(e) => {
                setShowOnboardingCallback(e);
              }}
            >
              Open Vault
            </SkipButton>
          );
      }
    },
    [setShowOnboardingCallback]
  );

  const infoSection = useMemo(() => {
    return (
      <ExplainerSection height={360}>
        <HeroText>R-EARN</HeroText>
        <AnimatePresence exitBeforeEnter initial={true}>
          <motion.div
            className="py-3"
            key={step}
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
            <InfoDescription className="mt-3 mb-3 py-3 flex-grow-1">
              {renderDescription(step)}
            </InfoDescription>
          </motion.div>
        </AnimatePresence>
        <ScrollerSection>
          <SegmentPagination
            page={ExplanationStepList.indexOf(step) + 1}
            total={ExplanationStepList.length}
            onPageClick={(page) => {
              setStep(ExplanationStepList[page - 1]);
            }}
          />
        </ScrollerSection>
        {renderButton(step)}
      </ExplainerSection>
    );
  }, [step, renderButton, renderDescription]);

  return (
    <ExplainerContainer ref={containerRef}>
      <ExplainerSection height={360}></ExplainerSection>
      {infoSection}
    </ExplainerContainer>
  );
};

export default EarnStrategyExplainer;
