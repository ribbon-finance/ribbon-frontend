export type HoverInfo =
  | {
      focused: true;
      xData: Date;
      yData: number;
      xPosition: number;
    }
  | { focused: false };
