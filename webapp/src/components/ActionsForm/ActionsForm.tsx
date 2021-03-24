import React, { useState } from "react";
import styled from "styled-components";
import { Title } from "../../designSystem";

const FormContainer = styled.div`
  font-family: VCR;
  color: #f3f3f3;
  width: 100%;
  border: 1px solid #2b2b2b;
  box-sizing: border-box;
  border-radius: 8px;
`;

const FormTitleDiv = styled.div<{ active: boolean }>`
  width: 100%;
  padding: 24px 60px;
  background-color: ${(props) =>
    props.active ? "#151413" : "rgba(255, 255, 255, 0.04)"};
  cursor: pointer;
`;

const FormTitle = styled(Title)<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 24px;
  text-transform: uppercase;
  color: ${(props) => (props.active ? "#f3f3f3" : "rgba(243, 243, 243, 0.64)")};
`;

const InputGuide = styled.div`
  color: #ffffff;
  opacity: 0.4;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 1.5px;
`;

const ContentContainer = styled.div`
  background: #1c1a19;
`;

const FormInput = styled.input`
  height: 80px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  font-size: 48px;
  line-height: 64px;
  color: #ffffff;
  border: none;

  &:focus {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.04);
    border: none;
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    border: rgba(255, 255, 255, 0);
  }
`;

const MaxAccessory = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  right: 0;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 8px;
  height: 32px;
  font-size: 11px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 1.5px;
  cursor: pointer;
`;

const ConnectWalletButton = styled.button`
  width: 100%;
  background: rgba(22, 206, 185, 0.08);
  border-radius: 8px;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-transform: uppercase;
  color: #16ceb9;

  &:hover {
    color: #16ceb9;
  }
`;

const WalletBalance = styled.div<{ active: boolean }>`
  width: 100%;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  text-transform: uppercase;
  color: ${(props) => (props.active ? "#FFFFFF" : "rgba(255, 255, 255, 0.16)")};
`;

const ActionsForm = () => {
  const [isDeposit, setIsDeposit] = useState(true);
  const [inputAmount, setInputAmount] = useState("");

  return (
    <FormContainer>
      <div
        style={{ justifyContent: "space-evenly" }}
        className="d-flex flex-row align-items-center"
      >
        <FormTitleDiv active={isDeposit} onClick={() => setIsDeposit(true)}>
          <FormTitle active={isDeposit}>Deposit</FormTitle>
        </FormTitleDiv>
        <FormTitleDiv active={!isDeposit} onClick={() => setIsDeposit(false)}>
          <FormTitle active={!isDeposit}>Withdraw</FormTitle>
        </FormTitleDiv>
      </div>
      <ContentContainer className="px-4 py-4">
        <InputGuide>AMOUNT (ETH)</InputGuide>
        <div className="position-relative mb-5">
          <FormInput
            type="number"
            className="form-control mt-2 px-4 py-3"
            aria-label="ETH"
            placeholder="0"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
          />
          <MaxAccessory>MAX</MaxAccessory>
        </div>

        <ConnectWalletButton type="button" className="btn py-3 mb-4">
          Connect Wallet
        </ConnectWalletButton>

        <WalletBalance active={false}>
          {isDeposit ? "Wallet Balance: ---" : "Your Position: ---"}
        </WalletBalance>
      </ContentContainer>
    </FormContainer>
  );
};

export default ActionsForm;
