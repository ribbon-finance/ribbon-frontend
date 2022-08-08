/**
 * Top floating menu component.
 * Used to show menu when clicked on wallet (after connecting)
 * to show additional menu items like "copy address", "open in etherscan", and "disconnect"
 *
 * ONLY visible on desktop
 */

import { AnimatePresence, motion, MotionStyle } from "framer-motion";
import styled from "styled-components";
import sizes from "shared/lib/designSystem/sizes";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";

const Container = styled(motion.div)<{
  isOpen?: boolean;
}>`
  z-index: 1;
  ${(props) =>
    props.isOpen
      ? `
          position: relative;
          width: 309px;
          background-color: ${colors.background.four};
          border-radius: ${theme.border.radius};
          margin-top: -12px;
          padding: 24px 16px 16px 16px;
          line-height: 20px;
          font-size: 14px;
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

const EarnFloatingMenu: React.FC<FloatingMenuProps> = ({
  isOpen,
  children,
  containerStyle,
  transition = {
    moveY: -20,
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

export default EarnFloatingMenu;
