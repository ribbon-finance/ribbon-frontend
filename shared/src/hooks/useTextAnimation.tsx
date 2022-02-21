import styled, { keyframes } from "styled-components";
import colors from "../designSystem/colors";

const flashing = () => keyframes`
 0%,
 100% {
    opacity: 0;
    // width: 100%;
  }
  
  50% {
    opacity: 1;
    // width: 0%;
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

const useTextAnimation = (text: string = "Loading") => {
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

export default useTextAnimation;
