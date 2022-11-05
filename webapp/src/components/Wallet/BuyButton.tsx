import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { initOnRamp } from "@coinbase/cbpay-js";
import type { CBPayInstanceType, InitOnRampParams } from "@coinbase/cbpay-js";
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

type BuyButtonProps = {};

type DestinationWallet = {
  address: string;
  blockchains: string[];
};

export const BuyButton: React.FC<BuyButtonProps> = (props) => {
  const [active, setActive] = useState(false);
  const [walletAccount, setWalletAccount] = useState<string>();
  const [initializing, setInitializing] = useState(false);
  const [onrampInstance, setOnrampInstance] = useState<
    CBPayInstanceType | undefined
  >();

  const { account, chainId } = useWeb3Wallet();

  useEffect(() => {
    setInitializing(true);
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
      onrampInstance?.destroy();
      setOnrampInstance(undefined);
      setActive(false);
      return;
    }

    const appId = process.env.REACT_APP_COINBASE_APPID;
    if (!appId) return;

    const initParams: InitOnRampParams = {
      appId,
      experienceLoggedIn: "new_tab",
      experienceLoggedOut: "new_tab",
      widgetParameters: {
        destinationWallets,
      },
      onSuccess: () => {
        // handle navigation when user successfully completes the flow
        console.log("purchase complete");
      },
      onExit: () => {
        // handle navigation from dismiss / exit events due to errors
        console.log("purchase exited");
      },
    };
    initOnRamp(initParams, (_, instance) => {
      if (instance) {
        //check that account connected is same as destination wallet account
        if (account) {
          setWalletAccount(account);
        }
        setActive(true);
        setInitializing(false);
        setOnrampInstance(instance);
      }
    });

    return () => {
      onrampInstance?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  const handleClick = () => {
    if (!initializing) {
      onrampInstance?.open();
    }
  };

  if (!active || !account || account !== walletAccount) return <></>;
  return (
    <ButtonContainer role="button" onClick={handleClick}>
      <IconContainer>
        <BuyIcon />
      </IconContainer>
    </ButtonContainer>
  );
};
