import styled, { keyframes } from "styled-components";
import Logo from "shared/lib/assets/icons/logo";
import { Title } from "shared/lib/designSystem";
import sizes from "shared/lib/designSystem/sizes";
import useScreenSize from "shared/lib/hooks/useScreenSize";

const FloatingContainer = styled.div<{ height: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (max-width: ${sizes.md}px) {
    flex-direction: column;
  }
`;

const rotate = keyframes`
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(360deg);
  }
`;

const RotatingLogo = styled(Logo)`
  margin-right: 32px;
  animation: ${rotate} 2.5s linear infinite;

  @media (max-width: ${sizes.md}px) {
    margin-right: unset;
  }
`;

const NotFound = () => {
  const { height } = useScreenSize();
  return (
    <FloatingContainer height={height}>
      <RotatingLogo height={120} width={120} />
      <Title fontSize={160} lineHeight={160}>
        404
      </Title>
    </FloatingContainer>
  );
};

export default NotFound;
