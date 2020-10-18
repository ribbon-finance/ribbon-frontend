import addresses from "../abis/addresses.json";

export const useAssets = () => {
  // maps the address to the asset symbol
  const symbols = Object.keys(addresses.assets);
  return new Map(symbols.map((symbol) => [addresses.assets[symbol], symbol]));
};
