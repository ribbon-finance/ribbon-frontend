import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { generateOnRampURL } from "@coinbase/cbpay-js";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { Chains, ID_TO_CHAINS } from "shared/lib/constants/constants";
import { BuyIcon } from "shared/lib/assets/icons/icons";

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.border.radius};
  background: ${colors.background.two};
  height: 48px;
  width: 48px;

  &:hover {
    svg {
      path {
        opacity: ${theme.hover.opacity};
      }
    }
  }
`;

const IconContainer = styled.div`
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type DestinationWallet = {
  address: string;
  blockchains: string[];
};

export const BuyButton: React.FC = () => {
  const [onrampURL, setOnrampURL] = useState<string>();
  const { account, chainId } = useWeb3Wallet();

  useEffect(() => {
    const destinationWallets: DestinationWallet[] = [];
    const addWallet = (
      blockchain: "ethereum" | "avalanche-c-chain" | "solana"
    ) => {
      if (!account) {
        return;
      }
      destinationWallets.push({
        address: account,
        blockchains: [blockchain],
      });
    };
    if (account && account.length > 0 && chainId) {
      switch (ID_TO_CHAINS[chainId]) {
        case Chains.Ethereum:
          addWallet("ethereum");
          break;
        case Chains.Avalanche:
          addWallet("avalanche-c-chain");
          break;
        case Chains.Solana:
          addWallet("solana");
      }
    }
    if (destinationWallets.length < 1) {
      return;
    }

    const appId = process.env.REACT_APP_COINBASE_APPID;
    if (!appId) return;

    setOnrampURL(
      generateOnRampURL({
        appId,
        destinationWallets,
      })
    );
  }, [account, chainId]);

  if (!account || !onrampURL) return <></>;
  return (
    <a href={onrampURL} target="_blank" rel="noreferrer noopener">
      <ButtonContainer>
        <IconContainer>
          <BuyIcon />
        </IconContainer>
      </ButtonContainer>
    </a>
  );
};
