import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import colors from "shared/lib/designSystem/colors";
import { VaultAddressMap, VaultOptions } from "shared/lib/constants/constants";
import { ACTIONS } from "../Modal/types";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import {
  BaseLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import useV2VaultData from "shared/lib/hooks/useV2VaultData";
import { ERC20Token } from "shared/lib/models/eth";
import { getVaultColor, isETHVault } from "shared/lib/utils/vault";
import { isPracticallyZero } from "shared/lib/utils/math";
import usePendingTransactions from "../../../../hooks/usePendingTransactions";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import { getAssetDisplay, getAssetLogo } from "shared/lib/utils/asset";
import { ActionButton } from "shared/lib/components/Common/buttons";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { getERC20Token } from "shared/lib/hooks/useERC20Token";

const FormTabContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-evenly;
  position: relative;

  &:before {
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    content: " ";
    background-color: ${colors.background};
    z-index: -1;
  }
`;

const FormTab = styled.div<{ active: boolean }>`
  width: 100%;
  padding: 24px 0;
  background-color: ${(props) =>
    props.active ? "rgb(28, 26, 25,0.95)" : "rgba(255,255,255,0.04)"};
  cursor: pointer;

  &:after {
    background-color: white;
  }

  &:first-child {
    border-top-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const FormTabTitle = styled(Title)<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 24px;
  text-transform: uppercase;
  color: ${(props) => (props.active ? "#f3f3f3" : "rgba(255, 255, 255, 0.64)")};
`;

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

interface VaultV2DepositWithdrawFormProps {
  vaultOption: VaultOptions;
  onFormSubmit: () => void;
}

const VaultV2DepositWithdrawForm: React.FC<VaultV2DepositWithdrawFormProps> = ({
  vaultOption,
  onFormSubmit,
}) => {
  /**
   * Primary hooks
   */
  const {
    canTransfer,
    handleActionTypeChange,
    handleInputChange,
    handleMaxClick,
    transferData,
    vaultActionForm,
  } = useVaultActionForm(vaultOption);
  const {
    data: { asset, decimals },
    loading,
  } = useV2VaultData(vaultOption);
  const { library } = useWeb3React();
  const { provider } = useWeb3Context();

  /**
   * Side hooks
   */
  const color = getVaultColor(vaultOption);
  const tokenAllowance = useTokenAllowance(
    isETHVault(vaultOption) ? undefined : (asset.toLowerCase() as ERC20Token),
    VaultAddressMap[vaultOption].v2
  );
  const tokenContract = useMemo(() => {
    if (isETHVault(vaultOption)) {
      return;
    }

    return getERC20Token(library, asset.toLowerCase() as ERC20Token);
  }, [vaultOption, asset, library]);
  const [, setPendingTransactions] = usePendingTransactions();

  /**
   * Page state
   */
  const [waitingApproval, setWaitingApproval] = useState(false);
  const loadingText = useTextAnimation(
    waitingApproval
      ? ["Approving", "Approving .", "Approving ..", "Approving ..."]
      : undefined,
    250,
    loading || waitingApproval
  );

  /**
   * Check if approval needed
   */
  const showTokenApproval = useMemo(() => {
    if (vaultActionForm.actionType === ACTIONS.deposit) {
      return (
        !isETHVault(vaultOption) &&
        tokenAllowance &&
        isPracticallyZero(tokenAllowance, decimals)
      );
    }

    return false;
  }, [decimals, tokenAllowance, vaultActionForm.actionType, vaultOption]);

  const handleApproveToken = useCallback(async () => {
    setWaitingApproval(true);
    if (tokenContract) {
      const amount =
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

      try {
        const tx = await tokenContract.approve(
          VaultAddressMap[vaultOption].v2!,
          amount
        );

        const txhash = tx.hash;

        setPendingTransactions((pendingTransactions) => [
          ...pendingTransactions,
          {
            txhash,
            type: "approval",
            amount: amount,
            vault: vaultOption,
          },
        ]);

        // Wait for transaction to be approved
        await provider.waitForTransaction(txhash, 5);
      } catch (err) {
      } finally {
        setWaitingApproval(false);
      }
    }
  }, [provider, setPendingTransactions, tokenContract, vaultOption]);

  const formContent = useMemo(() => {
    /**
     * Approval before deposit
     */
    if (showTokenApproval) {
      const Logo = getAssetLogo(asset);
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
            {waitingApproval
              ? loadingText
              : `Approve ${getAssetDisplay(asset)}`}
          </ActionButton>
        </>
      );
    }

    // switch (vaultActionForm.actionType) {
    //   case ACTIONS.deposit:
    //   case ACTIONS.withdraw:
    //     return (
    //       <>
    //         <BaseInputLabel>AMOUNT ({getAssetDisplay(asset)})</BaseInputLabel>
    //         <BaseInputContainer className="position-relative mb-5">
    //           <BaseInput
    //             type="number"
    //             className="form-control"
    //             aria-label="ETH"
    //             placeholder="0"
    //             value={vaultActionForm.inputAmount}
    //             onChange={handleInputChange}
    //           />
    //           {connected && (
    //             <BaseInputButton onClick={handleMaxClick}>
    //               MAX
    //             </BaseInputButton>
    //           )}
    //         </BaseInputContainer>
    //         {renderButton(error)}
    //       </>
    //     );
    //   case ACTIONS.transfer:
    //     return (
    //       <VaultV1TransferForm
    //         vaultOption={vaultOption}
    //         receiveVault={vaultActionForm.receiveVault!}
    //         vaultAccount={vaultAccounts[vaultOption]}
    //         transferVaultData={{
    //           maxWithdrawAmount,
    //           vaultMaxWithdrawAmount,
    //         }}
    //         transferData={transferData}
    //         inputAmount={vaultActionForm.inputAmount}
    //         handleInputChange={handleInputChange}
    //         handleMaxClick={handleMaxClick}
    //         renderActionButton={renderButton}
    //       />
    //     );
    // }
  }, [
    asset,
    color,
    handleApproveToken,
    loadingText,
    showTokenApproval,
    waitingApproval,
  ]);

  return (
    <>
      <FormTabContainer>
        <FormTab
          active={vaultActionForm.actionType === ACTIONS.deposit}
          onClick={() => handleActionTypeChange(ACTIONS.deposit)}
        >
          <FormTabTitle active={vaultActionForm.actionType === ACTIONS.deposit}>
            Deposit
          </FormTabTitle>
        </FormTab>
        <FormTab
          active={vaultActionForm.actionType === ACTIONS.withdraw}
          onClick={() => handleActionTypeChange(ACTIONS.withdraw)}
        >
          <FormTabTitle
            active={vaultActionForm.actionType === ACTIONS.withdraw}
          >
            Withdraw
          </FormTabTitle>
        </FormTab>
      </FormTabContainer>

      <div className="d-flex flex-column align-items-center p-4">
        {formContent}
      </div>
    </>
  );
};

export default VaultV2DepositWithdrawForm;
