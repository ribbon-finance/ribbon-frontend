import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import React, { useState, useCallback, useEffect } from "react";
import BigNumberJS from "bignumber.js";

import BasicModal from "shared/lib/components/Common/BasicModal";
import { getERC20TokenAddress } from "shared/lib/constants/constants";
import { useLBPSor } from "../../hooks/useLBPSor";
import { useLBPGlobalState } from "../../store/store";
import {
  BigNumberJSToBigNumber,
  BigNumberToBigNumberJS,
} from "../../utils/bignumber";
import TokenSwapForm from "./TokenSwapForm";
import { getERC20TokenDecimals } from "shared/lib/models/eth";
import { useMemo } from "react";
import { SwapStep, SwapStepList } from "./types";
import TokenSwapPreview from "./TokenSwapPreview";

const TokenSwapModal = () => {
  const [swapModal, setSwapModal] = useLBPGlobalState("swapModal");
  const [swapAmount, setSwapAmount] = useState<string>("");
  const [receiveAmount, setReceiveAmount] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [exchangeRate, setExchangeRate] = useState(0);
  const [step, setStep] = useState<SwapStep>(SwapStepList[0]);

  const { sor, fetchCounter: sorFetchCounter } = useLBPSor();

  useEffect(() => {
    (async () => {
      const offerTokenAddress = getERC20TokenAddress(swapModal.offerToken);
      const receiveTokenAddress = getERC20TokenAddress(swapModal.receiveToken);

      if (!sor.hasDataForPair(offerTokenAddress, receiveTokenAddress)) {
        return;
      }

      const [, tradeAmount, spotPrice] = await sor.getSwaps(
        offerTokenAddress,
        receiveTokenAddress,
        "swapExactIn",
        BigNumberToBigNumberJS(
          parseUnits(
            swapAmount ? swapAmount.toString() : "0",
            getERC20TokenDecimals(swapModal.offerToken)
          )
        )
      );

      setReceiveAmount(BigNumberJSToBigNumber(tradeAmount));
      setExchangeRate(
        parseFloat(
          new BigNumberJS("1e18")
            .div(spotPrice)
            .times(
              `1e${
                getERC20TokenDecimals(swapModal.offerToken) -
                getERC20TokenDecimals(swapModal.receiveToken)
              }`
            )
            .toString()
        )
      );
    })();
  }, [
    swapAmount,
    swapModal.offerToken,
    swapModal.receiveToken,
    sor,
    sorFetchCounter,
  ]);

  /**
   * Reset modal when closed
   */
  useEffect(() => {
    if (!swapModal.show) {
      setSwapAmount("");
      setStep(SwapStepList[0]);
    }
  }, [swapModal.show]);

  const handleSwapAmountChange = useCallback((amount) => {
    const parsedInput = parseFloat(amount);
    setSwapAmount(
      isNaN(parsedInput) || parsedInput < 0 ? "" : `${parsedInput}`
    );
  }, []);

  const handleClose = useCallback(() => {
    setSwapModal((currentSwapModal) => ({
      ...currentSwapModal,
      show: false,
    }));
  }, [setSwapModal]);

  const body = useMemo(() => {
    switch (step) {
      case SwapStepList[0]:
        return (
          <TokenSwapForm
            swapAmount={parseFloat(swapAmount)}
            receiveAmount={parseFloat(
              formatUnits(
                receiveAmount,
                getERC20TokenDecimals(swapModal.receiveToken)
              )
            )}
            exchangeRate={exchangeRate}
            onSwapAmountChange={handleSwapAmountChange}
            onPreview={() => {
              if (!receiveAmount) {
                return;
              }

              setStep("preview");
            }}
          />
        );
      case SwapStepList[1]:
        return (
          <TokenSwapPreview
            swapAmount={parseUnits(
              swapAmount,
              getERC20TokenDecimals(swapModal.offerToken)
            )}
            receiveAmount={receiveAmount}
          />
        );
    }
  }, [
    exchangeRate,
    handleSwapAmountChange,
    receiveAmount,
    step,
    swapAmount,
    swapModal.offerToken,
    swapModal.receiveToken,
  ]);

  return (
    <BasicModal
      show={swapModal.show}
      onClose={handleClose}
      height={516}
      headerBackground
      backButton={
        step === "preview"
          ? {
              onClick: () => {
                setStep("form");
              },
            }
          : undefined
      }
    >
      {body}
    </BasicModal>
  );
};

export default TokenSwapModal;
