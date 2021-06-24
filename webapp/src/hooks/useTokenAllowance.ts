import { useWeb3React } from "@web3-react/core";

import { ERC20Token } from "shared/lib/models/eth";
import { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { useEffect, useMemo, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { impersonateAddress } from "shared/lib/utils/development";

const useTokenAllowance = (token: ERC20Token | undefined, address: string) => {
  const web3Context = useWeb3React();
  const library = web3Context.library;
  const account = impersonateAddress ? impersonateAddress : web3Context.account;
  const { provider } = useWeb3Context();
  const tokenContract = useMemo(() => {
    if (!token) {
      return undefined;
    }

    return getERC20Token(library, token);
  }, [library, token]);
  const [allowance, setAllowance] = useState<BigNumber>();

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
