import React, { useMemo } from "react";
import Lottie from "react-lottie";

import WBTCDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/WBTC_Deposit.json";
import USDCDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/USDC_Deposit.json";
import ETHDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/ETH_Deposit.json";
import STETHDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/STETH_Deposit.json";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";

interface VaultDepositProps {
  vaultOption: VaultOptions;
}

const VaultDeposit: React.FC<VaultDepositProps> = ({ vaultOption }) => {
  const animationData = useMemo(() => {
    switch (vaultOption) {
      case "rstETH-THETA":
        return STETHDepositAnimationData;
      default:
        switch (getAssets(vaultOption)) {
          case "WETH":
            return ETHDepositAnimationData;
          case "WBTC":
            return WBTCDepositAnimationData;
          case "USDC":
            return USDCDepositAnimationData;
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
