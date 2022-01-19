import { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { defaultSolanaVaultData, SolanaVaultData } from "../models/vault";

import { BigNumber } from "@ethersproject/bignumber";

const vaultAdmin = anchor.web3.Keypair.generate();

const useFetchSolVaultData = (): SolanaVaultData => {
  const [data, setData] = useState<SolanaVaultData>(defaultSolanaVaultData);

  useEffect(() => {
    const initVault = async () => {
      //   await Vault.load(
      //     program.programId,
      //     Network.LOCALNET,
      //     provider.connection,
      //     new anchor.Wallet(vaultAdmin)
      //   );

      setData({
        responses: {
          "rSOL-THETA": {
            totalBalance: BigNumber.from(0),
            cap: BigNumber.from(0),
            pricePerShare: BigNumber.from(0),
            round: 1,
            lockedBalanceInAsset: BigNumber.from(0),
            depositBalanceInAsset: BigNumber.from(0),
            withdrawals: {
              round: 1,
              amount: BigNumber.from(0),
              shares: BigNumber.from(0),
            },
          },
        },
        loading: false,
      });
    };
    initVault();
  });

  return data;
};

export default useFetchSolVaultData;
