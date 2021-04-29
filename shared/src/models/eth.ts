const ERC20TokenList = ["weth", "usdc", "wbtc"] as const;
export type ERC20Token = typeof ERC20TokenList[number];
