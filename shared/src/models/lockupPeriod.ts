export type LockupPeriodKey =
  | "WEEK"
  | "MONTH"
  | "3MONTH"
  | "6MONTH"
  | "YEAR"
  | "2YEAR";

type LockupPeriodToDays = {
  [key in LockupPeriodKey]: number;
};

export const lockupPeriodToDays: LockupPeriodToDays = {
  WEEK: 7,
  MONTH: 30,
  "3MONTH": 91,
  "6MONTH": 182,
  YEAR: 365,
  "2YEAR": 365 * 2,
} as const;
