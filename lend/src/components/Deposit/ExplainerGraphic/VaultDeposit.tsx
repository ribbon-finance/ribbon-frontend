import React, { useMemo } from "react";
import Lottie from "react-lottie";

import WBTCDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/WBTC_Deposit.json";
import USDCDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/USDC_Deposit.json";
import ETHDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/ETH_Deposit.json";
import STETHDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/STETH_Deposit.json";
import RETHDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/RETH_Deposit.json";
import AAVEDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/AAVE_Deposit.json";
import AVAXDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/AVAX_Deposit.json";
import SAVAXDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/SAVAX_Deposit.json";
import APEDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/APE_Deposit.json";
import SOLDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/SOL_Deposit.json";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";

interface VaultDepositProps {
  vaultOption: VaultOptions;
}

const VaultDeposit: React.FC<VaultDepositProps> = ({ vaultOption }) => {
  const animationData = useMemo(() => {
    switch (vaultOption) {
      case "rstETH-THETA":
        return STETHDepositAnimationData;
      case "rrETH-THETA":
        return RETHDepositAnimationData;
      default:
        switch (getAssets(vaultOption)) {
          case "WETH":
            return ETHDepositAnimationData;
          case "WBTC":
            return WBTCDepositAnimationData;
          case "USDC":
          case "USDC.e":
            return USDCDepositAnimationData;
          case "AAVE":
            return AAVEDepositAnimationData;
          case "WAVAX":
            return AVAXDepositAnimationData;
          case "sAVAX":
            return SAVAXDepositAnimationData;
          case "APE":
            return APEDepositAnimationData;
          case "SOL":
            return SOLDepositAnimationData;
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
        height="90%"
      />
    </div>
  );
};

export default VaultDeposit;
