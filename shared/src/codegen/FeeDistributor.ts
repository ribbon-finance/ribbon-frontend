/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface FeeDistributorInterface extends utils.Interface {
  contractName: "FeeDistributor";
  functions: {
    "checkpoint_token()": FunctionFragment;
    "ve_for_at(address,uint256)": FunctionFragment;
    "checkpoint_total_supply()": FunctionFragment;
    "claim()": FunctionFragment;
    "claim_many(address[20])": FunctionFragment;
    "burn(address,uint256)": FunctionFragment;
    "commit_admin(address)": FunctionFragment;
    "apply_admin()": FunctionFragment;
    "toggle_allow_checkpoint_token()": FunctionFragment;
    "kill_me()": FunctionFragment;
    "recover_balance(address)": FunctionFragment;
    "recover_eth_balance()": FunctionFragment;
    "start_time()": FunctionFragment;
    "time_cursor()": FunctionFragment;
    "time_cursor_of(address)": FunctionFragment;
    "user_epoch_of(address)": FunctionFragment;
    "last_token_time()": FunctionFragment;
    "tokens_per_week(uint256)": FunctionFragment;
    "voting_escrow()": FunctionFragment;
    "token()": FunctionFragment;
    "total_received()": FunctionFragment;
    "token_last_balance()": FunctionFragment;
    "ve_supply(uint256)": FunctionFragment;
    "admin()": FunctionFragment;
    "future_admin()": FunctionFragment;
    "can_checkpoint_token()": FunctionFragment;
    "emergency_return()": FunctionFragment;
    "is_killed()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "checkpoint_token",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ve_for_at",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "checkpoint_total_supply",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "claim", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "claim_many",
    values: [string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "burn",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "commit_admin",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "apply_admin",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "toggle_allow_checkpoint_token",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "kill_me", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "recover_balance",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "recover_eth_balance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "start_time",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "time_cursor",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "time_cursor_of",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "user_epoch_of",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "last_token_time",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tokens_per_week",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "voting_escrow",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "total_received",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "token_last_balance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ve_supply",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "future_admin",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "can_checkpoint_token",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "emergency_return",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "is_killed", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "checkpoint_token",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ve_for_at", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "checkpoint_total_supply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim_many", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "commit_admin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "apply_admin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "toggle_allow_checkpoint_token",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "kill_me", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "recover_balance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "recover_eth_balance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "start_time", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "time_cursor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "time_cursor_of",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "user_epoch_of",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "last_token_time",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokens_per_week",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "voting_escrow",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "total_received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "token_last_balance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ve_supply", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "future_admin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "can_checkpoint_token",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "emergency_return",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "is_killed", data: BytesLike): Result;

  events: {
    "CommitAdmin(address)": EventFragment;
    "ApplyAdmin(address)": EventFragment;
    "ToggleAllowCheckpointToken(bool)": EventFragment;
    "CheckpointToken(uint256,uint256)": EventFragment;
    "Claimed(address,uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CommitAdmin"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ApplyAdmin"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ToggleAllowCheckpointToken"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CheckpointToken"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Claimed"): EventFragment;
}

export type CommitAdminEvent = TypedEvent<[string], { admin: string }>;

export type CommitAdminEventFilter = TypedEventFilter<CommitAdminEvent>;

export type ApplyAdminEvent = TypedEvent<[string], { admin: string }>;

export type ApplyAdminEventFilter = TypedEventFilter<ApplyAdminEvent>;

export type ToggleAllowCheckpointTokenEvent = TypedEvent<
  [boolean],
  { toggle_flag: boolean }
>;

export type ToggleAllowCheckpointTokenEventFilter =
  TypedEventFilter<ToggleAllowCheckpointTokenEvent>;

export type CheckpointTokenEvent = TypedEvent<
  [BigNumber, BigNumber],
  { time: BigNumber; tokens: BigNumber }
>;

export type CheckpointTokenEventFilter = TypedEventFilter<CheckpointTokenEvent>;

export type ClaimedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  {
    recipient: string;
    amount: BigNumber;
    claim_epoch: BigNumber;
    max_epoch: BigNumber;
  }
>;

export type ClaimedEventFilter = TypedEventFilter<ClaimedEvent>;

export interface FeeDistributor extends BaseContract {
  contractName: "FeeDistributor";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: FeeDistributorInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    checkpoint_token(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ve_for_at(
      _user: string,
      _timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    checkpoint_total_supply(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "claim()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "claim(address)"(
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claim_many(
      _receivers: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    burn(
      _coin: string,
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    commit_admin(
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    apply_admin(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    toggle_allow_checkpoint_token(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    kill_me(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    recover_balance(
      _coin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    recover_eth_balance(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    start_time(overrides?: CallOverrides): Promise<[BigNumber]>;

    time_cursor(overrides?: CallOverrides): Promise<[BigNumber]>;

    time_cursor_of(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    user_epoch_of(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    last_token_time(overrides?: CallOverrides): Promise<[BigNumber]>;

    tokens_per_week(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    voting_escrow(overrides?: CallOverrides): Promise<[string]>;

    token(overrides?: CallOverrides): Promise<[string]>;

    total_received(overrides?: CallOverrides): Promise<[BigNumber]>;

    token_last_balance(overrides?: CallOverrides): Promise<[BigNumber]>;

    ve_supply(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    admin(overrides?: CallOverrides): Promise<[string]>;

    future_admin(overrides?: CallOverrides): Promise<[string]>;

    can_checkpoint_token(overrides?: CallOverrides): Promise<[boolean]>;

    emergency_return(overrides?: CallOverrides): Promise<[string]>;

    is_killed(overrides?: CallOverrides): Promise<[boolean]>;
  };

  checkpoint_token(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  ve_for_at(
    _user: string,
    _timestamp: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  checkpoint_total_supply(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "claim()"(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "claim(address)"(
    _addr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claim_many(
    _receivers: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  burn(
    _coin: string,
    _amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  commit_admin(
    _addr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  apply_admin(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  toggle_allow_checkpoint_token(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  kill_me(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  recover_balance(
    _coin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  recover_eth_balance(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  start_time(overrides?: CallOverrides): Promise<BigNumber>;

  time_cursor(overrides?: CallOverrides): Promise<BigNumber>;

  time_cursor_of(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  user_epoch_of(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  last_token_time(overrides?: CallOverrides): Promise<BigNumber>;

  tokens_per_week(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  voting_escrow(overrides?: CallOverrides): Promise<string>;

  token(overrides?: CallOverrides): Promise<string>;

  total_received(overrides?: CallOverrides): Promise<BigNumber>;

  token_last_balance(overrides?: CallOverrides): Promise<BigNumber>;

  ve_supply(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  admin(overrides?: CallOverrides): Promise<string>;

  future_admin(overrides?: CallOverrides): Promise<string>;

  can_checkpoint_token(overrides?: CallOverrides): Promise<boolean>;

  emergency_return(overrides?: CallOverrides): Promise<string>;

  is_killed(overrides?: CallOverrides): Promise<boolean>;

  callStatic: {
    checkpoint_token(overrides?: CallOverrides): Promise<void>;

    ve_for_at(
      _user: string,
      _timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    checkpoint_total_supply(overrides?: CallOverrides): Promise<void>;

    "claim()"(overrides?: CallOverrides): Promise<BigNumber>;

    "claim(address)"(
      _addr: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claim_many(
      _receivers: string[],
      overrides?: CallOverrides
    ): Promise<boolean>;

    burn(
      _coin: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    commit_admin(_addr: string, overrides?: CallOverrides): Promise<void>;

    apply_admin(overrides?: CallOverrides): Promise<void>;

    toggle_allow_checkpoint_token(overrides?: CallOverrides): Promise<void>;

    kill_me(overrides?: CallOverrides): Promise<void>;

    recover_balance(_coin: string, overrides?: CallOverrides): Promise<boolean>;

    recover_eth_balance(overrides?: CallOverrides): Promise<boolean>;

    start_time(overrides?: CallOverrides): Promise<BigNumber>;

    time_cursor(overrides?: CallOverrides): Promise<BigNumber>;

    time_cursor_of(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    user_epoch_of(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    last_token_time(overrides?: CallOverrides): Promise<BigNumber>;

    tokens_per_week(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    voting_escrow(overrides?: CallOverrides): Promise<string>;

    token(overrides?: CallOverrides): Promise<string>;

    total_received(overrides?: CallOverrides): Promise<BigNumber>;

    token_last_balance(overrides?: CallOverrides): Promise<BigNumber>;

    ve_supply(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<string>;

    future_admin(overrides?: CallOverrides): Promise<string>;

    can_checkpoint_token(overrides?: CallOverrides): Promise<boolean>;

    emergency_return(overrides?: CallOverrides): Promise<string>;

    is_killed(overrides?: CallOverrides): Promise<boolean>;
  };

  filters: {
    "CommitAdmin(address)"(admin?: null): CommitAdminEventFilter;
    CommitAdmin(admin?: null): CommitAdminEventFilter;

    "ApplyAdmin(address)"(admin?: null): ApplyAdminEventFilter;
    ApplyAdmin(admin?: null): ApplyAdminEventFilter;

    "ToggleAllowCheckpointToken(bool)"(
      toggle_flag?: null
    ): ToggleAllowCheckpointTokenEventFilter;
    ToggleAllowCheckpointToken(
      toggle_flag?: null
    ): ToggleAllowCheckpointTokenEventFilter;

    "CheckpointToken(uint256,uint256)"(
      time?: null,
      tokens?: null
    ): CheckpointTokenEventFilter;
    CheckpointToken(time?: null, tokens?: null): CheckpointTokenEventFilter;

    "Claimed(address,uint256,uint256,uint256)"(
      recipient?: string | null,
      amount?: null,
      claim_epoch?: null,
      max_epoch?: null
    ): ClaimedEventFilter;
    Claimed(
      recipient?: string | null,
      amount?: null,
      claim_epoch?: null,
      max_epoch?: null
    ): ClaimedEventFilter;
  };

  estimateGas: {
    checkpoint_token(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    ve_for_at(
      _user: string,
      _timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    checkpoint_total_supply(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "claim()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "claim(address)"(
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claim_many(
      _receivers: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    burn(
      _coin: string,
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    commit_admin(
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    apply_admin(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    toggle_allow_checkpoint_token(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    kill_me(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    recover_balance(
      _coin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    recover_eth_balance(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    start_time(overrides?: CallOverrides): Promise<BigNumber>;

    time_cursor(overrides?: CallOverrides): Promise<BigNumber>;

    time_cursor_of(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    user_epoch_of(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    last_token_time(overrides?: CallOverrides): Promise<BigNumber>;

    tokens_per_week(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    voting_escrow(overrides?: CallOverrides): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    total_received(overrides?: CallOverrides): Promise<BigNumber>;

    token_last_balance(overrides?: CallOverrides): Promise<BigNumber>;

    ve_supply(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<BigNumber>;

    future_admin(overrides?: CallOverrides): Promise<BigNumber>;

    can_checkpoint_token(overrides?: CallOverrides): Promise<BigNumber>;

    emergency_return(overrides?: CallOverrides): Promise<BigNumber>;

    is_killed(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    checkpoint_token(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    ve_for_at(
      _user: string,
      _timestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    checkpoint_total_supply(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "claim()"(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "claim(address)"(
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claim_many(
      _receivers: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    burn(
      _coin: string,
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    commit_admin(
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    apply_admin(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    toggle_allow_checkpoint_token(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    kill_me(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    recover_balance(
      _coin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    recover_eth_balance(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    start_time(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    time_cursor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    time_cursor_of(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    user_epoch_of(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    last_token_time(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokens_per_week(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    voting_escrow(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    total_received(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token_last_balance(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ve_supply(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    future_admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    can_checkpoint_token(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    emergency_return(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    is_killed(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}