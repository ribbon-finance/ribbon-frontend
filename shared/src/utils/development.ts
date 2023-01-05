import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0x39f36935e07f283cf1fd58984c3ed2e63e8b5ccd";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
