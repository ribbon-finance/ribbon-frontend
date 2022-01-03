export const profileActivityFilters = [
  "all activity",
  "stake",
  "unstake",
  "vote",
  "delegate",
  "allocate voting power",
] as const;
export const profileActivitySortByList = [
  "latest first",
  "oldest first",
] as const;

export type ProfileActivityFilterType = typeof profileActivityFilters[number];
export type ProfileSortByType = typeof profileActivitySortByList[number];
