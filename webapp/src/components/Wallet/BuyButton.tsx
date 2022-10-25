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
  margin-right: 8px;

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
  transform: scale(0.8);
`;

type BuyButtonProps = {};

export const BuyButton: React.FC<BuyButtonProps> = (props) => {
  const [active, setActive] = useState(false);
  const [onrampInstance, setOnrampInstance] = useState<
    CBPayInstanceType | undefined
  >();

  const { account, chainId } = useWeb3Wallet();

  useEffect(() => {
    //console.log("checking onramp", account, chainId);

    const appId = process.env.REACT_APP_COINBASE_APPID;
    if (!appId) return;

    const destinationWallets = [];
    if (account && account.length > 0) {
      if (chainId === undefined) {
        destinationWallets.push({
          address: account,
          blockchains: ["solana"],
        });
      } else if (ID_TO_CHAINS[chainId] === Chains.Ethereum) {
        destinationWallets.push({
          address: account,
          blockchains: ["ethereum"],
        });
      } else if (ID_TO_CHAINS[chainId] === Chains.Solana) {
        destinationWallets.push({
          address: account,
          blockchains: ["solana"],
        });
      } else if (ID_TO_CHAINS[chainId] === Chains.Avalanche) {
        destinationWallets.push({
          address: account,
          blockchains: ["avalanche-c-chain"],
        });
      }
    }
    if (destinationWallets.length < 1) {
      onrampInstance?.destroy();
      setOnrampInstance(undefined);
      setActive(false);
      return;
    }
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
        setActive(true);
        setOnrampInstance(instance);
      }
    });
    return () => {
      onrampInstance?.destroy();
    };
  }, [account]);

  const handleClick = () => {
    onrampInstance?.open();
  };

  if (!active) return <></>;
  return (
    <ButtonContainer role="button" onClick={handleClick}>
      <IconContainer>
        <BuyIcon color={"white"} />
      </IconContainer>
    </ButtonContainer>
  );
};
