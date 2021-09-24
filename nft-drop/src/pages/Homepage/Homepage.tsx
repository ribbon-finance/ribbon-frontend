import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

import VideoView from "../../components/Video/VideoView";
import ClaimView from "../../components/Claim/ClaimView";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import { useNFTDropGlobalState } from "../../store/store";

const ContentContainer = styled(motion.div)`
  display: flex;
  height: 100%;
`;

const Homepage = () => {
  const [views] = useNFTDropGlobalState("homepageView");
  const { height, width } = useScreenSize();

  const containerHeight = useMemo(() => {
    return (
      height -
      theme.header.height -
      (width > sizes.lg ? 80 : theme.footer.mobile.height)
    );
  }, [height, width]);

  const content = useMemo(() => {
    switch (views) {
      case "video":
        return <VideoView />;
      case "claim":
        return <ClaimView />;
    }
  }, [views]);

  return (
    <>
      <Container style={{ height: containerHeight }} fluid className="p-0">
        <AnimatePresence exitBeforeEnter>
          <ContentContainer
            key={views}
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
            {content}
          </ContentContainer>
        </AnimatePresence>
      </Container>
    </>
  );
};

export default Homepage;
