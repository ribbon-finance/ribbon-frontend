import React from "react";
import styled from "styled-components";
import { SecondaryText, Title } from "../../designSystem";
import { Assets } from "../../store/types";
import { getAssetDisplay } from "../../utils/asset";
import { formatAmount } from "../../utils/math";

const BackgroundBar = styled.div<{ height: number; radius: number }>`
  height: ${(props) => props.height}px;
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border-radius: ${(props) => props.radius}px;
`;

const ForegroundBar = styled.div<{ height: number; radius: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: ${(props) => props.height}px;
  background: #ffffff;
  border-radius: ${(props) => props.radius}px;
  width: 100%;
`;

const DepositLabel = styled(SecondaryText)<{
  config: {
    fontSize: number;
  };
}>`
  font-size: ${(props) => props.config.fontSize}px;
  color: rgba(255, 255, 255, 0.64);
`;

const DepositStat = styled(Title)<{
  config: {
    fontSize: number;
  };
}>`
  font-size: ${(props) => props.config.fontSize}px;
  line-height: 20px;
`;

const CapBar: React.FC<{
  loading: boolean;
  current: number;
  cap: number;
  copies?: {
    current: string;
    cap: string;
  };
  displayData?: {
    current?: string;
    cap?: string;
  };
  labelConfig?: {
    fontSize: number;
  };
  statsConfig?: {
    fontSize: number;
  };
  barConfig?: {
    height: number;
    extraClassNames: string;
    radius: number;
  };
  asset?: Assets;
}> = ({
  loading,
  current,
  cap,
  copies = { current: "Total Deposits", cap: "Limit" },
  displayData: { current: displayCurrent, cap: displayCap } = {},
  labelConfig = { fontSize: 16 },
  statsConfig = { fontSize: 16 },
  barConfig = { height: 16, extraClassNames: "my-3", radius: 4 },
  asset,
}) => {
  let percent = cap > 0 ? current / cap : 0;
  if (percent < 0) {
    percent = 0;
  } else if (percent > 1) {
    percent = 1;
  }
  percent *= 100;
  current = current > cap ? cap : current;

  return (
    <div className="w-100">
      <div className="d-flex flex-row justify-content-between">
        <DepositLabel config={labelConfig}>{copies.current}</DepositLabel>
        <DepositStat config={statsConfig}>
          {loading
            ? "Loading..."
            : `${
                displayCurrent
                  ? displayCurrent
                  : `${formatAmount(current)} ${
                      asset ? getAssetDisplay(asset) : ""
                    }`
              }`}
        </DepositStat>
      </div>

      <div
        className={`d-flex flex-row position-relative ${barConfig.extraClassNames}`}
      >
        <BackgroundBar height={barConfig.height} radius={barConfig.radius} />
        <ForegroundBar
          height={barConfig.height}
          style={{ width: `${percent}%` }}
          radius={barConfig.radius}
        />
      </div>

      <div className="d-flex flex-row justify-content-between">
        <DepositLabel config={labelConfig}>{copies.cap}</DepositLabel>
        <DepositStat config={statsConfig}>
          {loading
            ? "Loading..."
            : `${
                displayCap
                  ? displayCap
                  : `${formatAmount(cap)} ${
                      asset ? getAssetDisplay(asset) : ""
                    }`
              }`}
        </DepositStat>
      </div>
    </div>
  );
};
export default CapBar;
