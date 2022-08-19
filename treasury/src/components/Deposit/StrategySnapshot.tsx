import React, { useMemo } from "react";
import styled from "styled-components";
import currency from "currency.js";
import { Col, Row } from "react-bootstrap";
import moment from "moment";

import theme from "shared/lib/designSystem/theme";
import { useAssetsPrice } from "shared/lib/hooks/useAssetPrice";
import { formatOption } from "shared/lib/utils/math";
import { getAssetDisplay } from "shared/lib/utils/asset";
import {
  getOptionAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import StrikeChart from "webapp/lib/components/Deposit/StrikeChart";
import { useLatestOption } from "shared/lib/hooks/useLatestOption";
import useVaultActivity from "shared/lib/hooks/useVaultActivity";
import { getLatestYieldEarnedFromActivities } from "../../utils";

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

interface StrategySnapshotProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
}

const StrategySnapshot: React.FC<StrategySnapshotProps> = ({ vault }) => {
  const { vaultOption, vaultVersion } = vault;
  const { option: currentOption, loading: optionLoading } = useLatestOption(
    vaultOption,
    vaultVersion
  );

  const optionAsset = getOptionAssets(vaultOption);
  const { prices, loading: priceLoading } = useAssetsPrice();
  const loading = priceLoading || optionLoading;
  const { activities, loading: activitiesLoading } = useVaultActivity(
    vaultOption!,
    vaultVersion
  );

  const loadingText = useLoadingText();

  const latestYield = useMemo(() => {
    if (activitiesLoading) return loadingText;
    const yieldEarned = getLatestYieldEarnedFromActivities(activities);
    if (yieldEarned !== undefined) {
      return currency(yieldEarned).format();
    }
    return undefined;
  }, [activitiesLoading, loadingText, activities]);

  const strikeAPRText = useMemo(() => {
    if (optionLoading) return loadingText;

    if (!currentOption) return "---";

    return currency(formatOption(currentOption.strike)).format();
  }, [currentOption, loadingText, optionLoading]);

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
        strike={formatOption(currentOption.strike)}
        profitable={true}
      />
    );
  }, [prices, currentOption, optionAsset, loading, loadingText]);

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
            <DataNumber variant={undefined}>
              {priceLoading
                ? loadingText
                : currency(prices[optionAsset]!, { precision: 4 }).format()}
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
              <DataLabel className="d-block">Latest Yield Earned</DataLabel>
            </div>
            <DataNumber
              variant={latestYield !== undefined ? "green" : undefined}
            >
              {latestYield === undefined ? "---" : latestYield}
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

export const EmptyStrategySnapshot: React.FC = () => {
  return (
    <>
      <VaultPerformanceChartContainer>
        <Title>No strike chosen</Title>
      </VaultPerformanceChartContainer>
      <VaultPerformanceChartSecondaryContainer>
        <Row noGutters>
          <DataCol xs="6">
            <DataLabel className="d-block">Current Price</DataLabel>
            <DataNumber variant={undefined}>{"---"}</DataNumber>
          </DataCol>
          <DataCol xs="6">
            <DataLabel className="d-block">Selected Strike Price</DataLabel>
            <DataNumber>{"---"}</DataNumber>
          </DataCol>
          <DataCol xs="6">
            <DataLabel className="d-block">Latest Yield Earned</DataLabel>
            <DataNumber variant={undefined}>{"---"}</DataNumber>
          </DataCol>
          <DataCol xs="6">
            <DataLabel className="d-block">Time to Expiry</DataLabel>
            <DataNumber>{"---"}</DataNumber>
          </DataCol>
        </Row>
      </VaultPerformanceChartSecondaryContainer>
    </>
  );
};

export default StrategySnapshot;
