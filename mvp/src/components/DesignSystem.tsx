import React from "react";
import styled from "styled-components";

export const BaseText = styled.span`
  font-family: "Roboto", sans-serif;
`;

export const PrimaryText = styled(BaseText)`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 23px;
`;

export const SecondaryText = styled(BaseText)`
  color: white;
`;
