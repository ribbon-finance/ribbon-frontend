import React, { useMemo } from "react";
import Lottie from "react-lottie";

import WBTCParadigmAuction from "../../../assets/icons/vaultExplainer/paradigmAuction/WBTC_Paradigm_Auction.json";
import USDCParadigmAuction from "../../../assets/icons/vaultExplainer/paradigmAuction/USDC_Paradigm_Auction.json";
import ETHParadigmAuction from "../../../assets/icons/vaultExplainer/paradigmAuction/ETH_Paradigm_Auction.json";
import STETHParadigmAuction from "../../../assets/icons/vaultExplainer/paradigmAuction/STETH_Paradigm_Auction.json";
import RETHParadigmAuction from "../../../assets/icons/vaultExplainer/paradigmAuction/RETH_Paradigm_Auction.json";
import AAVEParadigmAuction from "../../../assets/icons/vaultExplainer/paradigmAuction/AAVE_Paradigm_Auction.json";
import UNIParadigmAuction from "../../../assets/icons/vaultExplainer/paradigmAuction/UNI_Paradigm_Auction.json";
import AVAXParadigmAuction from "../../../assets/icons/vaultExplainer/paradigmAuction/AVAX_Paradigm_Auction.json";
import SAVAXParadigmAuction from "../../../assets/icons/vaultExplainer/paradigmAuction/SAVAX_Paradigm_Auction.json";
import APEParadigmAuction from "../../../assets/icons/vaultExplainer/paradigmAuction/APE_Paradigm_Auction.json";
import SOLFLEXAuction from "../../../assets/icons/vaultExplainer/paradigmAuction/SOL_FLEX_Auction.json";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";

interface ParadigmAuctionProps {
  vaultOption: VaultOptions;
}

const ParadigmAuction: React.FC<ParadigmAuctionProps> = ({ vaultOption }) => {
  const animationData = useMemo(() => {
    switch (vaultOption) {
      case "rstETH-THETA":
        return STETHParadigmAuction;
      case "rrETH-THETA":
        return RETHParadigmAuction;
      default:
        switch (getAssets(vaultOption)) {
          case "WETH":
            return ETHParadigmAuction;
          case "WBTC":
            return WBTCParadigmAuction;
          case "USDC":
          case "USDC.e":
            return USDCParadigmAuction;
          case "AAVE":
            return AAVEParadigmAuction;
          case "UNI":
            return UNIParadigmAuction;
          case "WAVAX":
            return AVAXParadigmAuction;
          case "sAVAX":
            return SAVAXParadigmAuction;
          case "APE":
            return APEParadigmAuction;
          case "SOL":
            return SOLFLEXAuction;
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

export default ParadigmAuction;
