import React from "react";
import styled from "styled-components";
import { Row, Col, Statistic, Divider } from "antd";
import { BaseText, StyledCard } from "../../designSystem";
import {
  computeStraddleValue,
  computeBreakeven,
  computeBreakevenPercent,
} from "../../utils/straddle";
import { useETHPriceInUSD } from "../../hooks/useEthPrice";
import { BasicStraddle } from "../../models";
import { timeToExpiry } from "../../utils/time";
import { useStraddleTrade } from "../../hooks/useStraddleTrade";
import { ethers } from "ethers";
import PayoffCalculator from "./PayoffCalculator";

const DescriptionTitle = styled.p`
  font-family: Montserrat;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: 1.5px;
  text-align: left;
  text-transform: uppercase;
  color: #999999;
`;

const DescriptionData = styled.p`
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
`;

const DescriptionContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Title = styled(BaseText)`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  color: #000000;
`;

const CustomStyledCard = styled(StyledCard)`
  background: #fafafa;
  border-radius: 4px;
  border: 0px;
`;

const StyledStatistic = (title: string, value: string) => {
  return (
    <Statistic
      valueStyle={{ fontSize: 15, fontWeight: "bold", paddingBottom: "15px" }}
      title={title}
      value={value}
    />
  );
};

type Props = {
  straddle: BasicStraddle;
  amount: number;
};

const ProductInfo: React.FC<Props> = ({ straddle, amount }) => {
  const ethPrice = useETHPriceInUSD();
  const {
    loading: loadingTrade,
    error: loadTradeError,
    totalPremium,
    callStrikePrice,
    putStrikePrice,
  } = useStraddleTrade(
    straddle.address,
    ethPrice,
    ethers.utils.parseEther(amount.toString())
  );

  const [straddleUSD, straddleETH] = computeStraddleValue(
    totalPremium,
    ethPrice
  );
  const [lowerBreakeven, upperBreakeven] = computeBreakeven(
    straddleUSD,
    callStrikePrice,
    putStrikePrice
  );

  const breakevenPercent =
    !totalPremium.isZero() &&
    computeBreakevenPercent(
      straddleUSD,
      callStrikePrice,
      putStrikePrice,
      ethPrice
    );

  const timestamp = new Date(
    straddle.expiryTimestamp * 1000
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalCostUSD = (parseFloat(straddleUSD) * amount).toFixed(2);
  const totalCostETH = ethers.utils.formatEther(
    ethers.utils.parseEther((parseFloat(straddleETH) * amount).toFixed(8))
  );

  let costStr;
  if (loadingTrade) {
    costStr = "Computing cost...";
  } else if (loadTradeError) {
    costStr = "Error loading cost. Try again.";
  } else {
    costStr = `$${totalCostUSD} (${totalCostETH} ETH)`;
  }

  return (
    <>
      <DescriptionContainer>
        <DescriptionTitle>Expiry</DescriptionTitle>
        <DescriptionData>{timestamp}</DescriptionData>
      </DescriptionContainer>

      <DescriptionContainer>
        <DescriptionTitle>Total Cost</DescriptionTitle>
        <DescriptionData>{costStr}</DescriptionData>
      </DescriptionContainer>

      <CustomStyledCard>
        <Title>Profitability Calculator</Title>
        <Divider />

        <DescriptionTitle>Current ETH Price</DescriptionTitle>
        <DescriptionData>${ethPrice}</DescriptionData>

        <PayoffCalculator
          ethPrice={ethPrice}
          callStrikePrice={callStrikePrice}
          putStrikePrice={putStrikePrice}
          straddlePrice={straddleUSD}
          amount={amount}
        ></PayoffCalculator>

        {/* <Row>
          <Col span={12}>
            {StyledStatistic(
              "Breakeven Price",
              breakevenPercent
                ? `≤ $${lowerBreakeven.toFixed(
                    2
                  )} or ≥ $${upperBreakeven.toFixed(2)}`
                : "-"
            )}
          </Col>
          <Col span={12}>
            {StyledStatistic(
              "To Breakeven",
              breakevenPercent ? `(±${breakevenPercent}%)` : "-"
            )}
          </Col>
        </Row> */}
      </CustomStyledCard>
    </>
  );
};

export default ProductInfo;
