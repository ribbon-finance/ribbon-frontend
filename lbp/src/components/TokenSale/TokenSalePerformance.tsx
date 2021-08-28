import React, { useMemo } from "react";
import styled from "styled-components";
import { Col, Row } from "react-bootstrap";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { SecondaryText, Title } from "shared/lib/designSystem";
import useRBNToken from "shared/lib/hooks/useRBNToken";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import useLBPPoolData from "../../hooks/useLBPPoolData";
import { assetToUSD, formatBigNumber } from "shared/lib/utils/math";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { useLBPGlobalState } from "../../store/store";
import { getERC20TokenDecimals } from "shared/lib/models/eth";
import { RBNPurchaseToken } from "../../constants/constants";

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
  const { data: tokenData, loading: tokenLoading } = useRBNToken();
  const { data: poolData, loading: poolLoading } = useLBPPoolData();
  const loadingText = useTextAnimation(tokenLoading || poolLoading);
  const [, setSwapModal] = useLBPGlobalState("swapModal");

  const [spotPriceText, rbnSoldText, usdcRaisedText] = useMemo(() => {
    if (poolLoading) {
      return [loadingText, loadingText, loadingText];
    }

    if (!poolData) {
      return ["---", 0, 0];
    }

    return [
      assetToUSD(
        poolData.spotPrice,
        1,
        getERC20TokenDecimals(RBNPurchaseToken[0])
      ),
      formatBigNumber(poolData.ribbonSold, 4, 18),
      formatBigNumber(
        poolData.usdcRaised,
        2,
        getERC20TokenDecimals(RBNPurchaseToken[0])
      ),
    ];
  }, [loadingText, poolData, poolLoading]);

  return (
    <>
      <SaleChartContainer>
        <Row>
          {/* Chart */}
          <Col md={8} className="d-flex flex-column">
            <div className="mt-4 ml-4">
              <RibbonSaleLabel>RBN PRICE</RibbonSaleLabel>
            </div>
            <div className="d-flex ml-4 mt-1 align-items-center">
              <PriceText>{spotPriceText}</PriceText>
              <div className="d-flex ml-auto">
                <ActionButton
                  color={colors.products.yield}
                  className="px-5 py-3"
                  onClick={() =>
                    setSwapModal({
                      show: true,
                      offerToken: "usdc",
                      receiveToken: "rbn",
                    })
                  }
                >
                  BUY
                </ActionButton>
                <ActionButton
                  className="ml-3 px-5 py-3"
                  variant="secondary"
                  onClick={() =>
                    setSwapModal({
                      show: true,
                      offerToken: "rbn",
                      receiveToken: "usdc",
                    })
                  }
                >
                  SELL
                </ActionButton>
              </div>
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
              <StatisticData>{rbnSoldText}</StatisticData>
            </StatisticContainer>
            <StatisticContainer>
              <StatisticLabel>USDC Raised</StatisticLabel>
              <StatisticData>{usdcRaisedText}</StatisticData>
            </StatisticContainer>
            <StatisticContainer>
              <StatisticLabel>No. of RBN Tokenholders</StatisticLabel>
              <StatisticData>
                {tokenLoading ? loadingText : tokenData?.numHolders}
              </StatisticData>
            </StatisticContainer>
            <StatisticContainer>
              <StatisticLabel>Token Sale Ends In</StatisticLabel>
              <StatisticData>2D 23H 12M</StatisticData>
            </StatisticContainer>
          </Col>
        </Row>
      </SaleChartContainer>
    </>
  );
};

export default TokenSalePerformance;
