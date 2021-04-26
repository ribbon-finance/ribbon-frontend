import React from "react";
import styled, { keyframes } from "styled-components";

import Theta from "../../assets/icons/theta/Theta";

const ThetaAnimation = keyframes`
  15% {
    opacity: 1;
  }
  50% {
    opacity: 0.08;
  }
  85% {
    opacity: 1;
  }
`;

const BottomText = styled.div`
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
`;

const Icon = styled(Theta)`
  animation: ${ThetaAnimation} 800ms ease-in-out infinite;
  margin-left: 15%;
  margin-right: 15%;
  width: 70%;
`;

const ConfirmationStep = () => {
  return (
    <>
      <div>
        <Icon className="my-5"></Icon>
        <BottomText className="mb-2">
          Confirm this transaction in your wallet
        </BottomText>
      </div>
    </>
  );
};

export default ConfirmationStep;
