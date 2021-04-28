import React from "react";
import styled from "styled-components";

export interface OpenStateProps {
  isOpen: boolean;
}

const ButtonArrowI = styled.i<OpenStateProps>`
  transition: 0.2s all ease-out;
  transform: ${(props) => (props.isOpen ? "rotate(-180deg)" : "none")};
`;

type ButtonArrowProps = React.HTMLAttributes<HTMLImageElement> & OpenStateProps;

const ButtonArrow: React.FC<ButtonArrowProps> = (props) => (
  <ButtonArrowI className="fas fa-chevron-down" {...props} />
);

export default ButtonArrow;
