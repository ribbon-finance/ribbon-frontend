import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";

import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import SnapScrollSection from "shared/lib/components/Common/SnapScrollSection";
import { useWeb3React } from "@web3-react/core";
import DesktopFooter from "../components/Footer/DesktopFooter";
import { FooterContainer } from "../components/Footer/Footer";
import OverviewKPI from "../components/Homepage/OverviewKPI";
import TVLLeaderboard from "../components/Homepage/TVLLeaderboard";
import TreasuryBreakdown from "../components/Homepage/TreasuryBreakdown";
import RBNPriceOverview from "../components/Homepage/RBNPriceOverview";

const FullscreenSection = styled(Container)<{ height: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: ${(props) => `${props.height}px` || "100vh"};
`;

const Homepage = () => {
  const { active } = useWeb3React();
  const { height, width } = useScreenSize();

  const containerHeight = useMemo(() => {
    let sectionHeight = height - theme.header.height;

    if (width <= sizes.lg && active) {
      sectionHeight -= theme.footer.mobile.height;
    } else if (active) {
      sectionHeight -= theme.governance.actionBar.height;
    }

    return sectionHeight;
  }, [active, height, width]);

  return (
    <>
      <Container fluid className="d-flex p-0">
        <SnapScrollSection
          height={containerHeight}
          items={[
            {
              child: (
                <FullscreenSection className="w-100" height={containerHeight}>
                  <OverviewKPI />
                </FullscreenSection>
              ),
            },
            {
              child: (
                <FullscreenSection className="w-100" height={containerHeight}>
                  <TVLLeaderboard />
                </FullscreenSection>
              ),
            },
            {
              child: (
                <FullscreenSection className="w-100" height={containerHeight}>
                  <TreasuryBreakdown />
                </FullscreenSection>
              ),
            },
            {
              child: (
                <FullscreenSection className="w-100" height={containerHeight}>
                  <RBNPriceOverview />
                </FullscreenSection>
              ),
            },
            {
              child: (
                <FooterContainer showDesktopFooter={true}>
                  <DesktopFooter />
                </FooterContainer>
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
