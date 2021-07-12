import React, { useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";

import SegmentControl from "../components/Common/SegmentControl";
import TokenSaleInfo from "../components/TokenSale/TokenSaleInfo";

const HomepageViewList = ["OVERVIEW", "TRANSACTIONS", "RBN FAQS"] as const;
type HomepageView = typeof HomepageViewList[number];

const Homepage = () => {
  const [views, setViews] = useState<HomepageView>(HomepageViewList[0]);

  const content = useMemo(() => {
    switch (views) {
      case HomepageViewList[0]:
        return (
          <>
            <TokenSaleInfo />
          </>
        );
      default:
        return <></>;
    }
  }, [views]);

  return (
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
        <motion.div
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
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};

export default Homepage;
