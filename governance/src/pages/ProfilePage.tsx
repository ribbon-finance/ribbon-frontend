import React, { useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";

import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import ProfileActivity from "../components/Profile/ProfileActivity";
import StakingSummary from "../components/Profile/StakingSummary";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";

const ProfilePage = () => {
  const { active } = useWeb3Wallet();
  const { height, width } = useScreenSize();

  const containerHeight = useMemo(() => {
    let sectionHeight =
      height - theme.header.height - theme.footer.desktop.height;

    if (width <= sizes.lg && active) {
      sectionHeight -= theme.governance.footer.mobile.height;
    } else if (active) {
      sectionHeight -= theme.governance.actionBar.height;
    }

    return sectionHeight;
  }, [active, height, width]);

  return (
    <Container style={{ minHeight: containerHeight }}>
      <Row className="justify-content-center">
        <Col sm="11" md="9" lg="7" className="d-flex flex-wrap">
          <StakingSummary />
          <ProfileActivity />
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
