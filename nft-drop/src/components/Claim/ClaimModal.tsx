import React, { useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";

import RBNClaimModalContent from "shared/lib/components/Common/RBNClaimModalContent";
import BasicModal from "shared/lib/components/Common/BasicModal";
import { useNFTDropGlobalState } from "../../store/store";
import { useNFTDropData } from "../../hooks/nftDataContext";
import {
  getLogoColorFromColorway,
  getThemeColorFromColorway,
} from "../../utils/colors";
import Logo from "shared/lib/assets/icons/logo";
import useRibbonOG from "../../hooks/useRibbonOG";
import { useWeb3Context } from "shared/lib/hooks/web3Context";

const ClaimModal = () => {
  const { active } = useWeb3React();
  const { provider } = useWeb3Context();
  const nftDropData = useNFTDropData();
  const contract = useRibbonOG();

  const [show, setShow] = useNFTDropGlobalState("showClaimModal");
  const [step, setStep] = useState<"claim" | "claiming" | "claimed">("claim");

  const onClaim = useCallback(async () => {
    if (!active) {
      setShow(false);
      return;
    }

    try {
      const tx = await contract.claim(nftDropData.tokenId, nftDropData.proof);
      setStep("claiming");

      await provider.waitForTransaction(tx.hash);
      setStep("claimed");
    } catch (_) {
      setShow(false);
    }
  }, [
    active,
    contract,
    provider,
    nftDropData.proof,
    nftDropData.tokenId,
    setShow,
  ]);

  // Trigger wallet approval on modal show
  useEffect(() => {
    setStep((prevStep) => {
      switch (prevStep) {
        case "claim":
          if (show) {
            onClaim();
          }
          return prevStep;
        case "claiming":
        case "claimed":
          return prevStep;
      }
    });
  }, [show, onClaim]);

  const onClose = useCallback(() => {
    setShow(false);
    if (step === "claimed") {
      setStep("claim");
    }
  }, [setShow, step]);

  const modalTitle = useMemo(() => {
    switch (step) {
      case "claiming":
        return "TRANSACTION PENDING";
      case "claimed":
        return "LOGO CLAIMED";
    }
  }, [step]);

  const modalContent = useMemo(() => {
    if (step === "claimed") {
      return (
        <Logo
          width={120}
          height={120}
          color={getLogoColorFromColorway(nftDropData.colorway)}
        />
      );
    }
  }, [nftDropData.colorway, step]);

  return (
    <BasicModal show={show} onClose={onClose} height={580}>
      <RBNClaimModalContent
        step={step}
        title={modalTitle}
        themeColor={getThemeColorFromColorway(nftDropData.colorway)}
      >
        {modalContent}
      </RBNClaimModalContent>
    </BasicModal>
  );
};

export default ClaimModal;
