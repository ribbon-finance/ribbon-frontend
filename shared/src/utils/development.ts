import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0x1a1e7a3B925476A3D81FdDaA113DCeB94257E88a";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
