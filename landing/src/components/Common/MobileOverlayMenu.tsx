import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import useScreenSize from "../../hooks/useScreenSize";

interface MenuStateProps {
  isMenuOpen: boolean;
}

interface ScreenHeightProps {
  height: number;
}

type MobileOverlayContainerProps = MenuStateProps & ScreenHeightProps;

export const MobileOverlayContainer = styled.div<MobileOverlayContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${(props) => (props.height ? `${props.height}px` : `100vh`)};
  z-index: ${(props) => (props.isMenuOpen ? 50 : -1)};
  transition: 0.1s all ease-in;
  display: flex;

  backdrop-filter: blur(40px);
  /**
   * Firefox desktop come with default flag to have backdrop-filter disabled
   * Firefox Android also currently has bug where backdrop-filter is not being applied
   * More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1178765
   **/
  @-moz-document url-prefix() {
    background-color: rgba(0, 0, 0, 0.9);
  }

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
    mountRoot?: string;
    boundingDivProps?: React.HTMLAttributes<HTMLDivElement>;
    overflowOnOpen?: boolean;
  };

const MobileOverlayMenu: React.FC<MobileOverlayMenuProps> = ({
  isMenuOpen,
  children,
  onClick,
  mountRoot,
  boundingDivProps,
  overflowOnOpen = true,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useScreenSize();

  useEffect(() => {
    if (!containerRef.current || !mountRoot) {
      return;
    }

    document.querySelector(mountRoot)!.appendChild(containerRef.current);
  }, [containerRef, mountRoot]);

  useEffect(() => {
    if (isMenuOpen && overflowOnOpen) {
      document.querySelector("body")!.style.overflow = "hidden";
      return;
    }

    document.querySelector("body")!.style.removeProperty("overflow");
  }, [isMenuOpen, overflowOnOpen]);

  return (
    <MobileOverlayContainer
      isMenuOpen={isMenuOpen}
      height={height}
      onClick={(event) => {
        onClick && onClick(event);
      }}
      ref={containerRef}
      {...props}
    >
      {React.Children.map(children, (child) => {
        return (
          <div onClick={(e) => e.stopPropagation()} {...boundingDivProps}>
            {child}
          </div>
        );
      })}
    </MobileOverlayContainer>
  );
};

export default MobileOverlayMenu;
