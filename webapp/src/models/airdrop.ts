export type AirdropProof = {
  merkleRoot: string;
  tokenTotal: string;
  claims: {
    [key: string]: {
      index: number;
      amount: string;
      proof: string[];
    };
  };
};

const AirdropBreakdownList = [
  "hegic",
  "charm",
  "primitive",
  "opyn",
  "discord",
  "strangle",
  "thetaVaultBase",
  "thetaVaultBonus",
] as const;

export type AirdropBreakDownType = typeof AirdropBreakdownList[number];

export type AirdropBreakdown = {
  [key in AirdropBreakDownType]: {
    [key: string]: number;
  };
};

export type Airdrop = {
  [key: string]: number;
};
