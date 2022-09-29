import React, { useCallback, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { BigNumber } from "ethers";

import { SecondaryText, Title, PrimaryText } from "shared/lib/designSystem";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { ActionType, V2WithdrawOption } from "./types";
import { formatBigNumber } from "shared/lib/utils/math";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { Assets } from "shared/lib/store/types";
import {
  VaultOptions,
  VaultVersion,
  VaultAddressMap,
} from "shared/lib/constants/constants";
import { getVaultColor } from "shared/lib/utils/vault";
import { capitalize } from "shared/lib/utils/text";
import {
  DepositGlowIcon,
  WithdrawGlowIcon,
} from "shared/lib/assets/icons/icons";
import theme from "shared/lib/designSystem/theme";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import useUSDC, { DepositSignature } from "../../../../hooks/useUSDC";
import useEarnStrategyTime from "../../../../hooks/useEarnStrategyTime";
import { fadeIn } from "shared/lib/designSystem/keyframes";
import colors from "shared/lib/designSystem/colors";
import { useV2VaultData } from "shared/lib/hooks/web3DataContext";
import useVaultPriceHistory from "shared/lib/hooks/useVaultPerformanceUpdate";
import { parseUnits } from "ethers/lib/utils";

const Logo = styled.div<{ delay?: number; show?: boolean }>`
  margin-top: -40px;
  margin-bottom: -40px;

  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const InfoPreview = styled.div<{ delay?: number; show?: boolean }>`
  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const FormTitle = styled(Title)<{ delay?: number; show?: boolean }>`
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
  text-align: center;

  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const WarningContainer = styled.div<{
  color: string;
  delay?: number;
  show?: boolean;
}>`
  padding: 8px;
  background: ${(props) => props.color}14;
  border-radius: ${theme.border.radiusSmall};

  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const DetailRow = styled.div<{ delay?: number; show?: boolean }>`
  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const WithdrawalSteps = styled.div<{ delay?: number; show?: boolean }>`
  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;
        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const WithdrawalStepsCircle = styled.div<{ active: boolean; color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 32px;
  background: ${(props) => props.color}14;

  ${(props) =>
    props.active
      ? `
          border: ${theme.border.width} ${theme.border.style} ${props.color};
        `
      : ``}
`;

const WithdrawalStepsDividerLine = styled.div<{ color: string }>`
  width: 40px;
  height: 1px;
  background: ${(props) => props.color}3D;
  margin-top: calc((32px - 1px) / 2);
`;

const FormButton = styled(ActionButton)<{ delay?: number; show?: boolean }>`
  ${({ show, delay }) => {
    return (
      show &&
      css`
        opacity: 0;

        &:disabled {
          opacity: 0;
        }

        animation: ${fadeIn} 1s ease-in-out forwards;
        animation-delay: ${delay || 0}s;
      `
    );
  }}
`;

const PreviewStep: React.FC<{
  actionType: ActionType;
  amount: BigNumber;
  positionAmount: BigNumber;
  withdrawOption: V2WithdrawOption;
  onClickConfirmButton: () => Promise<void>;
  asset: Assets;
  vaultOption: VaultOptions;
  vaultVersion: VaultVersion;
  onSignatureMade: (signature: DepositSignature) => void;
  show: boolean;
}> = ({
  actionType,
  amount,
  withdrawOption,
  onClickConfirmButton,
  asset,
  vaultOption,
  onSignatureMade,
  show,
}) => {
  const color = getVaultColor(vaultOption);
  const usdc = useUSDC();
  const { strategyStartTime, withdrawalDate } = useEarnStrategyTime();
  const loadingText = useLoadingText("permitting");
  const [depositSignature, setDepositSignature] = useState<DepositSignature>();

  const {
    data: { decimals, withdrawals },
  } = useV2VaultData(vaultOption);

  const { priceHistory } = useVaultPriceHistory(vaultOption, "earn");

  const withdrawalAmount = useMemo(
    () =>
      withdrawals.shares
        .mul(
          priceHistory.find((history) => history.round === withdrawals.round)
            ?.pricePerShare || BigNumber.from(0)
        )
        .div(parseUnits("1", decimals)),
    [decimals, priceHistory, withdrawals.round, withdrawals.shares]
  );

  interface Tooltip {
    title: string;
    explanation: string;
  }
  interface ActionDetail {
    key: string;
    value: string;
    tooltip?: Tooltip;
  }

  const [waitingApproval, setWaitingApproval] = useState(false);

  const detailRows: ActionDetail[] = useMemo(() => {
    const actionDetails: ActionDetail[] = [];

    switch (actionType) {
      case "deposit":
        actionDetails.push({
          key: "Strategy Start Time",
          value: `${strategyStartTime}`,
          tooltip: {
            title: "Strategy Start Time",
            explanation:
              "Time until the next epoch is started and funds are deployed.",
          },
        });

        actionDetails.push({
          key: "Counterparty",
          value: "Ribbon Diversified",
          tooltip: {
            title: "Counterparty",
            explanation:
              "The counterparty selected will be the one to which the funds will be lent during the epoch.",
          },
        });
        break;
      case "withdraw":
        switch (withdrawOption) {
          case "standard":
            actionDetails.push({
              key: "Withdraw Time",
              value: `${withdrawalDate}`,
              tooltip: {
                title: "Withdraw Time",
                explanation:
                  "Time until the next epoch is started and funds are deployed.",
              },
            });
            break;
          case "instant":
            actionDetails.push({
              key: "Withdraw Time",
              value: "Immediate",
              tooltip: {
                title: "Withdraw Time",
                explanation:
                  "Time until the next epoch is started and funds are deployed.",
              },
            });
            break;
        }
        break;
    }

    return actionDetails;
  }, [actionType, strategyStartTime, withdrawOption, withdrawalDate]);

  const renderTitle = useCallback(() => {
    switch (actionType) {
      case "deposit":
        return "DEPOSIT PREVIEW";
      case "withdraw":
        if (withdrawOption !== "complete") {
          return actionType + " Preview";
        } else {
          return "COMPLETE WITHDRAWAL";
        }
    }
  }, [actionType, withdrawOption]);

  const renderWithdrawalSteps = useCallback(() => {
    if (withdrawOption === "instant") {
      return <></>;
    }

    return (
      <WithdrawalSteps
        delay={0.6 + detailRows.length * 0.1}
        show={show}
        className="d-flex justify-content-center mt-2"
      >
        <div className="d-flex flex-column align-items-center">
          <WithdrawalStepsCircle
            active={withdrawOption === "standard"}
            color={color}
          >
            <Title
              fontSize={14}
              lineHeight={20}
              color={
                withdrawOption === "standard" ? color : colors.quaternaryText
              }
            >
              1
            </Title>
          </WithdrawalStepsCircle>
          <PrimaryText
            fontSize={11}
            lineHeight={12}
            color={
              withdrawOption === "standard" ? color : colors.quaternaryText
            }
            className="mt-2 text-center"
            style={{ maxWidth: 60 }}
          >
            Initiate Withdrawal
          </PrimaryText>
        </div>
        <WithdrawalStepsDividerLine color={color} />
        <div className="d-flex flex-column align-items-center">
          <WithdrawalStepsCircle
            active={withdrawOption === "complete"}
            color={color}
          >
            <Title
              fontSize={14}
              lineHeight={20}
              color={
                withdrawOption === "complete" ? color : colors.quaternaryText
              }
            >
              2
            </Title>
          </WithdrawalStepsCircle>
          <PrimaryText
            fontSize={11}
            lineHeight={12}
            color={
              withdrawOption === "complete" ? color : colors.quaternaryText
            }
            className="mt-2 text-center mb-4"
            style={{ maxWidth: 60 }}
          >
            Complete Withdrawal
          </PrimaryText>
        </div>
      </WithdrawalSteps>
    );
  }, [withdrawOption, color, detailRows.length, show]);

  const handleApprove = useCallback(async () => {
    setWaitingApproval(true);
    try {
      const approveToAddress = VaultAddressMap[vaultOption]["earn"];
      if (!approveToAddress) {
        return;
      }
      const deadline = Math.round(Date.now() / 1000 + 60 * 60);
      const signature = await usdc.showApproveAssetSignature(
        approveToAddress,
        amount.toString(),
        deadline
      );
      if (signature) {
        const depositSignature = {
          deadline: deadline,
          v: signature.v,
          r: signature.r,
          s: signature.s,
        };
        setWaitingApproval(false);
        setDepositSignature(depositSignature);
        onSignatureMade(depositSignature);
      }
    } catch (error) {
      setWaitingApproval(false);
      console.log(error);
    }
  }, [amount, onSignatureMade, usdc, vaultOption]);

  const actionWord = capitalize(actionType);

  let warning = <></>;

  const actionLogo = useMemo(() => {
    switch (actionType) {
      case "deposit":
        return <DepositGlowIcon color={color} width={176} />;
      case "withdraw":
        return <WithdrawGlowIcon color={color} width={176} />;
    }
  }, [actionType, color]);

  switch (actionType) {
    case "deposit":
      warning = (
        <WarningContainer
          delay={0.6 + detailRows.length * 0.1}
          show={show}
          className="mb-4 w-100 text-center"
          color={color}
        >
          <PrimaryText fontSize={14} lineHeight={20} color={color}>
            IMPORTANT: Your funds will be available for withdrawal at 12pm UTC
            on {withdrawalDate}
          </PrimaryText>
        </WarningContainer>
      );
      break;
    case "withdraw":
      if (withdrawOption === "standard") {
        warning = (
          <WarningContainer
            delay={0.7 + detailRows.length * 0.1}
            show={show}
            className="mb-4 w-100 text-center"
            color={color}
          >
            <PrimaryText fontSize={14} lineHeight={20} color={color}>
              You can complete your withdrawal any time after 12pm UTC on{" "}
              {withdrawalDate} when your {asset} will be removed from the
              vault’s investable pool of funds
            </PrimaryText>
          </WarningContainer>
        );
      }
  }

  return (
    <div className="d-flex flex-column align-items-center">
      {/* Logo */}
      <Logo delay={0.05} show={show}>
        {actionLogo}
      </Logo>

      {/* Title */}
      <FormTitle delay={0.2} show={show}>
        {renderTitle()}
      </FormTitle>

      {/* Info Preview */}

      <InfoPreview
        delay={0.15}
        show={show}
        className="d-flex w-100 flex-row align-items-center justify-content-between mt-4"
      >
        <SecondaryText>{actionWord} Amount</SecondaryText>
        <Title className="text-right">
          {withdrawOption === "complete"
            ? formatBigNumber(withdrawalAmount, getAssetDecimals(asset))
            : formatBigNumber(amount, getAssetDecimals(asset))}{" "}
          {getAssetDisplay(asset)}
        </Title>
      </InfoPreview>

      {detailRows.map((detail, index) => (
        <DetailRow
          className="d-flex w-100 flex-row align-items-center justify-content-between mt-4"
          key={index}
          delay={0.15 + (index + 1) * 0.05}
          show={show}
        >
          <div className="d-flex flex-row align-items-center">
            <SecondaryText>{detail.key}</SecondaryText>
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
          <Title className="text-right">{detail.value}</Title>
        </DetailRow>
      ))}
      {actionType === "deposit" ? (
        <div>
          {depositSignature !== undefined ? (
            <FormButton
              delay={0.4 + detailRows.length * 0.1}
              show={show}
              className="btn py-3 mt-4 mb-3"
              color={color}
              variant={"earn"}
            >
              USDC READY TO DEPOSIT
            </FormButton>
          ) : (
            <FormButton
              delay={0.4 + detailRows.length * 0.1}
              show={show}
              onClick={handleApprove}
              className="btn py-3 mt-4 mb-3"
              color={color}
              variant={"primary"}
            >
              {waitingApproval ? loadingText : `PERMIT VAULT TO USE YOUR USDC`}
            </FormButton>
          )}

          <FormButton
            delay={0.5 + detailRows.length * 0.1}
            show={show}
            onClick={onClickConfirmButton}
            disabled={depositSignature === undefined}
            className="btn py-3 mb-3"
            color={color}
            variant={
              depositSignature === undefined ? "earnDisabled" : "primary"
            }
          >
            {actionWord} Now
          </FormButton>
          {warning}
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          <FormButton
            delay={
              withdrawOption === "complete"
                ? 0.3 + detailRows.length * 0.1
                : 0.5 + detailRows.length * 0.1
            }
            show={show}
            onClick={onClickConfirmButton}
            className="btn py-3 mt-4 mb-3"
            color={color}
          >
            {withdrawOption === "standard" ? "Initiate Withdrawal" : "Withdraw"}
          </FormButton>
          {renderWithdrawalSteps()}
          {warning}
        </div>
      )}
    </div>
  );
};

export default PreviewStep;
