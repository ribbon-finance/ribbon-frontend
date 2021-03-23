import styled from "styled-components";

interface MobileOverlayMenuProps {
  isMenuOpen: boolean;
}

export const MobileOverlayMenu = styled.div<MobileOverlayMenuProps>`
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
