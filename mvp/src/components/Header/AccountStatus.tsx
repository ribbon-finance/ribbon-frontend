import React, { useCallback, useEffect, useMemo, useState } from "react";
import ethers from "ethers";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { SecondaryText } from "../../designSystem";
import AccountIcon from "./AccountIcon";

const AccountPill = styled.div`
  display: flex;
  flex-direction: row;
  background: #bcbcbc;
  border-radius: 15px;
  cursor: pointer;
`;

const AccountPillText = styled(SecondaryText)`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
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
  background: #636363;
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

  const injectedConnector = useMemo(
    () =>
      new InjectedConnector({
        supportedChainIds: [42],
      }),
    []
  );

  const handleConnect = useCallback(async () => {
    await activateWeb3(injectedConnector);
  }, [injectedConnector, activateWeb3]);

  useEffect(() => {
    (async () => {
      await handleConnect();
    })();
  }, [handleConnect]);

  useEffect(() => {
    if (library && account) {
      (async () => {
        const bal = await library.getBalance(account);
        const isZero = bal.eq("0");
        const etherBal = isZero
          ? "0"
          : parseFloat(ethers.utils.formatEther(bal)).toFixed(3);
        setBalance(etherBal);
      })();
    }
  }, [handleConnect, library, account]);

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
