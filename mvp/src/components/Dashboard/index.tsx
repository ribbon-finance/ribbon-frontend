import React from "react";
import styled from "styled-components";
import { Row, Col, Skeleton } from "antd";
import { Title } from "../../designSystem";
import Positions from "./Positions";
import usePositions from "../../hooks/usePositions";

const DashboardContainer = styled.div`
  padding-bottom: 50px;
`;

const DashboardTitleContainer = styled.div`
  padding-bottom: 30px;
`;

const Dashboard = () => {
  const { loading: loadingPositions, numOfActivePositions } = usePositions();

  return (
    <DashboardContainer>
      <DashboardTitleContainer>
        <Title>Account Overview</Title>
      </DashboardTitleContainer>
      {loadingPositions ? (
        <Skeleton></Skeleton>
      ) : (
        <Row align="middle">
          <Col span={12}>
            <Positions numPositions={numOfActivePositions}></Positions>
          </Col>
        </Row>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
