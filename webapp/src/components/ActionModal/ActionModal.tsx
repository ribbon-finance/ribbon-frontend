import React, { useCallback, useState } from "react";
import styled from "styled-components";
import MobileOverlayMenu from "../Common/MobileOverlayMenu";
import colors from "../../designSystem/colors";
import { Title } from "../../designSystem";
import ActionSteps from "./ActionSteps";
import { PreviewStepProps, StepData, STEPS } from "./types";
import sizes from "../../designSystem/sizes";
import { CloseIcon } from "../../assets/icons/icons";
import { VaultOptions } from "../../constants/constants";

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
}

const ModalBody = styled.div<ModalBodyProps>`
  background: #1c1a19;
  border: 1px solid #2b2b2b;
  box-sizing: border-box;
  border-radius: 8px;
  width: ${(props) => (props.variant === "desktop" ? "383px" : "100%")};
  max-width: 450px;
  min-height: 480px;

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
  height: 100%;
`;

const ModalHeaderCloseButton = styled.i`
  cursor: pointer;
  position: absolute;
  right: ${modalPadding}px;
`;

const StepsContainer = styled.div<ModalProps>`
  ${(props) =>
    props.variant === "desktop" &&
    `
    width: 100%;
    height: 100%;
    `}

  padding-left: ${modalPadding}px;
  padding-right: ${modalPadding}px;
`;

interface ModalProps {
  variant: "desktop" | "mobile";
}

interface ActionModalProps extends ModalProps {
  vaultOption: VaultOptions;
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  previewStepProps?: PreviewStepProps;
}

const ActionModal: React.FC<ActionModalProps> = ({
  vaultOption,
  show,
  onClose,
  variant,
  previewStepProps,
  onSuccess = () => {},
}) => {
  const [stepData, setStepData] = useState<StepData>({
    stepNum: 0,
    title: "",
  });
  const isDesktop = variant === "desktop";

  const onChangeStep = useCallback((stepData) => setStepData(stepData), [
    setStepData,
  ]);

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
        key={`actionModal-${vaultOption}`}
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
                vaultOption={vaultOption}
                skipToPreview={isDesktop}
                show={show}
                onClose={onClose}
                onChangeStep={onChangeStep}
                previewStepProps={previewStepProps}
                onSuccess={onSuccess}
              ></ActionSteps>
            </StepsContainer>
          </ModalContent>
        </ModalBody>
      </MobileOverlayMenu>
    </div>
  );
};

export default ActionModal;
