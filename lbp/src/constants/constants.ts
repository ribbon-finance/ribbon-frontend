import { BigNumber } from "ethers";

import { isDevelopment } from "shared/lib/utils/env";
import addresses from "shared/lib/constants/externalAddresses.json";

export const LBPPoolUSDC = isDevelopment()
  ? addresses.kovan.assets.usdc
  : addresses.mainnet.assets.usdc;

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
