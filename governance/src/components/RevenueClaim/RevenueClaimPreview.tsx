import styled from "styled-components";
import { BaseModalContentColumn, Title } from "shared/lib/designSystem";
import ModalBackButton from "shared/lib/components/Common/ModalBackButton";
import { ReactComponent as RevenueClaimIcon } from "../../assets/icons/revenueClaim.svg";
import { useTranslation } from "react-i18next";
import colors from "shared/lib/designSystem/colors";
import { ActionButton } from "shared/lib/components/Common/buttons";
import ModalInfoColumn from "shared/lib/components/Common/ModalInfoColumn";
import { ClaimType } from "./model";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { getAssetDecimals } from "shared/lib/utils/asset";

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: ${colors.red}1F;
  border-radius: 100px;
`;

interface RevenueClaimPreviewProps {
  onBack: () => void;
  onClaim: () => void;
  claimType: ClaimType;
  unlockPenalty?: BigNumber;
  unlockPenaltyPostTimestamp?: BigNumber;
  vaultRevenue?: BigNumber;
}

const RevenueClaimPreview: React.FC<RevenueClaimPreviewProps> = ({
  onBack,
  onClaim,
  claimType,
  unlockPenalty,
  unlockPenaltyPostTimestamp,
  vaultRevenue,
}) => {
  const { t } = useTranslation();
  const vaultRevenueNum = vaultRevenue
    ? parseFloat(formatUnits(vaultRevenue, getAssetDecimals("WETH")))
    : undefined;

  let vaultRevenueDisplay = "---";
  if (vaultRevenueNum === undefined) {
    vaultRevenueDisplay = "---";
  } else if (vaultRevenueNum <= 0) {
    vaultRevenueDisplay = "0.00";
  } else if (vaultRevenueNum < 0.0001) {
    vaultRevenueDisplay = "<0.0001";
  } else {
    vaultRevenueDisplay = vaultRevenueNum?.toFixed(4);
  }

  return (
    <>
      <ModalBackButton onBack={onBack} />
      <BaseModalContentColumn>
        <LogoContainer>
          <RevenueClaimIcon width="100%" height="100%" />
        </LogoContainer>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={16}>
        <Title fontSize={22} lineHeight={28}>
          {claimType === "penalty" || claimType === "penaltyPostTimestamp"
            ? t("governance:RevenueClaim:unlockPenaltyClaim")
            : t("governance:RevenueClaim:protocolRevenueClaim")}
        </Title>
      </BaseModalContentColumn>
      {claimType === "penalty" ? (
        <ModalInfoColumn
          label={t("governance:RevenueClaim:penaltyDistribution")}
          data={
            unlockPenalty
              ? parseFloat(
                  formatUnits(unlockPenalty, getAssetDecimals("RBN"))
                ).toFixed(2)
              : "---"
          }
        />
      ) : claimType === "penaltyPostTimestamp" ? (
        <ModalInfoColumn
          label={t("governance:RevenueClaim:penaltyDistribution")}
          data={
            unlockPenaltyPostTimestamp
              ? parseFloat(
                  formatUnits(
                    unlockPenaltyPostTimestamp,
                    getAssetDecimals("RBN")
                  )
                ).toFixed(2)
              : "---"
          }
        />
      ) : (
        <ModalInfoColumn
          label={t("governance:RevenueClaim:protocolFees")}
          data={vaultRevenueDisplay}
        />
      )}
      <BaseModalContentColumn marginTop="auto">
        <ActionButton
          className="mb-2"
          onClick={onClaim}
          color={claimType !== "revenue" ? colors.red : colors.asset.WETH}
        >
          {t("governance:RevenueClaim:claimRevenue")}
        </ActionButton>
      </BaseModalContentColumn>
    </>
  );
};

export default RevenueClaimPreview;
