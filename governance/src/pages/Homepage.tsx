import React from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";

import useScreenSize from "shared/lib/hooks/useScreenSize";
import SnapScrollSection from "shared/lib/components/Common/SnapScrollSection";
import DesktopFooter from "../components/Footer/DesktopFooter";
import { FooterContainer } from "../components/Footer/Footer";
import OverviewKPI from "../components/Homepage/OverviewKPI";
import TVLLeaderboard from "../components/Homepage/TVLLeaderboard";
import TreasuryBreakdown from "../components/Homepage/TreasuryBreakdown";
import RBNPriceOverview from "../components/Homepage/RBNPriceOverview";
import theme from "shared/lib/designSystem/theme";

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
            {
              child: (
                <div className="d-flex flex-wrap w-100">
                  <FooterContainer showDesktopFooter={true}>
                    <DesktopFooter />
                  </FooterContainer>
                  <div
                    style={{ height: theme.governance.actionBar.height }}
                    className="w-100"
                  />
                </div>
              ),
              anchor: false,
            },
          ]}
        />
      </Container>
    </>
  );
};

export default Homepage;
