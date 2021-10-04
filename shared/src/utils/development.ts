import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0x741701DAcF966fFffF2D5B6D3e5Ed8ea8D216FdB";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
