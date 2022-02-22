import React, { useMemo, useState } from "react";
import styled from "styled-components";
import currency from "currency.js";
import { Col, Row } from "react-bootstrap";
import moment from "moment";

import theme from "shared/lib/designSystem/theme";
import { useAssetsPrice } from "shared/lib/hooks/useAssetPrice";
import { formatOptionStrike } from "shared/lib/utils/math";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import {
  getAssets,
  getDisplayAssets,
  getOptionAssets,
  VaultOptions,
  VaultVersion,
  getVaultChain,
} from "shared/lib/constants/constants";
import { BaseButton, SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import StrikeChart from "./StrikeChart";
import ProfitCalculatorModal from "./ProfitCalculatorModal";
import { formatUnits } from "@ethersproject/units";
import { useLatestOption } from "shared/lib/hooks/useLatestOption";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";

const VaultPerformanceChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  padding: 30px 0;
  background: ${colors.background.two};
  border-radius: ${theme.border.radius} ${theme.border.radius} 0px 0px;
`;

const VaultPerformanceChartSecondaryContainer = styled.div`
  background: ${colors.background.two};

  &:last-child {
    border-radius: 0px 0px ${theme.border.radius} ${theme.border.radius};
  }
`;

const DataCol = styled(Col)`
  display: flex;
  flex-direction: column;
  border-top: ${theme.border.width} ${theme.border.style} ${colors.border};

  && {
    padding: 16px;
  }

  &:nth-child(even) {
    border-left: ${theme.border.width} ${theme.border.style} ${colors.border};
  }
`;

const DataLabel = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
`;

const DataNumber = styled(Title)<{ variant?: "green" | "red" }>`
  font-size: 16px;
  line-height: 24px;
  margin-top: 4px;

  ${(props) => {
    switch (props.variant) {
      case "green":
        return `color: ${colors.green};`;
      case "red":
        return `color: ${colors.red};`;
      default:
        return ``;
    }
  }}
`;

const CalculatorButton = styled(BaseButton)<{ color: string }>`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px 0px;
  background: ${(props) => props.color};
  border-radius: 0px 0px ${theme.border.radius} ${theme.border.radius};

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const CalculatorButtonText = styled(Title)<{ color: string }>`
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 1px;
  color: ${(props) => props.color};
`;

interface WeeklyStrategySnapshotProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

const WeeklyStrategySnapshot: React.FC<WeeklyStrategySnapshotProps> = ({
  vault,
}) => {
  const { vaultOption, vaultVersion } = vault;
  const { option: currentOption, loading: optionLoading } = useLatestOption(
    vaultOption,
    vaultVersion
  );
  const asset = getAssets(vaultOption);
  const optionAsset = getOptionAssets(vaultOption);
  const { prices, loading: priceLoading } = useAssetsPrice();
  const loading = priceLoading || optionLoading;
  const [showCalculator, setShowCalculator] = useState(false);
  const chain = getVaultChain(vaultOption);

  const loadingText = useTextAnimation(loading);

  const strikeAPRText = useMemo(() => {
    if (optionLoading) return loadingText;

    if (!currentOption) return "---";

    return currency(formatOptionStrike(currentOption.strike, chain)).format();
  }, [chain, currentOption, loadingText, optionLoading]);

  const toExpiryText = useMemo(() => {
    if (optionLoading) return loadingText;

    if (!currentOption) return "---";

    const toExpiryDuration = moment.duration(
      currentOption.expiry.diff(moment()),
      "milliseconds"
    );

    if (toExpiryDuration.asMilliseconds() <= 0) {
      return "Expired";
    }

    return `${toExpiryDuration.days()}D ${toExpiryDuration.hours()}H ${toExpiryDuration.minutes()}M`;
  }, [currentOption, loadingText, optionLoading]);

  const KPI = useMemo(() => {
    if (loading || !currentOption) {
      return undefined;
    }

    const higherStrike =
      formatOptionStrike(currentOption.strike, chain) > prices[optionAsset]!;
    const isExercisedRange = currentOption.isPut ? higherStrike : !higherStrike;
    const assetDecimals = getAssetDecimals(asset);

    let profit: number;

    if (!isExercisedRange) {
      profit = parseFloat(formatUnits(currentOption.premium, assetDecimals));
    } else if (currentOption.isPut) {
      const exerciseCost =
        formatOptionStrike(currentOption.strike, chain) - prices[optionAsset]!;

      profit =
        parseFloat(formatUnits(currentOption.premium, assetDecimals)) -
        currentOption.amount * exerciseCost;
    } else {
      profit =
        (currentOption.amount *
          formatOptionStrike(currentOption.strike, chain)) /
          prices[optionAsset]! -
        currentOption.amount +
        parseFloat(formatUnits(currentOption.premium, assetDecimals));
    }

    return {
      isProfit: profit >= 0,
      roi:
        (profit /
          parseFloat(formatUnits(currentOption.depositAmount, assetDecimals))) *
        100 *
        0.9,
    };
  }, [chain, loading, currentOption, prices, optionAsset, asset]);

  const ProfitabilityText = useMemo(() => {
    if (loading) return loadingText;

    if (!KPI) return "---";

    return `${KPI.roi.toFixed(2)}%`;
  }, [KPI, loading, loadingText]);

  const strikeChart = useMemo(() => {
    if (loading || !prices[optionAsset]) {
      return <Title>{loadingText}</Title>;
    }

    if (!currentOption) {
      return <Title>No strike chosen</Title>;
    }

    return (
      <StrikeChart
        current={prices[optionAsset] || 0}
        strike={formatOptionStrike(currentOption.strike, chain)}
        profitable={KPI ? KPI.isProfit : true}
      />
    );
  }, [chain, prices, currentOption, optionAsset, KPI, loading, loadingText]);

  return (
    <>
      <VaultPerformanceChartContainer>
        {strikeChart}
      </VaultPerformanceChartContainer>
      <VaultPerformanceChartSecondaryContainer>
        <Row noGutters>
          <DataCol xs="6">
            <DataLabel className="d-block">
              Current {getAssetDisplay(optionAsset)} Price
            </DataLabel>
            <DataNumber
              variant={KPI ? (KPI.isProfit ? "green" : "red") : undefined}
            >
              {priceLoading
                ? loadingText
                : currency(prices[optionAsset]!).format()}
            </DataNumber>
          </DataCol>
          <DataCol xs="6">
            <DataLabel className="d-block">
              Selected {getAssetDisplay(optionAsset)} Strike Price
            </DataLabel>
            <DataNumber>{strikeAPRText}</DataNumber>
          </DataCol>
          <DataCol xs="6">
            <div className="d-flex align-items-center">
              <DataLabel className="d-block">This Week's Performance</DataLabel>
              <TooltipExplanation
                title="This Week’s Performance"
                explanation={
                  <>
                    The {getAssetDisplay(asset)} premiums earned from selling
                    options expressed as a percentage of the amount of{" "}
                    {getAssetDisplay(getDisplayAssets(vaultOption))} used to
                    collateralize the options.
                    <br />
                    <br />
                    <SecondaryText color={colors.primaryText}>
                      Performance = (Premiums / Options Collateral)*100
                    </SecondaryText>
                    <br />
                    <br />
                    Fees are not included in this calculation.
                  </>
                }
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    i
                  </HelpInfo>
                )}
              />
            </div>
            <DataNumber
              variant={KPI ? (KPI.isProfit ? "green" : "red") : undefined}
              className="w-100"
            >
              {ProfitabilityText}
            </DataNumber>
          </DataCol>
          <DataCol xs="6">
            <DataLabel className="d-block">Time to Expiry</DataLabel>
            <DataNumber>{toExpiryText}</DataNumber>
          </DataCol>
        </Row>
      </VaultPerformanceChartSecondaryContainer>
      {currentOption && (
        <>
          <CalculatorButton
            color={colors.buttons.secondaryBackground2}
            role="button"
            onClick={() => setShowCalculator(true)}
          >
            <CalculatorButtonText color={colors.buttons.secondaryText}>
              OPEN PROFIT CALCULATOR
            </CalculatorButtonText>
          </CalculatorButton>
          <ProfitCalculatorModal
            vault={vault}
            show={showCalculator}
            onClose={() => setShowCalculator(false)}
            prices={prices}
            asset={asset}
            optionAsset={optionAsset}
            currentOption={currentOption}
          />
        </>
      )}
    </>
  );
};

export default WeeklyStrategySnapshot;
