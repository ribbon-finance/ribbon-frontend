import React from "react";
import { SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import useLoadingText from "../../hooks/useLoadingText";
import { Assets } from "../../store/types";
import { getAssetDisplay } from "../../utils/asset";
import { formatAmount } from "../../utils/math";
import ProgressBar, { BarConfig } from "./ProgressBar";

const loadingText = useLoadingText();

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
  barConfig?: BarConfig;
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
        <SecondaryText color={colors.text} fontSize={labelConfig.fontSize}>
          {copies.current}
        </SecondaryText>
        <Title fontSize={statsConfig.fontSize} lineHeight={20}>
          {loading
            ? loadingText
            : `${
                displayCurrent
                  ? displayCurrent
                  : `${formatAmount(current)} ${
                      asset ? getAssetDisplay(asset) : ""
                    }`
              }`}
        </Title>
      </div>
      <ProgressBar percent={percent} config={barConfig} />
      <div className="d-flex flex-row justify-content-between">
        <SecondaryText color={colors.text} fontSize={labelConfig.fontSize}>
          {copies.cap}
        </SecondaryText>
        <Title fontSize={statsConfig.fontSize} lineHeight={20}>
          {loading
            ? loadingText
            : `${
                displayCap
                  ? displayCap
                  : `${formatAmount(cap)} ${
                      asset ? getAssetDisplay(asset) : ""
                    }`
              }`}
        </Title>
      </div>
    </div>
  );
};
export default CapBar;
