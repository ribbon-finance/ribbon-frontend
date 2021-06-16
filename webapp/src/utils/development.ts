import { isProduction } from "shared/lib/utils/env";

/**
 * Only change this line
 */
const addressToImpersonate = undefined;

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
