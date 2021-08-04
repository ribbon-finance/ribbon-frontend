export const SwapStepList = [
  "form",
  "preview",
  "walletAction",
  "processing",
] as const;
export type SwapStep = typeof SwapStepList[number];

export const SlippageOptionsList = [1, 5, 10] as const;
export type SlippageOption = typeof SlippageOptionsList[number];

export type SlippageConfig =
  | {
      name: SlippageOption;
      value: number;
    }
  | {
      name: "custom";
      value: number;
    };
