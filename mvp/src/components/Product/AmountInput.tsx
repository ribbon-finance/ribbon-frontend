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

const InputAccessories = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledInput = styled.input`
  background: #f7f7f7;
  width: calc(
    100% - ${maxButtonMarginLeft}px - ${maxButtonWidth}px - ${iconMarginLeft}px -
      ${iconWidth}px - ${amountTextMarginLeft}px - ${amountTextPredictedWidth}px
  );
  padding: 8px 11px;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  border-radius: 5px;
  border: none;
`;

const MaxButton = styled(Button)`
  background: #c4c4c4;
  border-radius: 10px;
  width: ${maxButtonWidth}px;
  height: 22px;
  margin-left: ${maxButtonMarginLeft}px;
`;

const MaxButtonText = styled(SecondaryText)`
  font-weight: bold;
  font-size: 12px;
  line-height: 14px;
`;

const PaymentCurrencyIcon = styled.img`
  margin-left: ${iconMarginLeft}px;
  width: ${iconWidth}px;
  height: 23px;
`;

const AmountText = styled(PrimaryText)`
  margin-left: ${amountTextMarginLeft}px;
  font-weight: bold;
  font-size: 15px;
  line-height: 23px;
  text-align: center;
  color: #000000;
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
