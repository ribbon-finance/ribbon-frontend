import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { AnimatePresence, motion } from "framer";

import {
  getAssets,
  VaultAddressMap,
  VaultAllowedDepositAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { getVaultColor } from "shared/lib/utils/vault";
import { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { ERC20Token } from "shared/lib/models/eth";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
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
  padding: 8px;
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

interface VaultApprovalFormProps {
  vaultOption: VaultOptions;
  version: VaultVersion;
  showDepositAssetSwap?: boolean;
}

const VaultApprovalForm: React.FC<VaultApprovalFormProps> = ({
  vaultOption,
  version,
  showDepositAssetSwap = false,
}) => {
  const { vaultActionForm, handleDepositAssetChange } =
    useVaultActionForm(vaultOption);
  const asset = getAssets(vaultOption);
  const color = getVaultColor(vaultOption);
  const [depositAssetMenuOpen, setDepositAssetMenuOpen] = useState(false);

  const { library } = useWeb3React();
  const { provider } = useWeb3Context();
  const { addPendingTransaction } = usePendingTransactions();

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
    if (depositAsset === "WETH") {
      return;
    }

    return getERC20Token(library, depositAsset.toLowerCase() as ERC20Token);
  }, [depositAsset, library]);

  const [waitingApproval, setWaitingApproval] = useState(false);
  const loadingText = useTextAnimation(waitingApproval, {
    texts: ["Approving", "Approving .", "Approving ..", "Approving ..."],
    interval: 250,
  });

  const handleApproveToken = useCallback(async () => {
    setWaitingApproval(true);
    if (tokenContract) {
      const amount =
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

      try {
        const tx = await tokenContract.approve(
          VaultAddressMap[vaultOption][version],
          amount
        );

        const txhash = tx.hash;

        addPendingTransaction({
          txhash,
          type: "approval",
          amount: amount,
          vault: vaultOption,
        });

        // Wait for transaction to be approved
        await provider.waitForTransaction(txhash, 5);
      } catch (err) {
      } finally {
        setWaitingApproval(false);
      }
    }
  }, [addPendingTransaction, provider, tokenContract, vaultOption, version]);

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
        to="https://ribbon.finance/faq"
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

export default VaultApprovalForm;
