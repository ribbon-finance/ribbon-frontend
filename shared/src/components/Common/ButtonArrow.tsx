import React from "react";
import styled from "styled-components";

export interface ButtonArrowIProps {
  isOpen: boolean;
  color?: string;
  fontSize?: number;
}

const ButtonArrowI = styled.i<ButtonArrowIProps>`
  transition: 0.2s all ease-out;
  transform: ${(props) => (props.isOpen ? "rotate(-180deg)" : "none")};
  ${(props) => (props.color ? `color: ${props.color};` : "")}
  ${(props) => (props.fontSize ? `font-size: ${props.fontSize}px` : "")};
`;

type ButtonArrowProps = React.HTMLAttributes<HTMLImageElement> &
  ButtonArrowIProps;

const ButtonArrow: React.FC<ButtonArrowProps> = ({ className, ...props }) => (
  <ButtonArrowI className={`fas fa-chevron-down ${className}`} {...props} />
);

export default ButtonArrow;
