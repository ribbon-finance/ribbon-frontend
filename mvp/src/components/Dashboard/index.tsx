import React from "react";
import styled from "styled-components";
import { Row, Col, Skeleton } from "antd";
import { Title } from "../../designSystem";
import Portfolio from "./Portfolio";
import Positions from "./Positions";
import usePositions from "../../hooks/usePositions";
import { useInstrumentAddresses } from "../../hooks/useProducts";
import { sumPortfolioValue } from "../../utils/positions";

const DashboardContainer = styled.div`
  padding-bottom: 50px;
`;

const DashboardTitleContainer = styled.div`
  padding-bottom: 30px;
`;

const Dashboard = () => {
  const instrumentAddresses = useInstrumentAddresses();
  const { loading: loadingPositions, positions } = usePositions(
    instrumentAddresses
  );
  const portfolioValue = sumPortfolioValue(positions);

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
            <Portfolio portfolioValue={portfolioValue}></Portfolio>
          </Col>
          <Col span={12}>
            <Positions numPositions={positions.length}></Positions>
          </Col>
        </Row>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
