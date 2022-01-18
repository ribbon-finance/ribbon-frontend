import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";

import { isNativeToken, RibbonTreasuryAddress } from "../constants/constants";
import { ERC20Token } from "../models/eth";
import { Assets, AssetsList } from "../store/types";
import { CHAINID, isDevelopment, isProduction } from "../utils/env";
import { getERC20Token } from "./useERC20Token";
import { useETHWeb3Context } from "./web3Context";

export type TreasuryBalanceResponses = {
  [asset in Assets]: BigNumber;
};
export interface TreasuryBalanceData {
  data: TreasuryBalanceResponses;
  loading: boolean;
}
export const defaultTreasuryBalanceData: TreasuryBalanceData = {
  data: Object.fromEntries(
    AssetsList.map((asset) => [asset, BigNumber.from(0)])
  ) as TreasuryBalanceResponses,
  loading: true,
};

const TreasuryAssets: Assets[] = [
  "WETH",
  "RBN",
  "WBTC",
  "wstETH",
  "USDC",
  "AAVE",
];

const useFetchTreasuryBalanceData = () => {
  const [data, setData] = useState(defaultTreasuryBalanceData);
  const { provider } = useETHWeb3Context();
  const queryChainId = isDevelopment()
    ? CHAINID.ETH_KOVAN
    : CHAINID.ETH_MAINNET;

  const doMulticall = useCallback(async () => {
    if (!isProduction()) {
      console.time("Treasury Balance Data Fetch");
    }

    const responses = await Promise.all(
      TreasuryAssets.map(async (asset): Promise<[Assets, BigNumber]> => {
        if (isNativeToken(asset)) {
          return [
            asset,
            await provider.getBalance(RibbonTreasuryAddress[queryChainId]),
          ];
        }

        const contract = getERC20Token(
          provider,
          asset.toLowerCase() as ERC20Token,
          queryChainId,
          false
        );

        return [
          asset,
          (await contract?.balanceOf(RibbonTreasuryAddress[queryChainId])) ||
            BigNumber.from(0),
        ];
      })
    );

    setData((curr) => ({
      data: {
        ...curr.data,
        ...(Object.fromEntries(responses) as TreasuryBalanceResponses),
      },
      loading: false,
    }));

    if (!isProduction()) {
      console.timeEnd("Treasury Balance Data Fetch");
    }
  }, [queryChainId, provider]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall]);

  return data;
};

export default useFetchTreasuryBalanceData;
