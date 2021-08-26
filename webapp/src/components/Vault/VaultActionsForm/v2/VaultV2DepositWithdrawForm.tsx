import React, { useMemo, useState } from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import { VaultAddressMap, VaultOptions } from "shared/lib/constants/constants";
import { ACTIONS } from "../Modal/types";
import useVaultActionForm from "../../../../hooks/useVaultActionForm";
import { SecondaryText, Title } from "shared/lib/designSystem";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import useV2VaultData from "shared/lib/hooks/useV2VaultData";
import { ERC20Token } from "shared/lib/models/eth";
import { isETHVault } from "shared/lib/utils/vault";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import VaultApprovalForm from "../common/VaultApprovalForm";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import theme from "shared/lib/designSystem/theme";
import SwapBTCDropdown from "../common/SwapBTCDropdown";
import VaultBasicAmountForm from "../common/VaultBasicAmountForm";
import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { getAssetDisplay } from "shared/lib/utils/asset";

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

const FormInfoText = styled(Title)`
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  color: ${colors.text};
`;

const SwapTriggerContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SwapTriggerButton = styled.div`
  margin-top: 24px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 100px;
  padding: 8px 16px;
  width: 300px;
  display: flex;
  align-items: center;
`;

const SwapTriggerButtonText = styled(SecondaryText)`
  flex: 1;
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
  const { handleActionTypeChange, vaultActionForm } =
    useVaultActionForm(vaultOption);
  const {
    data: { asset, decimals, userAssetBalance },
    loading,
  } = useV2VaultData(vaultOption);
  const { active } = useWeb3React();

  /**
   * Side hooks
   */
  const tokenAllowance = useTokenAllowance(
    isETHVault(vaultOption) ? undefined : (asset.toLowerCase() as ERC20Token),
    VaultAddressMap[vaultOption].v2
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
  const [swapContainerOpen, setSwapContainerOpen] = useState(false);

  /**
   * Default action to deposit
   */
  useEffect(() => {
    handleActionTypeChange(ACTIONS.deposit, "v2");
  }, [handleActionTypeChange]);

  const formContent = useMemo(() => {
    /**
     * Approval before deposit
     */
    if (showTokenApproval) {
      return <VaultApprovalForm vaultOption={vaultOption} version="v2" />;
    }

    switch (vaultActionForm.actionType) {
      case ACTIONS.deposit:
        return (
          // TODO: Action Text
          <VaultBasicAmountForm
            vaultOption={vaultOption}
            error={false}
            onFormSubmit={onFormSubmit}
            actionButtonText={"Deposit"}
          />
        );
    }
  }, [
    onFormSubmit,
    showTokenApproval,
    vaultActionForm.actionType,
    vaultOption,
  ]);

  const formInfoText = useMemo(() => {
    //  switch (error) {
    //    case "vaultFull":
    //      return "The Vault is currently full";
    //    case "maxDeposited":
    //      return `This vault has a max deposit of ${parseInt(
    //        formatUnits(vaultMaxDepositAmount, decimals)
    //      ).toLocaleString()} ${getAssetDisplay(asset)} per depositor`;
    //    case "allBalanceStaked":
    //      return `You have staked all your ${vaultOption} tokens. You must unstake your ${vaultOption} tokens before you can withdraw from the vault.`;
    //    case "withdraw_limit_reached":
    //      return `The vault’s weekly withdrawal limit has been reached. Withdrawals
    //       will be enabled again at 1000 UTC on ${withdrawalFreeUpTime}.`;
    //    case "withdraw_limit_exceeded":
    //      return (
    //        <>
    //          Weekly Withdraw Limit:{" "}
    //          {formatBigNumber(maxWithdrawAmount, 6, decimals)}{" "}
    //          {getAssetDisplay(asset)}
    //          <TooltipExplanation
    //            title="WEEKLY WITHDRAWAL LIMIT"
    //            explanation={`Withdrawing ${formatBigNumber(
    //              maxWithdrawAmount,
    //              6,
    //              decimals
    //            )} ${getAssetDisplay(
    //              asset
    //            )} will result in the vault hitting its weekly withdrawal limit. If the withdrawal limit is reached, withdrawals will be disabled until ${withdrawalFreeUpTime}.`}
    //            renderContent={({ ref, ...triggerHandler }) => (
    //              <HelpInfo containerRef={ref} {...triggerHandler}>
    //                ?
    //              </HelpInfo>
    //            )}
    //          />
    //        </>
    //      );
    //    case "withdraw_amount_staked":
    //      return stakedAmountText;
    //  }

    if (!active || loading) {
      return <FormInfoText>---</FormInfoText>;
    }

    switch (vaultActionForm.actionType) {
      case ACTIONS.deposit:
        return (
          <FormInfoText>
            Wallet Balance: {formatBigNumber(userAssetBalance, 6, decimals)}{" "}
            {getAssetDisplay(asset)}
          </FormInfoText>
        );
      //  case ACTIONS.withdraw:
      //    const position = formatBigNumber(vaultBalanceInAsset, 6, decimals);

      //    /**
      //     * Condition to check withdraw is limited by staked
      //     * 1. Max withdraw amount must match total balance
      //     * 2. Staked amount is bigger than 0
      //     */
      //    if (
      //      vaultAccount &&
      //      vaultBalanceInAsset.eq(maxWithdrawAmount) &&
      //      !vaultAccount.totalStakedShares.isZero()
      //    ) {
      //      return stakedAmountText;
      //    }

      //    /**
      //     * Over here, we show unstaked position instead
      //     */
      //    if (vaultAccount && !vaultAccount.totalStakedShares.isZero()) {
      //      return (
      //        <>
      //          unstaked position: {position} {getAssetDisplay(asset)}
      //          <TooltipExplanation
      //            title="AVAILABLE TO WITHDRAW"
      //            explanation={
      //              <>
      //                You have staked{" "}
      //                {formatBigNumber(
      //                  vaultAccount.totalStakedBalance,
      //                  6,
      //                  decimals
      //                )}{" "}
      //                {vaultOption} tokens, leaving you with {position}{" "}
      //                {getAssetDisplay(asset)} unstaked balance.
      //                <br />
      //                <br />
      //                To increase the balance for withdrawal, you must unstake
      //                your {vaultOption} tokens from the staking pool.
      //              </>
      //            }
      //            renderContent={({ ref, ...triggerHandler }) => (
      //              <HelpInfo containerRef={ref} {...triggerHandler}>
      //                ?
      //              </HelpInfo>
      //            )}
      //          />
      //        </>
      //      );
      //    }

      //    return `Your Position: ${position} ${getAssetDisplay(asset)}`;
    }
  }, [
    active,
    asset,
    decimals,
    loading,
    userAssetBalance,
    vaultActionForm.actionType,
  ]);

  const swapContainerTrigger = useMemo(() => {
    switch (asset) {
      case "WBTC":
        return (
          <SwapTriggerContainer>
            <SwapTriggerButton
              role="button"
              onClick={() => setSwapContainerOpen((open) => !open)}
            >
              <SwapTriggerButtonText>
                Swap your BTC or renBTC for wBTC
              </SwapTriggerButtonText>
              <ButtonArrow
                isOpen={swapContainerOpen}
                color={colors.primaryText}
              />
            </SwapTriggerButton>
          </SwapTriggerContainer>
        );

      default:
        return <></>;
    }
  }, [asset, swapContainerOpen]);

  const swapContainer = useMemo(() => {
    switch (asset) {
      case "WBTC":
        return <SwapBTCDropdown open={swapContainerOpen} />;
      default:
        return <></>;
    }
  }, [asset, swapContainerOpen]);

  return (
    <>
      <FormTabContainer>
        <FormTab
          active={vaultActionForm.actionType === ACTIONS.deposit}
          onClick={() => handleActionTypeChange(ACTIONS.deposit, "v2")}
        >
          <FormTabTitle active={vaultActionForm.actionType === ACTIONS.deposit}>
            Deposit
          </FormTabTitle>
        </FormTab>
        <FormTab
          active={vaultActionForm.actionType === ACTIONS.withdraw}
          onClick={() => handleActionTypeChange(ACTIONS.withdraw, "v2")}
        >
          <FormTabTitle
            active={vaultActionForm.actionType === ACTIONS.withdraw}
          >
            Withdraw
          </FormTabTitle>
        </FormTab>
      </FormTabContainer>

      <div className="d-flex flex-column p-4">
        {formContent}
        {formInfoText}
        {swapContainerTrigger}
      </div>

      {swapContainer}
    </>
  );
};

export default VaultV2DepositWithdrawForm;
