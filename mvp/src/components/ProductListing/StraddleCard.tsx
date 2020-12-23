import React from "react";
import { StyledCard, Title } from "../../designSystem/index";
import styled from "styled-components";
import { Card, Col, Row } from "antd";
import { Straddle } from "../../models";
import { useEthPrice } from "../../hooks/marketPrice";

export const CardTitle = styled.div`
  font-weight: bold;
  font-size: 30px;
  line-height: 1.1;
`;

export const CardSubtitle = styled.div`
  font-size: 16px;
  color: #a0a0a0;
`;

const StraddleCard: React.FC<{ straddle: Straddle }> = ({ straddle }) => {
  return (
    <StyledCard
      hoverable
      bordered={false}
      bodyStyle={{ paddingTop: 15, paddingBottom: 15 }}
    >
      <Row align="middle">{useEthPrice()}</Row>
    </StyledCard>
  );
};

export default StraddleCard;
