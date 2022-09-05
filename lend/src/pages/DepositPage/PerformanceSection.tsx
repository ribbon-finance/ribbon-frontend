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

  const renderWithdrawalsSection = useCallback(
    (_vaultOption: VaultOptions, _vaultVersion: VaultVersion) => {
      switch (_vaultVersion) {
        case "v1":
          const withdrawalFee = VaultFees[_vaultOption].v1?.withdrawalFee;
          return (
            <>
              {" "}
              The vault allocates 90% of the funds deposited towards its
              strategy and reserves 10% of the funds deposited for withdrawals.
              If in any given week the 10% withdrawal limit is reached,
              withdrawals from the vault will be disabled and depositors will
              have to wait until the following week in order to withdraw their
              funds.
              <br />
              <br />
              Withdrawing from the vault has a fixed withdrawal fee of{" "}
              {withdrawalFee}%. This is to encourage longer-term depositors.
            </>
          );
        case "v2":
          return (
            <>
              Once user funds have been used in the vault’s weekly strategy they
              cannot be withdrawn until the vault closes it’s position the
              following Friday at 12pm UTC.
              <br />
              <br />
              {isSolanaVault(vaultOption)
                ? "Funds scheduled for withdrawal are automatically credited to their accounts once the vault rolls over its position."
                : "Users can withdraw their funds instantly during the weekly timelock period where the vault closes it’s previous position and opens its new position."}{" "}
            </>
          );
      }
    },
    [vaultOption]
  );

  const rendersYieldAssetProviderTooltips = useCallback(
    (_asset: Assets) => {
      switch (_asset) {
        case "stETH":
          return (
            <TooltipExplanation
              title={t("webapp:VaultStrategyExplainer:Lido:title")}
              explanation={t("webapp:VaultStrategyExplainer:Lido:explanation")}
              learnMoreURL={t(
                "webapp:VaultStrategyExplainer:Lido:learnMoreURL"
              )}
              renderContent={({ ref, ...triggerHandler }) => (
                <HighlightedText ref={ref} {...triggerHandler}>
                  Lido
                </HighlightedText>
              )}
            />
          );
        case "sAVAX":
          return (
            <TooltipExplanation
              title={t("webapp:VaultStrategyExplainer:Benqi:title")}
              explanation={t("webapp:VaultStrategyExplainer:Benqi:explanation")}
              learnMoreURL={t(
                "webapp:VaultStrategyExplainer:Benqi:learnMoreURL"
              )}
              renderContent={({ ref, ...triggerHandler }) => (
                <HighlightedText ref={ref} {...triggerHandler}>
                  Benqi
                </HighlightedText>
              )}
            />
          );
        default:
          return <></>;
      }
    },
    [t]
  );

  const rendersYieldAssetTooltips = useCallback(
    (_asset: Assets) => {
      const collateralAssetUnit = getAssetDisplay(_asset);

      switch (_asset) {
        case "stETH":
          return (
            <TooltipExplanation
              title={collateralAssetUnit}
              explanation={t(
                "webapp:VaultStrategyExplainer:stETH:explanation",
                { collateralAssetUnit }
              )}
              learnMoreURL={t(
                "webapp:VaultStrategyExplainer:stETH:learnMoreURL"
              )}
              renderContent={({ ref, ...triggerHandler }) => (
                <HighlightedText ref={ref} {...triggerHandler}>
                  {collateralAssetUnit}
                </HighlightedText>
              )}
            />
          );
        case "sAVAX":
          return (
            <TooltipExplanation
              title={collateralAssetUnit}
              explanation={t("webapp:VaultStrategyExplainer:sAVAX:explanation")}
              learnMoreURL={t(
                "webapp:VaultStrategyExplainer:sAVAX:learnMoreURL"
              )}
              renderContent={({ ref, ...triggerHandler }) => (
                <HighlightedText ref={ref} {...triggerHandler}>
                  {collateralAssetUnit}
                </HighlightedText>
              )}
            />
          );
        case "yvUSDC":
          return (
            <TooltipExplanation
              title={collateralAssetUnit}
              explanation={t(
                "webapp:VaultStrategyExplainer:yvToken:explanation",
                {
                  collateralAssetUnit,
                  assetUnit: getAssetDisplay(
                    getYieldAssetUnderlying(_asset) || _asset
                  ),
                }
              )}
              learnMoreURL={t(
                "webapp:VaultStrategyExplainer:yvToken:learnMoreURL"
              )}
              renderContent={({ ref, ...triggerHandler }) => (
                <HighlightedText ref={ref} {...triggerHandler}>
                  {collateralAssetUnit}
                </HighlightedText>
              )}
            />
          );
        default:
          return <></>;
      }
    },
    [t]
  );

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

    if (isYieldAsset(collateralAsset)) {
      /**
       * Return stratey for vault collaterized by yield asset
       */
      return putVault ? (
        <Trans
          i18nKey={`${basei18NKey}:strategy:yieldAssetCollateral`}
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
            rendersYieldAssetTooltips(collateralAsset),
          ]}
        />
      ) : (
        <Trans
          i18nKey={`${basei18NKey}:strategy:yieldAssetCollateral`}
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
            rendersYieldAssetProviderTooltips(collateralAsset),
            rendersYieldAssetTooltips(collateralAsset),
          ]}
        />
      );
    }

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
  }, [
    asset,
    optionAsset,
    rendersYieldAssetProviderTooltips,
    rendersYieldAssetTooltips,
    t,
    vault.vaultOption,
  ]);

  return (
    <Container>
      <Paragraph className="d-flex flex-column">
        <ParagraphHeading>Vault Strategy</ParagraphHeading>
        <ParagraphText className="mb-4">{vaultStrategyContent}</ParagraphText>
        <VaultStrategyExplainer vault={vault} />
      </Paragraph>

      {isDisabledVault(vault.vaultOption) ? null : (
        <Paragraph>
          <ParagraphHeading>Weekly Strategy Snapshot</ParagraphHeading>
          <WeeklyStrategySnapshot vault={vault} />
        </Paragraph>
      )}

      <Paragraph>
        <VaultPerformanceChart vault={vault} />
      </Paragraph>

      {active && (
        <Paragraph>
          <ParagraphHeading>Withdrawals</ParagraphHeading>
          <ParagraphText>
            {renderWithdrawalsSection(vaultOption, vaultVersion)}
          </ParagraphText>
        </Paragraph>
      )}

      {vaultVersion === "v2" && (
        <Paragraph>
          <ParagraphHeading>FEE STRUCTURE</ParagraphHeading>
          <ParagraphText>
            The vault fee structure consists of a{" "}
            {VaultFees[vaultOption].v2?.managementFee}% annualised management
            fee and a {VaultFees[vaultOption].v2?.performanceFee}% performance
            fee.
            <br />
            <br />
            If the weekly strategy is profitable, the weekly performance fee is
            charged on the premiums earned and the weekly management fee is
            charged on the assets managed by the vault.
            <br />
            <br />
            {isSolanaVault(vaultOption)
              ? "If the weekly strategy is unprofitable, performance fees are not charged."
              : "If the weekly strategy is unprofitable, there are no fees charged."}
          </ParagraphText>
        </Paragraph>
      )}

      <Paragraph>
        <ParagraphHeading>Risk</ParagraphHeading>
        <ParagraphText>
          <Trans
            i18nKey={`shared:ProductCopies:${
              isPutVault(vaultOption) ? "Put" : "Call"
            }:vaultRisk`}
            values={{
              optionAsset: getAssetDisplay(optionAsset),
            }}
            components={[
              <TooltipExplanation
                title={t("shared:TooltipExplanations:InTheMoney:title")}
                explanation={t(
                  "shared:TooltipExplanations:InTheMoney:explanation",
                  {
                    optionAsset: getAssetDisplay(optionAsset),
                    optionType: isPutVault(vaultOption) ? "put" : "call",
                    exercisedDirection: isPutVault(vaultOption)
                      ? "above"
                      : "below",
                  }
                )}
                learnMoreURL={t(
                  "shared:TooltipExplanations:InTheMoney:learnMoreURL"
                )}
                renderContent={({ ref, ...triggerHandler }) => (
                  <HighlightedText ref={ref} {...triggerHandler}>
                    {t(
                      "shared:TooltipExplanations:InTheMoney:title"
                    ).toLowerCase()}
                  </HighlightedText>
                )}
              />,
            ]}
          />
          {/* {t(
            `shared:ProductCopies:${
              isPutVault(vaultOption) ? "Put" : "Call"
            }:vaultRisk`,
            { optionAsset: getAssetDisplay(getOptionAssets(vaultOption)) }
          )} */}
          <br />
          <br />
          {vaultAudit(vaultOption)}
        </ParagraphText>

        <PrimaryText className="d-block mt-3">
          <Link
            href="https://www.research.ribbon.finance/blog/theta-vault-backtest-results"
            target="_blank"
            rel="noreferrer noopener"
            className="d-flex"
          >
            <span className="mr-2">Read More</span>
            <ExternalIcon color="white" />
          </Link>
        </PrimaryText>
      </Paragraph>
    </Container>
  );
};

export default PerformanceSection;
