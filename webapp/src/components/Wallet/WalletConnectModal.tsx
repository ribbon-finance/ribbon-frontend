import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { PrimaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import BasicModal from "shared/lib/components/Common/BasicModal";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import ConnectWalletBody from "./ConnectWalletBody";
import ConnectChainBody from "./ConnectChainBody";

const ConnectStepsCircle = styled.div<{ active: boolean; color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 32px;
  background: ${(props) => props.color}14;

  ${(props) =>
    props.active
      ? `
          border: ${theme.border.width} ${theme.border.style} ${props.color};
        `
      : ``}
`;

const ConnectStepsDividerLine = styled.div<{ color: string }>`
  width: 40px;
  height: 1px;
  background: ${(props) => props.color}3D;
  margin-top: calc((32px - 1px) / 2);
`;

type ConnectSteps = "chain" | "wallet";

const WalletConnectModal: React.FC = () => {
  const [show, setShow] = useConnectWalletModal();
  const [step, setStep] = useState<ConnectSteps>("chain");

  const onClose = useCallback(() => {
    setShow(false);
  }, [setShow]);

  return (
    <BasicModal show={show} onClose={onClose} height={450} maxWidth={500}>
      <>
        {step === "chain" ? (
          <ConnectChainBody onClose={onClose}></ConnectChainBody>
        ) : (
          <ConnectWalletBody onClose={onClose}></ConnectWalletBody>
        )}

        <ConnectStepsNav step={step}></ConnectStepsNav>
      </>
    </BasicModal>
  );
};

const ConnectStepsNav: React.FC<{ step: ConnectSteps }> = ({ step }) => {
  const isChainStep = step === "chain";
  const color = colors.green;

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex mt-2">
        <div className="d-flex flex-column align-items-center">
          <ConnectStepsCircle active={isChainStep} color={color}>
            <Title
              fontSize={14}
              lineHeight={20}
              color={isChainStep ? color : colors.quaternaryText}
            >
              1
            </Title>
          </ConnectStepsCircle>
          <PrimaryText
            fontSize={11}
            lineHeight={12}
            color={isChainStep ? color : colors.quaternaryText}
            className="mt-2 text-center"
            style={{ maxWidth: 60 }}
          >
            Select Blockchain
          </PrimaryText>
        </div>
        <ConnectStepsDividerLine color={color} />
        <div className="d-flex flex-column align-items-center">
          <ConnectStepsCircle active={!isChainStep} color={color}>
            <Title
              fontSize={14}
              lineHeight={20}
              color={!isChainStep ? color : colors.quaternaryText}
            >
              2
            </Title>
          </ConnectStepsCircle>
          <PrimaryText
            fontSize={11}
            lineHeight={12}
            color={!isChainStep ? color : colors.quaternaryText}
            className="mt-2 text-center mb-4"
            style={{ maxWidth: 60 }}
          >
            Select Wallet
          </PrimaryText>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
