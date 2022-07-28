import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { VaultOptions } from "shared/lib/constants/constants";
import { BaseModalContentColumn, Title } from "shared/lib/designSystem";
import BasicModal from "shared/lib/components/Common/BasicModal";
import Scroller from "../Scroller";
import { Strategy, Risk } from "../Details";

const Container = styled.div`
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
  | "counterparty options"
  | "activity"
  | "fees"; //| "transaction";
const StepList = [
  "strategy",
  "payoff",
  "performance",
  "risk",
  "counterparty options",
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

  const modalContent = useMemo(() => {
    switch (step) {
      case "strategy":
        return <Strategy />;
      case "payoff":
        return <>payoff</>;
      case "risk":
        return <Risk />;
      case "performance":
        return <>performance</>;
    }
  }, [step]);

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
          <Scroller
            page={StepList.indexOf(step) + 1}
            stepList={StepList as unknown as string[]}
            step={step}
            total={StepList.length}
            onPageClick={(page) => {
              setStep(StepList[page - 1]);
            }}
          />
          <BaseModalContentColumn marginTop={8}>
            <Title>{step}</Title>
          </BaseModalContentColumn>

          <ModalColumnScroll marginTop={40} className="justify-content-start">
            <Container>{modalContent}</Container>
          </ModalColumnScroll>
        </>
      </BasicModal>
    </>
  );
};

export default EarnDetailsModal;
