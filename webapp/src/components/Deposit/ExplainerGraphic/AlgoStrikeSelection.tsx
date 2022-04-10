import React, { useMemo } from "react";
import Lottie from "react-lottie";

import WBTCAlgoStrikeSelection from "../../../assets/icons/vaultExplainer/algoStrikeSelection/WBTC_Algo_Strike_Selection.json";
import USDCAlgoStrikeSelection from "../../../assets/icons/vaultExplainer/algoStrikeSelection/USDC_Algo_Strike_Selection.json";
import ETHAlgoStrikeSelection from "../../../assets/icons/vaultExplainer/algoStrikeSelection/ETH_Algo_Strike_Selection.json";
import STETHAlgoStrikeSelection from "../../../assets/icons/vaultExplainer/algoStrikeSelection/STETH_Algo_Strike_Selection.json";
import AAVEAlgoStrikeSelection from "../../../assets/icons/vaultExplainer/algoStrikeSelection/AAVE_Algo_Strike_Selection.json";
import AVAXAlgoStrikeSelection from "../../../assets/icons/vaultExplainer/algoStrikeSelection/AVAX_Algo_Strike_Selection.json";
import SAVAXAlgoStrikeSelection from "../../../assets/icons/vaultExplainer/algoStrikeSelection/SAVAX_Algo_Strike_Selection.json";
import SOLAlgoStrikeSelection from "../../../assets/icons/vaultExplainer/algoStrikeSelection/SOL_Algo_Strike_Selection.json";
import APEAlgoStrikeSelection from "../../../assets/icons/vaultExplainer/algoStrikeSelection/APE_Algo_Strike_Selection.json";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";

interface AlgoStrikeSelectionProps {
  vaultOption: VaultOptions;
}

const AlgoStrikeSelection: React.FC<AlgoStrikeSelectionProps> = ({
  vaultOption,
}) => {
  const animationData = useMemo(() => {
    switch (vaultOption) {
      case "rstETH-THETA":
        return STETHAlgoStrikeSelection;
      default:
        switch (getAssets(vaultOption)) {
          case "WETH":
            return ETHAlgoStrikeSelection;
          case "WBTC":
            return WBTCAlgoStrikeSelection;
          case "USDC":
          case "USDC.e":
            return USDCAlgoStrikeSelection;
          case "AAVE":
            return AAVEAlgoStrikeSelection;
          case "WAVAX":
            return AVAXAlgoStrikeSelection;
          case "sAVAX":
            return SAVAXAlgoStrikeSelection;
          case "SOL":
            return SOLAlgoStrikeSelection;
          case "APE":
            return APEAlgoStrikeSelection;
        }
    }
  }, [vaultOption]);

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
