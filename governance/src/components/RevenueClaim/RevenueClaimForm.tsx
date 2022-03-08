import styled from "styled-components";
import BasicInput from "shared/lib/components/Inputs/BasicInput";
import {
  BaseModalWarning,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { ModalColumn } from "./shared";
import { getAssetLogo } from "shared/lib/utils/asset";
import { ReactComponent as RevenueClaimIcon } from "../../assets/icons/revenueClaim.svg";
import { formatUnits } from "ethers/lib/utils";
import { useMemo } from "react";
import { BigNumber } from "ethers";
import ToggleRowItem from "./ToggleRowItem";
import { useTranslation } from "react-i18next";
import colors from "shared/lib/designSystem/colors";
import { ActionButton } from "shared/lib/components/Common/buttons";

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

const Highlight = styled.span`
  color: ${colors.green};
`;

const USDCLogo = getAssetLogo("USDC");

interface RevenueClaimFormProps {
  vaultRevenue?: BigNumber;
  unlockPenalty?: BigNumber;

  toggleProps: {
    claimVaultRevenue: boolean;
    setClaimVaultRevenue: (checked: boolean) => void;
    claimUnlockPenalty: boolean;
    setClaimUnlockPenalty: (checked: boolean) => void;
    lockToVERBN: boolean;
    setlockToVERBN: (checked: boolean) => void;
  };

  onPreviewClaim: () => void;
}

const RevenueClaimForm: React.FC<RevenueClaimFormProps> = ({
  vaultRevenue,
  unlockPenalty,
  toggleProps,
  onPreviewClaim,
}) => {
  const { t } = useTranslation();

  const {
    claimVaultRevenue,
    setClaimVaultRevenue,
    claimUnlockPenalty,
    setClaimUnlockPenalty,
    lockToVERBN,
    setlockToVERBN,
  } = toggleProps;

  const canProceed = useMemo(() => {
    return true;
    return (
      (vaultRevenue && vaultRevenue?.gt(0)) ||
      (unlockPenalty && unlockPenalty?.gt(0))
    );
  }, [vaultRevenue, unlockPenalty]);

  const canClaim = useMemo(() => {
    return canProceed && (claimVaultRevenue || claimUnlockPenalty);
  }, [canProceed, claimVaultRevenue, claimUnlockPenalty]);

  return (
    <>
      <ModalColumn marginTop={8}>
        <Title style={{ zIndex: 1 }}>CLAIM RIBBON REVENUE</Title>
      </ModalColumn>
      <ModalColumn marginTop={40}>
        <BasicInput
          size="s"
          leftContent={
            <LogoContainer>
              <USDCLogo width="100%" height="100%" />
            </LogoContainer>
          }
          labelProps={{
            text: "VAULT REVENUE",
            isInside: true,
          }}
          inputProps={{
            type: "text",
            value: vaultRevenue
              ? parseFloat(formatUnits(vaultRevenue, 8)).toFixed(2)
              : "---",
            contentEditable: false,
            disabled: true,
          }}
        />
      </ModalColumn>
      <ModalColumn marginTop={24}>
        <BasicInput
          size="s"
          leftContent={
            <LogoContainer>
              <RevenueClaimIcon width="100%" height="100%" />
            </LogoContainer>
          }
          labelProps={{
            text: "SHARE OF UNLOCK PENALTY",
            isInside: true,
          }}
          inputProps={{
            type: "text",
            value: unlockPenalty
              ? parseFloat(formatUnits(unlockPenalty, 18)).toFixed(2)
              : "---",
            contentEditable: false,
            disabled: true,
          }}
        />
      </ModalColumn>
      <DisableUI isDisabled={!canProceed}>
        <ModalColumn marginTop={24}>
          <ToggleRowItem
            title={t("governance:TooltipExplanations:claimVaultRevenue:title")}
            tooltip={{
              title: t(
                "governance:TooltipExplanations:claimVaultRevenue:title"
              ),
              explanation: (
                <>
                  {t(
                    "governance:TooltipExplanations:claimVaultRevenue:description"
                  )}
                  <br />
                  <br />
                  {t(
                    "governance:TooltipExplanations:claimRibbonRevenueAllYesDescription"
                  )}
                </>
              ),
            }}
            isChecked={claimVaultRevenue}
            onChecked={setClaimVaultRevenue}
          />
        </ModalColumn>
        <ModalColumn marginTop={16}>
          <ToggleRowItem
            title={t("governance:TooltipExplanations:claimUnlockPenalty:title")}
            tooltip={{
              title: t(
                "governance:TooltipExplanations:claimUnlockPenalty:title"
              ),
              explanation: (
                <>
                  {t(
                    "governance:TooltipExplanations:claimUnlockPenalty:description"
                  )}
                  <br />
                  <br />
                  {t(
                    "governance:TooltipExplanations:claimRibbonRevenueAllYesDescription"
                  )}
                </>
              ),
            }}
            isChecked={claimUnlockPenalty}
            onChecked={setClaimUnlockPenalty}
          />
        </ModalColumn>
        <ModalColumn marginTop={16}>
          <ToggleRowItem
            title={t("governance:TooltipExplanations:lockToVERBN:title")}
            tooltip={{
              title: t("governance:TooltipExplanations:lockToVERBN:title"),
              explanation: (
                <>
                  {t("governance:TooltipExplanations:lockToVERBN:description")}
                  <br />
                  <br />
                  {t(
                    "governance:TooltipExplanations:claimRibbonRevenueAllYesDescription"
                  )}
                </>
              ),
            }}
            isChecked={lockToVERBN}
            onChecked={setlockToVERBN}
          />
        </ModalColumn>
        <ModalColumn marginTop={24}>
          <ActionButton
            disabled={!canClaim}
            onClick={() => {
              if (!canClaim) {
                return;
              }
              onPreviewClaim();
            }}
            className="py-3 mb-2"
            color={colors.red}
          >
            {t("shared:ActionButtons:previewClaim")}
          </ActionButton>
        </ModalColumn>
      </DisableUI>
      <BaseModalWarning color={colors.green}>
        <SecondaryText
          color={`${colors.green}A3`}
          className="w-100 text-center"
          fontWeight={400}
        >
          {t("governance:WarningMessages:timeTilNextRevenueDistribution")}
          {": "}
          <Highlight>6D 12H 12M</Highlight>
        </SecondaryText>
      </BaseModalWarning>
    </>
  );
};

export default RevenueClaimForm;
