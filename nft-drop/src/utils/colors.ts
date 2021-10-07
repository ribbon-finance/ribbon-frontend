import colors from "shared/lib/designSystem/colors";

export const getThemeColorFromColorway = (colorWay?: number) => {
  switch (colorWay) {
    case 0:
      return colors.red;
    case 1:
      return colors.products.volatility;
    case 2:
      return colors.vaultActivity.sales;
    case 3:
      return "#2D99FF";
    default:
      return "#FFFFFF";
  }
};

export const getLogoColorFromColorway = (colorWay?: number) => {
  switch (colorWay) {
    case 0:
      return colors.red;
    case 1:
      return colors.products.volatility;
    case 2:
      return colors.vaultActivity.sales;
    case 3:
      return "#2D99FF";
    default:
      return "#000000";
  }
};
