import React, { useCallback } from "react";
import styled from "styled-components";

import Indicator from "../Indicator/Indicator";
import { mobileWidth } from "../../designSystem/sizes";
import { PrimaryText, BaseButton } from "../../designSystem";
import colors from "../../designSystem/colors";
import { WalletStatusProps } from "./types";
import { useWeb3Modal } from "../../hooks/useWeb3Modal";

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
  const { accounts, onConnect, onReset } = useWeb3Modal();
  const active = !!accounts.length;

  const handleConnect = useCallback(async () => {
    if (active) {
      onReset();
    }

    onConnect();
  }, [active, onConnect, onReset]);

  const renderButtonContent = () =>
    false ? (
      <>
        <Indicator connected={active} />
        <WalletButtonText connected={active}>
          {truncateAddress(accounts[0])}
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
