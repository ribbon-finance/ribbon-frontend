import { useWeb3React } from "@web3-react/core";

import { useEffect, useMemo, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { ERC20Token } from "../models/eth";
import { impersonateAddress } from "shared/lib/utils/development";
import { useWeb3Context } from "./web3Context";
import { getERC20Token } from "./useERC20Token";
import { getAssets, VaultList, VaultNameOptionMap } from "../constants/constants";
import { getV2Vault } from "./useV2Vault";

export const useWhitelist = () => {
  const { active, account: acc, chainId, library } = useWeb3React();
  const account = impersonateAddress ? impersonateAddress : acc;
  const { provider } = useWeb3Context();

  const [whitelisted, setWhitelisted] = useState<String>();

  useEffect(() => {
    (async () => {
      await Promise.all(
        VaultList.map(async (vault) => {
          const contract = getV2Vault(library || provider, vault, active);
          if (!contract) {
            return { vault };
          }
          try {
            const isWhitelisted = await contract.whitelistMap(acc);
            if (isWhitelisted) {
              setWhitelisted(
                Object.keys(VaultNameOptionMap)[
                  Object.values(VaultNameOptionMap).indexOf(vault)]
              )
            }
          } catch {}
        })
      )
    })();
  }, [provider, account]);

  return whitelisted;
};

export default useWhitelist;
