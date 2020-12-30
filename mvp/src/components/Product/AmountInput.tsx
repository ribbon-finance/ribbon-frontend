import React from "react";
import styled from "styled-components";
import { Input } from "antd";

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

function AmountInput(props: any) {
  function handleChange(event: any) {
    if (event.target.value == "") {
      event.target.value = 0;
    }
    props.onChange(event.target.value);
  }

  return (
    <InputDiv>
      <InputNumberStyled
        placeholder="0.0 contracts"
        type="number"
        min="0"
        step="0.1"
        value={props.value}
        onKeyDown={(e) => {
          if (e.key === "-") {
            e.preventDefault();
          }
        }}
        onChange={handleChange}
      ></InputNumberStyled>
    </InputDiv>
  );
}
export default AmountInput;
