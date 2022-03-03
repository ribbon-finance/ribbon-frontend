import React from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";

import useScreenSize from "shared/lib/hooks/useScreenSize";
import SnapScrollSection from "shared/lib/components/Common/SnapScrollSection";
import OverviewKPI from "../components/Homepage/OverviewKPI";
import TVLLeaderboard from "../components/Homepage/TVLLeaderboard";
import TreasuryBreakdown from "../components/Homepage/TreasuryBreakdown";
import RBNPriceOverview from "../components/Homepage/RBNPriceOverview";

const FullscreenSection = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100vh;
`;

const Homepage = () => {
  const { height } = useScreenSize();

  return (
    <>
      <Container fluid className="d-flex p-0">
        <SnapScrollSection
          height={height}
          items={[
            {
              child: (
                <FullscreenSection className="w-100">
                  <OverviewKPI />
                </FullscreenSection>
              ),
            },
            {
              child: (
                <FullscreenSection className="w-100">
                  <TVLLeaderboard />
                </FullscreenSection>
              ),
            },
            {
              child: (
                <FullscreenSection className="w-100">
                  <TreasuryBreakdown />
                </FullscreenSection>
              ),
            },
            {
              child: (
                <FullscreenSection className="w-100">
                  <RBNPriceOverview />
                </FullscreenSection>
              ),
            },
          ]}
        />
      </Container>
    </>
  );
};

export default Homepage;
