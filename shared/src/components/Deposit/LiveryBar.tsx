import styled, { keyframes } from "styled-components";

type AnimationStyle = "leftToRight" | "rightToLeft";

const livelyAnimation = (animationStyle: AnimationStyle) => keyframes`
0% {
  background-position-x: ${animationStyle === "rightToLeft" ? 0 : 100}%;
}

50% {
  background-position-x: ${animationStyle === "rightToLeft" ? 100 : 0}%;
}

100% {
  background-position-x: ${animationStyle === "rightToLeft" ? 0 : 100}%;
}
`;

const LiveryBar = styled.div<{
  color: string;
  animationStyle: AnimationStyle;
  height?: number;
}>`
  width: 100%;
  height: ${(props) => props.height || "8"}px;
  background: ${(props) => `linear-gradient(
  270deg,
  ${props.color}00 15%,
  ${props.color} 50%,
  ${props.color}00 85%
)`};
  background-size: 200%;
  animation: 10s ${(props) => livelyAnimation(props.animationStyle)} linear
    infinite;
`;

export default LiveryBar;
