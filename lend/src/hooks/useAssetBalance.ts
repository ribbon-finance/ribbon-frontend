import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { Assets } from "../store/types";
import useERC20Contracts from "./useERC20Contracts";
import useWeb3Wallet from "./useWeb3Wallet";

export type BalanceMap = {
  [asset in Assets]: BigNumber;
};

export const useAssetBalances = () => {
  const [balances, setBalances] = useState<BalanceMap>({
    RBN: BigNumber.from(0),
    WETH: BigNumber.from(0),
    USDC: BigNumber.from(0),
  });
  const { account, ethereumProvider } = useWeb3Wallet();
  const { ribbonToken, usdcToken } = useERC20Contracts();
  const [rbnBalance, setRbnBalance] = useState<BigNumber>(BigNumber.from(0));
  const [ethBalance, setEthBalance] = useState<BigNumber>(BigNumber.from(0));
  const [usdcBalance, setUsdcBalance] = useState<BigNumber>(BigNumber.from(0));
  useEffect(() => {
    if (ribbonToken && usdcToken && account && ethereumProvider) {
      ribbonToken.balanceOf(account).then((balance: BigNumber) => {
        setRbnBalance(balance);
      });
      usdcToken.balanceOf(account).then((balance: BigNumber) => {
        setUsdcBalance(balance);
      });
      ethereumProvider.getBalance(account).then((balance: BigNumber) => {
        setEthBalance(balance);
      });
    }
    setBalances({
      RBN: rbnBalance,
      WETH: ethBalance,
      USDC: usdcBalance,
    });
  }, [
    account,
    ethBalance,
    ethereumProvider,
    rbnBalance,
    ribbonToken,
    usdcBalance,
    usdcToken,
  ]);

  return balances;
};
