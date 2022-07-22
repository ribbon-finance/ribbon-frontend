import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { vaultAudit } from "shared/lib/components/Product/productCopies";
import {
  getAssets,
  getDisplayAssets,
  VaultOptions,
  VaultVersion,
  VaultFees,
  isSolanaVault,
  isPutVault,
  getOptionAssets,
  isDisabledVault,
} from "shared/lib/constants/constants";
import { PrimaryText, SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import VaultPerformanceChart from "./VaultPerformanceChart";
import {
  getAssetDisplay,
  getYieldAssetUnderlying,
  isYieldAsset,
} from "shared/lib/utils/asset";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import WeeklyStrategySnapshot from "../../components/Deposit/WeeklyStrategySnapshot";
import VaultStrategyExplainer from "../../components/Deposit/VaultStrategyExplainer";
import sizes from "shared/lib/designSystem/sizes";
import { Assets } from "shared/lib/store/types";

const Paragraph = styled.div`
  margin-bottom: 64px;
`;

const ParagraphHeading = styled(Title)`
  display: block;
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 16px;
`;

const ParagraphText = styled(SecondaryText)`
  color: rgba(255, 255, 255, 0.64);
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
`;

const Link = styled.a`
  color: ${colors.primaryText};
  text-decoration: underline;

  &:hover {
    color: ${colors.primaryText}CC;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 50%;
  padding: 0 16px;

  @media (max-width: ${sizes.md}px) {
    max-width: unset;
  }
`;

const HighlightedText = styled.span`
  color: ${colors.primaryText};
  cursor: help;

  poin &:hover {
    color: ${colors.primaryText}CC;
  }
`;

interface PerformanceSectionProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
  active: boolean;
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  vault,
  active,
}) => {
  const { vaultOption, vaultVersion } = vault;
  const { t } = useTranslation();
  const asset = getAssets(vaultOption);
  const optionAsset = getOptionAssets(vaultOption);

  const vaultStrategyContent = useMemo(() => {
    const putVault = isPutVault(vault.vaultOption);
    const collateralAsset = getDisplayAssets(vault.vaultOption);

    const basei18NKey = putVault
      ? "shared:ProductCopies:Put"
      : "shared:ProductCopies:Call";
    const i18nParams = putVault
      ? {
          asset: getAssetDisplay(asset),
          optionAsset: getAssetDisplay(optionAsset),
          vault: t(`shared:ProductCopies:${vault.vaultOption}:title`),
        }
      : { asset: getAssetDisplay(asset) };

    /**
     * Default Vault
     */
    return (
      <Trans
        i18nKey={`${basei18NKey}:strategy:default`}
        values={i18nParams}
        components={[
          <TooltipExplanation
            title={t(`${basei18NKey}:text`)}
            explanation={t(`${basei18NKey}:explanation`)}
            learnMoreURL={t(`${basei18NKey}:learnMoreURL`)}
            renderContent={({ ref, ...triggerHandler }) => (
              <HighlightedText ref={ref} {...triggerHandler}>
                {t(`${basei18NKey}:text`)}
              </HighlightedText>
            )}
          />,
        ]}
      />
    );
  }, [asset, optionAsset, t, vault.vaultOption]);

  return (
    <Container>
      <VaultStrategyExplainer vault={vault} />
    </Container>
  );
};

export default PerformanceSection;
