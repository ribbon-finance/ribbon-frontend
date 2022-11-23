import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { VaultOptions } from "shared/lib/constants/constants";
import { BaseModalContentColumn, Title } from "shared/lib/designSystem";
import BasicModal from "shared/lib/components/Common/BasicModal";
import SegmentControl from "shared/lib/components/Common/SegmentControl";
import { Strategy, Risk } from "../Details";
import EarnPerformanceSection from "../EarnPerformanceSection";
import EarnVaultActivity from "../../Vault/EarnVaultActivity";
import Payoff from "../Payoff";
import Counterparties from "../Counterparties";
import FundingSource from "../FundingSource";
import Fees from "../Fees";
import { motion } from "framer-motion";
import sizes from "shared/lib/designSystem/sizes";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  z-index: 2;
  text-align: left;
  overflow: auto;
  width: 100%;
`;

const ModalColumnScroll = styled(BaseModalContentColumn)`
  flex: 1;
  overflow: hidden;
  * {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  *::-webkit-scrollbar {
    display: none;
  }
`;

const DesktopNavigatorButtonContainer = styled.div`
  position: absolute;
  top: 50%;
  z-index: 1;
  width: 150%;
  left: -25%;
  display: flex;
  justify-content: space-between;
`;

const NavigationButton = styled.div<{
  disabled?: boolean;
  marginLeft?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${colors.primaryText}0A;
  border-radius: 100px;
  overflow: show;
  margin-left: ${(props) => props.marginLeft};
  transition: opacity 100ms ease-in;
  align-self: center;
  margin-bottom: 8px;

  ${(props) =>
    props.disabled
      ? `
          opacity: 0.24;
          cursor: default;
        `
      : `
          &:hover {
            opacity: ${theme.hover.opacity};
          }
        `}

  i {
    color: white;
  }

  &:last-child {
    margin-right: 0px;
  }
`;

const SegmentControlWrapper = styled.div`
  position: absolute;
  bottom: -72px;
  width: 300%;
  left: -100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${sizes.md}px) {
    width: 120%;
    left: -10%;
  }
`;

interface EarnDetailsModalProps {
  show: boolean;
  onClose: () => void;
  vaultOption: VaultOptions;
}

export type Step =
  | "strategy"
  | "payoff"
  | "performance"
  | "risk"
  | "funding source"
  | "activity"
  | "fees";

const StepList = [
  "strategy",
  "payoff",
  "performance",
  "risk",
  "funding source",
  "activity",
  "fees",
] as const;

// Calls user_checkpoint and shows a transaction loading screen
const EarnDetailsModal: React.FC<EarnDetailsModalProps> = ({
  show,
  onClose,
  vaultOption,
}) => {
  const { width } = useScreenSize();

  const [step, setStep] = useState<Step>("strategy");
  const showDesktopNavigator = useMemo(() => width > sizes.md, [width]);

  const onCloseModal = useCallback(() => {
    setStep("strategy");
    onClose();
  }, [onClose]);

  const modalContent = useMemo(() => {
    switch (step) {
      case "strategy":
        return <Strategy setStep={setStep} vaultOption={vaultOption} />;
      case "payoff":
        return <Payoff vaultOption={vaultOption} />;
      case "risk":
        return <Risk vaultOption={vaultOption} />;
      case "performance":
        return (
          <EarnPerformanceSection
            vault={{
              vaultOption,
              vaultVersion: "earn",
            }}
          />
        );
      case "activity":
        return (
          <EarnVaultActivity
            vault={{
              vaultOption,
              vaultVersion: "earn",
            }}
          />
        );
      case "funding source":
        return vaultOption === "rEARN-USDC" ? (
          <Counterparties vaultOption={vaultOption} />
        ) : (
          <FundingSource vaultOption={vaultOption} />
        );
      case "fees":
        return <Fees />;
    }
  }, [step, vaultOption]);

  return (
    <>
      <BasicModal
        show={show}
        onClose={onCloseModal}
        height={480}
        overflow={"show"}
        headerBackground={true}
      >
        <>
          {showDesktopNavigator && (
            <DesktopNavigatorButtonContainer>
              <NavigationButton
                role="button"
                disabled={step === StepList[0]}
                onClick={() => {
                  const newStep = StepList.indexOf(step);
                  if (newStep > 0) {
                    setStep(StepList[newStep - 1]);
                  }
                }}
              >
                <i className="fas fa-arrow-left" />
              </NavigationButton>
              <NavigationButton
                role="button"
                disabled={step === StepList[StepList.length - 1]}
                onClick={() => {
                  if (step === StepList[StepList.length - 1]) {
                    return;
                  }
                  const newStep = StepList.indexOf(step);
                  if (newStep < StepList.length) {
                    setStep(StepList[newStep + 1]);
                  }
                }}
              >
                <i className="fas fa-arrow-right" />
              </NavigationButton>
            </DesktopNavigatorButtonContainer>
          )}
          <SegmentControlWrapper>
            <SegmentControl
              config={{
                theme: "plain",
                button: {
                  px: 8,
                  py: 16,
                  fontSize: 12,
                  lineHeight: 12,
                },
              }}
              segments={StepList.map((step) => {
                return {
                  value: step,
                  display: step,
                };
              })}
              value={step}
              onSelect={(step) => setStep(step as Step)}
            />
          </SegmentControlWrapper>
          <BaseModalContentColumn marginTop={8}>
            <Title>{step}</Title>
          </BaseModalContentColumn>

          {step === "payoff" ? (
            <div style={{ marginLeft: -16, marginRight: -16 }}>
              <ModalColumnScroll
                marginTop={40}
                className="justify-content-center"
              >
                <Container
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
                  {modalContent}
                </Container>
              </ModalColumnScroll>
            </div>
          ) : (
            <ModalColumnScroll
              marginTop={40}
              className="justify-content-center"
            >
              <Container
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
                {modalContent}
              </Container>
            </ModalColumnScroll>
          )}
        </>
      </BasicModal>
    </>
  );
};

export default EarnDetailsModal;
