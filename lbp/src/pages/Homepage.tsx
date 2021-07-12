import React, { useMemo, useState } from "react";
import { Container } from "react-bootstrap";
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
      {content}
    </Container>
  );
};

export default Homepage;
