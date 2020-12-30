import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import styled from "styled-components";
import { Button, PrimaryText, SecondaryText } from "../../designSystem";
import { Input } from "antd";

const maxButtonMarginLeft = 2;
const maxButtonWidth = 40;
const iconMarginLeft = 7;
const iconWidth = 23;
const amountTextMarginLeft = 7;
const amountTextPredictedWidth = 75;

const InputNumberStyled = styled(Input)`
  background-color: white;
  border-radius: 10px;
  width: 98%;
`;

const InputDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #f7f7f7;
  border-radius: 5px;
  width: 100%;
  padding-right: 7px;
`;

type AmountInputProps = {
  onChange: (value: number) => void;
};

const AmountInput: React.FC<AmountInputProps> = ({ onChange }) => {
  const [inputText, setInputText] = useState("");
  const { library, account } = useWeb3React();

  const parseInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    return parseFloat(e.target.value);
  };

  return (
    <InputDiv>
      <InputNumberStyled
        placeholder="0.0 contracts"
        type="number"
        min="0"
        step="0.1"
        value={inputText}
        onKeyDown={(e) => {
          if (e.key === "-") {
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          setInputText(e.target.value);
          onChange(parseInput(e));
        }}
      ></InputNumberStyled>
    </InputDiv>
  );
};

export default AmountInput;
