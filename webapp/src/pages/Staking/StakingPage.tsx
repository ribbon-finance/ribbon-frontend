import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import StakingOverview from "../../components/Staking/StakingOverview";
import StakingPools from "../../components/Staking/StakingPools";

const StakingPage = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm="12" md="10" lg="8" xl="7" className="d-flex flex-wrap">
          <StakingOverview />
          <StakingPools />
        </Col>
      </Row>
    </Container>
  );
};
export default StakingPage;
