import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import {
  getAssets,
  VaultAddressMap,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { getVaultColor, isETHVault } from "shared/lib/utils/vault";
import { getERC20Token } from "shared/lib/hooks/useERC20Token";
import { ERC20Token } from "shared/lib/models/eth";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { BaseLink, PrimaryText, SecondaryText } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { getAssetDisplay, getAssetLogo } from "shared/lib/utils/asset";

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
}

const VaultApprovalForm: React.FC<VaultApprovalFormProps> = ({
  vaultOption,
  version,
}) => {
  const asset = getAssets(vaultOption);
  const Logo = getAssetLogo(asset);
  const color = getVaultColor(vaultOption);

  const { library } = useWeb3React();
  const { provider } = useWeb3Context();
  const { addPendingTransaction } = usePendingTransactions();

  const tokenContract = useMemo(() => {
    if (isETHVault(vaultOption)) {
      return;
    }

    return getERC20Token(library, asset.toLowerCase() as ERC20Token);
  }, [vaultOption, asset, library]);

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
        <ApprovalIcon color={color}>
          <Logo />
        </ApprovalIcon>
      </ApprovalIconContainer>
      <ApprovalDescription>
        Before you deposit, the vault needs your permission to invest your{" "}
        {getAssetDisplay(asset)} in the vault’s strategy.
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
        {waitingApproval ? loadingText : `Approve ${getAssetDisplay(asset)}`}
      </ActionButton>
    </>
  );
};

export default VaultApprovalForm;
