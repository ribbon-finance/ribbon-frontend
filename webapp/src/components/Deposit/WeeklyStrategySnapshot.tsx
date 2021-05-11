import React, { useMemo } from "react";
import styled from "styled-components";
import currency from "currency.js";
import { Col, Row } from "react-bootstrap";
import moment from "moment";
import { BigNumber } from "@ethersproject/bignumber";

import theme from "shared/lib/designSystem/theme";
import { useAssetsPrice } from "../../hooks/useAssetPrice";
import useVaultActivity from "../../hooks/useVaultActivity";
import {
  VaultActivityMeta,
  VaultOptionTrade,
  VaultShortPosition,
} from "shared/lib/models/vault";
import {
  assetToFiat,
  formatOption,
  annualizedPerformance,
} from "shared/lib/utils/math";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import {
  getAssets,
  getOptionAssets,
  isPutVault,
  VaultOptions,
} from "shared/lib/constants/constants";
import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import StrikeChart from "./StrikeChart";

const VaultPerformanceChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  padding: 30px 0;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 4px 4px 0px 0px;
`;

const VaultPerformanceChartSecondaryContainer = styled.div`
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-top: none;
  border-radius: 0px 0px 4px 4px;
`;

const DataCol = styled(Col)`
  border-top: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-right: ${theme.border.width} ${theme.border.style} ${colors.border};

  && {
    padding: 16px;
  }

  &:nth-child(-n + 2) {
    border-top: none;
  }

  &:nth-child(even) {
    border-right: none;
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

interface WeeklyStrategySnapshotProps {
  vaultOption: VaultOptions;
}

const WeeklyStrategySnapshot: React.FC<WeeklyStrategySnapshotProps> = ({
  vaultOption,
}) => {
  const { activities, loading: activityLoading } = useVaultActivity(
    vaultOption
  );
  const asset = getAssets(vaultOption);
  const optionAsset = getOptionAssets(vaultOption);
  const { prices, loading: priceLoading } = useAssetsPrice({
    assets: [asset, optionAsset],
  });
  const loading = priceLoading || activityLoading;

  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    loading
  );

  // Calculate the latest option short position
  const latestShortPosition = useMemo(() => {
    const sortedActivities = activities
      .filter((activity) => activity.type === "minting")
      .sort((a, b) => (a.date.valueOf() < b.date.valueOf() ? 1 : -1));

    if (sortedActivities.length <= 0) {
      return undefined;
    }

    return sortedActivities[0] as VaultShortPosition &
      VaultActivityMeta & { type: "minting" };
  }, [activities]);

  const strikeAPRText = useMemo(() => {
    if (activityLoading) return loadingText;

    if (!latestShortPosition) return "---";

    return currency(formatOption(latestShortPosition.strikePrice)).format();
  }, [latestShortPosition, loadingText, activityLoading]);

  const toExpiryText = useMemo(() => {
    if (activityLoading) return loadingText;

    if (!latestShortPosition) return "---";

    const toExpiryDuration = moment.duration(
      moment(latestShortPosition.expiry, "X").diff(moment()),
      "milliseconds"
    );

    if (toExpiryDuration.asMilliseconds() <= 0) {
      return "Expired";
    }

    return `${toExpiryDuration.days()}D ${toExpiryDuration.hours()}H ${toExpiryDuration.minutes()}M`;
  }, [latestShortPosition, loadingText, activityLoading]);

  const KPI = useMemo(() => {
    if (loading || !latestShortPosition) {
      return undefined;
    }

    const higherStrike =
      formatOption(latestShortPosition.strikePrice) > prices[optionAsset]!;
    const isPut = isPutVault(vaultOption);
    const isExercisedRange = isPut ? higherStrike : !higherStrike;

    const optionTraded = activities.filter(
      (activity) =>
        activity.type === "sales" &&
        activity.vaultShortPosition.id === latestShortPosition.id
    ) as (VaultOptionTrade & VaultActivityMeta & { type: "sales" })[];

    const totalYield = optionTraded.reduce(
      (acc, curr) => acc.add(curr.premium),
      BigNumber.from(0)
    );

    let profit: number;

    if (!isExercisedRange) {
      profit = parseFloat(
        assetToFiat(totalYield, prices[asset]!, getAssetDecimals(asset))
      );
    } else if (isPut) {
      const exerciseCost =
        formatOption(latestShortPosition.strikePrice) - prices[optionAsset]!;
      const soldAmount =
        parseFloat(
          assetToFiat(
            latestShortPosition.depositAmount,
            prices[asset]!,
            getAssetDecimals(asset)
          )
        ) / formatOption(latestShortPosition.strikePrice);

      profit =
        parseFloat(
          assetToFiat(totalYield, prices[asset]!, getAssetDecimals(asset))
        ) -
        soldAmount * exerciseCost;
    } else {
      const exerciseCost =
        prices[optionAsset]! - formatOption(latestShortPosition.strikePrice);

      profit =
        parseFloat(
          assetToFiat(totalYield, prices[asset]!, getAssetDecimals(asset))
        ) -
        parseFloat(
          assetToFiat(
            latestShortPosition.depositAmount,
            exerciseCost,
            getAssetDecimals(optionAsset)
          )
        );
    }

    return {
      isProfit: profit >= 0,
      roi:
        annualizedPerformance(
          profit /
            parseFloat(
              assetToFiat(
                latestShortPosition.depositAmount,
                prices[asset]!,
                getAssetDecimals(asset)
              )
            )
        ) * 100,
    };
  }, [
    activities,
    loading,
    latestShortPosition,
    vaultOption,
    prices,
    optionAsset,
    asset,
  ]);

  const ProfitabilityText = useMemo(() => {
    if (loading) return loadingText;

    if (!KPI) return "---";

    return `${KPI.roi.toFixed(2)}%`;
  }, [KPI, loading, loadingText]);

  const strikeChart = useMemo(() => {
    if (loading) {
      return <Title>{loadingText}</Title>;
    }

    if (!latestShortPosition) {
      return <Title>No strike choosen</Title>;
    }

    return (
      <StrikeChart
        current={prices[optionAsset] || 0}
        strike={
          latestShortPosition
            ? formatOption(latestShortPosition.strikePrice)
            : 0
        }
        profitable={KPI ? KPI.isProfit : true}
      />
    );
  }, [prices, latestShortPosition, optionAsset, KPI, loading, loadingText]);

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
            <DataLabel className="d-block">
              Profitability (Annualised)
            </DataLabel>
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
    </>
  );
};

export default WeeklyStrategySnapshot;
