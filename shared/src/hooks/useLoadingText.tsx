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

const Dot = styled.span<{ index: number }>`
  animation: ${flashing} 2s ease-in-out infinite;
  animation-delay: ${(props) => props.index}s;
  display: inline;
`;

const useLoadingText = (text: string = "Loading") => {
  return (
    <span>
      {text}
      <Dots>
        {[0.3, 0.6, 0.9].map((value, index) => (
          <Dot index={value}>.</Dot>
        ))}
      </Dots>
    </span>
  );
};

export default useLoadingText;
