import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

import { VaultList } from "../../constants/constants";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import YieldCard from "./Product/YieldCard";

const Carousel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ArrowButton = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.backgroundDarker};
  border-radius: 100px;
  width: 64px;
  height: 64px;
  transition: opacity 500ms ease-in;

  ${(props) =>
    props.disabled
      ? `
          opacity: 0.24;
          cursor: default;
        `
      : `
          &:hover {
            opacity: ${theme.hover.opacity};
          }
        `}

  i {
    color: white;
  }
`;

const ThetaCarousel = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const canPrev = useMemo(() => activeIndex > 0, [activeIndex]);
  const canNext = useMemo(() => VaultList.length - 1 > activeIndex, [
    activeIndex,
  ]);

  return (
    <Carousel>
      <ArrowButton
        role="button"
        disabled={!canPrev}
        onClick={() => {
          if (!canPrev) {
            return;
          }

          setActiveIndex((i) => i - 1);
        }}
      >
        <i className="fas fa-arrow-left" />
      </ArrowButton>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={activeIndex}
          transition={{
            duration: 0.4,
            type: "keyframes",
            ease: "easeInOut",
          }}
          initial={{
            y: 30,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: 30,
            opacity: 0,
          }}
        >
          <YieldCard vault={VaultList[activeIndex]} />
        </motion.div>
      </AnimatePresence>
      <ArrowButton
        role="button"
        disabled={!canNext}
        onClick={() => {
          if (!canNext) {
            return;
          }

          setActiveIndex((i) => i + 1);
        }}
      >
        <i className="fas fa-arrow-right" />
      </ArrowButton>
    </Carousel>
  );
};

export default ThetaCarousel;
