export const SwapStepList = ["form", "preview"] as const;
export type SwapStep = typeof SwapStepList[number];
