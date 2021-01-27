import React from "react";
import { Row, Col, Statistic } from "antd";
import { StyledCard } from "../../designSystem";
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

  const expiryTimestamp = new Date(
    straddle.expiryTimestamp * 1000
  ).toLocaleDateString();

  const expiry = `${expiryTimestamp} (${timeToExpiry(
    straddle.expiryTimestamp
  )} remaining)`;

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
    <StyledCard style={{ height: "100%" }}>
      <Row>{StyledStatistic("Expiry", expiry)}</Row>
      <Row>{StyledStatistic("Total Cost", costStr)}</Row>
      <Row>
        <Col span={12}>
          {StyledStatistic(
            "Breakeven Price",
            breakevenPercent
              ? `≤ $${lowerBreakeven.toFixed(2)} or ≥ $${upperBreakeven.toFixed(
                  2
                )}`
              : "-"
          )}
        </Col>
        <Col span={12}>
          {StyledStatistic(
            "To Breakeven",
            breakevenPercent ? `(±${breakevenPercent}%)` : "-"
          )}
        </Col>
      </Row>
    </StyledCard>
  );
};

export default ProductInfo;
