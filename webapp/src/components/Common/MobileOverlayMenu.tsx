import React, { useEffect } from "react";
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${(props) => (props.height ? `${props.height}px` : `100vh`)};
  z-index: -1;
  transition: 0.1s all ease-in;
  display: flex;

  backdrop-filter: blur(20px);
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
    onOverlayClick?: (event: React.MouseEvent) => void;
  };

const MobileOverlayMenu: React.FC<MobileOverlayMenuProps> = ({
  isMenuOpen,
  children,
  onClick,
  onOverlayClick,
  ...props
}) => {
  const { height } = useScreenSize();

  useEffect(() => {
    if (isMenuOpen) {
      (document.querySelector(
        "div#appRoot"
      )! as HTMLDivElement).style.overflow = "hidden";
      return;
    }

    (document.querySelector(
      "div#appRoot"
    )! as HTMLDivElement).style.removeProperty("overflow");
  }, [isMenuOpen]);

  return (
    <MobileOverlayContainer
      isMenuOpen={isMenuOpen}
      height={height}
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
