export const profileActivityFilters = [
  "all activity",
  "lock",
  "unlock",
  "increase lock duration",
  "increase lock amount",
  "gauge boosting",
] as const;
export const profileActivitySortByList = [
  "latest first",
  "oldest first",
] as const;

export type ProfileActivityFilterType = typeof profileActivityFilters[number];
export type ProfileSortByType = typeof profileActivitySortByList[number];
