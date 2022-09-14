import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0x715d25754d5942cac0e66917f0cf6e2a3cf40c1d";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
