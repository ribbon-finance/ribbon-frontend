import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import React, { useState, useCallback, useEffect } from "react";
import BigNumberJS from "bignumber.js";

import BasicModal from "shared/lib/components/Common/BasicModal";
import { RibbonTokenAddress } from "shared/lib/constants/constants";
import { LBPPoolUSDC } from "../../constants/constants";
import { useLBPSor } from "../../hooks/useLBPSor";
import { useLBPGlobalState } from "../../store/store";
import {
  BigNumberJSToBigNumber,
  BigNumberToBigNumberJS,
} from "../../utils/bignumber";
import TokenSwapForm from "./TokenSwapForm";
import { getAssetDecimals } from "shared/lib/utils/asset";

const TokenSwapModal = () => {
  const [swapModal, setSwapModal] = useLBPGlobalState("swapModal");
  const [swapAmount, setSwapAmount] = useState<string>("");
  const [receiveAmount, setReceiveAmount] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [exchangeRate, setExchangeRate] = useState(0);

  const { sor, fetchCounter: sorFetchCounter } = useLBPSor();

  useEffect(() => {
    (async () => {
      const offerTokenAddress =
        swapModal.offerToken === "USDC" ? LBPPoolUSDC : RibbonTokenAddress;
      const receiveTokenAddress =
        swapModal.receiveToken === "USDC" ? LBPPoolUSDC : RibbonTokenAddress;

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
            getAssetDecimals(swapModal.offerToken)
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
                getAssetDecimals(swapModal.offerToken) -
                getAssetDecimals(swapModal.receiveToken)
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

  const handleClose = useCallback(() => {
    setSwapModal((currentSwapModal) => ({
      ...currentSwapModal,
      show: false,
    }));
  }, [setSwapModal]);

  return (
    <BasicModal
      show={swapModal.show}
      onClose={handleClose}
      height={516}
      headerBackground
    >
      <TokenSwapForm
        swapAmount={parseFloat(swapAmount)}
        receiveAmount={parseFloat(
          formatUnits(receiveAmount, getAssetDecimals(swapModal.receiveToken))
        )}
        exchangeRate={exchangeRate}
        onSwapAmountChange={(amount) => {
          const parsedInput = parseFloat(amount);
          setSwapAmount(
            isNaN(parsedInput) || parsedInput < 0 ? "" : `${parsedInput}`
          );
        }}
      />
    </BasicModal>
  );
};

export default TokenSwapModal;
