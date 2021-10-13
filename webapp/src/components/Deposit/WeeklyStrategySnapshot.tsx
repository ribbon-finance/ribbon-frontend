import React, { useMemo, useState } from "react";
import styled from "styled-components";
import currency from "currency.js";
import { Col, Row } from "react-bootstrap";
import moment from "moment";
import { BigNumber } from "@ethersproject/bignumber";

import theme from "shared/lib/designSystem/theme";
import { useAssetsPrice } from "shared/lib/hooks/useAssetPrice";
import useVaultActivity from "shared/lib/hooks/useVaultActivity";
import {
  VaultActivityMeta,
  VaultOptionTrade,
  VaultShortPosition,
} from "shared/lib/models/vault";
import { assetToFiat, formatOption } from "shared/lib/utils/math";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import {
  getAssets,
  getOptionAssets,
  isPutVault,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { BaseButton, SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import StrikeChart from "./StrikeChart";
import { getVaultColor } from "shared/lib/utils/vault";
import ProfitCalculatorModal from "./ProfitCalculatorModal";
import { formatUnits } from "@ethersproject/units";

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
  margin-bottom: 4px;
`;

const DataNumber = styled(Title)<{ variant?: "green" | "red" }>`
  font-size: 16px;
  line-height: 24px;
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
  background: ${(props) => props.color}14;
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
  const { activities, loading: activityLoading } = useVaultActivity(
    vaultOption,
    vaultVersion
  );
  const asset = getAssets(vaultOption);
  const optionAsset = getOptionAssets(vaultOption);
  const color = getVaultColor(vaultOption);
  const { prices, loading: priceLoading } = useAssetsPrice({
    assets: [asset, optionAsset],
  });
  const loading = priceLoading || activityLoading;
  const [showCalculator, setShowCalculator] = useState(false);

  const loadingText = useTextAnimation(loading);

  const currentOption = useMemo(() => {
    const sortedActivities = activities
      .filter((activity) => activity.type === "minting")
      .sort((a, b) => (a.date.valueOf() < b.date.valueOf() ? 1 : -1));
    if (sortedActivities.length <= 0) {
      return undefined;
    }
    const latestShortPosition = sortedActivities[0] as VaultShortPosition &
      VaultActivityMeta & { type: "minting" };
    const optionTraded = activities.filter(
      (activity) =>
        activity.type === "sales" &&
        activity.vaultShortPosition.id === latestShortPosition.id
    ) as (VaultOptionTrade & VaultActivityMeta & { type: "sales" })[];

    const decimals = getAssetDecimals(asset);
    const isPut = isPutVault(vaultOption);

    return {
      strike: latestShortPosition.strikePrice,
      expiry: moment(latestShortPosition.expiry, "X"),
      premium: optionTraded.reduce(
        (acc, curr) => acc.add(curr.premium),
        BigNumber.from(0)
      ),
      depositAmount: latestShortPosition.depositAmount,
      amount: isPut
        ? parseFloat(
            assetToFiat(
              latestShortPosition.depositAmount,
              prices[asset]!,
              decimals
            )
          ) / formatOption(latestShortPosition.strikePrice)
        : parseFloat(formatUnits(latestShortPosition.depositAmount, decimals)),
      isPut: isPut,
    };
  }, [activities, asset, prices, vaultOption]);

  const strikeAPRText = useMemo(() => {
    if (activityLoading) return loadingText;

    if (!currentOption) return "---";

    return currency(formatOption(currentOption.strike)).format();
  }, [currentOption, loadingText, activityLoading]);

  const toExpiryText = useMemo(() => {
    if (activityLoading) return loadingText;

    if (!currentOption) return "---";

    const toExpiryDuration = moment.duration(
      currentOption.expiry.diff(moment()),
      "milliseconds"
    );

    if (toExpiryDuration.asMilliseconds() <= 0) {
      return "Expired";
    }

    return `${toExpiryDuration.days()}D ${toExpiryDuration.hours()}H ${toExpiryDuration.minutes()}M`;
  }, [currentOption, loadingText, activityLoading]);

  const KPI = useMemo(() => {
    if (loading || !currentOption) {
      return undefined;
    }

    const higherStrike =
      formatOption(currentOption.strike) > prices[optionAsset]!;
    const isExercisedRange = currentOption.isPut ? higherStrike : !higherStrike;
    const assetDecimals = getAssetDecimals(asset);

    let profit: number;

    if (!isExercisedRange) {
      profit = parseFloat(formatUnits(currentOption.premium, assetDecimals));
    } else if (currentOption.isPut) {
      const exerciseCost =
        formatOption(currentOption.strike) - prices[optionAsset]!;

      profit =
        parseFloat(formatUnits(currentOption.premium, assetDecimals)) -
        currentOption.amount * exerciseCost;
    } else {
      profit =
        (currentOption.amount * formatOption(currentOption.strike)) /
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
  }, [loading, currentOption, prices, optionAsset, asset]);

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
      return <Title>No strike choosen</Title>;
    }

    return (
      <StrikeChart
        current={prices[optionAsset] || 0}
        strike={formatOption(currentOption.strike)}
        profitable={KPI ? KPI.isProfit : true}
      />
    );
  }, [prices, currentOption, optionAsset, KPI, loading, loadingText]);

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
            <DataLabel className="d-block">This Week's Performance</DataLabel>
            <DataNumber
              variant={KPI ? (KPI.isProfit ? "green" : "red") : undefined}
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
            color={color}
            role="button"
            onClick={() => setShowCalculator(true)}
          >
            <CalculatorButtonText color={color}>
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
