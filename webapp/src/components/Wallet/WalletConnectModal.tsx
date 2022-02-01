import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { BaseButton, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import BasicModal from "shared/lib/components/Common/BasicModal";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import ConnectWalletBody from "./ConnectWalletBody";
import ConnectChainBody from "./ConnectChainBody";
import { useChain } from "../../hooks/chainContext";
import {
  EthereumWallet,
  SolanaWallet,
  ETHEREUM_WALLETS,
  SOLANA_WALLETS,
  Wallet,
} from "../../models/wallets";
import { useWeb3Data } from "../../hooks/useWeb3Wallets";
import { Chains } from "../../constants/constants";

type ConnectSteps = "chain" | "wallet";

const WalletConnectModal: React.FC = () => {
  const { addNewChain } = useWeb3Data();
  const [chain] = useChain();
  const [show, setShow] = useConnectWalletModal();
  const [selectedStep, setStep] = useState<ConnectSteps>("chain");

  // List of wallets dependent on selected chain
  const [walletList, setWalletList] = useState<Wallet[]>([]);

  // We use these states to preset the state before sending to setChain when clicking the Next button
  const [selectedWallet, setWallet] = useState<Wallet>();
  const [selectedChain, setWalletChain] = useState<Chains>(chain);

  // We update wallets when there is a change of chains
  useEffect(() => {
    setWalletChain(selectedChain);
    switch (selectedChain) {
      case Chains.Ethereum:
      case Chains.Avalanche:
        setWalletList(ETHEREUM_WALLETS);
        break;
      case Chains.Solana:
        setWalletList(SOLANA_WALLETS);
        break;
      case Chains.NotSelected:
      default:
        setWalletList([]);
        break;
    }
  }, [selectedChain]);

  const onClose = useCallback(() => {
    setTimeout(() => setStep("chain"), 100);
    setShow(false);
  }, [setShow]);

  const handleClickStep = useCallback(async (updatedStep: ConnectSteps) => {
    setStep(updatedStep);
  }, []);

  const onActivate = async () => {
    try {
      await addNewChain(
        selectedWallet as EthereumWallet | SolanaWallet,
        selectedChain
      ).then(() => {
        onClose();
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BasicModal show={show} onClose={onClose} height={450} maxWidth={500}>
      <>
        {selectedStep === "chain" ? (
          <ConnectChainBody
            currentChain={selectedChain}
            onClose={onClose}
            onSelectChain={setWalletChain}
          ></ConnectChainBody>
        ) : (
          <ConnectWalletBody
            wallets={walletList}
            selectedWallet={selectedWallet}
            onSelectWallet={setWallet}
          ></ConnectWalletBody>
        )}

        <ConnectStepsNav
          selectedChain={selectedChain}
          wallets={walletList}
          step={selectedStep}
          selectedWallet={selectedWallet}
          onClickStep={handleClickStep}
          onActivate={onActivate}
        ></ConnectStepsNav>
      </>
    </BasicModal>
  );
};

interface ConnectStepsNavProps {
  step: ConnectSteps;
  selectedChain: Chains;
  selectedWallet: Wallet | undefined;
  onClickStep: (step: ConnectSteps) => void;
  wallets: Wallet[];
  onActivate: () => void;
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

const ConnectStepsNav: React.FC<ConnectStepsNavProps> = ({
  step,
  selectedChain,
  selectedWallet,
  wallets,
  onClickStep,
  onActivate,
}) => {
  // Render the proper wallet list based on the selected wallet
  const walletInChain = selectedWallet && wallets.includes(selectedWallet);
  const isChainStep = step === "chain";

  return (
    <>
      {isChainStep && (
        <ConnectStepsButton
          role="button"
          disabled={!selectedChain}
          onClick={() => onClickStep("wallet")}
        >
          <ButtonTitle>Next</ButtonTitle>
        </ConnectStepsButton>
      )}
      {!isChainStep && (
        <ConnectStepsButton
          role="button"
          disabled={!walletInChain}
          onClick={() => onActivate()}
        >
          <ButtonTitle>Connect</ButtonTitle>
        </ConnectStepsButton>
      )}
    </>
  );
};

export default WalletConnectModal;
