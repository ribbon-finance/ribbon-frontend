export const SwapStepList = [
  "form",
  "preview",
  "walletAction",
  "processing",
] as const;
export type SwapStep = typeof SwapStepList[number];
