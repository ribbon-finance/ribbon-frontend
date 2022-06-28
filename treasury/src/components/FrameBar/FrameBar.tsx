import colors from "shared/lib/designSystem/colors";
import styled, { keyframes } from "styled-components";

const livelyAnimation = (position: "top" | "bottom") => keyframes`
  0% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }

  50% {
    background-position-x: ${position === "top" ? 100 : 0}%; 
  }

  100% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }
`;

export const FrameBar = styled.div<{
    bottom: number;
    height: number;
}>`
  position: absolute;
  width: 100%;
  height: ${(props) => props.height}px;
  background: ${`linear-gradient(
    270deg,
    ${colors.asset.veRBN}00 5%,
    ${colors.asset.veRBN} 50%,
    ${colors.asset.veRBN}00 95%
  )`};
  background-size: 200%;
  animation: 10s ${livelyAnimation("bottom")} linear infinite;
  left: 0;
  bottom: ${(props) => props.bottom}px;
`;
