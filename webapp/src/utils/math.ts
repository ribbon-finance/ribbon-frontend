export const formatSignificantDecimals = (
  num: string,
  significantDecimals: number = 6
) => {
  return parseFloat(parseFloat(num).toFixed(significantDecimals)).toString();
};
