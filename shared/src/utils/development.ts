import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0x12fcEE56674F0D17EdB05A0Da149851A9664A505";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
