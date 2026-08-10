import React from "react";
import { render, waitFor } from "@testing-library/react";
import { BigNumber } from "ethers";

import { VaultList } from "../constants/constants";
import useFetchVaultData from "./useFetchVaultData";

const mockReadOnlyProvider = { name: "read-only" };
let mockConnectedProvider = { name: "wallet-1" };
const mockGetVault = jest.fn();

jest.mock("@web3-react/core", () => ({
  useWeb3React: () => ({
    chainId: 1,
    account: "0x0000000000000000000000000000000000000001",
    provider: mockConnectedProvider,
  }),
}));

jest.mock("./useWeb3Wallet", () => ({
  __esModule: true,
  default: () => ({ active: true }),
}));

jest.mock("./web3Context", () => ({
  useWeb3Context: () => ({ provider: mockReadOnlyProvider }),
}));

jest.mock("./pendingTransactionsContext", () => ({
  usePendingTransactions: () => ({ transactionsCounter: 0 }),
}));

jest.mock("./useVault", () => ({
  getVault: (...args: unknown[]) => mockGetVault(...args),
}));

jest.mock("../utils/env", () => ({
  SUBGRAPH_URI: "",
  SOLANA_SUBGRAPH: "",
  getSolanaAddresses: () => ({ vaults: { "rSOL-THETA": "" } }),
  getSubgraphqlRearnURI: () => "",
  getSubgraphqlURI: () => "",
  isDevelopment: () => false,
  isProduction: () => true,
  isTreasury: () => false,
  isVIP: () => false,
}));

jest.mock("../utils/vault", () => ({
  isVaultSupportedOnChain: () => true,
}));

const resolvedValue = BigNumber.from(1);
const contract = {
  totalBalance: jest.fn(() => Promise.resolve(resolvedValue)),
  cap: jest.fn(() => Promise.resolve(resolvedValue)),
  maxWithdrawableShares: jest.fn(() => Promise.resolve(resolvedValue)),
  totalSupply: jest.fn(() => Promise.resolve(resolvedValue)),
  accountVaultBalance: jest.fn(() => Promise.resolve(resolvedValue)),
  maxWithdrawAmount: jest.fn(() => Promise.resolve(resolvedValue)),
};

const Probe = () => {
  useFetchVaultData();
  return null;
};

beforeEach(() => {
  mockConnectedProvider = { name: "wallet-1" };
  mockGetVault.mockReset();
  mockGetVault.mockReturnValue(contract);
  Object.values(contract).forEach((method) => {
    method.mockImplementation(() => Promise.resolve(resolvedValue));
  });
});

it("keeps vault reads on the shared provider when a wallet is connected", async () => {
  const { rerender } = render(<Probe />);

  await waitFor(() => {
    expect(mockGetVault).toHaveBeenCalledTimes(VaultList.length);
  });

  mockGetVault.mock.calls.forEach(([provider, , useSigner]) => {
    expect(provider).toBe(mockReadOnlyProvider);
    expect(provider).not.toBe(mockConnectedProvider);
    expect(useSigner).toBe(false);
  });

  const initialCallCount = mockGetVault.mock.calls.length;
  mockConnectedProvider = { name: "wallet-2" };
  rerender(<Probe />);

  await Promise.resolve();
  expect(mockGetVault).toHaveBeenCalledTimes(initialCallCount);
});
