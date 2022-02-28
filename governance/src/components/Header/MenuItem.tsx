import MenuButton from "shared/lib/components/Common/MenuButton";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";
import styled from "styled-components";

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

  &:hover {
    span {
      color: ${colors.primaryText};
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
  color: ${colors.primaryText}A3;
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
