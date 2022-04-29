import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0x02cE2dD89A34c09be029Adff5B8bedf828A93910";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
