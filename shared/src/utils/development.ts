import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = '0xb793898783802543D17FcCd78BE611241501649d';

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
