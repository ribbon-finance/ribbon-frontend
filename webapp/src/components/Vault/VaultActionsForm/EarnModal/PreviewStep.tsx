import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
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
import USDCSign, { DepositSignature } from "../../../../hooks/useUSDC";
import useEarnStrategyTime from "../../../../hooks/useEarnStrategyTime";

const FormTitle = styled(Title)`
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
`;

const WarningContainer = styled.div<{ color: string }>`
  padding: 8px;
  background: ${(props) => props.color}14;
  border-radius: ${theme.border.radiusSmall};
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
}> = ({
  actionType,
  amount,
  onClickConfirmButton,
  asset,
  vaultOption,
  onSignatureMade,
}) => {
  const color = getVaultColor(vaultOption);
  const usdc = USDCSign();
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
      value: "Ribbon Diverisified",
      tooltip: {
        title: "Counterparty",
        explanation:
          "The counterpary selected will be the one to which the funds will be lent during the epoch.",
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
    <WarningContainer className="mb-4 w-100 text-center" color={color}>
      <PrimaryText fontSize={14} lineHeight={20} color={color}>
        IMPORTANT: Your funds will be available for withdrawal at 5pm UTC on{" "}
        {withdrawalDate}
      </PrimaryText>
    </WarningContainer>
  );

  return (
    <div className="d-flex flex-column align-items-center">
      {/* Logo */}
      <div style={{ marginTop: -40, marginBottom: -40 }}>{actionLogo}</div>

      {/* Title */}
      <FormTitle className=" text-center">{actionWord} PREVIEW</FormTitle>

      {/* Info Preview */}

      <div className="d-flex w-100 flex-row align-items-center justify-content-between mt-4">
        <SecondaryText>{actionWord} Amount</SecondaryText>
        <Title className="text-right">
          {formatBigNumber(amount, getAssetDecimals(asset))}{" "}
          {getAssetDisplay(asset)}
        </Title>
      </div>

      {detailRows.map((detail, index) => (
        <div
          className="d-flex w-100 flex-row align-items-center justify-content-between mt-4"
          key={index}
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
        </div>
      ))}
      <ActionButton
        onClick={handleApprove}
        disabled={!(depositSignature === undefined)}
        className="btn py-3 mt-4 mb-3"
        color={color}
        variant={depositSignature === undefined ? "primary" : "earn"}
      >
        {waitingApproval
          ? loadingText
          : depositSignature === undefined
          ? `PERMIT VAULT TO USE YOUR USDC`
          : `USDC READY TO DEPOSIT`}
      </ActionButton>
      <ActionButton
        onClick={onClickConfirmButton}
        disabled={depositSignature === undefined}
        className="btn py-3 mb-3"
        color={color}
      >
        {actionWord} Now
      </ActionButton>
      {warning}
    </div>
  );
};

export default PreviewStep;
