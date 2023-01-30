export const portfolioTransactionActivityFilters = [
  "all activity",
  "deposit",
  "withdraw",
  "instant withdraw",
  "migrate",
  "stake",
  "unstake",
  "transfer",
  "receive",
  "distribute",
] as const;
export const portfolioTransactionSortByList = [
  "latest first",
  "oldest first",
] as const;

export type PortfolioTransactionActivityFilter =
  typeof portfolioTransactionActivityFilters[number];
export type PortfolioTransactionSortBy =
  typeof portfolioTransactionSortByList[number];
