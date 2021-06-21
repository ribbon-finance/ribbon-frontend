import { keyframes } from "styled-components";

export const shimmerKeyframe = (color: string = "rgba(0,0,0,0)") => keyframes`
    0% {
        box-shadow: ${color}66 8px 16px 80px;
    }
    50% {
        box-shadow: ${color}29 8px 16px 80px;
    }
    100% {
        box-shadow: ${color}66 8px 16px 80px;
    }
`;
