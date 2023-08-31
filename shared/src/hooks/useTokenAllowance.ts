import { useWeb3React } from "@web3-react/core";

import { useEffect, useMemo, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { ERC20Token } from "../models/eth";
import { impersonateAddress } from "../utils/development";
import { useWeb3Context } from "./web3Context";
import { getERC20Token } from "./useERC20Token";
import useWeb3Wallet from "./useWeb3Wallet";

const useTokenAllowance = (token: ERC20Token | undefined, address?: string) => {
  const { account: acc, chainId, provider } = useWeb3React();
  const { provider: defaultProvider } = useWeb3Context();
  const account = impersonateAddress ? impersonateAddress : acc;
  const tokenContract = useMemo(() => {
    if (!token || !chainId) {
      return undefined;
    }

    return getERC20Token(provider || defaultProvider, token, chainId);
  }, [chainId, defaultProvider, provider, token]);

  const [allowance, setAllowance] = useState<BigNumber>();

  useEffect(() => {
    if (!account || !tokenContract || !address || !provider) {
      setAllowance(undefined);
      return;
    }

    (async () => {
      setAllowance(await tokenContract.allowance(account, address));
    })();

    // Fetch allowance when block is mined
    provider.on("block", async () => {
      setAllowance(await tokenContract.allowance(account, address));
    });

    return () => {
      provider.removeAllListeners();
    };
  }, [provider, account, tokenContract, address]);

  return allowance;
};

export default useTokenAllowance;
