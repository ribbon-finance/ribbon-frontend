import React, { useCallback, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { BigNumber } from "ethers";

import { SecondaryText, Title, PrimaryText } from "shared/lib/designSystem";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { ActionType } from "./types";
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
import { DepositGlowIcon } from "shared/lib/assets/icons/icons";
import theme from "shared/lib/designSystem/theme";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import useUSDC, { DepositSignature } from "../../../../hooks/useUSDC";
import useEarnStrategyTime from "../../../../hooks/useEarnStrategyTime";
import { fadeIn } from "shared/lib/designSystem/keyframes";

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
  onClickConfirmButton: () => Promise<void>;
  asset: Assets;
  vaultOption: VaultOptions;
  vaultVersion: VaultVersion;
  onSignatureMade: (signature: DepositSignature) => void;
  show: boolean;
}> = ({
  actionType,
  amount,
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

    return actionDetails;
  }, [strategyStartTime]);

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
  let actionLogo = <></>;
  let warning = <></>;

  actionLogo = <DepositGlowIcon color={color} width={176} />;

  warning = (
    <WarningContainer
      delay={0.3 + detailRows.length * 0.05}
      show={show}
      className="mb-4 w-100 text-center"
      color={color}
    >
      <PrimaryText fontSize={14} lineHeight={20} color={color}>
        IMPORTANT: Your funds will be available for withdrawal at 5pm UTC on{" "}
        {withdrawalDate}
      </PrimaryText>
    </WarningContainer>
  );

  return (
    <div className="d-flex flex-column align-items-center">
      {/* Logo */}
      <Logo delay={0.05} show={show}>
        {actionLogo}
      </Logo>

      {/* Title */}
      <FormTitle delay={0.1} show={show}>
        {actionWord} PREVIEW
      </FormTitle>

      {/* Info Preview */}

      <InfoPreview
        delay={0.15}
        show={show}
        className="d-flex w-100 flex-row align-items-center justify-content-between mt-4"
      >
        <SecondaryText>{actionWord} Amount</SecondaryText>
        <Title className="text-right">
          {formatBigNumber(amount, getAssetDecimals(asset))}{" "}
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
      {depositSignature !== undefined ? (
        <FormButton
          delay={0.2 + detailRows.length * 0.05}
          show={show}
          className="btn py-3 mt-4 mb-3"
          color={color}
          variant={"earn"}
        >
          USDC READY TO DEPOSIT
        </FormButton>
      ) : (
        <FormButton
          delay={0.2 + detailRows.length * 0.05}
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
        delay={0.25 + detailRows.length * 0.05}
        show={show}
        onClick={onClickConfirmButton}
        disabled={depositSignature === undefined}
        className="btn py-3 mb-3"
        color={color}
        variant={depositSignature === undefined ? "earnDisabled" : "primary"}
      >
        {actionWord} Now
      </FormButton>
      {warning}
    </div>
  );
};

export default PreviewStep;
