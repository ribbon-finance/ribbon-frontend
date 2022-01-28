import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { BaseButton, PrimaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import BasicModal from "shared/lib/components/Common/BasicModal";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import ConnectWalletBody from "./ConnectWalletBody";
import ConnectChainBody from "./ConnectChainBody";
import { Chains, useChain } from "../../hooks/chainContext";
import { Button } from "shared/lib/components/Common/buttons";

type ConnectSteps = "chain" | "wallet";

const WalletConnectModal: React.FC = () => {
  const [chain, setChain] = useChain();
  const [show, setShow] = useConnectWalletModal();
  const [step, setStep] = useState<ConnectSteps>("chain");

  const onClose = useCallback(() => {
    setShow(false);
    setTimeout(() => setStep("chain"), 300);
  }, [setShow]);

  const handleSelectChain = useCallback(
    (chain: Chains) => {
      setChain(chain);
    },
    [setChain, setStep]
  );

  return (
    <BasicModal show={show} onClose={onClose} height={450} maxWidth={500}>
      <>
        {step === "chain" ? (
          <ConnectChainBody onClose={onClose} onSelectChain={handleSelectChain}></ConnectChainBody>
        ) : (
          <ConnectWalletBody onClose={onClose}></ConnectWalletBody>
        )}

        <ConnectStepsNav step={step} chain={chain} setStep={setStep}></ConnectStepsNav>
      </>
    </BasicModal>
  );
};

interface ConnectStepsNavProps {
  step: ConnectSteps;
  chain: Chains;
  setStep: (step: ConnectSteps) => void;
}

const ConnectStepsButton = styled(BaseButton)<{ disabled?: boolean }>`
  margin: 0 16px;
  padding: 16px;
  color: ${colors.green};
  justify-content: center;
  background-color: ${colors.buttons.secondaryBackground};

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
`;

const ButtonTitle = styled(Title)`
  color: ${colors.buttons.secondaryText};
`;

const ConnectStepsNav: React.FC<ConnectStepsNavProps> = ({ step, chain, setStep }) => {
  const isChainStep = step === "chain";
  console.log(chain);

  return (
    <>
      {isChainStep && (
        <ConnectStepsButton role="button" disabled={!chain} onClick={() => setStep("wallet")}>
          <ButtonTitle>Next</ButtonTitle>
        </ConnectStepsButton>
      )}
      {!isChainStep && (
        <ConnectStepsButton role="button" disabled={!isChainStep}>
          <ButtonTitle>Connect</ButtonTitle>
        </ConnectStepsButton>
      )}
    </>
  );
};

export default WalletConnectModal;
