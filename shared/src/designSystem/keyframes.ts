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
