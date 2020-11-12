import React from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

const Warning = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FF0000;
  padding: 10px 15px;
  border-radius: 15px;
  margin-left: 60px;
`;

const WarningText = styled.div`
    color: white;
`;

const NetworkStatus = () => {
  const {chainId} = useWeb3React();

  if (chainId !== 42) {
    return (
        <Warning>
            <WarningText>
                Warning: This application only works on the Kovan testnet.
            </WarningText>
        </Warning>
      );
  } else {
      return (<></>);
  }
};

export default NetworkStatus;
