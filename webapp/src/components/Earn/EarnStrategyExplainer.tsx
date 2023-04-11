import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { SecondaryText, Title } from "shared/lib/designSystem";
import SegmentPagination from "shared/lib/components/Common/SegmentPagination";

import { useGlobalState } from "shared/lib/store/store";
import { useAirtableEarnData } from "shared/lib/hooks/useAirtableEarnData";
import {
  VaultOptions,
  getEarnSkipStorage,
} from "shared/lib/constants/constants";
import { t } from "i18next";
import { getVaultColor } from "shared/lib/utils/vault";

const ExplainerContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 480px;
  @media (max-width: 700px) {
    width: 360px;
  }
  z-index: 1;
`;

const ExplainerSection = styled.div<{ height: number }>`
  text-align: center;
  justify-content: center;
  overflow: show;
  align-items: center;
  height: fit-content;
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

const SkipButton = styled.div<{ isLast?: boolean; color: string }>`
  display: flex;
  flex-direction: column;
  width: 120px;
  height: 40px;
  background: ${(props) =>
    props.isLast ? `${props.color}14;` : `rgba(255, 255, 255, 0.08)`};
  border-radius: 100px;
  justify-content: center;
  text-align: center;
  color: ${(props) => (props.isLast ? `${props.color}` : `#FFFFFF`)};
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
  vaultOption: VaultOptions;
}

export const EarnStrategyExplainer: React.FC<EarnStrategyExplainerProps> = ({
  vaultOption,
}) => {
  const containerRef = useRef(null);
  const color = getVaultColor(vaultOption);
  const [, setShowEarnVault] = useGlobalState("showEarnVault");
  const { loading, baseYield, maxYield } = useAirtableEarnData(vaultOption);
  const [step, setStep] = useState<ExplanationStep>(ExplanationStepList[0]);
  const skipEarnExplanation = getEarnSkipStorage(vaultOption);
  const setShowOnboardingCallback = useCallback(() => {
    setShowEarnVault((prev) => ({ ...prev, show: true }));
    localStorage.setItem(skipEarnExplanation, "true");
  }, [setShowEarnVault, skipEarnExplanation]);

  useEffect(() => {
    const skip = Boolean(localStorage.getItem(skipEarnExplanation));
    if (skip) setShowOnboardingCallback();
  }, [setShowOnboardingCallback, skipEarnExplanation]);

  const renderTitle = useCallback(
    (s: ExplanationStep) => {
      switch (s) {
        case "step1":
        case "step2":
        case "step3":
          return t(`shared:ProductCopies:${vaultOption}:title`);
      }
    },
    [vaultOption]
  );

  const renderDescription = useCallback(
    (s: ExplanationStep) => {
      switch (s) {
        case "step1":
          return (
            <>
              Earn up to {loading ? "---" : (maxYield * 100).toFixed(2) + "%"}{" "}
              yield with {vaultOption === "rEARN-stETH" && "a crypto native "}
              principal protection
            </>
          );

        case "step2":
          switch (vaultOption) {
            case "rEARN":
              return (
                <>Capitalise on intra-week ETH movements in either direction</>
              );
            case "rEARN-stETH":
              return (
                <>Monetize a bullish view on ETH, boosted by staking yield</>
              );
            default:
              return <></>;
          }
        case "step3":
          switch (vaultOption) {
            case "rEARN":
              return (
                <>
                  Set it and forget it - deposit and start earning a base APY of{" "}
                  {loading ? "---" : `${(baseYield * 100).toFixed(2)}%`} with
                  principal protection
                </>
              );
            case "rEARN-stETH":
              return (
                <>
                  Set it and forget it - deposit and start earning with 99.5%
                  weekly principal protection
                </>
              );
            default:
              return <></>;
          }
      }
    },
    [baseYield, loading, maxYield, vaultOption]
  );

  const renderButton = useCallback(
    (s: ExplanationStep) => {
      switch (s) {
        case "step1":
        case "step2":
          return (
            <SkipButton
              role="button"
              color={color}
              onClick={() => setShowOnboardingCallback()}
            >
              Skip
            </SkipButton>
          );
        case "step3":
          return (
            <SkipButton
              isLast={true}
              color={color}
              role="button"
              onClick={() => setShowOnboardingCallback()}
            >
              Open Vault
            </SkipButton>
          );
      }
    },
    [color, setShowOnboardingCallback]
  );

  const infoSection = useMemo(() => {
    return (
      <ExplainerSection height={360}>
        <HeroText>{renderTitle(step)}</HeroText>
        <AnimatePresence exitBeforeEnter initial={true}>
          <motion.div
            className="py-3"
            key={step}
            initial={{
              opacity: 0,
              translateY: 20,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
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
  }, [renderTitle, step, renderDescription, renderButton]);

  return (
    <ExplainerContainer ref={containerRef}>
      <ExplainerSection height={360}></ExplainerSection>
      {infoSection}
    </ExplainerContainer>
  );
};

export default EarnStrategyExplainer;
