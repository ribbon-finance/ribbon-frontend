import styled from "styled-components";
import BasicInput from "shared/lib/components/Inputs/BasicInput";
import {
  BaseModalWarning,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { ModalColumn } from "./shared";
import { getAssetDecimals, getAssetLogo } from "shared/lib/utils/asset";
import { ReactComponent as RevenueClaimIcon } from "../../assets/icons/revenueClaim.svg";
import { formatUnits } from "ethers/lib/utils";
import { useMemo } from "react";
import { BigNumber } from "ethers";
import { useTranslation } from "react-i18next";
import colors from "shared/lib/designSystem/colors";
import { ActionButton } from "shared/lib/components/Common/buttons";
import { ClaimType } from "./model";
import SegmentControl from "shared/lib/components/Common/SegmentControl";
import moment from "moment";
import { isProduction } from "shared/lib/utils/env";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";

const LogoContainer = styled.div.attrs({
  className: "d-flex align-items-center justify-content-center",
})`
  width: 40px;
  height: 100%;
  margin-left: 8px;
`;

// Disables UI if necessary
const DisableUI = styled.div<{ isDisabled?: boolean }>`
  opacity: ${({ isDisabled }) => (isDisabled ? 0.64 : 1)};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "auto")};
`;

const SegmentControlTitleContainer = styled.div.attrs({
  className: "d-flex align-items-center justify-content-center",
})`
  width: 142px;
`;

const Highlight = styled.span`
  color: ${colors.green};
`;

interface RevenueClaimFormProps {
  claimType: ClaimType;
  onClaimTypeChange: (claimType: ClaimType) => void;

  vaultRevenue?: BigNumber;
  unlockPenalty?: BigNumber;
  nextDistributionDate?: Date;

  onPreviewClaim: () => void;
}

const RevenueClaimForm: React.FC<RevenueClaimFormProps> = ({
  vaultRevenue,
  unlockPenalty,
  onPreviewClaim,
  claimType,
  nextDistributionDate,
  onClaimTypeChange,
}) => {
  const { t } = useTranslation();

  const timeRemainingToDistribution = useMemo(() => {
    if (nextDistributionDate) {
      const toNextDist = moment.duration(
        moment(nextDistributionDate).diff(moment()),
        "milliseconds"
      );

      if (toNextDist.asMilliseconds() <= 0) {
        return "Now";
      }

      return `${toNextDist.days()}D ${toNextDist.hours()}H ${toNextDist.minutes()}M`;
    }
  }, [nextDistributionDate]);

  // On staging/dev, allow claiming 0
  // Contract call will work, but user will receive nothing (0).
  // This is disabled on prod to prevent users from wasting gas.
  const canProceed = useMemo(() => {
    if (!isProduction()) {
      return true;
    }
    if (claimType === "penalty") {
      return unlockPenalty && unlockPenalty?.gt(0);
    }
    return vaultRevenue && vaultRevenue?.gt(0);
  }, [vaultRevenue, unlockPenalty, claimType]);

  const displayValues = useMemo(() => {
    if (claimType === "penalty") {
      return {
        Logo: RevenueClaimIcon,
        label: t("governance:RevenueClaim:shareOfUnlockPenalty"),
        input: unlockPenalty
          ? parseFloat(
              formatUnits(unlockPenalty, getAssetDecimals("RBN"))
            ).toFixed(2)
          : "---",
      };
    }
    return {
      Logo: getAssetLogo("WETH"),
      label: t("governance:RevenueClaim:vaultRevenueEarned"),
      input: vaultRevenue
        ? parseFloat(
            formatUnits(vaultRevenue, getAssetDecimals("WETH"))
          ).toFixed(2)
        : "---",
    };
  }, [claimType, t, unlockPenalty, vaultRevenue]);

  return (
    <>
      <ModalColumn marginTop={8}>
        <Title style={{ zIndex: 1 }}>
          {t("governance:RevenueClaim:claimRibbonRevenue")}
        </Title>
      </ModalColumn>
      <ModalColumn marginTop={24}>
        <div className="pt-4">
          <SegmentControl
            segments={[
              {
                display: (
                  <SegmentControlTitleContainer>
                    {t("governance:RevenueClaim:vaultRevenue")}
                  </SegmentControlTitleContainer>
                ),
                value: "revenue",
                textColor:
                  claimType === "revenue" ? colors.green : colors.tertiaryText,
              },
              {
                display: (
                  <SegmentControlTitleContainer>
                    {t("governance:RevenueClaim:unlockPenalty")}
                  </SegmentControlTitleContainer>
                ),
                value: "penalty",
                textColor:
                  claimType === "penalty" ? colors.green : colors.tertiaryText,
              },
            ]}
            value={claimType}
            onSelect={(value) => {
              onClaimTypeChange(value as ClaimType);
            }}
            config={{
              theme: "outline",
              color: colors.green,
              backgroundColor: colors.background.three,
              button: {
                px: 6,
                py: 10,
                fontSize: 14,
                lineHeight: 20,
              },
            }}
          />
        </div>
      </ModalColumn>
      <ModalColumn marginTop={24}>
        <BasicInput
          size="s"
          leftContent={
            <LogoContainer>
              {<displayValues.Logo width="100%" height="100%" />}
            </LogoContainer>
          }
          labelProps={{
            text: displayValues.label,
            isInside: true,
            accessoryComponent:
              claimType === "penalty" ? (
                <TooltipExplanation
                  title={t(
                    "governance:TooltipExplanations:unlockPenalty.title"
                  )}
                  explanation={t(
                    "governance:TooltipExplanations:unlockPenalty.description"
                  )}
                  renderContent={({ ref, ...triggerHandler }) => (
                    <HelpInfo
                      containerRef={ref}
                      {...triggerHandler}
                      style={{ marginLeft: "0px" }}
                    >
                      i
                    </HelpInfo>
                  )}
                />
              ) : undefined,
          }}
          inputProps={{
            type: "text",
            value: displayValues.input,
            contentEditable: false,
            disabled: true,
          }}
        />
      </ModalColumn>
      <DisableUI isDisabled={!canProceed}>
        <ModalColumn marginTop={24}>
          <ActionButton
            disabled={!canProceed}
            onClick={() => {
              if (!canProceed) {
                return;
              }
              onPreviewClaim();
            }}
            className="py-3 mb-2"
            color={claimType === "penalty" ? colors.red : colors.asset.WETH}
          >
            {t("shared:ActionButtons:previewClaim")}
          </ActionButton>
        </ModalColumn>
      </DisableUI>
      {claimType === "revenue" && (
        <BaseModalWarning color={colors.green}>
          <SecondaryText
            color={`${colors.green}A3`}
            className="w-100 text-center"
            fontWeight={400}
          >
            {t("governance:WarningMessages:timeTilNextRevenueDistribution")}
            {": "}
            <Highlight>{timeRemainingToDistribution}</Highlight>
          </SecondaryText>
        </BaseModalWarning>
      )}
    </>
  );
};

export default RevenueClaimForm;
