import { isProduction } from "./env";

/**
 * Only change this line
 */
// const addressToImpersonate = "0xc95c069f83b8e9eaeebf813a4fcf6762b881e35f";
const addressToImpersonate = undefined;

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
