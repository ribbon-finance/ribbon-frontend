import React, { useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

import TokenSaleOverview from "./TokenSaleOverview";
import FAQ from "./FAQ";
import SegmentControl from "shared/lib/components/Common/SegmentControl";

const ContentContainer = styled(motion.div)`
  margin-top: 40px;
  margin-bottom: 64px;
`;

const HomepageViewList = ["OVERVIEW", "RBN FAQS"] as const;
type HomepageView = typeof HomepageViewList[number];

const Homepage = () => {
  const [views, setViews] = useState<HomepageView>(HomepageViewList[0]);

  const content = useMemo(() => {
    switch (views) {
      case HomepageViewList[0]:
        return <TokenSaleOverview />;
      case HomepageViewList[1]:
        return <FAQ />;
    }
  }, [views]);

  return (
    <>
      <Container>
        <div className="mt-5 d-flex justify-content-center">
          <SegmentControl
            segments={HomepageViewList.map((view) => ({
              value: view,
              display: view,
            }))}
            value={views}
            onSelect={(value) => setViews(value as HomepageView)}
          />
        </div>
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
