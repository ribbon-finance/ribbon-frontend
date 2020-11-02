import React from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import ethereumAccountImage from "../../img/ethAccount.svg";
import { SecondaryText } from "../../designSystem";
import AccountIcon from "./AccountIcon";

const AccountPill = styled.div`
  display: flex;
  flex-direction: row;
  background: #bcbcbc;
  border-radius: 15px;
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

const AddressIcon = styled.img`
  margin-left: 2px;
`;

type Props = {};

const truncateAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(address.length - 4);
};

const AccountStatus: React.FC<Props> = () => {
  const { active, account } = useWeb3React();

  return (
    <AccountPill onClick={() => {}}>
      <AccountPillBalance>
        <AccountPillText>0.5083 ETH</AccountPillText>
      </AccountPillBalance>
      <AccountPillAddress>
        <AccountPillText>
          {active && account ? truncateAddress(account) : "Not Connected"}
        </AccountPillText>
        <AccountIcon></AccountIcon>
      </AccountPillAddress>
    </AccountPill>
  );
};
export default AccountStatus;
