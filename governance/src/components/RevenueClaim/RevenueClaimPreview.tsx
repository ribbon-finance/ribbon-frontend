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
  vaultRevenue?: BigNumber;
}

const RevenueClaimPreview: React.FC<RevenueClaimPreviewProps> = ({
  onBack,
  onClaim,
  claimType,
  unlockPenalty,
  vaultRevenue,
}) => {
  const { t } = useTranslation();

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
          {claimType === "penalty"
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
      ) : (
        <ModalInfoColumn
          label={t("governance:RevenueClaim:protocolFees")}
          data={
            vaultRevenue
              ? parseFloat(
                  formatUnits(vaultRevenue, getAssetDecimals("WETH"))
                ).toFixed(2)
              : "---"
          }
        />
      )}
      <BaseModalContentColumn marginTop="auto">
        <ActionButton
          className="mb-2"
          onClick={onClaim}
          color={claimType === "penalty" ? colors.red : colors.asset.WETH}
        >
          {t("governance:RevenueClaim:claimRevenue")}
        </ActionButton>
      </BaseModalContentColumn>
    </>
  );
};

export default RevenueClaimPreview;
