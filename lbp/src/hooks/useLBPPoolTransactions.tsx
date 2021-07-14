import { useEffect, useState } from "react";
import { BigNumber } from "ethers";

import { LBPPoolTransaction } from "../models/lbp";

const useLBPPoolTransactions = () => {
  const [transactions, setTransactions] = useState<LBPPoolTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setTransactions(
        [...Array(183)].map(() =>
          Math.random() > 0.5
            ? {
                id: "0x343b22857f6a864bea4c2a814ef9b8df73163e6e",
                type: "buy",
                address: "0x9E4011aFC6E5C60344261c5A346dAaA333Fb6436",
                txhash:
                  "0xac14c3311fd3f4a6d8f18c265fe74cd11987771109df62202dfc48d889b63c20",
                timestamp: 1624867200,
                price: 0.283647,
                amount: BigNumber.from(6000000).mul(BigNumber.from(10).pow(18)),
              }
            : {
                id: "0x343b22857f6a864bea4c2a814ef9b8df73163e6e",
                type: "sell",
                address: "0x9E4011aFC6E5C60344261c5A346dAaA333Fb6436",
                txhash:
                  "0xac14c3311fd3f4a6d8f18c265fe74cd11987771109df62202dfc48d889b63c20",
                timestamp: 1624867200,
                price: 0.312937,
                amount: BigNumber.from(20000000).mul(
                  BigNumber.from(10).pow(18)
                ),
              }
        )
      );
      setLoading(false);
    })();
  }, []);

  return { transactions, loading };
};

export default useLBPPoolTransactions;
