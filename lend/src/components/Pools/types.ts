export const activityFilters = ["all activity", "borrow", "repay"] as const;
export const sortByList = ["latest first", "oldest first"] as const;

export type ActivityFilter = typeof activityFilters[number];
export type SortBy = typeof sortByList[number];
