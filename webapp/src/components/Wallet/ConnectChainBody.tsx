import React from "react";
import styled from "styled-components";

import { getAssetColor, getAssetLogo } from "shared/lib/utils/asset";
import { Title, Subtitle, BaseIndicator } from "shared/lib/designSystem";
import theme from "shared/lib/designSystem/theme";
import {
  Chains,
  CHAINS_TO_NATIVE_TOKENS,
  ENABLED_CHAINS,
  READABLE_CHAIN_NAMES,
} from "shared/lib/constants/constants";

interface ConnectChainBodyProps {
  onClose?: () => void;
  onSelectChain: (chain: Chains) => void;
  currentChain: Chains | undefined;
  availableChains?: Chains[];
}

const ModalContainer = styled.div`
  padding: 10px 0px;
`;

const NetworkContainer = styled.div<{
  borderColor: string;
  active?: boolean;
}>`
  display: flex;
  border-radius: 8px;
  padding: 8px;
  padding-right: 16px;
  height: 56px;
  align-items: center;
  justify-content: space-between;
  background: #212127;
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;

  &:hover {
    opacity: ${theme.hover.opacity};
  }

  ${(props) =>
    props.active
      ? `border: 1px solid ${props.borderColor};`
      : "border: 1px solid #212127;"}
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
`;
const NetworkContainerPill = styled(NetworkContainer)`
  border-radius: 100px;
`;

const ConnectChainBody: React.FC<ConnectChainBodyProps> = ({
  onSelectChain,
  currentChain,
  availableChains = ENABLED_CHAINS,
}) => {
  return (
    <ModalContainer>
      <TitleContainer>
        <Title>Select a blockchain</Title>
      </TitleContainer>

      {availableChains.map((chain: Chains) => (
        <ChainButton
          key={chain}
          chain={chain}
          currentChain={currentChain as Chains}
          onSelectChain={() => onSelectChain(chain)}
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
  const logoSize = 40;

  return (
    <NetworkContainerPill
      key={chain}
      onClick={() => onSelectChain(chain)}
      borderColor={color}
      active={active}
    >
      <NetworkNameContainer>
        <AssetCircle size={logoSize} color={`${color}1F`}>
          <Logo
            style={{ padding: 0 }}
            height={logoSize}
            width={logoSize}
          ></Logo>
        </AssetCircle>
        <NetworkName>{READABLE_CHAIN_NAMES[chain]}</NetworkName>
      </NetworkNameContainer>

      {active && <BaseIndicator size={8} color={color}></BaseIndicator>}
    </NetworkContainerPill>
  );
};

export default ConnectChainBody;
