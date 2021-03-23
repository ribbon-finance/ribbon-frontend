import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import Indicator from "../Indicator/Indicator";
import { mobileWidth } from "../../designSystem/sizes";
import { PrimaryText, BaseButton } from "../../designSystem";
import { injectedConnector } from "../../utils/connectors";
import { addConnectEvent } from "../../utils/analytics";
import colors from "../../designSystem/colors";
import { WalletStatusProps } from "./types";

const WalletContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 40px;
  z-index: 1000;

  @media (max-width: ${mobileWidth}px) {
    display: none;
  }
`;

const WalletButton = styled(BaseButton)<WalletStatusProps>`
  background-color: ${(props) =>
    props.connected ? colors.backgroundDarker : `${colors.green}14`};
  align-items: center;
`;

const WalletButtonText = styled(PrimaryText)<WalletStatusProps>`
  ${(props) => {
    if (props.connected) return null;

    return `color: ${colors.green}`;
  }}
`;

type Props = {};

const truncateAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(address.length - 4);
};

const AccountStatus: React.FC<Props> = () => {
  const {
    activate: activateWeb3,
    deactivate: deactivateWeb3,
    library,
    active,
    account,
  } = useWeb3React();

  const handleConnect = useCallback(async () => {
    if (active) {
      deactivateWeb3();
    }

    await activateWeb3(injectedConnector);
  }, [activateWeb3, deactivateWeb3, active]);

  useEffect(() => {
    if (library && account) {
      addConnectEvent("header", account);
    }
  }, [library, account]);

  const renderButtonContent = () =>
    active && account ? (
      <>
        <Indicator connected={active} />
        <WalletButtonText connected={active}>
          {truncateAddress(account)}
        </WalletButtonText>
      </>
    ) : (
      <WalletButtonText connected={active}>CONNECT WALLET</WalletButtonText>
    );

  return (
    <WalletContainer>
      <WalletButton connected={active} role="button" onClick={handleConnect}>
        {renderButtonContent()}
      </WalletButton>
    </WalletContainer>
  );
};
export default AccountStatus;
