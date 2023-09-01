import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0xaDb4726975E877775Ae06ce5826cc7783D5225df";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
