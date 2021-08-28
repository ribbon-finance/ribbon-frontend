import React from "react";
import styled from "styled-components";

export interface OpenStateProps {
  isOpen: boolean;
  color?: string;
}

const ButtonArrowI = styled.i<OpenStateProps>`
  transition: 0.2s all ease-out;
  transform: ${(props) => (props.isOpen ? "rotate(-180deg)" : "none")};
  ${(props) => (props.color ? `color: ${props.color};` : "")}
`;

type ButtonArrowProps = React.HTMLAttributes<HTMLImageElement> & OpenStateProps;

const ButtonArrow: React.FC<ButtonArrowProps> = ({ className, ...props }) => (
  <ButtonArrowI className={`fas fa-chevron-down ${className}`} {...props} />
);

export default ButtonArrow;
