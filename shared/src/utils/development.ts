import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0x76153d209f2E780721C665F24435D54a14315eAA";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
