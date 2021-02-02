import React from "react";
import styled from "styled-components";
import { Input } from "antd";

const InputNumberStyled = styled(Input)`
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  width: 98%;
  height: 60px;
`;

const InputDiv = styled.div`
  border-radius: 5px;
  width: 100%;
`;

function AmountInput(props: any) {
  function handleChange(event: any) {
    if (event.target.value === "") {
      event.target.value = 0;
    }
    props.onChange(event.target.value);
  }

  return (
    <InputDiv>
      <InputNumberStyled
        placeholder="0.0"
        type="number"
        min="0"
        step="0.1"
        size="large"
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
