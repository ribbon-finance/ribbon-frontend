import React from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import SubmittedIcon from "../../assets/img/SubmittedIcon.svg";
import { ActionButton } from "../Common/buttons";

const Submitted = styled.img`
  width: 100%;
`;

interface SubmittedStepProps {
  txhash: string;
}

const SubmittedStep: React.FC<SubmittedStepProps> = ({ txhash }) => {
  const { chainId } = useWeb3React();

  let host;
  switch (chainId) {
    case 1:
      host = "etherscan.io";
      break;
    case 42:
      host = "kovan.etherscan.io";
      break;
    default:
      host = "etherscan.io";
      break;
  }

  return (
    <>
      <div style={{ flex: 1 }} className="d-flex align-items-center">
        <Submitted src={SubmittedIcon} alt="Transaction Submitted" />
      </div>

      <ActionButton link={`https://${host}/tx/${txhash}`} className="py-3 my-3">
        View on Etherscan
      </ActionButton>
    </>
  );
};

export default SubmittedStep;
