import React, { useMemo } from "react";
import Lottie from "react-lottie";

import { Assets } from "shared/lib/store/types";
import WBTCDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/WBTC_Deposit.json";
import USDCDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/USDC_Deposit.json";
import ETHDepositAnimationData from "../../../assets/icons/vaultExplainer/deposit/ETH_Deposit.json";

interface VaultDepositProps {
  depositAsset: Assets;
}

const VaultDeposit: React.FC<VaultDepositProps> = ({ depositAsset }) => {
  const animationData = useMemo(() => {
    switch (depositAsset) {
      case "WETH":
        return ETHDepositAnimationData;
      case "WBTC":
        return WBTCDepositAnimationData;
      case "USDC":
        return USDCDepositAnimationData;
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
        height="90%"
      />
    </div>
  );
};

export default VaultDeposit;
