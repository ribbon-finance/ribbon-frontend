// Can get from: https://pyth.network/developers/price-feed-ids
export const PYTH_ASSET_TO_PRICE_FEED_ID: Record<string, string> = {
  ETH: "ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  BTC: "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  SOL: "ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
  BNB: "2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f",
  MATIC: "5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52",
  DOGE: "dcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c",
  LTC: "6e3f3fa8253588df9326580180233eb791e03b443a3ba7a1d892e73874e19a54",
  USDC: "eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  LDO: "c63e2a7f37a04e5e614c07238bedb25dcc38927fba8fe890597a593c0b2fa4ad",
  OP: "385f64d993f7b77d8182ed5003d97c60aa3361f3cecfe711544d2d59165e9bdf",
  ARB: "3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5",
  APT: "03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5",
  SUI: "23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744",
  PEPE: "d69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4",
  AVAX: "93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7",
  AAVE: "2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445",
  SPELL: "1dcf38b0206d27849b0fcb8d2df21aff4f95873cce223f49d7c1ea3c5145ec63",
  BAL: "07ad7b4a7662d19a6bc675f6b467172d2f3947fa653ca97555a9b20236406628",
  PERP: "944f2f908c5166e0732ea5b610599116cd8e1c41f47452697c1e84138b7184d6",
  APE: "15add95022ae13563a11992e727c91bdb6b55bc183d9d747436c80a483d8c864",
  CRV: "a19d04ac696c7a6616d291c7e5d1377cc8be437c327b75adb5dc1bad745fcae8",
  BLUR: "856aac602516addee497edf6f50d39e8c95ae5fb0da1ed434a8c2ab9c3e877e9",
};

export const PYTH_PRICE_FEED_ID_TO_ASSET: Record<string, string> = {};

for (const [asset, id] of Object.entries(PYTH_ASSET_TO_PRICE_FEED_ID)) {
  PYTH_PRICE_FEED_ID_TO_ASSET[id] = asset;
}
