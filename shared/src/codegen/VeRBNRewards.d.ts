/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface VeRBNRewardsInterface extends ethers.utils.Interface {
  functions: {
    "DURATION()": FunctionFragment;
    "addToWhitelist(address,bool)": FunctionFragment;
    "currentRewards()": FunctionFragment;
    "donate(uint256)": FunctionFragment;
    "earned(address)": FunctionFragment;
    "getReward()": FunctionFragment;
    "getRewardFor(address,bool)": FunctionFragment;
    "gov()": FunctionFragment;
    "historicalRewards()": FunctionFragment;
    "lastTimeRewardApplicable()": FunctionFragment;
    "lastUpdateTime()": FunctionFragment;
    "periodFinish()": FunctionFragment;
    "queueNewRewards(uint256)": FunctionFragment;
    "queuedRewards()": FunctionFragment;
    "rewardPerToken()": FunctionFragment;
    "rewardPerTokenStored()": FunctionFragment;
    "rewardRate()": FunctionFragment;
    "rewardToken()": FunctionFragment;
    "rewards(address)": FunctionFragment;
    "setGov(address)": FunctionFragment;
    "sweep(address)": FunctionFragment;
    "updateReward(address)": FunctionFragment;
    "userRewardPerTokenPaid(address)": FunctionFragment;
    "veToken()": FunctionFragment;
    "whitelist(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "DURATION", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "addToWhitelist",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "currentRewards",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "donate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "earned", values: [string]): string;
  encodeFunctionData(functionFragment: "getReward", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getRewardFor",
    values: [string, boolean]
  ): string;
  encodeFunctionData(functionFragment: "gov", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "historicalRewards",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lastTimeRewardApplicable",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lastUpdateTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "periodFinish",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "queueNewRewards",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "queuedRewards",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardPerToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardPerTokenStored",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardToken",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "rewards", values: [string]): string;
  encodeFunctionData(functionFragment: "setGov", values: [string]): string;
  encodeFunctionData(functionFragment: "sweep", values: [string]): string;
  encodeFunctionData(
    functionFragment: "updateReward",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "userRewardPerTokenPaid",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "veToken", values?: undefined): string;
  encodeFunctionData(functionFragment: "whitelist", values: [string]): string;

  decodeFunctionResult(functionFragment: "DURATION", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addToWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "donate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "earned", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRewardFor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "gov", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "historicalRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastTimeRewardApplicable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastUpdateTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "periodFinish",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queueNewRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queuedRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardPerToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardPerTokenStored",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewardRate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setGov", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sweep", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userRewardPerTokenPaid",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "veToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "whitelist", data: BytesLike): Result;

  events: {
    "Donate(uint256)": EventFragment;
    "RewardAdded(uint256)": EventFragment;
    "RewardPaid(address,uint256)": EventFragment;
    "UpdatedGov(address)": EventFragment;
    "UpdatedWhitelist(address,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Donate"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardPaid"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdatedGov"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdatedWhitelist"): EventFragment;
}

export class VeRBNRewards extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: VeRBNRewardsInterface;

  functions: {
    DURATION(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "DURATION()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    addToWhitelist(
      _addr: string,
      _isWhitelist: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "addToWhitelist(address,bool)"(
      _addr: string,
      _isWhitelist: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    currentRewards(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "currentRewards()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    donate(
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "donate(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    earned(
      account: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "earned(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "getReward()"(overrides?: Overrides): Promise<ContractTransaction>;

    "getReward(bool)"(
      _lock: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    getRewardFor(
      _account: string,
      _lock: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "getRewardFor(address,bool)"(
      _account: string,
      _lock: boolean,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    gov(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    "gov()"(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    historicalRewards(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "historicalRewards()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    lastTimeRewardApplicable(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "lastTimeRewardApplicable()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    lastUpdateTime(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "lastUpdateTime()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    periodFinish(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "periodFinish()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    queueNewRewards(
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "queueNewRewards(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    queuedRewards(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "queuedRewards()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    rewardPerToken(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "rewardPerToken()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    rewardPerTokenStored(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "rewardPerTokenStored()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    rewardRate(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "rewardRate()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    rewardToken(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    "rewardToken()"(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    rewards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "rewards(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    setGov(_gov: string, overrides?: Overrides): Promise<ContractTransaction>;

    "setGov(address)"(
      _gov: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    sweep(_token: string, overrides?: Overrides): Promise<ContractTransaction>;

    "sweep(address)"(
      _token: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    updateReward(
      _account: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "updateReward(address)"(
      _account: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    userRewardPerTokenPaid(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    "userRewardPerTokenPaid(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    veToken(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    "veToken()"(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    whitelist(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    "whitelist(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;
  };

  DURATION(overrides?: CallOverrides): Promise<BigNumber>;

  "DURATION()"(overrides?: CallOverrides): Promise<BigNumber>;

  addToWhitelist(
    _addr: string,
    _isWhitelist: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "addToWhitelist(address,bool)"(
    _addr: string,
    _isWhitelist: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  currentRewards(overrides?: CallOverrides): Promise<BigNumber>;

  "currentRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

  donate(
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "donate(uint256)"(
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  earned(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  "earned(address)"(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getReward()"(overrides?: Overrides): Promise<ContractTransaction>;

  "getReward(bool)"(
    _lock: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  getRewardFor(
    _account: string,
    _lock: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "getRewardFor(address,bool)"(
    _account: string,
    _lock: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  gov(overrides?: CallOverrides): Promise<string>;

  "gov()"(overrides?: CallOverrides): Promise<string>;

  historicalRewards(overrides?: CallOverrides): Promise<BigNumber>;

  "historicalRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

  lastTimeRewardApplicable(overrides?: CallOverrides): Promise<BigNumber>;

  "lastTimeRewardApplicable()"(overrides?: CallOverrides): Promise<BigNumber>;

  lastUpdateTime(overrides?: CallOverrides): Promise<BigNumber>;

  "lastUpdateTime()"(overrides?: CallOverrides): Promise<BigNumber>;

  periodFinish(overrides?: CallOverrides): Promise<BigNumber>;

  "periodFinish()"(overrides?: CallOverrides): Promise<BigNumber>;

  queueNewRewards(
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "queueNewRewards(uint256)"(
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  queuedRewards(overrides?: CallOverrides): Promise<BigNumber>;

  "queuedRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

  rewardPerToken(overrides?: CallOverrides): Promise<BigNumber>;

  "rewardPerToken()"(overrides?: CallOverrides): Promise<BigNumber>;

  rewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;

  "rewardPerTokenStored()"(overrides?: CallOverrides): Promise<BigNumber>;

  rewardRate(overrides?: CallOverrides): Promise<BigNumber>;

  "rewardRate()"(overrides?: CallOverrides): Promise<BigNumber>;

  rewardToken(overrides?: CallOverrides): Promise<string>;

  "rewardToken()"(overrides?: CallOverrides): Promise<string>;

  rewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  "rewards(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  setGov(_gov: string, overrides?: Overrides): Promise<ContractTransaction>;

  "setGov(address)"(
    _gov: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  sweep(_token: string, overrides?: Overrides): Promise<ContractTransaction>;

  "sweep(address)"(
    _token: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  updateReward(
    _account: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "updateReward(address)"(
    _account: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  userRewardPerTokenPaid(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "userRewardPerTokenPaid(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  veToken(overrides?: CallOverrides): Promise<string>;

  "veToken()"(overrides?: CallOverrides): Promise<string>;

  whitelist(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  "whitelist(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    DURATION(overrides?: CallOverrides): Promise<BigNumber>;

    "DURATION()"(overrides?: CallOverrides): Promise<BigNumber>;

    addToWhitelist(
      _addr: string,
      _isWhitelist: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    "addToWhitelist(address,bool)"(
      _addr: string,
      _isWhitelist: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    currentRewards(overrides?: CallOverrides): Promise<BigNumber>;

    "currentRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

    donate(_amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    "donate(uint256)"(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    earned(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    "earned(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getReward()"(overrides?: CallOverrides): Promise<boolean>;

    "getReward(bool)"(
      _lock: boolean,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getRewardFor(
      _account: string,
      _lock: boolean,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "getRewardFor(address,bool)"(
      _account: string,
      _lock: boolean,
      overrides?: CallOverrides
    ): Promise<boolean>;

    gov(overrides?: CallOverrides): Promise<string>;

    "gov()"(overrides?: CallOverrides): Promise<string>;

    historicalRewards(overrides?: CallOverrides): Promise<BigNumber>;

    "historicalRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

    lastTimeRewardApplicable(overrides?: CallOverrides): Promise<BigNumber>;

    "lastTimeRewardApplicable()"(overrides?: CallOverrides): Promise<BigNumber>;

    lastUpdateTime(overrides?: CallOverrides): Promise<BigNumber>;

    "lastUpdateTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    periodFinish(overrides?: CallOverrides): Promise<BigNumber>;

    "periodFinish()"(overrides?: CallOverrides): Promise<BigNumber>;

    queueNewRewards(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "queueNewRewards(uint256)"(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    queuedRewards(overrides?: CallOverrides): Promise<BigNumber>;

    "queuedRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerToken(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardPerToken()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardPerTokenStored()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardRate(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardRate()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardToken(overrides?: CallOverrides): Promise<string>;

    "rewardToken()"(overrides?: CallOverrides): Promise<string>;

    rewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "rewards(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setGov(_gov: string, overrides?: CallOverrides): Promise<boolean>;

    "setGov(address)"(
      _gov: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    sweep(_token: string, overrides?: CallOverrides): Promise<boolean>;

    "sweep(address)"(
      _token: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    updateReward(_account: string, overrides?: CallOverrides): Promise<boolean>;

    "updateReward(address)"(
      _account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    userRewardPerTokenPaid(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "userRewardPerTokenPaid(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    veToken(overrides?: CallOverrides): Promise<string>;

    "veToken()"(overrides?: CallOverrides): Promise<string>;

    whitelist(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    "whitelist(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    Donate(amount: null): EventFilter;

    RewardAdded(reward: null): EventFilter;

    RewardPaid(user: string | null, reward: null): EventFilter;

    UpdatedGov(gov: null): EventFilter;

    UpdatedWhitelist(recipient: null, isWhitelisted: null): EventFilter;
  };

  estimateGas: {
    DURATION(overrides?: CallOverrides): Promise<BigNumber>;

    "DURATION()"(overrides?: CallOverrides): Promise<BigNumber>;

    addToWhitelist(
      _addr: string,
      _isWhitelist: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "addToWhitelist(address,bool)"(
      _addr: string,
      _isWhitelist: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;

    currentRewards(overrides?: CallOverrides): Promise<BigNumber>;

    "currentRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

    donate(_amount: BigNumberish, overrides?: Overrides): Promise<BigNumber>;

    "donate(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    earned(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    "earned(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getReward()"(overrides?: Overrides): Promise<BigNumber>;

    "getReward(bool)"(
      _lock: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;

    getRewardFor(
      _account: string,
      _lock: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "getRewardFor(address,bool)"(
      _account: string,
      _lock: boolean,
      overrides?: Overrides
    ): Promise<BigNumber>;

    gov(overrides?: CallOverrides): Promise<BigNumber>;

    "gov()"(overrides?: CallOverrides): Promise<BigNumber>;

    historicalRewards(overrides?: CallOverrides): Promise<BigNumber>;

    "historicalRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

    lastTimeRewardApplicable(overrides?: CallOverrides): Promise<BigNumber>;

    "lastTimeRewardApplicable()"(overrides?: CallOverrides): Promise<BigNumber>;

    lastUpdateTime(overrides?: CallOverrides): Promise<BigNumber>;

    "lastUpdateTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    periodFinish(overrides?: CallOverrides): Promise<BigNumber>;

    "periodFinish()"(overrides?: CallOverrides): Promise<BigNumber>;

    queueNewRewards(
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "queueNewRewards(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    queuedRewards(overrides?: CallOverrides): Promise<BigNumber>;

    "queuedRewards()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerToken(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardPerToken()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardPerTokenStored()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardRate(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardRate()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewardToken(overrides?: CallOverrides): Promise<BigNumber>;

    "rewardToken()"(overrides?: CallOverrides): Promise<BigNumber>;

    rewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "rewards(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setGov(_gov: string, overrides?: Overrides): Promise<BigNumber>;

    "setGov(address)"(_gov: string, overrides?: Overrides): Promise<BigNumber>;

    sweep(_token: string, overrides?: Overrides): Promise<BigNumber>;

    "sweep(address)"(_token: string, overrides?: Overrides): Promise<BigNumber>;

    updateReward(_account: string, overrides?: Overrides): Promise<BigNumber>;

    "updateReward(address)"(
      _account: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    userRewardPerTokenPaid(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "userRewardPerTokenPaid(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    veToken(overrides?: CallOverrides): Promise<BigNumber>;

    "veToken()"(overrides?: CallOverrides): Promise<BigNumber>;

    whitelist(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "whitelist(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DURATION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "DURATION()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addToWhitelist(
      _addr: string,
      _isWhitelist: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "addToWhitelist(address,bool)"(
      _addr: string,
      _isWhitelist: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    currentRewards(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "currentRewards()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    donate(
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "donate(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    earned(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "earned(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getReward()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    "getReward(bool)"(
      _lock: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    getRewardFor(
      _account: string,
      _lock: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "getRewardFor(address,bool)"(
      _account: string,
      _lock: boolean,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    gov(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "gov()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    historicalRewards(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "historicalRewards()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lastTimeRewardApplicable(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "lastTimeRewardApplicable()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lastUpdateTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "lastUpdateTime()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    periodFinish(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "periodFinish()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    queueNewRewards(
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "queueNewRewards(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    queuedRewards(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "queuedRewards()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardPerToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "rewardPerToken()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardPerTokenStored(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "rewardPerTokenStored()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "rewardRate()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "rewardToken()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "rewards(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setGov(_gov: string, overrides?: Overrides): Promise<PopulatedTransaction>;

    "setGov(address)"(
      _gov: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    sweep(_token: string, overrides?: Overrides): Promise<PopulatedTransaction>;

    "sweep(address)"(
      _token: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    updateReward(
      _account: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "updateReward(address)"(
      _account: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    userRewardPerTokenPaid(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "userRewardPerTokenPaid(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    veToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "veToken()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    whitelist(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "whitelist(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}