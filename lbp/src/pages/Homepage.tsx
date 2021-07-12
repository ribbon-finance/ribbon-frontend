import React, { useState } from "react";
import { Container } from "react-bootstrap";
import SegmentControl from "../components/Common/SegmentControl";

const HomepageViewList = ["OVERVIEW", "TRANSACTIONS", "RBN FAQS"] as const;
type HomepageView = typeof HomepageViewList[number];

const Homepage = () => {
  const [views, setViews] = useState<HomepageView>(HomepageViewList[0]);

  return (
    <>
      <Container className="mt-5 d-flex justify-content-center">
        <SegmentControl
          segments={HomepageViewList.map((view) => ({
            value: view,
            display: view,
          }))}
          value={views}
          onSelect={(value) => setViews(value as HomepageView)}
        />
      </Container>
    </>
  );
};

export default Homepage;
