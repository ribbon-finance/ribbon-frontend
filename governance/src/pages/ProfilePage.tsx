import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import StakingSummary from "../components/Profile/StakingSummary";

const ProfilePage = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm="11" md="9" lg="7" className="d-flex flex-wrap">
          <StakingSummary />
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
