import { BigNumber, ethers } from "ethers";
import { BPool } from "../codegen/BPool";
import { Instrument } from "../models";
import { WAD, wmul, wdiv } from "./math";

const MAX_SLIPPAGE = WAD.add(ethers.utils.parseEther("0.0005"));

enum ERROR_CODE {
  ERR_BAD_LIMIT_PRICE = 1,
  ERR_LIMIT_OUT,
  ERR_LIMIT_PRICE,
}

type ErrorResponse = {
  success: false;
  error: Error;
  code: ERROR_CODE;
};

type SwapResponse = {
  success: true;
  minTokenOut: BigNumber;
  maxPrice: BigNumber;
};

export const canSwapTokens = async (
  balancerPool: BPool,
  purchaseAmount: BigNumber,
  instrument: Instrument
): Promise<SwapResponse | ErrorResponse> => {
  const dTokenBalance = await balancerPool.getBalance(instrument.dTokenAddress);
  const paymentBalance = await balancerPool.getBalance(
    instrument.paymentCurrencyAddress
  );
  console.log(
    `dToken: ${ethers.utils.formatEther(
      dTokenBalance
    )}, payment: ${ethers.utils.formatEther(
      paymentBalance
    )}, purchase amount: ${ethers.utils.formatEther(purchaseAmount)}`
  );

  const spotPriceBefore = await balancerPool.calcSpotPrice(
    paymentBalance,
    WAD,
    dTokenBalance,
    WAD,
    instrument.swapFee
  );
  const maxSpotPrice = wmul(spotPriceBefore, MAX_SLIPPAGE);
  const minTokenOut = wdiv(purchaseAmount, maxSpotPrice);

  if (spotPriceBefore.gt(maxSpotPrice)) {
    console.log(
      `spotPriceBefore ${spotPriceBefore}, maxSpotPrice ${maxSpotPrice}`
    );
    return {
      success: false,
      error: new Error(
        "Pool does not have sufficient liquidity for this purchase."
      ),
      code: ERROR_CODE.ERR_BAD_LIMIT_PRICE,
    };
  }

  const tokenOut = await balancerPool.calcOutGivenIn(
    paymentBalance,
    WAD,
    dTokenBalance,
    WAD,
    purchaseAmount,
    instrument.swapFee
  );

  if (tokenOut.lt(minTokenOut)) {
    console.error(
      `tokenOut ${ethers.utils.formatEther(
        tokenOut
      )}, minTokenOut ${ethers.utils.formatEther(minTokenOut)}`
    );
    return {
      success: false,
      error: new Error(
        "Pool does not have sufficient liquidity for this purchase."
      ),
      code: ERROR_CODE.ERR_LIMIT_OUT,
    };
  }

  const newSpotPrice = await balancerPool.calcSpotPrice(
    paymentBalance.add(purchaseAmount),
    WAD,
    dTokenBalance.sub(tokenOut),
    WAD,
    instrument.swapFee
  );

  if (newSpotPrice.gt(maxSpotPrice)) {
    console.error(
      `New spot price ${ethers.utils.formatEther(
        newSpotPrice
      )} is greater than max spot price ${maxSpotPrice}`
    );
    return {
      success: false,
      error: new Error("Price impact is too huge on the pool."),
      code: ERROR_CODE.ERR_LIMIT_PRICE,
    };
  }

  return { success: true, minTokenOut, maxPrice: maxSpotPrice };
};
