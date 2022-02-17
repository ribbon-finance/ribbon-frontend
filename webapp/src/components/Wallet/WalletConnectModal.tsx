import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import {
  BaseButton,
  BaseLink,
  BaseModalContentColumn,
  BaseText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import BasicModal from "shared/lib/components/Common/BasicModal";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import ConnectWalletBody from "./ConnectWalletBody";
import ConnectChainBody from "./ConnectChainBody";
import { useChain } from "shared/lib/hooks/chainContext";
import {
  EthereumWallet,
  SolanaWallet,
  ETHEREUM_WALLETS,
  SOLANA_WALLETS,
  Wallet,
} from "../../models/wallets";
import { Chains, ENABLED_CHAINS } from "shared/lib/constants/constants";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";

const LearnMoreLink = styled(BaseLink)`
  display: flex;
  text-align: center;
  justify-content: center;
  margin-top: 16px;

  > * {
    margin: auto 0;
  }

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const LearnMoreText = styled(BaseText)`
  text-decoration: underline;
`;

type ConnectSteps = "chain" | "wallet";

const WalletConnectModal: React.FC = () => {
  const { activate, connectingWallet } = useWeb3Wallet();
  const [chain] = useChain();
  const [show, setShow] = useConnectWalletModal();
  const [selectedStep, setStep] = useState<ConnectSteps>("chain");

  // List of wallets dependent on selected chain
  const [walletList, setWalletList] = useState<Wallet[]>([]);

  // We use these states to preset the state before sending to setChain when clicking the Next button
  const [selectedWallet, setWallet] = useState<Wallet>();
  const [selectedChain, setChain] = useState<Chains>(chain);

  const onClose = useCallback(() => {
    setShow(false);

    setStep("chain");
  }, [setShow]);

  const handleClickStep = useCallback(async (updatedStep: ConnectSteps) => {
    setStep(updatedStep);
  }, []);

  // On initialize, set list of wallets based on connected chain
  useEffect(() => {
    setChain(chain);
    onClose();
  }, [chain, onClose]);

  // We update wallets when there is a change of chains
  useEffect(() => {
    setChain(selectedChain);
    switch (selectedChain) {
      case Chains.Ethereum:
      case Chains.Avalanche:
        setWalletList(ETHEREUM_WALLETS);
        break;
      case Chains.Solana:
        setWalletList(SOLANA_WALLETS);
        break;
      default:
        setWalletList([]);
        break;
    }
  }, [selectedChain]);

  const onActivate = async () => {
    if (selectedWallet && selectedChain) {
      try {
        await activate(
          selectedWallet as EthereumWallet | SolanaWallet,
          selectedChain
        );

        onClose();
      } catch (error) {
        console.error(error);
      }
    }
  };

  let modalHeightForChain = 0;
  switch (ENABLED_CHAINS.length) {
    case 2:
      modalHeightForChain = 320;
      break;
    case 3:
      modalHeightForChain = 400;
      break;
    default:
      break;
  }

  let modalHeightForWallets = 0;
  switch (walletList.length) {
    case 2:
      modalHeightForWallets = 400;
      break;
    case 3:
      modalHeightForWallets = 450;
      break;
    default:
      break;
  }

  const modalHeight =
    selectedStep === "chain" ? modalHeightForChain : modalHeightForWallets;

  return (
    <BasicModal
      show={show}
      onClose={onClose}
      height={modalHeight}
      maxWidth={343}
    >
      <>
        {selectedStep === "chain" ? (
          <ConnectChainBody
            currentChain={selectedChain}
            onClose={onClose}
            onSelectChain={setChain}
          ></ConnectChainBody>
        ) : (
          <ConnectWalletBody
            wallets={walletList}
            connectingWallet={connectingWallet}
            selectedWallet={selectedWallet}
            onBack={() => setStep("chain")}
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
  margin: 0;
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
        <>
          <ConnectStepsButton
            role="button"
            disabled={!walletInChain}
            onClick={() => onActivate()}
          >
            <ButtonTitle>Connect</ButtonTitle>
          </ConnectStepsButton>
          <BaseModalContentColumn marginTop={16}>
            <LearnMoreLink
              to={
                selectedChain === Chains.Solana
                  ? "https://docs.solana.com/wallet-guide"
                  : "https://ethereum.org/en/wallets/"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-100"
            >
              <LearnMoreText>Learn more about wallets</LearnMoreText>
              <ExternalIcon height={20} color={colors.primaryText} />
            </LearnMoreLink>
          </BaseModalContentColumn>
        </>
      )}
    </>
  );
};

export default WalletConnectModal;
