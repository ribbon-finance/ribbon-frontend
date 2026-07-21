import React, { ReactElement, useContext } from "react";
import {
  BlockTag,
  StaticJsonRpcProvider,
  TransactionRequest,
} from "@ethersproject/providers";
import { Interface } from "@ethersproject/abi";
import { resolveProperties } from "@ethersproject/properties";
import { isDevelopment } from "../utils/env";
import { NODE_URI } from "../utils/nodeEnv";
import {
  CHAINID,
  isAvaxNetwork,
  isBinanceNetwork,
} from "../constants/constants";
export type Web3ContextData = {
  provider: StaticJsonRpcProvider;
};

const ETH_CALL_CACHE_TTL = 2000;
const ETH_CALL_BATCH_DELAY = 10;
const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";
const MULTICALL3_INTERFACE = new Interface([
  "function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) view returns (tuple(bool success, bytes returnData)[] returnData)",
]);

type BatchCallItem = {
  transaction: TransactionRequest;
  blockTag: BlockTag;
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
};

class CachedStaticJsonRpcProvider extends StaticJsonRpcProvider {
  private callCache = new Map<string, { expiresAt: number; value: string }>();
  private pendingCalls = new Map<string, Promise<string>>();
  private queuedCalls: BatchCallItem[] = [];
  private queuedCallsTimer?: ReturnType<typeof setTimeout>;

  constructor(url: string, private multicallAddress?: string) {
    super(url);
  }

  async call(
    transaction: TransactionRequest,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    const resolvedTransaction = await resolveProperties(transaction);
    const resolvedBlockTag = blockTag ? await blockTag : "latest";
    const cacheKey = JSON.stringify({
      to: resolvedTransaction.to?.toLowerCase(),
      from: resolvedTransaction.from?.toLowerCase(),
      data: resolvedTransaction.data?.toString().toLowerCase(),
      value: resolvedTransaction.value?.toString(),
      blockTag: resolvedBlockTag?.toString(),
    });

    const cached = this.callCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    const pendingCall = this.pendingCalls.get(cacheKey);
    if (pendingCall) {
      return pendingCall;
    }

    const callPromise = this.shouldBatchCall(resolvedTransaction)
      ? this.queueBatchCall(resolvedTransaction, resolvedBlockTag)
      : this.sendSingleCall(resolvedTransaction, resolvedBlockTag);

    const cachedCallPromise = callPromise
      .then((value) => {
        this.callCache.set(cacheKey, {
          expiresAt: Date.now() + ETH_CALL_CACHE_TTL,
          value,
        });
        return value;
      })
      .finally(() => {
        this.pendingCalls.delete(cacheKey);
      });

    this.pendingCalls.set(cacheKey, cachedCallPromise);
    return cachedCallPromise;
  }

  private shouldBatchCall(transaction: TransactionRequest) {
    if (!this.multicallAddress) {
      return false;
    }

    const to = transaction.to?.toString().toLowerCase();
    const data = transaction.data?.toString();

    return Boolean(
      to &&
        data &&
        data !== "0x" &&
        !transaction.from &&
        !transaction.value &&
        to !== this.multicallAddress.toLowerCase()
    );
  }

  private sendSingleCall(
    transaction: TransactionRequest,
    blockTag: BlockTag
  ): Promise<string> {
    return super.call(transaction, blockTag);
  }

  private queueBatchCall(
    transaction: TransactionRequest,
    blockTag: BlockTag
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queuedCalls.push({
        transaction,
        blockTag,
        resolve,
        reject,
      });

      if (!this.queuedCallsTimer) {
        this.queuedCallsTimer = setTimeout(() => {
          this.flushQueuedCalls();
        }, ETH_CALL_BATCH_DELAY);
      }
    });
  }

  private flushQueuedCalls() {
    const batches = this.queuedCalls.reduce<Record<string, BatchCallItem[]>>(
      (acc, item) => {
        const key = item.blockTag?.toString() || "latest";
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
      },
      {}
    );

    this.queuedCalls = [];
    this.queuedCallsTimer = undefined;

    Object.values(batches).forEach((batch) => {
      this.sendBatchedCalls(batch);
    });
  }

  private async sendBatchedCalls(batch: BatchCallItem[]) {
    if (!this.multicallAddress || batch.length === 0) {
      return;
    }

    const blockTag = batch[0].blockTag;

    try {
      const multicallData = MULTICALL3_INTERFACE.encodeFunctionData(
        "tryAggregate",
        [
          false,
          batch.map((item) => ({
            target: item.transaction.to!.toString(),
            callData: item.transaction.data!.toString(),
          })),
        ]
      );
      const response = await super.call(
        {
          to: this.multicallAddress,
          data: multicallData,
        },
        blockTag
      );
      const [results] = MULTICALL3_INTERFACE.decodeFunctionResult(
        "tryAggregate",
        response
      ) as [Array<{ success: boolean; returnData: string }>];

      batch.forEach((item, index) => {
        const result = results[index];
        if (result?.success) {
          item.resolve(result.returnData);
        } else {
          item.reject(new Error("Multicall subcall failed"));
        }
      });
    } catch (error) {
      await Promise.all(
        batch.map((item) =>
          this.sendSingleCall(item.transaction, item.blockTag)
            .then(item.resolve)
            .catch(item.reject)
        )
      );
    }
  }
}

const defaultProvider = new CachedStaticJsonRpcProvider(
  NODE_URI[isDevelopment() ? CHAINID.ETH_KOVAN : CHAINID.ETH_MAINNET],
  isDevelopment() ? undefined : MULTICALL3_ADDRESS
);
const avaxProvider = new CachedStaticJsonRpcProvider(
  NODE_URI[isDevelopment() ? CHAINID.AVAX_FUJI : CHAINID.AVAX_MAINNET],
  isDevelopment() ? undefined : MULTICALL3_ADDRESS
);
const binanceProvider = new CachedStaticJsonRpcProvider(
  NODE_URI[CHAINID.BINANCE_MAINNET],
  MULTICALL3_ADDRESS
);

export const Web3Context = React.createContext<Web3ContextData>({
  provider: defaultProvider,
});

export const AvaxWeb3Context = React.createContext<Web3ContextData>({
  provider: avaxProvider,
});

export const BinanceWeb3Context = React.createContext<Web3ContextData>({
  provider: binanceProvider,
});

export const useWeb3Context = (chainId: CHAINID = CHAINID.ETH_MAINNET) => {
  let context = Web3Context;
  if (isAvaxNetwork(chainId)) context = AvaxWeb3Context;
  if (isBinanceNetwork(chainId)) context = BinanceWeb3Context;
  return useContext(context);
};

export const useETHWeb3Context = () => {
  return useContext(Web3Context);
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => (
  <Web3Context.Provider value={{ provider: defaultProvider }}>
    <AvaxWeb3Context.Provider value={{ provider: avaxProvider }}>
      <BinanceWeb3Context.Provider value={{ provider: binanceProvider }}>
        {children}
      </BinanceWeb3Context.Provider>
    </AvaxWeb3Context.Provider>
  </Web3Context.Provider>
);
