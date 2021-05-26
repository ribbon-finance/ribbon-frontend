import { useWeb3React } from "@web3-react/core";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import {
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import moment from "moment";
import currency from "currency.js";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { useAssetsPrice } from "../../hooks/useAssetPrice";
import useBalances from "../../hooks/useBalances";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { assetToFiat } from "shared/lib/utils/math";
import PerformanceChart from "../PerformanceChart/PerformanceChart";
import { HoverInfo } from "../PerformanceChart/types";
import sizes from "shared/lib/designSystem/sizes";
import useConnectWalletModal from "../../hooks/useConnectWalletModal";
import { getAssets, VaultList } from "shared/lib/constants/constants";
import useVaultAccounts from "../../hooks/useVaultAccounts";
import { AssetsList } from "shared/lib/store/types";
import { getAssetDecimals } from "shared/lib/utils/asset";

const PerformanceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  margin-top: 24px;
`;

const PerformanceColumn = styled.div`
  width: 100%;
  border-bottom: ${theme.border.width} ${theme.border.style} ${colors.border};
  display: flex;
  flex-wrap: wrap;

  &:last-child {
    border-bottom: unset;
  }
`;

const DepositColumn = styled(PerformanceColumn)`
  padding-bottom: 24px;
  position: relative;
`;

const DepositChartExtra = styled.div`
  width: 100%;
  padding: 16px;
`;

const DateFilters = styled.div`
  margin-left: auto;

  @media (max-width: ${sizes.sm}px) {
    margin-top: 24px;
    width: 100%;
  }
`;

const DateFilter = styled(Title)<{ active: boolean }>`
  font-size: 12px;
  letter-spacing: 1.5px;
  cursor: pointer;
  color: ${(props) => (props.active ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)")};
  margin-right: 24px;

  &:last-child {
    margin-right: unset;
  }
`;

const ChartConnectWalletContainer = styled.div`
  width: 100%;
  height: 224px;
  border-top: ${theme.border.width} ${theme.border.style} ${colors.border};
`;

const ConnectWalletButton = styled(PrimaryText)`
  color: ${colors.green};
`;

const KPIColumn = styled.div`
  width: 50%;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;

  &:first-child {
    border-right: ${theme.border.width} ${theme.border.style} ${colors.border};
  }

  @media (max-width: ${sizes.sm}px) {
    width: 100%;

    &:first-child {
      border-right: none;
      border-bottom: ${theme.border.width} ${theme.border.style}
        ${colors.border};
    }
  }
`;

const ColumnLabel = styled(SecondaryText)`
  font-size: 12px;
  width: 100%;
`;

const KPI = styled.div`
  display: flex;
  align-items: center;
`;

const DepositAmount = styled(Title)<{ active: boolean }>`
  font-size: 40px;
  line-height: 48px;
  ${(props) => (!props.active ? `opacity: 0.16;` : null)}
`;

const DepositCurrency = styled(Subtitle)`
  font-size: 16px;
  margin-left: 16px;
  color: rgba(255, 255, 255, 0.16);
  text-transform: uppercase;
`;

const KPIText = styled(Title)<{ active: boolean; state?: "green" | "red" }>`
  font-size: 18px;
  line-height: 24px;
  color: ${(props) => {
    if (!props.active) {
      return "rgba(255, 255, 255, 0.4)";
    }

    switch (props.state) {
      case "green":
        return colors.green;
      case "red":
        return colors.red;
      default:
        return colors.primaryText;
    }
  }};
`;

const dateFilterOptions = ["24h", "1w", "1m", "all"] as const;
type dateFilterType = typeof dateFilterOptions[number];

const PortfolioPerformance = () => {
  const { active } = useWeb3React();
  const { prices: assetPrices, loading: assetPricesLoading } = useAssetsPrice({
    // @ts-ignore
    assets: AssetsList,
  });
  const { vaultAccounts, loading: vaultAccountLoading } =
    useVaultAccounts(VaultList);
  const [hoveredBalanceUpdateIndex, setHoveredBalanceUpdateIndex] =
    useState<number>();
  const [rangeFilter, setRangeFilter] = useState<dateFilterType>("1m");
  const [, setShowConnectWalletModal] = useConnectWalletModal();

  const { deposit: vaultTotalDeposit, balance: vaultBalanceInAsset } =
    useMemo(() => {
      let deposit = 0;
      let balance = 0;

      Object.keys(vaultAccounts).forEach((key) => {
        const vaultAccount = vaultAccounts[key];
        if (vaultAccount) {
          const currentAsset = getAssets(vaultAccount.vault.symbol);
          const currentAssetDecimals = getAssetDecimals(currentAsset);
          deposit += parseFloat(
            assetToFiat(
              vaultAccount.totalDeposits,
              // @ts-ignore
              assetPrices[currentAsset],
              currentAssetDecimals
            )
          );
          balance += parseFloat(
            assetToFiat(
              vaultAccount.totalBalance,
              // @ts-ignore
              assetPrices[currentAsset],
              currentAssetDecimals
            )
          );
        }
      });

      return { deposit, balance };
    }, [vaultAccounts, assetPrices]);

  const afterDate = useMemo(() => {
    switch (rangeFilter) {
      case "24h":
        return moment().subtract(1, "days");
      case "1w":
        return moment().subtract(1, "weeks");
      case "1m":
        return moment().subtract(1, "months");
    }
  }, [rangeFilter]);

  // Fetch balances update
  const { balances: balanceUpdates, loading: balanceUpdatesLoading } =
    useBalances(undefined, afterDate ? afterDate.unix() : undefined);
  const loading =
    assetPricesLoading || vaultAccountLoading || balanceUpdatesLoading;
  const animatedLoadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    loading
  );

  // Accumulate balance with USD value
  const balances = useMemo(() => {
    const vaultLastBalances: { [key: string]: number } = {};
    let balances: {
      balance: number;
      netDeposit: number;
      netProfit: number;
      timestamp: number;
    }[];

    balances = balanceUpdates.map((balanceUpdate) => {
      const currentAsset = getAssets(balanceUpdate.vault.symbol);
      const currentAssetDecimals = getAssetDecimals(currentAsset);

      const vaultLastBalance =
        vaultLastBalances[balanceUpdate.vault.symbol] || 0;
      const vaultCurrentBalance = parseFloat(
        assetToFiat(
          balanceUpdate.balance,
          // @ts-ignore
          assetPrices[currentAsset],
          currentAssetDecimals
        )
      );
      const vaultNetChange = vaultCurrentBalance - vaultLastBalance;
      let netProfit: number = 0;
      let netDeposit: number = 0;

      if (vaultNetChange >= 0) {
        // If balance goes up
        if (balanceUpdate.yieldEarned.isZero()) {
          // User deposit
          netDeposit = vaultNetChange;
        } else {
          // Yield gained
          netProfit = parseFloat(
            assetToFiat(
              balanceUpdate.yieldEarned,
              // @ts-ignore
              assetPrices[currentAsset],
              currentAssetDecimals
            )
          );
        }
      } else {
        // If balance goes down
        if (balanceUpdate.isWithdraw) {
          // Balance decrease due to withdraw
          netDeposit = vaultNetChange;
        } else {
          // Vault value goes down, causing losses
          netProfit = vaultNetChange;
        }
      }

      vaultLastBalances[balanceUpdate.vault.symbol] = vaultCurrentBalance;

      return {
        balance: Object.keys(vaultLastBalances).reduce(
          (acc, curr) => acc + vaultLastBalances[curr],
          0
        ),
        netDeposit,
        netProfit,
        timestamp: balanceUpdate.timestamp,
      };
    });

    return balances;
  }, [balanceUpdates, assetPrices]);

  const calculatedKPI = useMemo(() => {
    if (hoveredBalanceUpdateIndex === undefined || balances.length <= 0) {
      return {
        yield: vaultBalanceInAsset - vaultTotalDeposit,
        roi:
          vaultTotalDeposit > 0
            ? ((vaultBalanceInAsset - vaultTotalDeposit) / vaultTotalDeposit) *
              100
            : 0,
        balance: vaultBalanceInAsset,
      };
    }

    let balancesToCalculate = balances.slice(
      0,
      hoveredBalanceUpdateIndex >= 0 ? hoveredBalanceUpdateIndex + 1 : 1
    );
    let totalInvestment = 0;
    let netProfit = 0;

    for (let i = 0; i < balancesToCalculate.length; i++) {
      const currentBalanceObj = balancesToCalculate[i];
      totalInvestment += currentBalanceObj.netDeposit;
      netProfit += currentBalanceObj.netProfit;
    }

    return {
      yield: netProfit,
      roi: totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0,
      balance: totalInvestment + netProfit,
    };
  }, [
    balances,
    hoveredBalanceUpdateIndex,
    vaultTotalDeposit,
    vaultBalanceInAsset,
  ]);

  const renderDepositText = useCallback(() => {
    if (!active) {
      return "---";
    }

    if (loading) {
      return animatedLoadingText;
    }

    return currency(calculatedKPI.balance.toFixed(2)).format();
  }, [active, animatedLoadingText, loading, calculatedKPI]);

  const handleChartHover = useCallback(
    (hoverInfo: HoverInfo) => {
      setHoveredBalanceUpdateIndex(
        hoverInfo.focused
          ? balances.findIndex(
              (balance) =>
                balance.timestamp * 1000 === hoverInfo.xData.getTime()
            )
          : undefined
      );
    },
    [balances]
  );

  const renderYieldEarnedText = useCallback(() => {
    if (!active) {
      return "---";
    }

    if (loading) {
      return animatedLoadingText;
    }

    return `${calculatedKPI.roi >= 0 ? "+" : ""}${currency(
      calculatedKPI.yield.toFixed(2)
    ).format()}`;
  }, [active, calculatedKPI, loading, animatedLoadingText]);

  const renderRoiText = useCallback(() => {
    if (!active) {
      return "---";
    }

    if (loading) {
      return animatedLoadingText;
    }

    return `${calculatedKPI.roi >= 0 ? "+" : ""}${calculatedKPI.roi.toFixed(
      2
    )}%`;
  }, [active, loading, animatedLoadingText, calculatedKPI]);

  const depositHeader = useMemo(
    () => (
      <DepositChartExtra>
        <ColumnLabel>Balances</ColumnLabel>
        <div className="d-flex align-items-center flex-wrap">
          <KPI>
            <DepositAmount active={active}>{renderDepositText()}</DepositAmount>
            <DepositCurrency>{active && !loading ? "USD" : ""}</DepositCurrency>
          </KPI>
          <DateFilters>
            {dateFilterOptions.map((currRange) => (
              <DateFilter
                key={currRange}
                active={rangeFilter === currRange}
                onClick={() => setRangeFilter(currRange)}
              >
                {currRange.toUpperCase()}
              </DateFilter>
            ))}
          </DateFilters>
        </div>
      </DepositChartExtra>
    ),
    [rangeFilter, renderDepositText, active, loading]
  );

  const processedGraphData = useMemo(() => {
    if (balances.length > 2) {
      return {
        dataset: balances.map((balance) => balance.balance),
        labels: balances.map((balance) => new Date(balance.timestamp * 1000)),
      };
    }

    if (balances.length === 1) {
      return {
        dataset: [balances[0].balance, balances[0].balance],
        labels: [
          afterDate?.toDate() || new Date(),
          new Date(balances[0].timestamp * 1000),
        ],
      };
    }

    return {
      dataset: [vaultBalanceInAsset, vaultBalanceInAsset],
      labels: [afterDate?.toDate() || new Date(), new Date()],
    };
  }, [balances, afterDate, vaultBalanceInAsset]);

  return (
    <PerformanceContainer>
      <DepositColumn>
        {active ? (
          <PerformanceChart
            dataset={processedGraphData.dataset}
            labels={processedGraphData.labels}
            onChartHover={handleChartHover}
            extras={depositHeader}
          />
        ) : (
          <>
            {depositHeader}
            <ChartConnectWalletContainer className="d-flex align-items-center justify-content-center">
              <ConnectWalletButton
                role="button"
                onClick={() => {
                  setShowConnectWalletModal(true);
                }}
              >
                Connect your wallet
              </ConnectWalletButton>
            </ChartConnectWalletContainer>
          </>
        )}
      </DepositColumn>
      <PerformanceColumn>
        <KPIColumn>
          <ColumnLabel>Yield Earned</ColumnLabel>
          <KPI>
            <KPIText
              active={active}
              state={
                calculatedKPI.yield === 0
                  ? undefined
                  : calculatedKPI.yield > 0
                  ? "green"
                  : "red"
              }
            >
              {renderYieldEarnedText()}
            </KPIText>
            <DepositCurrency>{active && !loading ? "USD" : ""}</DepositCurrency>
          </KPI>
        </KPIColumn>
        <KPIColumn>
          <ColumnLabel>ROI</ColumnLabel>
          <KPIText
            active={active}
            state={
              calculatedKPI.yield === 0
                ? undefined
                : calculatedKPI.yield > 0
                ? "green"
                : "red"
            }
          >
            {renderRoiText()}
          </KPIText>
        </KPIColumn>
      </PerformanceColumn>
    </PerformanceContainer>
  );
};

export default PortfolioPerformance;
