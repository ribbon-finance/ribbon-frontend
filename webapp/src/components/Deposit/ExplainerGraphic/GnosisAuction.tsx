import React, { useMemo } from "react";
import Lottie from "react-lottie";

import WBTCGnosisAuction from "../../../assets/icons/vaultExplainer/gnosisAuction/WBTC_Gnosis_Auction.json";
import USDCGnosisAuction from "../../../assets/icons/vaultExplainer/gnosisAuction/USDC_Gnosis_Auction.json";
import ETHGnosisAuction from "../../../assets/icons/vaultExplainer/gnosisAuction/ETH_Gnosis_Auction.json";
import STETHGnosisAuction from "../../../assets/icons/vaultExplainer/gnosisAuction/STETH_Gnosis_Auction.json";
import AAVEGnosisAuction from "../../../assets/icons/vaultExplainer/gnosisAuction/AAVE_Gnosis_Auction.json";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";

interface GnosisAuctionProps {
  vaultOption: VaultOptions;
}

const GnosisAuction: React.FC<GnosisAuctionProps> = ({ vaultOption }) => {
  const animationData = useMemo(() => {
    switch (vaultOption) {
      case "rstETH-THETA":
        return STETHGnosisAuction;
      default:
        switch (getAssets(vaultOption)) {
          case "WETH":
            return ETHGnosisAuction;
          case "WBTC":
            return WBTCGnosisAuction;
          case "USDC":
            return USDCGnosisAuction;
          case "AAVE":
            return AAVEGnosisAuction;
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

export default GnosisAuction;
