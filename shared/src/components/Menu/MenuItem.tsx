import MenuButton from "../../components/Common/MenuButton";
import { Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import sizes from "../../designSystem/sizes";
import styled from "styled-components";
import theme from "../../designSystem/theme";

const Container = styled.div`
  padding: 8px 16px;
  padding-right: 38px;
  opacity: 1;
  display: flex;
  align-items: center;

  &:first-child {
    padding-top: 16px;
  }

  &:last-child {
    padding-bottom: 16px;
  }

  // Doing this allows us to change child opacity
  // without affecting the container background
  > * {
    opacity: ${theme.hover.opacity};
  }
  &:hover {
    > * {
      opacity: 1;
    }
  }

  @media (max-width: ${sizes.md}px) {
    margin: unset;
    && {
      padding: 28px;
    }
  }
`;

const MenuItemText = styled(Title)`
  color: ${colors.primaryText};
  white-space: nowrap;
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.md}px) {
    font-size: 24px;
  }
`;

const MenuCloseItemContainer = styled(Container)`
  position: absolute;
  bottom: 50px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

interface MenuItemProps {
  title: string;
  onClick?: () => void;
  extra?: React.ReactNode;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  title,
  onClick,
  extra,
}) => {
  return (
    <Container onClick={onClick} role="button">
      <MenuItemText>{title}</MenuItemText>
      {extra}
    </Container>
  );
};

interface MenuCloseItemProps {
  onClose: () => void;
}
export const MenuCloseItem: React.FC<MenuCloseItemProps> = ({ onClose }) => {
  return (
    <MenuCloseItemContainer role="button" onClick={onClose}>
      <MenuButton isOpen={true} onToggle={onClose} />
    </MenuCloseItemContainer>
  );
};
