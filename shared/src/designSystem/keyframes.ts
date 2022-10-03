import { keyframes } from "styled-components";

export const shimmerKeyframe = (color: string = "rgba(0,0,0,0)") => keyframes`
    0% {
        box-shadow: ${color}66 0px 0px 70px;
    }
    50% {
        box-shadow: ${color}29 0px 0px 70px;
    }
    100% {
        box-shadow: ${color}66 0px 0px 70px;
    }
`;

export const animatedGradientKeyframe = () => keyframes`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}`;

export const rotateClockwise = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const blinkAnimation = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

export const rotateAnticlockwise = keyframes`
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
`;
