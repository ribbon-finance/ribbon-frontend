import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0xfad695efd57ad18ea64bc45eb2f60d9e38bd436d";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
