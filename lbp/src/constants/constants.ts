import { BigNumber } from "ethers";

import { isDevelopment } from "shared/lib/utils/env";
import { ERC20Token } from "../../../shared/lib/models/eth";

/**
 * Please place the first entry to be default
 * In this case, USDC
 */
export const RBNPurchaseToken: ERC20Token[] = ["usdc"];

export const LBPPoolInitialBalance = isDevelopment()
  ? {
      // Unit in cents times 10 ^ 4 (6 decimals)
      usdc: BigNumber.from(55472217).mul(BigNumber.from(10).pow(4)),
      ribbon: BigNumber.from(50000000).mul(BigNumber.from(10).pow(18)),
    }
  : {
      // Unit in cents times 10 ^ 4 (6 decimals)
      usdc: BigNumber.from(55472217).mul(BigNumber.from(10).pow(4)),
      ribbon: BigNumber.from(50000000).mul(BigNumber.from(10).pow(18)),
    };

export const BalancerPoolUrls = isDevelopment()
  ? `https://ipfs.fleek.co/ipns/balancer-bucket.storage.fleek.co/balancer-exchange-kovan/pools?timestamp=${Date.now()}`
  : `https://ipfs.fleek.co/ipns/balancer-bucket.storage.fleek.co/balancer-exchange/pools?timestamp=${Date.now()}`;
