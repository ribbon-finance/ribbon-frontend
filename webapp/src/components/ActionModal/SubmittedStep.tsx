import React from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import SubmittedIcon from "../../assets/img/SubmittedIcon.svg";
import { ActionButton } from "shared/lib/components/Common/buttons";

const Submitted = styled.img`
  width: 100%;
`;

const Container = styled.div`
  height: 370px;
`;

const LinkButton = styled(ActionButton)`
  position: absolute;
  bottom: 0;
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
      <Container className="position-relative w-100 d-flex align-items-center justify-content-center">
        <div style={{ marginTop: -80 }} className="d-flex align-items-center">
          <Submitted src={SubmittedIcon} alt="Transaction Submitted" />
        </div>

        <LinkButton link={`https://${host}/tx/${txhash}`} className="py-3">
          View on Etherscan
        </LinkButton>
      </Container>
    </>
  );
};

export default SubmittedStep;
