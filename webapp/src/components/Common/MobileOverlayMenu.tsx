import React, { useEffect } from "react";
import styled from "styled-components";

interface MenuStateProps {
  isMenuOpen: boolean;
}

export const MobileOverlayContainer = styled.div<MenuStateProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  z-index: -1;
  backdrop-filter: blur(20px);
  transition: 0.1s all ease-in;
  display: flex;

  ${(props) =>
    props.isMenuOpen
      ? `
    opacity: 1;
  `
      : `
    opacity: 0;
    visibility: hidden;
  `}
`;

type MobileOverlayMenuProps = MenuStateProps &
  React.HTMLAttributes<HTMLDivElement> & {
    onOverlayClick?: (event: React.MouseEvent) => void;
  };

const MobileOverlayMenu: React.FC<MobileOverlayMenuProps> = ({
  isMenuOpen,
  children,
  onClick,
  onOverlayClick,
  ...props
}) => {
  useEffect(() => {
    if (isMenuOpen) {
      document.querySelector("body")!.style.overflow = "hidden";
      return;
    }

    document.querySelector("body")!.style.removeProperty("overflow");
  }, [isMenuOpen]);

  return (
    <MobileOverlayContainer
      isMenuOpen={isMenuOpen}
      onClick={(event) => {
        onClick && onClick(event);
        onOverlayClick && onOverlayClick(event);
      }}
      {...props}
    >
      {React.Children.map(children, (child) => {
        return <div onClick={(e) => e.stopPropagation()}>{child}</div>;
      })}
    </MobileOverlayContainer>
  );
};

export default MobileOverlayMenu;
