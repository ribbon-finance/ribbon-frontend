export const currencies = ["eth", "usd"] as const;
export type CurrencyType = typeof currencies[number];
