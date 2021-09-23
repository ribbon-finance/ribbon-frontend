export interface NFTDropData {
  claimed: boolean;
  colorway?: number;
  tokenId?: number;
  proof?: string;
}

export const defaultNFTDropData = {
  claimed: false,
};
