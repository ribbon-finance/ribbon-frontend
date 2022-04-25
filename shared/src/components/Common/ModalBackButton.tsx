import styled from "styled-components";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";

const Container = styled.div.attrs({
  role: "button",
})`
  display: flex;
  position: absolute;
  z-index: 1000;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 40px;
`;

const ArrowBack = styled.i.attrs({
  className: "fas fa-arrow-left",
})`
  color: ${colors.text};
  height: 14px;
`;

const ModalBackButton: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <Container onClick={onBack}>
      <ArrowBack />
    </Container>
  );
};

export default ModalBackButton;
