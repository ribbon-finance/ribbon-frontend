import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0xCeC909e109aF27C4220d8c0400Ec990126187Dce";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
