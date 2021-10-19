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
import { BigNumber } from "@ethersproject/bignumber";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import {
  useAssetsPrice,
  useAssetsPriceHistory,
} from "shared/lib/hooks/useAssetPrice";
import useBalances from "shared/lib/hooks/useBalances";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { assetToFiat, formatBigNumber } from "shared/lib/utils/math";
import PerformanceChart from "../PerformanceChart/PerformanceChart";
import { HoverInfo } from "../PerformanceChart/types";
import sizes from "shared/lib/designSystem/sizes";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import { getAssets } from "shared/lib/constants/constants";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import { Assets } from "shared/lib/store/types";

const PerformanceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  background: ${colors.background.two};
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
  width: calc(100% / 3);
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  border-left: ${theme.border.width} ${theme.border.style} ${colors.border};

  &:first-child {
    border-left: none;
  }

  @media (max-width: ${sizes.md}px) {
    width: 100%;
    border-left: unset;
    border-top: ${theme.border.width} ${theme.border.style} ${colors.border};

    &:first-child {
      border-top: none;
    }
  }
`;

const KPI = styled.div`
  display: flex;
  align-items: center;
`;

const DepositAmount = styled(Title)<{ active: boolean }>`
  font-size: 32px;
  line-height: 48px;
  ${(props) => (!props.active ? `opacity: 0.16;` : null)}
`;

const DepositCurrency = styled(Subtitle)`
  font-size: 16px;
  margin-left: 16px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
`;

const KPIText = styled(Title)<{ active: boolean; state?: "green" | "red" }>`
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
  const { prices: assetsPrice, loading: assetsPriceLoading } = useAssetsPrice();
  const { searchAssetPriceFromTimestamp } = useAssetsPriceHistory();
  const [hoveredBalanceUpdateIndex, setHoveredBalanceUpdateIndex] =
    useState<number>();
  const [rangeFilter, setRangeFilter] = useState<dateFilterType>("1m");
  const [, setShowConnectWalletModal] = useConnectWalletModal();
  const { data: RBNTokenAccount, loading: RBNTokenAccountLoading } =
    useRBNTokenAccount();

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
    assetsPriceLoading || balanceUpdatesLoading || RBNTokenAccountLoading;
  const animatedLoadingText = useTextAnimation(loading);

  /**
   * We process balances into fiat term before perform more processing
   * balances[].balance - Total balance of user portfolio up until that point
   * balances[].netDeposit - Net deposit of user in that specific round
   * balances[].netProfit - Net profit of user in that round. This takes into account of asset price fluctuation and yield earned
   * balances[].netYield - This only account for the fiat amount of yield for a given round
   * balances[].timestamp - timestamp of the balance update
   */
  const {
    balances,
    vaultTotalDeposit,
    vaultTotalYieldEarned,
    vaultBalanceInAsset,
  } = useMemo(() => {
    const vaultLastBalances: {
      [key: string]: {
        asset: Assets;
        fiatBalance: number;
        cryptoBalance: BigNumber;
        totalDeposit: number;
        totalYieldEarned: number;
      };
    } = {};
    let balances: {
      balance: number;
      netDeposit: number;
      netProfit: number;
      netYield: number;
      timestamp: number;
    }[];

    balances = balanceUpdates.map((balanceUpdate) => {
      const currentAsset = getAssets(balanceUpdate.vault.symbol);
      const currentAssetDecimals = getAssetDecimals(currentAsset);
      const vaultKey = balanceUpdate.vault.symbol + balanceUpdate.vaultVersion;
      const currentAssetPrice = searchAssetPriceFromTimestamp(
        currentAsset,
        balanceUpdate.timestamp * 1000
      );

      const vaultLastBalance = vaultLastBalances[vaultKey];
      //Calculate current balance in fiat
      const vaultCurrentFiatBalance = parseFloat(
        assetToFiat(
          balanceUpdate.balance,
          currentAssetPrice,
          currentAssetDecimals
        )
      );

      /**
       * If this is the first balanceUpdate, we take the balance as starting balance for calculating any further ROI
       */
      if (!vaultLastBalance) {
        vaultLastBalances[vaultKey] = {
          asset: currentAsset,
          fiatBalance: vaultCurrentFiatBalance,
          cryptoBalance: balanceUpdate.balance,
          totalDeposit: vaultCurrentFiatBalance,
          totalYieldEarned: 0,
        };

        return {
          balance: Object.keys(vaultLastBalances).reduce((acc, curr) => {
            const vaultLastBalance = vaultLastBalances[curr];
            return (
              acc +
              parseFloat(
                assetToFiat(
                  vaultLastBalance.cryptoBalance,
                  searchAssetPriceFromTimestamp(
                    vaultLastBalance.asset,
                    balanceUpdate.timestamp * 1000
                  ),
                  getAssetDecimals(vaultLastBalance.asset)
                )
              )
            );
          }, 0),
          netDeposit: vaultCurrentFiatBalance,
          netProfit: 0,
          netYield: 0,
          timestamp: balanceUpdate.timestamp,
        };
      }

      // Find out net changes in vault amount
      const vaultNetCryptoChange = balanceUpdate.balance.sub(
        vaultLastBalance.cryptoBalance
      );

      // let netProfit: number = 0;
      let netDeposit: number = 0;
      let netYield: number = 0;

      if (vaultNetCryptoChange.gt(BigNumber.from(0))) {
        // If crypto balance goes up
        if (balanceUpdate.yieldEarned.isZero()) {
          // User deposit
          netDeposit = parseFloat(
            assetToFiat(
              vaultNetCryptoChange,
              currentAssetPrice,
              currentAssetDecimals
            )
          );
        } else {
          // Yield gained
          netYield = parseFloat(
            assetToFiat(
              balanceUpdate.yieldEarned,
              currentAssetPrice,
              currentAssetDecimals
            )
          );
        }
      } else {
        // If crypto balance goes down
        if (balanceUpdate.isWithdraw) {
          // Balance decrease due to withdraw
          netDeposit = parseFloat(
            assetToFiat(
              vaultNetCryptoChange,
              currentAssetPrice,
              currentAssetDecimals
            )
          );
        } else {
          // Vault value goes down, causing losses
          netYield = parseFloat(
            assetToFiat(
              vaultNetCryptoChange,
              currentAssetPrice,
              currentAssetDecimals
            )
          );
        }
      }

      vaultLastBalances[vaultKey] = {
        asset: currentAsset,
        fiatBalance: vaultCurrentFiatBalance,
        cryptoBalance: balanceUpdate.balance,
        totalDeposit:
          (vaultLastBalances[vaultKey]?.totalDeposit ?? 0) + netDeposit,
        totalYieldEarned:
          (vaultLastBalances[vaultKey]?.totalYieldEarned ?? 0) + netYield,
      };

      return {
        balance: Object.keys(vaultLastBalances).reduce((acc, curr) => {
          const vaultLastBalance = vaultLastBalances[curr];
          return (
            acc +
            parseFloat(
              assetToFiat(
                vaultLastBalance.cryptoBalance,
                searchAssetPriceFromTimestamp(
                  vaultLastBalance.asset,
                  balanceUpdate.timestamp * 1000
                ),
                getAssetDecimals(vaultLastBalance.asset)
              )
            )
          );
        }, 0),
        netDeposit,
        netProfit:
          vaultCurrentFiatBalance - vaultLastBalance.fiatBalance - netDeposit,
        netYield,
        timestamp: balanceUpdate.timestamp,
      };
    });

    /**
     * Add current point in portfolio chart
     */
    const lastFiatBalance = Object.keys(vaultLastBalances).reduce<number>(
      (acc, curr) => {
        const vaultLastBalance = vaultLastBalances[curr];
        const vaultCurrentFiatBalance = parseFloat(
          assetToFiat(
            vaultLastBalance.cryptoBalance,
            assetsPrice[vaultLastBalance.asset],
            getAssetDecimals(vaultLastBalance.asset)
          )
        );

        vaultLastBalances[curr] = {
          ...vaultLastBalance,
          fiatBalance: vaultCurrentFiatBalance,
        };

        return acc + vaultLastBalance.fiatBalance;
      },
      0
    );
    const currentFiatBalance = Object.keys(vaultLastBalances).reduce(
      (acc, curr) => {
        const vaultLastBalance = vaultLastBalances[curr];
        return (
          acc +
          parseFloat(
            assetToFiat(
              vaultLastBalance.cryptoBalance,
              assetsPrice[vaultLastBalance.asset],
              getAssetDecimals(vaultLastBalance.asset)
            )
          )
        );
      },
      0
    );
    balances.push({
      balance: currentFiatBalance,
      netDeposit: 0,
      netProfit: currentFiatBalance - lastFiatBalance,
      netYield: 0,
      timestamp: new Date().valueOf() / 1000,
    });

    return {
      balances,
      vaultTotalDeposit: Object.keys(vaultLastBalances).reduce(
        (acc, curr) =>
          acc +
          // Rule out withdrew vault
          (vaultLastBalances[curr].fiatBalance > 0
            ? vaultLastBalances[curr].totalDeposit
            : 0),
        0
      ),
      vaultTotalYieldEarned: Object.keys(vaultLastBalances).reduce(
        (acc, curr) =>
          acc +
          (vaultLastBalances[curr].fiatBalance > 0
            ? vaultLastBalances[curr].totalYieldEarned
            : 0),
        0
      ),
      vaultBalanceInAsset: Object.keys(vaultLastBalances).reduce(
        (acc, curr) =>
          acc +
          (vaultLastBalances[curr].fiatBalance > 0
            ? vaultLastBalances[curr].fiatBalance
            : 0),
        0
      ),
    };
  }, [assetsPrice, balanceUpdates, searchAssetPriceFromTimestamp]);

  const calculatedKPI = useMemo(() => {
    if (hoveredBalanceUpdateIndex === undefined || balances.length <= 0) {
      return {
        yield: vaultTotalYieldEarned,
        roi:
          vaultTotalDeposit > 0
            ? ((vaultBalanceInAsset - vaultTotalDeposit) / vaultTotalDeposit) *
              100
            : 0,
        balance: vaultBalanceInAsset,
      };
    }

    let balancesToCalculate = balances
      .slice(
        hoveredBalanceUpdateIndex >= 0 ? hoveredBalanceUpdateIndex + 1 : 1,
        balances.length
      )
      .reverse();
    let netYield = vaultTotalYieldEarned;
    let netProfit = vaultBalanceInAsset - vaultTotalDeposit;
    let totalInvestment = vaultTotalDeposit;

    for (let i = 0; i < balancesToCalculate.length; i++) {
      const currentBalanceObj = balancesToCalculate[i];
      totalInvestment -= currentBalanceObj.netDeposit;
      netProfit -= currentBalanceObj.netProfit;
      netYield -= currentBalanceObj.netYield;
    }

    netYield = parseFloat(netYield.toFixed(2));

    return {
      yield: netYield,
      roi: totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0,
      balance: totalInvestment + netProfit,
    };
  }, [
    balances,
    hoveredBalanceUpdateIndex,
    vaultBalanceInAsset,
    vaultTotalDeposit,
    vaultTotalYieldEarned,
  ]);

  const renderBalanceText = useCallback(() => {
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

    return `${calculatedKPI.yield >= 0 ? "+" : ""}${currency(
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

  const renderRBNBalanceText = useCallback(() => {
    if (!active) {
      return "---";
    }

    if (loading) {
      return animatedLoadingText;
    }

    return RBNTokenAccount
      ? formatBigNumber(RBNTokenAccount.balance, 18)
      : "0.00";
  }, [RBNTokenAccount, active, animatedLoadingText, loading]);

  const depositHeader = useMemo(
    () => (
      <DepositChartExtra>
        <SecondaryText fontSize={12} className="w-100">
          Balances
        </SecondaryText>
        <div className="d-flex align-items-center flex-wrap">
          <KPI>
            <DepositAmount active={active}>{renderBalanceText()}</DepositAmount>
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
    [rangeFilter, renderBalanceText, active, loading]
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
          <SecondaryText fontSize={12} className="w-100">
            Yield Earned
          </SecondaryText>
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
          <SecondaryText fontSize={12} className="w-100">
            ROI
          </SecondaryText>
          <KPIText
            active={active}
            state={
              calculatedKPI.roi === 0
                ? undefined
                : calculatedKPI.roi > 0
                ? "green"
                : "red"
            }
          >
            {renderRoiText()}
          </KPIText>
        </KPIColumn>
        <KPIColumn>
          <SecondaryText fontSize={12} color={colors.red} className="w-100">
            $RBN Balance
          </SecondaryText>
          <KPIText active={active}>{renderRBNBalanceText()}</KPIText>
        </KPIColumn>
      </PerformanceColumn>
    </PerformanceContainer>
  );
};

export default PortfolioPerformance;
