import React from "react";
import styled, { keyframes } from "styled-components";

const flashing = () => keyframes`
 0%,
 100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}`;

const Dots = styled.span`
  display: inline-flex;
`;

const Dot = styled.span<{ delay: number }>`
  animation: ${flashing} 2s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
  display: inline;
`;

export const LoadingText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span>
      {text}
      <Dots>
        {/* Here we insert the delay values to map the respective dots */}
        {[0.3, 0.6, 0.9].map((value) => (
          <Dot key={value} delay={value}>
            .
          </Dot>
        ))}
      </Dots>
    </span>
  );
};

const useLoadingText = (text: string = "Loading") => {
  return <LoadingText text={text} />;
};

export default useLoadingText;
