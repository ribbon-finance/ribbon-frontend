import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0x31d3243cfb54b34fc9c73e1cb1137124bd6b13e1";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
