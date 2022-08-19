import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { VaultOptions } from "shared/lib/constants/constants";
import { BaseModalContentColumn, Title } from "shared/lib/designSystem";
import BasicModal from "shared/lib/components/Common/BasicModal";
import SegmentControl from "shared/lib/components/Common/SegmentControl";
import { Strategy, Risk } from "../Details";
import EarnPerformanceSection from "../../../pages/DepositPage/EarnPerformanceSection";
import EarnVaultActivity from "../../Vault/EarnVaultActivity";
import Payoff from "../Payoff";
import Counterparties from "../Counterparties";
import Fees from "../Fees";
import { motion } from "framer-motion";
import sizes from "shared/lib/designSystem/sizes";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  z-index: 2;
  text-align: left;
  overflow: auto;
`;

const ModalColumnScroll = styled(BaseModalContentColumn)`
  flex: 1;
  overflow: hidden;
`;

const SegmentControlWrapper = styled.div`
  position: absolute;
  bottom: -60px;
  width: 300%;
  left: -100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${sizes.lg}px) {
    width: 150%;
    left: -25%;
  }
`

interface EarnDetailsModalProps {
  show: boolean;
  onClose: () => void;
  vaultOption: VaultOptions;
}

type Step =
  | "strategy"
  | "payoff"
  | "performance"
  | "risk"
  | "counterparties"
  | "activity"
  | "fees"; //| "transaction";
const StepList = [
  "strategy",
  "payoff",
  "performance",
  "risk",
  "counterparties",
  "activity",
  "fees",
] as const;

// Calls user_checkpoint and shows a transaction loading screen
const EarnDetailsModal: React.FC<EarnDetailsModalProps> = ({
  show,
  onClose,
}) => {
  const [step, setStep] = useState<Step>("strategy");

  const onCloseModal = useCallback(() => {
    setStep("strategy");
    onClose();
  }, [onClose]);

  const modalContent = useMemo(
    (margin?: number) => {
      switch (step) {
        case "strategy":
          return <Strategy />;
        case "payoff":
          return <Payoff />;
        case "risk":
          return <Risk />;
        case "performance":
          return (
            <EarnPerformanceSection
              vault={{
                vaultOption: "rEARN",
                vaultVersion: "earn",
              }}
            />
          );
        case "activity":
          return (
            <EarnVaultActivity
              vault={{
                vaultOption: "rEARN",
                vaultVersion: "earn",
              }}
            />
          );
        case "counterparties":
          return <Counterparties />;
        case "fees":
          return <Fees />;
      }
    },
    [step]
  );

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
          <SegmentControlWrapper>
            <SegmentControl
              config={{
                theme: "plain",
                button: {
                  px: 8,
                  py: 16,
                  fontSize: 12,
                  lineHeight: 12
                }
              }}
              segments={StepList.map((step) => {
                return {
                  value: step,
                  display: step
                };
              })
              }
              value={step}
              onSelect={(step) =>
                setStep(step as Step)
              }
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
