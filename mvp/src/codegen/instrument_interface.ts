// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma enum-naming
// tslint:disable:whitespace no-unbound-method no-trailing-whitespace
// tslint:disable:no-unused-variable
import {
  AwaitTransactionSuccessOpts,
  ContractFunctionObj,
  ContractTxFunctionObj,
  SendTransactionOpts,
  BaseContract,
  PromiseWithTransactionHash,
  methodAbiToFunctionSignature,
  linkLibrariesInBytecode,
} from "@0x/base-contract";
import { schemas } from "@0x/json-schemas";
import {
  BlockParam,
  BlockParamLiteral,
  BlockRange,
  CallData,
  ContractAbi,
  ContractArtifact,
  DecodedLogArgs,
  MethodAbi,
  TransactionReceiptWithDecodedLogs,
  TxData,
  TxDataPayable,
  SupportedProvider,
} from "ethereum-types";
import {
  BigNumber,
  classUtils,
  hexUtils,
  logUtils,
  providerUtils,
} from "@0x/utils";
import {
  EventCallback,
  IndexedFilterValues,
  SimpleContractArtifact,
} from "@0x/types";
import { Web3Wrapper } from "@0x/web3-wrapper";
import { assert } from "@0x/assert";
import * as ethers from "ethers";
// tslint:enable:no-unused-variable

/* istanbul ignore next */
// tslint:disable:array-type
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class InstrumentInterfaceContract extends BaseContract {
  /**
   * @ignore
   */
  public static deployedBytecode: string | undefined;
  public static contractName = "InstrumentInterface";
  private readonly _methodABIIndex: { [name: string]: number } = {};
  public static async deployFrom0xArtifactAsync(
    artifact: ContractArtifact | SimpleContractArtifact,
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: {
      [contractName: string]: ContractArtifact | SimpleContractArtifact;
    }
  ): Promise<InstrumentInterfaceContract> {
    assert.doesConformToSchema("txDefaults", txDefaults, schemas.txDataSchema, [
      schemas.addressSchema,
      schemas.numberSchema,
      schemas.jsNumber,
    ]);
    if (artifact.compilerOutput === undefined) {
      throw new Error("Compiler output not found in the artifact file");
    }
    const provider = providerUtils.standardizeOrThrow(supportedProvider);
    const bytecode = artifact.compilerOutput.evm.bytecode.object;
    const abi = artifact.compilerOutput.abi;
    const logDecodeDependenciesAbiOnly: {
      [contractName: string]: ContractAbi;
    } = {};
    if (Object.keys(logDecodeDependencies) !== undefined) {
      for (const key of Object.keys(logDecodeDependencies)) {
        logDecodeDependenciesAbiOnly[key] =
          logDecodeDependencies[key].compilerOutput.abi;
      }
    }
    return InstrumentInterfaceContract.deployAsync(
      bytecode,
      abi,
      provider,
      txDefaults,
      logDecodeDependenciesAbiOnly
    );
  }

  public static async deployWithLibrariesFrom0xArtifactAsync(
    artifact: ContractArtifact,
    libraryArtifacts: { [libraryName: string]: ContractArtifact },
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: {
      [contractName: string]: ContractArtifact | SimpleContractArtifact;
    }
  ): Promise<InstrumentInterfaceContract> {
    assert.doesConformToSchema("txDefaults", txDefaults, schemas.txDataSchema, [
      schemas.addressSchema,
      schemas.numberSchema,
      schemas.jsNumber,
    ]);
    if (artifact.compilerOutput === undefined) {
      throw new Error("Compiler output not found in the artifact file");
    }
    const provider = providerUtils.standardizeOrThrow(supportedProvider);
    const abi = artifact.compilerOutput.abi;
    const logDecodeDependenciesAbiOnly: {
      [contractName: string]: ContractAbi;
    } = {};
    if (Object.keys(logDecodeDependencies) !== undefined) {
      for (const key of Object.keys(logDecodeDependencies)) {
        logDecodeDependenciesAbiOnly[key] =
          logDecodeDependencies[key].compilerOutput.abi;
      }
    }
    const libraryAddresses = await InstrumentInterfaceContract._deployLibrariesAsync(
      artifact,
      libraryArtifacts,
      new Web3Wrapper(provider),
      txDefaults
    );
    const bytecode = linkLibrariesInBytecode(artifact, libraryAddresses);
    return InstrumentInterfaceContract.deployAsync(
      bytecode,
      abi,
      provider,
      txDefaults,
      logDecodeDependenciesAbiOnly
    );
  }

  public static async deployAsync(
    bytecode: string,
    abi: ContractAbi,
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: ContractAbi }
  ): Promise<InstrumentInterfaceContract> {
    assert.isHexString("bytecode", bytecode);
    assert.doesConformToSchema("txDefaults", txDefaults, schemas.txDataSchema, [
      schemas.addressSchema,
      schemas.numberSchema,
      schemas.jsNumber,
    ]);
    const provider = providerUtils.standardizeOrThrow(supportedProvider);
    const constructorAbi = BaseContract._lookupConstructorAbi(abi);
    [] = BaseContract._formatABIDataItemList(
      constructorAbi.inputs,
      [],
      BaseContract._bigNumberToString
    );
    const iface = new ethers.utils.Interface(abi);
    const deployInfo = iface.deployFunction;
    const txData = deployInfo.encode(bytecode, []);
    const web3Wrapper = new Web3Wrapper(provider);
    const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
      {
        data: txData,
        ...txDefaults,
      },
      web3Wrapper.estimateGasAsync.bind(web3Wrapper)
    );
    const txHash = await web3Wrapper.sendTransactionAsync(txDataWithDefaults);
    logUtils.log(`transactionHash: ${txHash}`);
    const txReceipt = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
    logUtils.log(
      `InstrumentInterface successfully deployed at ${txReceipt.contractAddress}`
    );
    const contractInstance = new InstrumentInterfaceContract(
      txReceipt.contractAddress as string,
      provider,
      txDefaults,
      logDecodeDependencies
    );
    contractInstance.constructorArgs = [];
    return contractInstance;
  }

  /**
   * @returns      The contract ABI
   */
  public static ABI(): ContractAbi {
    const abi = [
      {
        inputs: [
          {
            name: "collateralAmount",
            type: "uint256",
          },
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            name: "tokenAmount",
            type: "uint256",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            name: "collateralAmount",
            type: "uint256",
          },
          {
            name: "tokenAmount",
            type: "uint256",
          },
        ],
        name: "depositAndMint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            name: "collateral",
            type: "uint256",
          },
          {
            name: "dToken",
            type: "uint256",
          },
          {
            name: "maxSlippage",
            type: "uint256",
          },
        ],
        name: "depositMintAndSell",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "withdrawAfterExpiry",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            name: "vault",
            type: "address",
          },
          {
            name: "debtAmount",
            type: "uint256",
          },
        ],
        name: "repayDebt",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "settle",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            name: "tokenAmount",
            type: "uint256",
          },
        ],
        name: "redeem",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ] as ContractAbi;
    return abi;
  }

  protected static async _deployLibrariesAsync(
    artifact: ContractArtifact,
    libraryArtifacts: { [libraryName: string]: ContractArtifact },
    web3Wrapper: Web3Wrapper,
    txDefaults: Partial<TxData>,
    libraryAddresses: { [libraryName: string]: string } = {}
  ): Promise<{ [libraryName: string]: string }> {
    const links = artifact.compilerOutput.evm.bytecode.linkReferences;
    // Go through all linked libraries, recursively deploying them if necessary.
    for (const link of Object.values(links)) {
      for (const libraryName of Object.keys(link)) {
        if (!libraryAddresses[libraryName]) {
          // Library not yet deployed.
          const libraryArtifact = libraryArtifacts[libraryName];
          if (!libraryArtifact) {
            throw new Error(
              `Missing artifact for linked library "${libraryName}"`
            );
          }
          // Deploy any dependent libraries used by this library.
          await InstrumentInterfaceContract._deployLibrariesAsync(
            libraryArtifact,
            libraryArtifacts,
            web3Wrapper,
            txDefaults,
            libraryAddresses
          );
          // Deploy this library.
          const linkedLibraryBytecode = linkLibrariesInBytecode(
            libraryArtifact,
            libraryAddresses
          );
          const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
            {
              data: linkedLibraryBytecode,
              ...txDefaults,
            },
            web3Wrapper.estimateGasAsync.bind(web3Wrapper)
          );
          const txHash = await web3Wrapper.sendTransactionAsync(
            txDataWithDefaults
          );
          logUtils.log(`transactionHash: ${txHash}`);
          const {
            contractAddress,
          } = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
          logUtils.log(
            `${libraryArtifact.contractName} successfully deployed at ${contractAddress}`
          );
          libraryAddresses[
            libraryArtifact.contractName
          ] = contractAddress as string;
        }
      }
    }
    return libraryAddresses;
  }

  public getFunctionSignature(methodName: string): string {
    const index = this._methodABIIndex[methodName];
    const methodAbi = InstrumentInterfaceContract.ABI()[index] as MethodAbi; // tslint:disable-line:no-unnecessary-type-assertion
    const functionSignature = methodAbiToFunctionSignature(methodAbi);
    return functionSignature;
  }

  public getABIDecodedTransactionData<T>(
    methodName: string,
    callData: string
  ): T {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as InstrumentInterfaceContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    const abiDecodedCallData = abiEncoder.strictDecode<T>(callData);
    return abiDecodedCallData;
  }

  public getABIDecodedReturnData<T>(methodName: string, callData: string): T {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as InstrumentInterfaceContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    const abiDecodedCallData = abiEncoder.strictDecodeReturnValue<T>(callData);
    return abiDecodedCallData;
  }

  public getSelector(methodName: string): string {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as InstrumentInterfaceContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    return abiEncoder.getSelector();
  }

  public deposit(collateralAmount: BigNumber): ContractTxFunctionObj<void> {
    const self = (this as any) as InstrumentInterfaceContract;
    assert.isBigNumber("collateralAmount", collateralAmount);
    const functionSignature = "deposit(uint256)";

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true }
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this)
        );
        if (opts.shouldValidate !== false) {
          await this.callAsync(txDataWithDefaults);
        }
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true }
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(
          this.sendTransactionAsync(txData, opts),
          opts
        );
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
          data: this.getABIEncodedTransactionData(),
          ...txData,
        });
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam
      ): Promise<void> {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync(
          { data: this.getABIEncodedTransactionData(), ...callData },
          defaultBlock
        );
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(
          rawCallResult,
          abiEncoder
        );
        return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [
          collateralAmount,
        ]);
      },
    };
  }
  public mint(tokenAmount: BigNumber): ContractTxFunctionObj<void> {
    const self = (this as any) as InstrumentInterfaceContract;
    assert.isBigNumber("tokenAmount", tokenAmount);
    const functionSignature = "mint(uint256)";

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true }
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this)
        );
        if (opts.shouldValidate !== false) {
          await this.callAsync(txDataWithDefaults);
        }
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true }
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(
          this.sendTransactionAsync(txData, opts),
          opts
        );
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
          data: this.getABIEncodedTransactionData(),
          ...txData,
        });
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam
      ): Promise<void> {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync(
          { data: this.getABIEncodedTransactionData(), ...callData },
          defaultBlock
        );
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(
          rawCallResult,
          abiEncoder
        );
        return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [tokenAmount]);
      },
    };
  }
  public depositAndMint(
    collateralAmount: BigNumber,
    tokenAmount: BigNumber
  ): ContractTxFunctionObj<void> {
    const self = (this as any) as InstrumentInterfaceContract;
    assert.isBigNumber("collateralAmount", collateralAmount);
    assert.isBigNumber("tokenAmount", tokenAmount);
    const functionSignature = "depositAndMint(uint256,uint256)";

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true }
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this)
        );
        if (opts.shouldValidate !== false) {
          await this.callAsync(txDataWithDefaults);
        }
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true }
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(
          this.sendTransactionAsync(txData, opts),
          opts
        );
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
          data: this.getABIEncodedTransactionData(),
          ...txData,
        });
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam
      ): Promise<void> {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync(
          { data: this.getABIEncodedTransactionData(), ...callData },
          defaultBlock
        );
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(
          rawCallResult,
          abiEncoder
        );
        return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [
          collateralAmount,
          tokenAmount,
        ]);
      },
    };
  }
  public depositMintAndSell(
    collateral: BigNumber,
    dToken: BigNumber,
    maxSlippage: BigNumber
  ): ContractTxFunctionObj<void> {
    const self = (this as any) as InstrumentInterfaceContract;
    assert.isBigNumber("collateral", collateral);
    assert.isBigNumber("dToken", dToken);
    assert.isBigNumber("maxSlippage", maxSlippage);
    const functionSignature = "depositMintAndSell(uint256,uint256,uint256)";

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true }
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this)
        );
        if (opts.shouldValidate !== false) {
          await this.callAsync(txDataWithDefaults);
        }
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true }
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(
          this.sendTransactionAsync(txData, opts),
          opts
        );
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
          data: this.getABIEncodedTransactionData(),
          ...txData,
        });
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam
      ): Promise<void> {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync(
          { data: this.getABIEncodedTransactionData(), ...callData },
          defaultBlock
        );
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(
          rawCallResult,
          abiEncoder
        );
        return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [
          collateral,
          dToken,
          maxSlippage,
        ]);
      },
    };
  }
  public withdrawAfterExpiry(): ContractTxFunctionObj<void> {
    const self = (this as any) as InstrumentInterfaceContract;
    const functionSignature = "withdrawAfterExpiry()";

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true }
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this)
        );
        if (opts.shouldValidate !== false) {
          await this.callAsync(txDataWithDefaults);
        }
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true }
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(
          this.sendTransactionAsync(txData, opts),
          opts
        );
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
          data: this.getABIEncodedTransactionData(),
          ...txData,
        });
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam
      ): Promise<void> {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync(
          { data: this.getABIEncodedTransactionData(), ...callData },
          defaultBlock
        );
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(
          rawCallResult,
          abiEncoder
        );
        return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    };
  }
  public repayDebt(
    vault: string,
    debtAmount: BigNumber
  ): ContractTxFunctionObj<void> {
    const self = (this as any) as InstrumentInterfaceContract;
    assert.isString("vault", vault);
    assert.isBigNumber("debtAmount", debtAmount);
    const functionSignature = "repayDebt(address,uint256)";

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true }
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this)
        );
        if (opts.shouldValidate !== false) {
          await this.callAsync(txDataWithDefaults);
        }
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true }
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(
          this.sendTransactionAsync(txData, opts),
          opts
        );
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
          data: this.getABIEncodedTransactionData(),
          ...txData,
        });
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam
      ): Promise<void> {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync(
          { data: this.getABIEncodedTransactionData(), ...callData },
          defaultBlock
        );
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(
          rawCallResult,
          abiEncoder
        );
        return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [
          vault.toLowerCase(),
          debtAmount,
        ]);
      },
    };
  }
  public settle(): ContractTxFunctionObj<void> {
    const self = (this as any) as InstrumentInterfaceContract;
    const functionSignature = "settle()";

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true }
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this)
        );
        if (opts.shouldValidate !== false) {
          await this.callAsync(txDataWithDefaults);
        }
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true }
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(
          this.sendTransactionAsync(txData, opts),
          opts
        );
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
          data: this.getABIEncodedTransactionData(),
          ...txData,
        });
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam
      ): Promise<void> {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync(
          { data: this.getABIEncodedTransactionData(), ...callData },
          defaultBlock
        );
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(
          rawCallResult,
          abiEncoder
        );
        return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    };
  }
  public redeem(tokenAmount: BigNumber): ContractTxFunctionObj<void> {
    const self = (this as any) as InstrumentInterfaceContract;
    assert.isBigNumber("tokenAmount", tokenAmount);
    const functionSignature = "redeem(uint256)";

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true }
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this)
        );
        if (opts.shouldValidate !== false) {
          await this.callAsync(txDataWithDefaults);
        }
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true }
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(
          this.sendTransactionAsync(txData, opts),
          opts
        );
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
          data: this.getABIEncodedTransactionData(),
          ...txData,
        });
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam
      ): Promise<void> {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync(
          { data: this.getABIEncodedTransactionData(), ...callData },
          defaultBlock
        );
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(
          rawCallResult,
          abiEncoder
        );
        return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [tokenAmount]);
      },
    };
  }

  constructor(
    address: string,
    supportedProvider: SupportedProvider,
    txDefaults?: Partial<TxData>,
    logDecodeDependencies?: { [contractName: string]: ContractAbi },
    deployedBytecode:
      | string
      | undefined = InstrumentInterfaceContract.deployedBytecode
  ) {
    super(
      "InstrumentInterface",
      InstrumentInterfaceContract.ABI(),
      address,
      supportedProvider,
      txDefaults,
      logDecodeDependencies,
      deployedBytecode
    );
    classUtils.bindAll(this, [
      "_abiEncoderByFunctionSignature",
      "address",
      "_web3Wrapper",
    ]);
    InstrumentInterfaceContract.ABI().forEach((item, index) => {
      if (item.type === "function") {
        const methodAbi = item as MethodAbi;
        this._methodABIIndex[methodAbi.name] = index;
      }
    });
  }
}

// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
