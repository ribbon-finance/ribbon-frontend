import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { SecondaryText } from "../../designSystem";
import AccountIcon from "./AccountIcon";
import { injectedConnector } from "../../utils/connectors";
import { addConnectEvent } from "../../utils/google";
import { toSignificantDecimals } from "../../utils/math";

const AccountPill = styled.div`
  display: flex;
  flex-direction: row;
  background: #bcbcbc;
  border-radius: 15px;
  cursor: pointer;
  margin-left: 30px;
`;

const AccountPillText = styled(SecondaryText)`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
`;

const AccountPillBalance = styled.div`
  background: #bcbcbc;
  padding: 10px 15px;
  border-radius: 15px;
`;

const AccountPillAddress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0);
  padding: 10px 15px;
  border-radius: 15px;
`;

const IconSpan = styled.span`
  margin-left: 6px;
`;

type Props = {};

const truncateAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(address.length - 4);
};

const AccountStatus: React.FC<Props> = () => {
  const [balance, setBalance] = useState("0");
  const { activate: activateWeb3, library, active, account } = useWeb3React();
  const hasAccount = active && account;

  const handleConnect = useCallback(async () => {
    await activateWeb3(injectedConnector);
  }, [activateWeb3]);

  const fetchAndSetBalance = useCallback(async () => {
    const bal = await library.getBalance(account);
    const isZero = bal.eq("0");
    const etherBal = isZero ? "0" : toSignificantDecimals(bal, 4);
    setBalance(etherBal);
  }, [library, account]);

  useEffect(() => {
    if (library && account) {
      addConnectEvent("header", account);
      fetchAndSetBalance();
    }
  }, [library, account, fetchAndSetBalance]);

  return (
    <AccountPill role="button" onClick={handleConnect}>
      {hasAccount && (
        <AccountPillBalance>
          <AccountPillText>{balance} ETH</AccountPillText>
        </AccountPillBalance>
      )}
      <AccountPillAddress>
        <AccountPillText>
          {active && account ? truncateAddress(account) : "Connect to a wallet"}
        </AccountPillText>
        <IconSpan>
          <AccountIcon></AccountIcon>
        </IconSpan>
      </AccountPillAddress>
    </AccountPill>
  );
};
export default AccountStatus;
