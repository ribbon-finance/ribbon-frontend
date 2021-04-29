import React, { createRef, useRef, useState } from "react";
import styled from "styled-components";
import { motion, PanInfo } from "framer-motion";
import { VaultList, VaultOptions } from "../../../constants/constants";
import YieldCard from "./YieldCard";

const ScrollContainer = styled.div`
  display: flex;
  // overflow-x: scroll;
  overflow-x: hidden;
  margin: -80px -15px -80px -15px;
`;

const Vaults = styled(motion.div)`
  padding: 80px 12px 80px 12px;
`;

interface MobileThetaProductsProps {
  onVaultPress: (vault: VaultOptions) => void;
}

const MobileThetaProducts: React.FC<MobileThetaProductsProps> = ({
  onVaultPress,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const yieldCardRefs = VaultList.reduce<any>((acc, vault) => {
    acc[vault] = createRef();
    return acc;
  }, {});
  const [productIndex, setProductIndex] = useState(0);

  const dragEndCallback = (_event: any, info: PanInfo) => {
    // Prevent small movement to affect scroll
    if (!(info.offset.x <= -10 || info.offset.x >= 10)) {
      return;
    }

    const currIndex = info.offset.x < 0 ? productIndex + 1 : productIndex - 1;
    if (currIndex < 0) {
      return;
    }

    if (currIndex >= VaultList.length) {
      return;
    }

    try {
      const currentCardInView =
        yieldCardRefs[Object.keys(yieldCardRefs)[currIndex]];

      if (currentCardInView.current) {
        scrollContainerRef.current!.scrollTo({
          left: currentCardInView.current.offsetLeft - 12,
          top: 0,
          behavior: "smooth",
        });
      }
    } finally {
      setProductIndex(currIndex);
    }
  };

  return (
    <ScrollContainer ref={scrollContainerRef}>
      <Vaults
        className="d-flex"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={dragEndCallback}
      >
        {VaultList.map((vault) => (
          <div ref={yieldCardRefs[vault]} key={vault}>
            <YieldCard
              key={vault}
              vault={vault}
              onClick={() => onVaultPress(vault)}
            />
          </div>
        ))}
      </Vaults>
    </ScrollContainer>
  );
};

export default MobileThetaProducts;
