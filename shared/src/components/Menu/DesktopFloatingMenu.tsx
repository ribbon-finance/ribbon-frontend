/**
 * Top floating menu component.
 * Used to show menu when clicked on wallet (after connecting)
 * to show additional menu items like "copy address", "open in etherscan", and "disconnect"
 *
 * ONLY visible on desktop
 */

import { AnimatePresence, motion, MotionStyle } from "framer-motion";
import styled from "styled-components";
import sizes from "../../designSystem/sizes";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";

const Container = styled(motion.div)<{
  isOpen?: boolean;
}>`
  ${(props) =>
    props.isOpen
      ? `
         position: absolute;
         right: 0px;
         top: 64px;
         width: fit-content;
         background-color: ${colors.background.two};
         border-radius: ${theme.border.radius};
       `
      : `
         display: none;
       `}

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

interface FloatingMenuProps {
  isOpen: boolean;
  containerStyle?: MotionStyle;

  // Transition props.
  transition?: {
    // How much does the Y position moves on animate.
    // Default is 20
    moveY?: number;
  };
}

const DesktopFloatingMenu: React.FC<FloatingMenuProps> = ({
  isOpen,
  children,
  containerStyle,
  transition = {
    moveY: 20,
  },
}) => {
  return (
    <AnimatePresence>
      <Container
        key={isOpen.toString()}
        isOpen={isOpen}
        style={containerStyle}
        initial={{
          opacity: 0,
          y: transition.moveY,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: transition.moveY,
        }}
        transition={{
          type: "keyframes",
          duration: 0.2,
        }}
      >
        {children}
      </Container>
    </AnimatePresence>
  );
};

export default DesktopFloatingMenu;
