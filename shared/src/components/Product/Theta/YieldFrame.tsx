import { AnimatePresence, motion } from "framer";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { BarChartIcon, GlobeIcon } from "../../../assets/icons/icons";

import { VaultOptions } from "../../../constants/constants";
import { BaseButton, Subtitle } from "../../../designSystem";
import theme from "../../../designSystem/theme";
import { getVaultColor } from "../../../utils/vault";
import { productCopies } from "../productCopies";

const FrameContainer = styled.div`
  perspective: 2000px;
`;

const Frame = styled(motion.div)<{ color: string }>`
  display: flex;
  flex-wrap: wrap;
  width: 294px;
  height: 429px;
  position: relative;
  padding: 18px;
  border-radius: ${theme.border.radius};
  background: linear-gradient(
    96.84deg,
    ${(props) => props.color}29 1.04%,
    ${(props) => props.color}0A 98.99%
  );
  backdrop-filter: blur(16px);
  transition: 0.25s border-color ease-out;

  &:hover {
    padding: 16px;
    border: 2px ${theme.border.style} ${(props) => props.color};
  }
`;

const TagContainer = styled.div`
  z-index: 1;
  margin-right: auto;
`;

const ProductTag = styled(BaseButton)<{ color: string }>`
  background: ${(props) => props.color}29;
  padding: 8px;
  margin-right: 4px;
`;

const ModeSwitcherContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 100px;
  background: ${(props) => props.color}14;
  z-index: 1;
`;

interface YieldFrameProps {
  vault: VaultOptions;
  onClick: () => void;
}

const YieldFrame: React.FC<YieldFrameProps> = ({ vault, onClick }) => {
  const color = getVaultColor(vault);
  const [mode, setMode] = useState<"info" | "yield">("info");

  const onSwapMode = useCallback((e) => {
    e.stopPropagation();
    setMode((prev) => (prev === "info" ? "yield" : "info"));
  }, []);

  return (
    <FrameContainer role="button" onClick={onClick}>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Frame
          key={mode}
          transition={{
            duration: 0.1,
            type: "keyframes",
            ease: "linear",
          }}
          initial={{
            transform: "rotateY(90deg)",
          }}
          animate={{
            transform: "rotateY(0deg)",
          }}
          exit={{
            transform: "rotateY(-90deg)",
          }}
          color={color}
        >
          <div className="d-flex w-100">
            {/* Tags */}
            <TagContainer>
              {productCopies[vault].tags.map((tag) => (
                <ProductTag key={tag} color={color}>
                  <Subtitle>{tag}</Subtitle>
                </ProductTag>
              ))}
            </TagContainer>

            {/* Mode switcher button */}
            <ModeSwitcherContainer
              role="button"
              onClick={onSwapMode}
              color={color}
            >
              {mode === "info" ? (
                <GlobeIcon color={color} />
              ) : (
                <BarChartIcon color={color} />
              )}
            </ModeSwitcherContainer>
          </div>
        </Frame>
      </AnimatePresence>
    </FrameContainer>
  );
};

export default YieldFrame;
