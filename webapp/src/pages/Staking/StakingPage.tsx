import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import StakingOverview from "../../components/Staking/StakingOverview";

const StakingPage = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm="11" md="9" lg="7" className="d-flex flex-wrap">
          <StakingOverview />
        </Col>
      </Row>
    </Container>
  );
};
export default StakingPage;
