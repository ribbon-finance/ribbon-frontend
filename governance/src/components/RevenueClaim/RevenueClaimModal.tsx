import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

import { ReactComponent as RevenueClaimIcon } from "../../assets/icons/revenueClaim.svg";
import BasicModal from "shared/lib/components/Common/BasicModal";
import {
  BaseModalWarning,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { getAssetLogo } from "shared/lib/utils/asset";
import NumberInput from "shared/lib/components/Inputs/NumberInput";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import ToggleRowItem from "./ToggleRowItem";
import { ActionButton } from "shared/lib/components/Common/buttons";
import colors from "shared/lib/designSystem/colors";

const ModalContainer = styled(BasicModal)``;

const ModalColumn = styled.div<{ marginTop?: number | "auto" }>`
  display: flex;
  justify-content: center;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop === undefined ? 24 : props.marginTop}px`};
`;

const WarningHighlight = styled.strong`
  color: ${colors.green};
`;

const LogoContainer = styled.div.attrs({
  className: "d-flex align-items-center justify-content-center",
})`
  width: 40px;
  height: 100%;
  margin-left: 8px;
`;

interface RewardsCalculatorModalProps {
  show: boolean;
  onClose: () => void;
}

const USDCLogo = getAssetLogo("USDC");
const RevenueClaimModal: React.FC<RewardsCalculatorModalProps> = ({
  show,
  onClose,
}) => {
  const loadingText = useLoadingText();
  const { t } = useTranslation();

  // TODO: - Retrieve vault revenue
  // TODO: - Retrieve Share of unlock penalty

  const [claimVaultRevenue, setClaimVaultRevenue] = useState(false);
  const [claimUnlockPenalty, setClaimUnlockPenalty] = useState(false);
  const [lockToVERBN, setlockToVERBN] = useState(false);

  const canProceed = useMemo(() => {
    return true;
  }, []);

  return (
    <ModalContainer show={show} headerBackground height={576} onClose={onClose}>
      <>
        <ModalColumn marginTop={8}>
          <Title style={{ zIndex: 1 }}>CLAIM RIBBON REVENUE</Title>
        </ModalColumn>
        <ModalColumn marginTop={40}>
          <NumberInput
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
              min: "0",
              placeholder: "0.00",
              value: "0.00",
              contentEditable: false,
              disabled: true,
            }}
          />
        </ModalColumn>
        <ModalColumn marginTop={24}>
          <NumberInput
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
              min: "0",
              placeholder: "0.00",
              value: "0.00",
              contentEditable: false,
              disabled: true,
            }}
          />
        </ModalColumn>
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
        <ModalColumn marginTop="auto">
          <ActionButton
            disabled={!canProceed}
            onClick={() => {
              if (!canProceed) {
                return;
              }
              // TODO:
            }}
            className="py-3 mb-2"
            color={colors.red}
          >
            {t("shared:ActionButtons:previewClaim")}
          </ActionButton>
        </ModalColumn>
        <BaseModalWarning color={colors.green}>
          <SecondaryText
            color={`${colors.green}A3`}
            className="w-100 text-center"
            fontWeight={400}
          >
            {t("governance:WarningMessages:timeTilNextRevenueDistribution")}{": "}
            <WarningHighlight>6D 12H 12M</WarningHighlight>
          </SecondaryText>
        </BaseModalWarning>
      </>
    </ModalContainer>
  );
};

export default RevenueClaimModal;
