import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { ReactComponent as RevenueClaimIcon } from "../../assets/icons/revenueClaim.svg";
import BasicModal from "shared/lib/components/Common/BasicModal";
import {
  BaseModalWarning,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import { getAssetLogo } from "shared/lib/utils/asset";
import BasicInput from "shared/lib/components/Inputs/BasicInput";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import ToggleRowItem from "./ToggleRowItem";
import { ActionButton } from "shared/lib/components/Common/buttons";
import colors from "shared/lib/designSystem/colors";
import useVeRBNRewards from "../../hooks/useVERBNRewards";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

const ModalContainer = styled(BasicModal)``;

// Disables UI if necessary
const DisableUI = styled.div<{ isDisabled?: boolean }>`
  opacity: ${({ isDisabled }) => (isDisabled ? 0.64 : 1)};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "auto")};
`;

const ModalColumn = styled.div<{ marginTop?: number | "auto" }>`
  display: flex;
  justify-content: center;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop === undefined ? 24 : props.marginTop}px`};
`;

const Highlight = styled.span`
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
  const { account } = useWeb3Wallet();
  const veRBNRewards = useVeRBNRewards();

  // TODO: - Retrieve vault revenue
  // TODO: - Retrieve Share of unlock penalty

  // CONTRACT VALUES
  const [vaultRevenue, setVaultRevenue] = useState<BigNumber>();
  const [unlockPenalty, setUnlockPenalty] = useState<BigNumber>();

  // TOGGLE
  const [claimVaultRevenue, setClaimVaultRevenue] = useState(false);
  const [claimUnlockPenalty, setClaimUnlockPenalty] = useState(false);
  const [lockToVERBN, setlockToVERBN] = useState(false);

  useEffect(() => {
    if (veRBNRewards && account) {
      veRBNRewards.rewards(account).then((rewards: BigNumber) => {
        setVaultRevenue(() => rewards);
      });
    }
  }, [veRBNRewards, account]);

  // Can only proceed if revenue OR penalty is more than 0
  const canProceed = useMemo(() => {
    return (
      (vaultRevenue && vaultRevenue?.gt(0)) ||
      (unlockPenalty && unlockPenalty?.gt(0))
    );
  }, [vaultRevenue, unlockPenalty]);

  const canClaim = useMemo(() => {
    return canProceed && (claimVaultRevenue || claimUnlockPenalty);
  }, [canProceed, claimVaultRevenue, claimUnlockPenalty]);

  return (
    <ModalContainer show={show} headerBackground height={576} onClose={onClose}>
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
                : "-",
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
              title={t(
                "governance:TooltipExplanations:claimVaultRevenue:title"
              )}
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
              title={t(
                "governance:TooltipExplanations:claimUnlockPenalty:title"
              )}
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
                    {t(
                      "governance:TooltipExplanations:lockToVERBN:description"
                    )}
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
                // TODO:
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
    </ModalContainer>
  );
};

export default RevenueClaimModal;
