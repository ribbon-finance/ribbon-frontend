import React from "react";
import { StyledCard, Title } from "../../designSystem/index";
import styled from "styled-components";
import { Card, Col, Row } from "antd";
import icons from "../../img/icons";

export const CardTitle = styled.div`
  font-weight: bold;
  font-size: 30px;
  line-height: 1.1;
`;

export const CardSubtitle = styled.div`
  font-size: 16px;
  color: #a0a0a0;
`;

type DashboardCardProps = {
  value: string;
  text: string;
  icon: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ value, text, icon }) => {
  return (
    <StyledCard
      hoverable
      bordered={false}
      bodyStyle={{ paddingTop: 15, paddingBottom: 15 }}
    >
      <Row align="middle">
        <Col span={20}>
          <CardTitle>{value}</CardTitle>
          <CardSubtitle>{text}</CardSubtitle>
        </Col>
        <Col span={4}>
          <img src={icons[icon]}></img>
        </Col>
      </Row>
    </StyledCard>
  );
};

export default DashboardCard;
