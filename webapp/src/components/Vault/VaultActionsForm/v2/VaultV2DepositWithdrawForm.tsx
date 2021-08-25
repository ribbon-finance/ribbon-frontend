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
import { isPracticallyZero } from "shared/lib/utils/math";
import VaultApprovalForm from "../common/VaultApprovalForm";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import theme from "shared/lib/designSystem/theme";
import SwapBTCDropdown from "../common/SwapBTCDropdown";

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

  const formContent = useMemo(() => {
    /**
     * Approval before deposit
     */
    if (showTokenApproval) {
      return <VaultApprovalForm vaultOption={vaultOption} version="v2" />;
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
    // }
  }, [showTokenApproval, vaultOption]);

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
        {swapContainerTrigger}
      </div>

      {swapContainer}
    </>
  );
};

export default VaultV2DepositWithdrawForm;
