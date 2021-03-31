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

const DepositLabel = styled(SecondaryText)<{
  config: {
    fontSize: number;
  };
}>`
  font-size: ${(props) => props.config.fontSize}px;
`;

const DepositStat = styled(Title)<{
  config: {
    fontSize: number;
  };
}>`
  font-size: ${(props) => props.config.fontSize}px;
  line-height: 20px;
`;

const DepositCapBar: React.FC<{
  loading: boolean;
  totalDeposit: number;
  limit: number;
  copies?: {
    totalDeposit: string;
    limit: string;
  };
  labelConfig?: {
    fontSize: number;
  };
  statsConfig?: {
    fontSize: number;
  };
}> = ({
  loading,
  totalDeposit,
  limit,
  copies = { totalDeposit: "Total Deposits", limit: "Limit" },
  labelConfig = { fontSize: 16 },
  statsConfig = { fontSize: 16 },
}) => {
  let percent = totalDeposit / (limit > 0 ? limit : 1);
  if (percent < 0) {
    percent = 0;
  } else if (percent > 1) {
    percent = 1;
  }
  percent *= 100;

  return (
    <div className="w-100">
      <div className="d-flex flex-row justify-content-between">
        <DepositLabel config={labelConfig}>{copies.totalDeposit}</DepositLabel>
        <DepositStat config={statsConfig}>
          {loading ? "Loading..." : `${totalDeposit} ETH`}
        </DepositStat>
      </div>

      <div className="d-flex flex-row position-relative my-3">
        <BackgroundBar></BackgroundBar>
        <ForegroundBar style={{ width: `${percent}%` }}></ForegroundBar>
      </div>

      <div className="d-flex flex-row justify-content-between">
        <DepositLabel config={labelConfig}>{copies.limit}</DepositLabel>
        <DepositStat config={statsConfig}>
          {loading ? "Loading..." : `${limit} ETH`}
        </DepositStat>
      </div>
    </div>
  );
};
export default DepositCapBar;
