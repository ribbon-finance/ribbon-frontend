import React, { useEffect } from "react";
import styled from "styled-components";

interface MobileOverlayMenuProps {
  isMenuOpen: boolean;
}

export const MobileOverlayContainer = styled.div<MobileOverlayMenuProps>`
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

const MobileOverlayMenu: React.FC<
  MobileOverlayMenuProps & React.HTMLAttributes<HTMLDivElement>
> = ({ isMenuOpen, children, ...props }) => {
  useEffect(() => {
    if (isMenuOpen) {
      document.querySelector("body")!.style.overflow = "hidden";
      return;
    }

    document.querySelector("body")!.style.removeProperty("overflow");
  }, [isMenuOpen]);

  return (
    <MobileOverlayContainer isMenuOpen={isMenuOpen} {...props}>
      {children}
    </MobileOverlayContainer>
  );
};

export default MobileOverlayMenu;
