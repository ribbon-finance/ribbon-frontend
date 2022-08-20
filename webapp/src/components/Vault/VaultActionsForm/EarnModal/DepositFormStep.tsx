import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";

import {
  SecondaryText,
  Title,
  PrimaryText,
  BaseInputLabel,
  BaseInputContainer,
  BaseInput,
  BaseInputButton,
} from "shared/lib/designSystem";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { ActionType } from "./types";
import { formatBigNumber } from "shared/lib/utils/math";
import { getAssetDisplay } from "shared/lib/utils/asset";
import { Assets } from "shared/lib/store/types";
import {
  VaultOptions,
  VaultVersion,
  VaultMaxDeposit,
} from "shared/lib/constants/constants";
import { getVaultColor } from "shared/lib/utils/vault";
import { DepositIcon } from "shared/lib/assets/icons/icons";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  useAssetBalance,
  useV2VaultData,
} from "shared/lib/hooks/web3DataContext";
import { parseUnits } from "ethers/lib/utils";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import currency from "currency.js";
import moment from "moment";

const ActionLogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 100px;
  background: ${(props) => props.color}14;
`;

const StyledBaseInputLabel = styled(BaseInputLabel)`
  margin-top: 24px;
  width: 100%;
`;

const FormTitle = styled(Title)`
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
`;

const StyledTitle = styled(Title)<{ color?: string }>`
  color: ${(props) => props.color};
`;

const WarningContainer = styled.div<{ color: string }>`
  padding: 8px;
  background: ${(props) => props.color}14;
  border-radius: ${theme.border.radiusSmall};
`;

const DepositFormStep: React.FC<{
  onClickUpdateInput: (amount: number) => void;
  actionType: ActionType;
  onClickConfirmButton: () => Promise<void>;
  asset: Assets;
  vaultOption: VaultOptions;
  vaultVersion: VaultVersion;
}> = ({
  onClickUpdateInput,
  actionType,
  onClickConfirmButton,
  asset,
  vaultOption,
  vaultVersion,
}) => {
  const color = getVaultColor(vaultOption);
  const {
    data: {
      cap,
      decimals,
      depositBalanceInAsset,
      lockedBalanceInAsset,
      totalBalance,
    },
    loading,
  } = useV2VaultData(vaultOption);

  const [inputAmount, changeInputAmount] = useState<number>(0);
  const { balance: userAssetBalance } = useAssetBalance(asset);
  const vaultBalanceInAsset = depositBalanceInAsset.add(lockedBalanceInAsset);
  const { active } = useWeb3Wallet();
  const vaultMaxDepositAmount = VaultMaxDeposit[vaultOption];
  const { vaultAccounts } = useVaultAccounts(vaultVersion);
  const vaultAccount = vaultAccounts["rEARN"];

  const isInputNonZero = useMemo((): boolean => {
    return inputAmount > 0;
  }, [inputAmount]);

  const error = useMemo((): string | undefined => {
    try {
      /** Check block with input requirement */
      if (isInputNonZero && !loading && active) {
        const amountBigNumber = parseUnits(inputAmount.toString(), decimals);

        if (amountBigNumber.gt(userAssetBalance)) {
          return "insufficientBalance";
        }

        if (
          amountBigNumber.gt(vaultMaxDepositAmount.sub(vaultBalanceInAsset))
        ) {
          return "maxExceeded";
        }

        if (amountBigNumber.gt(cap.sub(totalBalance))) {
          return "capacityOverflow";
        }
      }
    } catch (err) {
      // Assume no error because empty input unable to parse
    }

    return undefined;
  }, [
    active,
    cap,
    decimals,
    inputAmount,
    isInputNonZero,
    loading,
    totalBalance,
    userAssetBalance,
    vaultBalanceInAsset,
    vaultMaxDepositAmount,
  ]);

  const isButtonDisabled = useMemo((): boolean => {
    return error ? true : !isInputNonZero;
  }, [error, isInputNonZero]);

  const investedInStrategy = useMemo(() => {
    if (!vaultAccount) {
      return BigNumber.from(0.0);
    }
    return vaultAccount.totalBalance.sub(vaultAccount.totalPendingDeposit);
  }, [vaultAccount]);

  interface Tooltip {
    title: string;
    explanation: string;
  }
  interface ActionDetail {
    key: string;
    value: string;
    error?: string;
    tooltip?: Tooltip;
  }

  const renderErrorText = useCallback((_error: string) => {
    switch (_error) {
      case "insufficientBalance":
        return "Insufficient balance";
      case "maxExceeded":
        break;
      case "capacityOverflow":
        return "Insufficient vault capacity";
      default:
        return "";
    }
  }, []);

  const [toDepositTime, withdrawalDate] = useMemo(() => {
    let firstOpenLoanTime = moment.utc("2022-09-02").set("hour", 17);

    let toDepositTime;

    while (!toDepositTime) {
      let toDepositTimeTemp = moment.duration(
        firstOpenLoanTime.diff(moment()),
        "milliseconds"
      );
      if (toDepositTimeTemp.asMilliseconds() <= 0) {
        firstOpenLoanTime.add(28, "days");
      } else {
        toDepositTime = toDepositTimeTemp;
      }
    }

    return [
      `${toDepositTime.days()}D ${toDepositTime.hours()}H ${toDepositTime.minutes()}M`,
      firstOpenLoanTime.add(28, "days").format("Do MMMM, YYYY"),
    ];
  }, []);

  const detailRows: ActionDetail[] = useMemo(() => {
    const actionDetails: ActionDetail[] = [];

    actionDetails.push({
      key: "Current Position",
      value: `${currency(formatBigNumber(investedInStrategy, decimals), {
        symbol: "",
      })} USDC`,
      tooltip: {
        title: "Current Position",
        explanation: "Something Something current position",
      },
    });

    actionDetails.push({
      key: "Wallet Balance",
      value: `${currency(formatBigNumber(userAssetBalance, decimals), {
        symbol: "",
      }).format()} USDC`,
      error: "insufficientBalance",
    });

    actionDetails.push({
      key: "Vault Capacity",
      value: `${currency(formatBigNumber(cap.sub(totalBalance), decimals), {
        symbol: "",
      }).format()} USDC`,
      error: "capacityOverflow",
      tooltip: {
        title: "Vault Capacity",
        explanation: "Something Something current position",
      },
    });

    actionDetails.push({
      key: "Deposit Time",
      value: `${toDepositTime}`,
      tooltip: {
        title: "Deposit Time",
        explanation: "Something Something current position",
      },
    });

    return actionDetails;
  }, [
    investedInStrategy,
    decimals,
    userAssetBalance,
    cap,
    totalBalance,
    toDepositTime,
  ]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      changeInputAmount(parseFloat(parseFloat(rawInput).toFixed(6)));
    },
    []
  );
  const handleMaxClick = useCallback(() => {
    changeInputAmount(
      parseFloat(formatBigNumber(userAssetBalance, decimals, 6))
    );
  }, [userAssetBalance, decimals]);

  /**
   * IMPORTANT
   * Do note over here that the fallthrough case currently will only allow V1 withdraw and v2 instant withdraw to fall through.
   * Exercise great caution when introducing further fallthrough to avoid unintended consequences.
   */
  // eslint-disable-next-line no-fallthrough
  let actionLogo = <></>;
  let warning = <></>;

  actionLogo = <DepositIcon color={color} width={32} />;

  warning = (
    <WarningContainer className="mt-2 mb-3 w-100 text-center" color={color}>
      <PrimaryText fontSize={14} lineHeight={20} color={color}>
        IMPORTANT: Your funds will be available for withdrawal at 5pm UTC on{" "}
        {withdrawalDate}
      </PrimaryText>
    </WarningContainer>
  );
  const handleConfirm = () => {
    onClickConfirmButton();
    onClickUpdateInput(inputAmount);
  };
  return (
    <div className="d-flex flex-column align-items-center">
      {/* Logo */}
      <ActionLogoContainer color={color}>{actionLogo}</ActionLogoContainer>

      {/* Title */}
      <FormTitle className="mt-3 text-center">DEPOSIT</FormTitle>
      <StyledBaseInputLabel>
        AMOUNT ({getAssetDisplay(asset)})
      </StyledBaseInputLabel>
      <BaseInputContainer className="mb-2" error={error ? true : false}>
        <BaseInput
          type="number"
          className="form-control"
          aria-label="USDC"
          placeholder="0"
          value={inputAmount}
          onChange={handleInputChange}
          inputWidth={"80%"}
        />
        {/* {renderDepositAssetButton} */}
        {active && (
          <BaseInputButton onClick={handleMaxClick}>MAX</BaseInputButton>
        )}
      </BaseInputContainer>
      {error && (
        <SecondaryText style={{ width: "100%" }} color={colors.red}>
          {renderErrorText(error)}
        </SecondaryText>
      )}
      {detailRows.map((detail, index) => (
        <div
          className="d-flex w-100 flex-row align-items-center justify-content-between mt-4"
          key={index}
        >
          <div className="d-flex flex-row align-items-center">
            <SecondaryText>{detail.key} </SecondaryText>
            {detail.tooltip && (
              <TooltipExplanation
                title={detail.tooltip.title}
                explanation={detail.tooltip.explanation}
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo
                    containerRef={ref}
                    {...triggerHandler}
                    style={{ marginLeft: "4px" }}
                  >
                    i
                  </HelpInfo>
                )}
              />
            )}
          </div>

          <StyledTitle
            color={
              error && detail.error
                ? error === detail.error
                  ? colors.red
                  : colors.primaryText
                : colors.primaryText
            }
            className="text-right"
          >
            {detail.value}
          </StyledTitle>
        </div>
      ))}
      <div style={{ height: 40 }}> </div>
      <ActionButton
        onClick={handleConfirm}
        disabled={isButtonDisabled}
        className="btn py-3 mt-2 mb-2"
        color={color}
      >
        Next
      </ActionButton>

      {warning}
    </div>
  );
};

export default DepositFormStep;
