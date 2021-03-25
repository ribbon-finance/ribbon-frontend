import React from "react";
import styled from "styled-components";
import { SecondaryText, Title } from "../../designSystem";

const BackgroundBar = styled.div`
  height: 16px;
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
`;

const ForegroundBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 16px;
  background: #ffffff;
  border-radius: 4px;
  width: 100%;
`;

const DepositStat = styled(Title)`
  font-size: 14px;
  line-height: 20px;
`;

const DepositCapBar: React.FC<{ totalDeposit: number; limit: number }> = ({
  totalDeposit,
  limit,
}) => {
  let percent = totalDeposit / limit;
  if (percent < 0) {
    percent = 0;
  } else if (percent > 1) {
    percent = 1;
  }
  percent *= 100;

  return (
    <div className="w-100">
      <div className="d-flex flex-row justify-content-between">
        <SecondaryText>Total Deposits</SecondaryText>
        <DepositStat>{totalDeposit} ETH</DepositStat>
      </div>

      <div className="d-flex flex-row position-relative my-3">
        <BackgroundBar></BackgroundBar>
        <ForegroundBar style={{ width: `${percent}%` }}></ForegroundBar>
      </div>

      <div className="d-flex flex-row justify-content-between">
        <SecondaryText>Limit</SecondaryText>
        <DepositStat>{limit} ETH</DepositStat>
      </div>
    </div>
  );
};
export default DepositCapBar;
