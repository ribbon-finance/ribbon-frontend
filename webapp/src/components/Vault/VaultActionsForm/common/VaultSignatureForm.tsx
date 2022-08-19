import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";
import { AnimatePresence, motion } from "framer";

import {
  getAssets,
  isNativeToken,
  VaultAddressMap,
  VaultAllowedDepositAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { getVaultColor } from "shared/lib/utils/vault";
import useERC20Token, { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { ERC20Token } from "shared/lib/models/eth";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import {
  BaseLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { ActionButton } from "shared/lib/components/Common/buttons";
import {
  getAssetColor,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import theme from "shared/lib/designSystem/theme";
import { ISignature, splitSignature } from "./signing";
import { setTokenSourceMapRange } from "typescript";

const ApprovalIconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
`;

const ApprovalIcon = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background-color: ${(props) => props.color}29;
`;

const DepositAssetSwitchContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background: ${colors.background.three};
  border-radius: 100px;
  padding: 8px;
`;

const DepositAssetSwitchContainerLogo = styled.div<{
  color: string;
}>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;
  border-radius: 100px;
  background: ${colors.background.one};

  &:before {
    position: absolute;
    content: " ";
    width: 100%;
    height: 100%;
    background: ${(props) => `${props.color}14`};
    border-radius: 100px;
  }
`;

const DepositAssetsSwitchDropdown = styled(motion.div)<{
  isOpen: boolean;
}>`
  ${(props) =>
    props.isOpen
      ? `
          position: absolute;
          z-index: 2000;
          padding: 8px;

          width: fit-content;
          background-color: ${colors.background.three};
          border-radius: ${theme.border.radius};
          top: 72px;
        `
      : `
          display: none;
        `}
`;

const DepositAssetsSwitchDropdownItem = styled.div<{
  color: string;
  active: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 8px;
  opacity: 0.48;
  border-radius: 100px;
  background: ${(props) => `${props.color}14`};
  margin-bottom: 8px;
  border: ${theme.border.width} ${theme.border.style} transparent;
  transition: border 150ms;

  &:last-child {
    margin-bottom: 0px;
  }

  ${(props) => {
    if (props.active) {
      return `
        opacity: 1;
        border: ${theme.border.width} ${theme.border.style} ${props.color};
      `;
    }
    return `
      &:hover {
        opacity: 1;
      }
    `;
  }}
`;

const ApprovalDescription = styled(PrimaryText)`
  display: block;
  text-align: center;
  margin-bottom: 16px;
`;

const ApprovalHelp = styled(BaseLink)`
  display: flex;
  justify-content: center;
  text-decoration: underline ${colors.text};
  margin-bottom: 40px;

  &:hover {
    text-decoration: underline ${colors.text}A3;

    span {
      color: ${colors.text}A3;
    }
  }
`;

interface VaultSignatureFormProps {
  vaultOption: VaultOptions;
  version: VaultVersion;
  showDepositAssetSwap?: boolean;
  onSignatureMade: (signature: ISignature) => void;
  onSignComplete: () => Promise<void>;
  onSetDeadline: (deadline: number) => void;
}

const VaultSignatureForm: React.FC<VaultSignatureFormProps> = ({
  vaultOption,
  version,
  showDepositAssetSwap = false,
  onSignatureMade,
  onSignComplete,
  onSetDeadline,
}) => {
  const { vaultActionForm, handleDepositAssetChange } =
    useVaultActionForm(vaultOption);
  const asset = getAssets(vaultOption);
  const color = getVaultColor(vaultOption);
  const [depositAssetMenuOpen, setDepositAssetMenuOpen] = useState(false);

  const { chainId, ethereumProvider, account } = useWeb3Wallet();
  const { provider } = useWeb3Context();
  const { addPendingTransaction } = usePendingTransactions();

  const EIP2612_TYPE = [
    { name: "owner", type: "address" },
    { name: "spender", type: "address" },
    { name: "value", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ];

  const EIP712_DOMAIN_TYPE = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ];

  const depositAsset = useMemo(() => {
    switch (version) {
      case "v1":
        return asset;
      default:
        return (
          vaultActionForm.depositAsset ||
          VaultAllowedDepositAssets[vaultOption][0]
        );
    }
  }, [asset, vaultActionForm.depositAsset, vaultOption, version]);
  const Logo = getAssetLogo(depositAsset);

  const tokenContract = useMemo(() => {
    if (!chainId) {
      return;
    }

    return getERC20Token(
      ethereumProvider,
      depositAsset.toLowerCase() as ERC20Token,
      chainId
    );
  }, [chainId, depositAsset, ethereumProvider]);

  const showApproveUSDCSignature = useCallback(
    async (spender: string, deadline: string) => {
      if (!account || !tokenContract || !ethereumProvider) {
        return;
      }

      const domain = {
        name: "USD Coin",
        version: "2",
        verifyingContract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        chainId,
      };

      const approveMessage = {
        owner: account,
        spender,
        value: "1000000",
        nonce: (await tokenContract.nonces(account)).toNumber(),
        deadline,
      };

      console.log(domain);
      console.log(approveMessage);
      console.log({
        types: {
          EIP712Domain: EIP712_DOMAIN_TYPE,
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        domain,
        primaryType: "Permit",
        approveMessage,
      });

      // const permitInfo = { type: PermitType.AMOUNT, name: 'USD Coin', version: '2' },
      const data = JSON.stringify({
        types: {
          EIP712Domain: EIP712_DOMAIN_TYPE,
          Permit: EIP2612_TYPE,
        },
        domain,
        primaryType: "Permit",
        message: approveMessage,
      });

      console.log("reached");
      console.log({ data });
      const approveUSDCSignature = await ethereumProvider.send(
        "eth_signTypedData_v4",
        [account, data]
      );

      // const approveUSDCSignature = await ethereumProvider
      //   .getSigner()
      //   ._signTypedData(domain, { Permit: EIP2612_TYPE }, approveMessage);

      if (approveUSDCSignature) {
        const splitted = splitSignature(approveUSDCSignature);
        return splitted;
      }
      return undefined;
    },
    [account, chainId, tokenContract, provider]
  );

  const [waitingApproval, setWaitingApproval] = useState(false);
  const loadingText = useLoadingText("Approving");

  const handleApproveToken = useCallback(async () => {
    const approveToAddress = VaultAddressMap[vaultOption][version];
    if (tokenContract && approveToAddress) {
      setWaitingApproval(true);

      try {
        const deadline = Math.round(Date.now() / 1000 + 60 * 60).toString();
        const signature = await showApproveUSDCSignature(
          approveToAddress,
          deadline
        );
        if (signature) {
          onSignatureMade(signature);
          onSignComplete();
          onSetDeadline(parseInt(deadline));
        }
        //   const tx = await tokenContract.approve(approveToAddress, amount);

        //   const txhash = tx.hash;

        //   addPendingTransaction({
        //     txhash,
        //     type: "approval",
        //     amount: amount,
        //     vault: vaultOption,
        //     asset: depositAsset,
        //   });

        //   // Wait for transaction to be approved
        //   await provider.waitForTransaction(txhash, 2);
        // } catch (err) {
      } finally {
        setWaitingApproval(false);
      }
    }
  }, [
    addPendingTransaction,
    depositAsset,
    provider,
    tokenContract,
    vaultOption,
    version,
  ]);

  return (
    <>
      <ApprovalIconContainer>
        {showDepositAssetSwap ? (
          <DepositAssetSwitchContainer
            role="button"
            onClick={() => setDepositAssetMenuOpen((show) => !show)}
          >
            <DepositAssetSwitchContainerLogo color={color}>
              <Logo height={40} width={40} />
            </DepositAssetSwitchContainerLogo>
            <Title className="mx-2">{getAssetDisplay(depositAsset)}</Title>
            <ButtonArrow
              isOpen={depositAssetMenuOpen}
              className="mr-2"
              color={colors.primaryText}
            />
            <AnimatePresence>
              <DepositAssetsSwitchDropdown
                key={depositAssetMenuOpen.toString()}
                isOpen={depositAssetMenuOpen}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                }}
                transition={{
                  type: "keyframes",
                  duration: 0.2,
                }}
              >
                {VaultAllowedDepositAssets[vaultOption].map((assetOption) => {
                  const Logo = getAssetLogo(assetOption);
                  return (
                    <DepositAssetsSwitchDropdownItem
                      color={getAssetColor(assetOption)}
                      active={assetOption === depositAsset}
                      onClick={() => handleDepositAssetChange(assetOption)}
                    >
                      <DepositAssetSwitchContainerLogo
                        color={getAssetColor(assetOption)}
                      >
                        <Logo height={40} width={40} />
                      </DepositAssetSwitchContainerLogo>
                      <Title className="ml-2 mr-4">
                        {getAssetDisplay(assetOption)}
                      </Title>
                    </DepositAssetsSwitchDropdownItem>
                  );
                })}
              </DepositAssetsSwitchDropdown>
            </AnimatePresence>
          </DepositAssetSwitchContainer>
        ) : (
          <ApprovalIcon color={color}>
            <Logo />
          </ApprovalIcon>
        )}
      </ApprovalIconContainer>
      <ApprovalDescription>
        Before you deposit, the vault needs your permission to invest your{" "}
        {getAssetDisplay(depositAsset)} in the vault’s strategy.
      </ApprovalDescription>
      <ApprovalHelp
        to="https://docs.ribbon.finance/faq"
        target="__blank"
        rel="noreferrer noopener"
      >
        <SecondaryText>Why do I have to do this?</SecondaryText>
      </ApprovalHelp>
      <ActionButton
        onClick={handleApproveToken}
        className="py-3 mb-4"
        color={color}
      >
        {waitingApproval
          ? loadingText
          : `Approve ${getAssetDisplay(depositAsset)}`}
      </ActionButton>
    </>
  );
};

export default VaultSignatureForm;
