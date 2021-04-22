import { useWeb3React } from "@web3-react/core";

import { ERC20Token } from "../models/eth";
import { getERC20Token } from "./useERC20Token";
import { useWeb3Context } from "./web3Context";
import { useEffect, useMemo, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";

const useTokenAllowance = (token: ERC20Token | undefined, address: string) => {
  const { account, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const tokenContract = useMemo(() => {
    if (!token) {
      return undefined;
    }

    return getERC20Token(library, token);
  }, [library, token]);
  const [allowance, setAllowance] = useState(BigNumber.from(0));

  useEffect(() => {
    if (!account || !tokenContract) {
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
