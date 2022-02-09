export const profileActivityFilters = [
  "all activity",
  "stake",
  "unstake",
  "increase stake duration",
  "increase stake amount",
  "gauge boosting",
] as const;
export const profileActivitySortByList = [
  "latest first",
  "oldest first",
] as const;

export type ProfileActivityFilterType = typeof profileActivityFilters[number];
export type ProfileSortByType = typeof profileActivitySortByList[number];
