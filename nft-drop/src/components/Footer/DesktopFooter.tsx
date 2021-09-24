import React from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { AnimatePresence, motion } from "framer-motion";

import sizes from "shared/lib/designSystem/sizes";
import { useNFTDropGlobalState } from "../../store/store";
import { useMemo } from "react";
import { PrimaryText, Subtitle } from "shared/lib/designSystem";
import theme from "shared/lib/designSystem/theme";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { getThemeColorFromColorway } from "../../utils/colors";
import { useNFTDropData } from "../../hooks/nftDataContext";

const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-wrap: nowrap;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const TextButton = styled(Subtitle)`
  opacity: ${theme.hover.opacity};

  &:hover {
    opacity: 1;
  }
`;

const StyledActionButton = styled(ActionButton)<{ width: number }>`
  min-width: 150px;
  width: ${(props) => props.width}px;
  padding: 12px 64px;
`;

const DesktopFooter = () => {
  const { active } = useWeb3React();
  const nftDropData = useNFTDropData();
  const [views, setViews] = useNFTDropGlobalState("homepageView");
  const [buttonWidth] = useNFTDropGlobalState("claimButtonWidth");
  const [, setShowClaimModal] = useNFTDropGlobalState("showClaimModal");

  const [footerContentId, footerContent] = useMemo(() => {
    switch (views) {
      case "video":
        return [
          0,
          <TextButton
            fontSize={14}
            lineHeight={20}
            role="button"
            onClick={() => setViews("claim")}
          >
            SKIP VIDEO
          </TextButton>,
        ];
      case "claim":
        if (!active || nftDropData.colorway !== undefined) {
          return [
            1,
            <div>
              <StyledActionButton
                className="btn"
                onClick={() => setShowClaimModal(true)}
                disabled={!active}
                color={getThemeColorFromColorway(
                  !active ? 0 : nftDropData.colorway
                )}
                width={buttonWidth}
              >
                CLAIM NFT
              </StyledActionButton>
            </div>,
          ];
        }

        return [
          2,
          <PrimaryText fontSize={14} lineHeight={20}>
            Unfortunately, you don’t have a claimable NFT
          </PrimaryText>,
        ];
    }
  }, [
    active,
    buttonWidth,
    nftDropData.colorway,
    setShowClaimModal,
    setViews,
    views,
  ]);

  return (
    <FooterContainer>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={footerContentId}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.25,
            type: "keyframes",
            ease: "easeInOut",
          }}
        >
          {footerContent}
        </motion.div>
      </AnimatePresence>
    </FooterContainer>
  );
};

export default DesktopFooter;
