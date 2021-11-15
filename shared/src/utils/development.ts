import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = "0xE5621Eb62aB4b6CEeD2617021af183e17d57FD14";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
