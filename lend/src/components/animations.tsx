import { fadeIn } from "shared/lib/designSystem/keyframes";
import { css, keyframes } from "styled-components";

export const delayedFade = css<{ delay?: number; duration?: number }>`
  opacity: 0;
  animation: ${fadeIn} ${({ duration }) => duration || 1}s ease-in-out forwards;
  animation-delay: ${({ delay }) => `${delay || 0}s`};
`;

export const upwards = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const delayedUpwardFade = css<{ delay?: number; duration?: number }>`
  opacity: 0;
  animation: ${upwards} ${({ duration }) => duration || 0.5}s ease-in-out
    forwards;
  animation-delay: ${({ delay }) => `${delay || 0}s`} !important;
`;
