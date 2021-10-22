import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0x10229a132bf529defd6f4965782e2038bee8747c";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
