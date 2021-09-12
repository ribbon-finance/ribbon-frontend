import React, { useMemo } from "react";
import Lottie from "react-lottie";

import { Assets } from "shared/lib/store/types";
import WBTCGnosisAuction from "../../../assets/icons/vaultExplainer/gnosisAuction/WBTC_Gnosis_Auction.json";
import USDCGnosisAuction from "../../../assets/icons/vaultExplainer/gnosisAuction/USDC_Gnosis_Auction.json";
import ETHGnosisAuction from "../../../assets/icons/vaultExplainer/gnosisAuction/ETH_Gnosis_Auction.json";

interface GnosisAuctionProps {
  depositAsset: Assets;
}

const GnosisAuction: React.FC<GnosisAuctionProps> = ({ depositAsset }) => {
  const animationData = useMemo(() => {
    switch (depositAsset) {
      case "WETH":
        return ETHGnosisAuction;
      case "WBTC":
        return WBTCGnosisAuction;
      case "USDC":
        return USDCGnosisAuction;
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

export default GnosisAuction;
