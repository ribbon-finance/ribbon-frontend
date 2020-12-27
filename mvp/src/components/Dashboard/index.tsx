import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { Title } from "../../designSystem";
import Portfolio from "./Portfolio";
import Positions from "./Positions";

const DashboardContainer = styled.div`
  padding-bottom: 50px;
`;

const DashboardTitleContainer = styled.div`
  padding-bottom: 30px;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <DashboardTitleContainer>
        <Title>Account Overview</Title>
      </DashboardTitleContainer>
      <Row align="middle">
        <Col span={12}>
          <Portfolio></Portfolio>
        </Col>
        <Col span={12}>
          <Positions></Positions>
        </Col>
      </Row>
    </DashboardContainer>
  );
};

export default Dashboard;
