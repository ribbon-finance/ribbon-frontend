import {
  Multicall,
  ContractCallContext,
  ContractCallResults,
} from "ethereum-multicall";
import { BigNumber } from "ethers";
import { useWeb3Context } from "./web3Context";
import deployments from "../constants/deployments.json";
import RibbonCoveredCallABI from "../constants/abis/RibbonCoveredCall.json";
import { useCallback, useEffect, useState } from "react";
import { getDefaultNetworkName } from "../utils/env";
import { VaultDataResponse } from "../pages/DepositPage/types";
import { useWeb3React } from "@web3-react/core";

type ContractCallRequest = {
  reference: string;
  methodName: string;
  methodParameters: string[];
};

type UseVaultData = () => VaultDataResponse;

const useVaultData: UseVaultData = () => {
  const { active: walletConnected, account } = useWeb3React();
  const { provider: ethersProvider } = useWeb3Context();
  const [response, setResponse] = useState<VaultDataResponse>({
    status: "loading",
  });

  const doMulticall = useCallback(async () => {
    const networkName = getDefaultNetworkName();

    const deployment = deployments[networkName];
    const vaultAddress = deployment.RibbonETHCoveredCall;

    if (ethersProvider) {
      const multicall = new Multicall({ ethersProvider });

      const unconnectedCalls: ContractCallRequest[] = [
        { reference: "cap", methodName: "cap", methodParameters: [] },
        {
          reference: "totalBalance",
          methodName: "totalBalance",
          methodParameters: [],
        },
      ];

      const connectedCalls: ContractCallRequest[] =
        account !== undefined && account !== null
          ? [
              {
                reference: "shareBalance",
                methodName: "balanceOf",
                methodParameters: [account],
              },
            ]
          : [];

      const contractCallContext = [
        {
          reference: "vaultCalls",
          contractAddress: vaultAddress,
          abi: RibbonCoveredCallABI,
          calls: unconnectedCalls.concat(connectedCalls),
        },
      ];

      const results = await multicall.call(contractCallContext);
      const { vaultCalls } = results.results;
      const [
        capReturn,
        totalBalanceReturn,
        shareBalanceReturn,
      ] = vaultCalls.callsReturnContext;

      const data = {
        deposits: BigNumber.from(totalBalanceReturn.returnValues[0]),
        vaultLimit: BigNumber.from(capReturn.returnValues[0]),
      };

      if (!walletConnected) {
        setResponse({
          status: "loaded_unconnected",
          data,
        });
        return;
      }

      setResponse({
        status: "loaded_connected",
        data: {
          ...data,
          shareBalance: BigNumber.from(shareBalanceReturn.returnValues[0]),
          assetBalance: BigNumber.from("0"),
        },
      });
    }
  }, [ethersProvider, walletConnected]);

  useEffect(() => {
    doMulticall();
  }, [doMulticall, walletConnected]);

  return response;
};

export default useVaultData;
