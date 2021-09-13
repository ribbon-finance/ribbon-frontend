import React, { useMemo } from "react";
import Lottie from "react-lottie";

import { Assets } from "shared/lib/store/types";
import WBTCAlgoStrikeSelection from "../../../assets/icons/vaultExplainer/algoStrikeSelection/WBTC_Algo_Strike_Selection.json";
import USDCAlgoStrikeSelection from "../../../assets/icons/vaultExplainer/algoStrikeSelection/USDC_Algo_Strike_Selection.json";
import ETHAlgoStrikeSelection from "../../../assets/icons/vaultExplainer/algoStrikeSelection/ETH_Algo_Strike_Selection.json";

interface AlgoStrikeSelectionProps {
  depositAsset: Assets;
}

const AlgoStrikeSelection: React.FC<AlgoStrikeSelectionProps> = ({
  depositAsset,
}) => {
  const animationData = useMemo(() => {
    switch (depositAsset) {
      case "WETH":
        return ETHAlgoStrikeSelection;
      case "WBTC":
        return WBTCAlgoStrikeSelection;
      case "USDC":
        return USDCAlgoStrikeSelection;
    }
  }, [depositAsset]);

  return (
    <div className="d-flex flex-column w-100 h-100 justify-content-center">
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: animationData,
        }}
        height="100%"
      />
    </div>
  );
};

export default AlgoStrikeSelection;
