import React, { useCallback } from "react";
import { useWeb3Wallet } from "../../hooks/useWeb3Wallet";
import styled from "styled-components";

import { getAssetColor, getAssetLogo } from "shared/lib/utils/asset";
import { Title, Subtitle, BaseIndicator } from "shared/lib/designSystem";
import { switchChains } from "shared/lib/utils/chainSwitching";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import { Chains, useChain } from "../../hooks/chainContext";
import { CHAINS_TO_NATIVE_TOKENS, ENABLED_CHAINS, READABLE_CHAIN_NAMES } from "../../constants/constants";

interface ConnectChainBodyProps {
  onClose: () => void;
  onSelectChain: (chain: Chains) => void;
}

const ModalContainer = styled.div`
  padding: 10px 16px;
`;

const NetworkContainer = styled.div<{
  borderColor: string;
  active?: boolean;
}>`
  display: flex;
  border-radius: 8px;
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  background: #212127;
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;

  ${(props) => (props.active ? `border: 1px solid ${props.borderColor};` : "border: 1px solid #212127;")}
`;
const NetworkNameContainer = styled.div`
  display: flex;
  align-items: center;
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`;
const NetworkName = styled(Subtitle)`
  font-size: 16px;
  text-transform: uppercase;
  line-height: 24px;
  margin-left: 10px;
`;
const AssetCircle = styled(BaseIndicator)<{
  size: number;
  color: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 5px;
`;

const NetworkContainerPill = styled(NetworkContainer)`
  border-radius: 100px;
`;

const ConnectChainBody: React.FC<ConnectChainBodyProps> = ({ onClose, onSelectChain }) => {
  const [currentChain] = useChain();
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSelectChain = useCallback(
    (chain: Chains) => {
      onSelectChain(chain);
    },
    [onSelectChain]
  );

  return (
    <ModalContainer>
      <TitleContainer>
        <Title>Select a blockchain</Title>
      </TitleContainer>

      {ENABLED_CHAINS.map((chain: Chains) => (
        <ChainButton
          key={chain}
          chain={chain}
          currentChain={currentChain as Chains}
          onSelectChain={handleSelectChain}
        ></ChainButton>
      ))}
    </ModalContainer>
  );
};

export const ChainButton: React.FC<{
  chain: Chains;
  currentChain: Chains;
  onSelectChain: (chain: Chains) => void;
}> = ({ chain, currentChain, onSelectChain }) => {
  const Logo = getAssetLogo(CHAINS_TO_NATIVE_TOKENS[chain]);
  const color = getAssetColor(CHAINS_TO_NATIVE_TOKENS[chain]);
  const active = currentChain === chain;
  const logoSize = 28;

  return (
    <NetworkContainerPill key={chain} onClick={() => onSelectChain(chain)} borderColor={color} active={active}>
      <NetworkNameContainer>
        <AssetCircle size={40} color={`${color}1F`}>
          <Logo height={logoSize} width={logoSize}></Logo>
        </AssetCircle>
        <NetworkName>{READABLE_CHAIN_NAMES[chain]}</NetworkName>
      </NetworkNameContainer>

      {active && <BaseIndicator size={8} color={color}></BaseIndicator>}
    </NetworkContainerPill>
  );
};

export default ConnectChainBody;
