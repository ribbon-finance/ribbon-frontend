import styled from "styled-components";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";

const Container = styled.div.attrs({
  className: "d-flex position-relative",
})`
  border-radius: ${theme.border.radius};
  background: ${colors.background.two};
`;

interface HeaderButtonContainerProps {
  containerRef?: React.RefObject<HTMLDivElement>;
}

const HeaderButtonContainer: React.FC<HeaderButtonContainerProps> = ({
  containerRef,
  children,
}) => {
  return <Container ref={containerRef}>{children}</Container>;
};

export default HeaderButtonContainer;
