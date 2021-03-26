import React from "react";
import styled from "styled-components";
import Theta from "../Product/Splash/Theta";

const BottomText = styled.div`
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
`;

const ConfirmationStep = () => {
  return (
    <>
      <Theta className="w-100 my-5"></Theta>
      <BottomText className="mb-2">
        Confirm this transaction in your wallet
      </BottomText>
    </>
  );
};

export default ConfirmationStep;
