import colors from "shared/lib/designSystem/colors";

export const getThemeFromColorway = (colorWay?: number) => {
  switch (colorWay) {
    case 0:
      return "yield";
    case 1:
      return "volatility";
    case 2:
      return "capitalAccumulation";
    case 3:
      return "principalProtection";
  }
};

export const getThemeColorFromColorway = (colorWay?: number) => {
  switch (colorWay) {
    case 0:
    case 1:
    case 2:
    case 3:
      return colors.products[getThemeFromColorway(colorWay)!];
    default:
      return "#FFFFFF";
  }
};

export const getLogoColorFromColorway = (colorWay?: number) => {
  switch (colorWay) {
    case 0:
    case 1:
    case 2:
    case 3:
      return colors.products[getThemeFromColorway(colorWay)!];
    default:
      return "#000000";
  }
};
