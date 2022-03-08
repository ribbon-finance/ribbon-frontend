import styled from "styled-components";
import { BaseModalContentColumn, Title } from "shared/lib/designSystem";
import ModalBackButton from "shared/lib/components/Common/ModalBackButton";
import { ReactComponent as RevenueClaimIcon } from "../../assets/icons/revenueClaim.svg";
import { useTranslation } from "react-i18next";
import colors from "shared/lib/designSystem/colors";
import { ActionButton } from "shared/lib/components/Common/buttons";
import ModalInfoColumn from "shared/lib/components/Common/ModalInfoColumn";

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
  claimVaultRevenue: boolean;
  claimUnlockPenalty: boolean;
  lockToVERBN: boolean;
}

const RevenueClaimPreview: React.FC<RevenueClaimPreviewProps> = ({
  onBack,
  onClaim,
  claimVaultRevenue,
  claimUnlockPenalty,
  lockToVERBN,
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
          PROTOCOL REVENUE CLAIM
        </Title>
      </BaseModalContentColumn>
      <ModalInfoColumn
        label="Protocol Fees (USDC)"
        data={claimVaultRevenue ? "10,372.12" : "-"}
      />
      <ModalInfoColumn
        label="Penalty Distribution (RBN)"
        data={claimUnlockPenalty ? "4,372.12" : "-"}
      />
      <ModalInfoColumn
        label="Lock to veRBN"
        data={lockToVERBN ? "YES" : "NO"}
      />
      <BaseModalContentColumn marginTop="auto">
        <ActionButton className="mb-2" onClick={onClaim} color={colors.red}>
          CLAIM REVENUE
        </ActionButton>
      </BaseModalContentColumn>
    </>
  );
};

export default RevenueClaimPreview;
