import React, { useCallback, useState } from "react";
import styled from "styled-components";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import colors from "shared/lib/designSystem/colors";
import { Title } from "shared/lib/designSystem";
import ActionSteps from "./ActionSteps";
import { StepData, STEPS } from "./types";
import sizes from "shared/lib/designSystem/sizes";
import { CloseIcon } from "shared/lib/assets/icons/icons";
import { VaultOptions, VaultVersion } from "shared/lib/constants/constants";
import theme from "shared/lib/designSystem/theme";

const ModalNavigation = styled.div`
  position: absolute;
  top: 28px;
  left: 14px;
  width: calc(100% - 14px);
  padding-right: 28px;
`;

const ArrowBack = styled.i`
  color: ${colors.primaryText};
  height: 14px;
  margin-right: 20px;
`;

const ModalNavigationCloseButton = styled.span`
  margin-left: auto;
`;

interface ModalBodyProps extends ModalProps {
  isFormStep: boolean;
  steps: StepData;
}

const ModalBody = styled.div<ModalBodyProps>`
  display: flex;
  flex-direction: column;
  background: #1c1a19;
  border: 1px solid #2b2b2b;
  box-sizing: border-box;
  border-radius: 8px;
  width: ${(props) => (props.variant === "desktop" ? "383px" : "375px")};
  max-width: 450px;
  min-height: ${(props) => {
    switch (props.steps.stepNum) {
      case STEPS.confirmationStep:
      case STEPS.submittedStep:
        return "unset";
      default:
        return "480px";
    }
  }};

  ${(props) =>
    props.variant === "mobile" &&
    props.isFormStep &&
    `
  background: none;
  border: none;
  `}

  @media (max-width: ${sizes.md}px) {
    max-height: unset;
    min-height: unset;
  }
`;

const modalPadding = 16;

const ModalTitle = styled.div`
  background: #151413;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: ${modalPadding}px;
  padding-right: ${modalPadding}px;
  margin-bottom: 24px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
`;

const ModalHeaderCloseButton = styled.i`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 48px;
  cursor: pointer;
  position: absolute;
  right: ${modalPadding}px;
`;

const StepsContainer = styled.div<ModalProps>`
  display: flex;
  flex-direction: column;
  flex: 1;
  ${(props) =>
    props.variant === "desktop" &&
    `
    height: 100%;
    `}

  width: 100%;
  padding-left: ${modalPadding}px;
  padding-right: ${modalPadding}px;
`;

interface ModalProps {
  variant: "desktop" | "mobile";
}

interface ActionModalProps extends ModalProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
  show: boolean;
  onClose: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({
  vault,
  show,
  onClose,
  variant,
}) => {
  const [stepData, setStepData] = useState<StepData>({
    stepNum: 0,
    title: "",
  });
  const isDesktop = variant === "desktop";

  const onChangeStep = useCallback(
    (stepData) => setStepData(stepData),
    [setStepData]
  );

  const renderModalNavigationItem = useCallback(() => {
    if (isDesktop) {
      return;
    }

    if (
      stepData.stepNum === STEPS.confirmationStep ||
      stepData.stepNum === STEPS.submittedStep
    ) {
      return (
        <ModalNavigationCloseButton onClick={onClose}>
          <CloseIcon></CloseIcon>
        </ModalNavigationCloseButton>
      );
    }

    return (
      <div onClick={onClose} role="button">
        <ArrowBack className="fas fa-arrow-left"></ArrowBack>
        <Title>Back</Title>
      </div>
    );
  }, [isDesktop, onClose, stepData]);

  const renderModalCloseButton = useCallback(() => {
    if (!isDesktop && stepData.stepNum !== STEPS.previewStep) {
      return;
    }

    return (
      <ModalHeaderCloseButton onClick={onClose}>
        <CloseIcon></CloseIcon>
      </ModalHeaderCloseButton>
    );
  }, [isDesktop, stepData, onClose]);

  return (
    <div>
      <MobileOverlayMenu
        key={`actionModal-${vault.vaultOption}`}
        isMenuOpen={show}
        onClick={onClose}
        mountRoot="div#root"
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ModalNavigation className="d-flex flex-row align-items-center">
          {renderModalNavigationItem()}
        </ModalNavigation>
        <ModalBody
          isFormStep={stepData.stepNum === STEPS.formStep}
          variant={variant}
          steps={stepData}
        >
          {stepData.title !== "" && (
            <ModalTitle className="position-relative d-flex align-items-center justify-content-center">
              <Title>{stepData.title}</Title>
              {renderModalCloseButton()}
            </ModalTitle>
          )}

          <ModalContent className="position-relative">
            <StepsContainer variant={variant}>
              <ActionSteps
                vault={vault}
                skipToPreview={isDesktop}
                show={show}
                onClose={onClose}
                onChangeStep={onChangeStep}
              />
            </StepsContainer>
          </ModalContent>
        </ModalBody>
      </MobileOverlayMenu>
    </div>
  );
};

export default ActionModal;
