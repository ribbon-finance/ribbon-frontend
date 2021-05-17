import React from "react";
import styled from "styled-components";

import { PrimaryText, Title } from "shared/lib/designSystem";

const ContentColumn = styled.div<{ marginTop?: number | "auto" }>`
  display: flex;
  justify-content: center;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop || 24}px`};
`;

const FloatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -16px;
  left: 0;
  width: 100%;
  height: calc(100%);
  padding: 0 16px;
`;

const Pole = styled.div`
  width: 160px;
  height: 320px;
  background: #ffffff0a;
`;

const AirdropClaim = () => {
  return (
    <>
      <ContentColumn marginTop={-24}>
        <Title>CONFIRM Transaction</Title>
      </ContentColumn>
      <ContentColumn marginTop="auto">
        <PrimaryText>Confirm this transaction in your wallet</PrimaryText>
      </ContentColumn>
      <FloatingContainer>
        <Pole />
      </FloatingContainer>
    </>
  );
};

export default AirdropClaim;
