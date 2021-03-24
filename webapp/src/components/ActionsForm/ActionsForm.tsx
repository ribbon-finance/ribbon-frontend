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
  color: rgba(255, 255, 255, 0.64);
  border: none;
`;

const ActionsForm = () => {
  const [inputAmount, setInputAmount] = useState(0);

  return (
    <FormContainer>
      <div
        style={{ justifyContent: "space-evenly" }}
        className="d-flex flex-row align-items-center"
      >
        <FormTitleDiv active>
          <FormTitle active>Deposit</FormTitle>
        </FormTitleDiv>
        <FormTitleDiv active={false}>
          <FormTitle active={false}>Withdraw</FormTitle>
        </FormTitleDiv>
      </div>
      <ContentContainer className="px-4 py-4">
        <InputGuide>AMOUNT (ETH)</InputGuide>
        <FormInput
          type="text"
          className="form-control mt-2 px-4 py-3"
          aria-label="ETH"
          placeholder="0"
          value={inputAmount}
        />
      </ContentContainer>
    </FormContainer>
  );
};

export default ActionsForm;
