import { isDevelopment } from "shared/lib/utils/env";

export const RibbonOGAddress = isDevelopment()
  ? "0x81Eb8D19277da74BA7a1F804A79e1bC31CeF92C1"
  : "0xD602e05594101FdCf3AF0dDcf4775fb1b78f5397";

export const getColorwayFromTokenID = (tokenId: number) => {
  if (tokenId < 1194) {
    return 0;
  } else if (tokenId < 1729) {
    return 1;
  } else if (tokenId < 2253) {
    return 2;
  } else if (tokenId < 2669) {
    return 3;
  } else {
    return 4;
  }
};

export const getOGNFTOpenseaURI = (tokenId: number) =>
  `https://${isDevelopment() ? "testnets." : ""}opensea.io/assets/${
    isDevelopment()
      ? "0xc609bae5588fd92cb98ebaee609d557551606678"
      : RibbonOGAddress
  }/${tokenId}`;
