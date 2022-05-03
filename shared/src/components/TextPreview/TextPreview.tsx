// Preview screen to show before loading the actual screen

import styled from "styled-components";
import { Title } from "../../designSystem";
import colors from "../../designSystem/colors";

const Container = styled.div.attrs({
  className: "d-flex align-items-center justify-content-center",
})`
  background-color: ${colors.background.one};
  height: 100vh;
`;

const TextPreview: React.FC = ({ children }) => {
  return (
    <Container>
      <Title fontSize={24} color={colors.primaryText}>
        {children}
      </Title>
    </Container>
  );
};

export default TextPreview;
