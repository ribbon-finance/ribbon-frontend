import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0xA4290C9EAe274c7A8FbC57A1E68AdC3E95E7C67e";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
