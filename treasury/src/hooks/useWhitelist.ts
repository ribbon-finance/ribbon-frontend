import { useWeb3React } from "@web3-react/core";

import { useEffect, useState } from "react";
import { impersonateAddress } from "shared/lib/utils/development";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { VaultList, VaultNameOptionMap } from "shared/lib/constants/constants";
import { getV2Vault } from "shared/lib/hooks/useV2Vault";

export const useWhitelist = () => {
  const { active, account: web3Account, library } = useWeb3React();
  const account = impersonateAddress ? impersonateAddress : web3Account;
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
            const isWhitelisted = await contract.whitelistMap(account);

            if (isWhitelisted) {
              setWhitelisted(
                Object.keys(VaultNameOptionMap)[
                  Object.values(VaultNameOptionMap).indexOf(vault)
                ]
              );
            }
          } catch {}
        })
      );
    })();
  }, [provider, account, active, library]);

  return whitelisted;
};

export default useWhitelist;
