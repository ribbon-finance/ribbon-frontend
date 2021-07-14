import React from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { Col, Row } from "react-bootstrap";
import { SecondaryText, Title } from "shared/lib/designSystem";

const SaleChartContainer = styled.div`
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radiusSmall};
  background: ${colors.primaryText}03;
`;

const RibbonSaleLabel = styled(Title)`
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 1px;
  color: ${colors.products.yield};
`;

const PriceText = styled(Title)`
  font-size: 40px;
  line-height: 48px;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;

  &:not(:first-child) {
    margin-left: 24px;
  }
`;

const LegendIndicator = styled.div<{ color: string }>`
  height: 8px;
  width: 8px;
  background: ${(props) => props.color};
  border-radius: 4px;
  margin-right: 8px;
`;

const StatisticContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
  border-left: ${theme.border.width} ${theme.border.style} ${colors.border};

  &:not(:first-child) {
    border-top: ${theme.border.width} ${theme.border.style} ${colors.border};
  }
`;

const StatisticLabel = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
`;

const StatisticData = styled(Title)`
  letter-spacing: 1px;
  margin-top: 4px;
`;

const TokenSalePerformance = () => {
  return (
    <SaleChartContainer>
      <Row>
        {/* Chart */}
        <Col md={8} className="d-flex flex-column">
          <div className="mt-4 ml-4">
            <RibbonSaleLabel>RBN PRICE</RibbonSaleLabel>
          </div>
          <div className="d-flex ml-4 mt-1">
            <PriceText>$0.2945</PriceText>
          </div>
          <div className="flex-grow-1"></div>
          <div className="ml-4 mt-3 mb-3 d-flex">
            <Legend>
              <LegendIndicator color={colors.green} />
              <SecondaryText>RBN price</SecondaryText>
            </Legend>
            <Legend>
              <LegendIndicator color={colors.products.capitalAccumulation} />
              <SecondaryText>
                Projected RBN price with no new buyers
              </SecondaryText>
            </Legend>
          </div>
        </Col>

        {/* Statistic */}
        <Col md={4}>
          <StatisticContainer>
            <StatisticLabel>RBN Sold</StatisticLabel>
            <StatisticData>30,000,000</StatisticData>
          </StatisticContainer>
          <StatisticContainer>
            <StatisticLabel>USDC Raised</StatisticLabel>
            <StatisticData>15,000,000</StatisticData>
          </StatisticContainer>
          <StatisticContainer>
            <StatisticLabel>No. of RBN Tokenholders</StatisticLabel>
            <StatisticData>2,202</StatisticData>
          </StatisticContainer>
          <StatisticContainer>
            <StatisticLabel>Token Sale Ends In</StatisticLabel>
            <StatisticData>2D 23H 12M</StatisticData>
          </StatisticContainer>
        </Col>
      </Row>
    </SaleChartContainer>
  );
};

export default TokenSalePerformance;
