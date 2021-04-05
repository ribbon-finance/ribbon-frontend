import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import {
  PrimaryText,
  SecondaryText,
  Subtitle,
  Title,
} from "../../designSystem";
import moment from "moment";

import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import useAssetPrice from "../../hooks/useAssetPrice";
import useBalances from "../../hooks/useBalances";
import useTextAnimation from "../../hooks/useTextAnimation";
import { CurrencyType } from "../../pages/Portfolio/types";
import { ethToUSD, toETH } from "../../utils/math";
import PerformanceChart from "../PerformanceChart/PerformanceChart";
import { HoverInfo } from "../PerformanceChart/types";
import useVaultData from "../../hooks/useVaultData";
import { BalanceUpdate } from "../../models/vault";
import sizes from "../../designSystem/sizes";
import useConnectWalletModal from "../../hooks/useConnectWalletModal";

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

interface PortfolioPerformanceProps {
  currency: CurrencyType;
}

const dateFilterOptions = ["24h", "1w", "1m", "all"] as const;
type dateFilterType = typeof dateFilterOptions[number];

const PortfolioPerformance: React.FC<PortfolioPerformanceProps> = ({
  currency,
}) => {
  const { active } = useWeb3React();
  const { vaultBalanceInAsset } = useVaultData();
  const { price: ethPrice, loading: ethPriceLoading } = useAssetPrice({
    asset: "WETH",
  });
  const animatedLoadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    ethPriceLoading
  );
  const [
    hoveredBalanceUpdate,
    setHoveredBalanceUpdate,
  ] = useState<BalanceUpdate>();
  const [rangeFilter, setRangeFilter] = useState<dateFilterType>("1m");
  const [, setShowConnectWalletModal] = useConnectWalletModal();

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

  const { balances, loading } = useBalances(
    undefined,
    afterDate ? afterDate.unix() : undefined
  );
  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    loading
  );

  const getDepositAmount = useCallback(() => {
    switch (currency) {
      case "eth":
        return toETH(
          hoveredBalanceUpdate
            ? hoveredBalanceUpdate.balance
            : vaultBalanceInAsset,
          2
        );
      case "usd":
        return ethPriceLoading
          ? animatedLoadingText
          : ethToUSD(
              hoveredBalanceUpdate
                ? hoveredBalanceUpdate.balance
                : vaultBalanceInAsset,
              ethPrice
            );
    }
  }, [
    currency,
    ethPrice,
    hoveredBalanceUpdate,
    vaultBalanceInAsset,
    ethPriceLoading,
    animatedLoadingText,
  ]);

  const renderDepositData = useCallback(() => {
    if (!active) {
      return (
        <KPI>
          <DepositAmount active={active}>---</DepositAmount>
        </KPI>
      );
    }

    if (loading) {
      return (
        <KPI>
          <DepositAmount active={active}>{loadingText}</DepositAmount>
        </KPI>
      );
    }

    return (
      <KPI>
        <DepositAmount active={active}>{getDepositAmount()}</DepositAmount>
        <DepositCurrency>{currency}</DepositCurrency>
      </KPI>
    );
  }, [active, currency, loadingText, loading, getDepositAmount]);

  const handleChartHover = useCallback(
    (hoverInfo: HoverInfo) => {
      setHoveredBalanceUpdate(
        hoverInfo.focused
          ? balances.find(
              (balance) =>
                balance.timestamp * 1000 === hoverInfo.xData.getTime()
            )
          : undefined
      );
    },
    [balances]
  );

  const calculatedKPI = useMemo(() => {
    if (balances.length <= 0) {
      return {
        yield: BigNumber.from(0),
        roi: 0,
      };
    }

    let balancesToCalculate = hoveredBalanceUpdate
      ? balances.slice(0, balances.indexOf(hoveredBalanceUpdate) + 1)
      : balances;
    let totalInvestment = BigNumber.from(0);
    let yieldEarned = BigNumber.from(0);
    let lastBalance = BigNumber.from(0);

    for (let i = 0; i < balancesToCalculate.length; i++) {
      const currentBalanceObj = balancesToCalculate[i];
      totalInvestment = totalInvestment.add(
        currentBalanceObj.balance
          .sub(lastBalance)
          .sub(currentBalanceObj.yieldEarned)
      );
      yieldEarned = yieldEarned.add(currentBalanceObj.yieldEarned);
      lastBalance = currentBalanceObj.balance;
    }

    if (totalInvestment.lte(0)) {
      return {
        yield: BigNumber.from(0),
        roi: 0,
      };
    }

    return {
      yield: yieldEarned,
      roi:
        (parseFloat(ethers.utils.formatEther(yieldEarned)) /
          parseFloat(ethers.utils.formatEther(totalInvestment))) *
        100,
    };
  }, [balances, hoveredBalanceUpdate]);

  const renderYieldEarnedText = useCallback(() => {
    if (!active) {
      return "---";
    }

    switch (currency) {
      case "eth":
        return `+${toETH(calculatedKPI.yield, 2)}`;
      case "usd":
        return `+${ethToUSD(calculatedKPI.yield, ethPrice)}`;
    }
  }, [active, calculatedKPI, currency, ethPrice]);

  const depositHeader = useMemo(
    () => (
      <DepositChartExtra>
        <ColumnLabel>Deposits</ColumnLabel>
        <div className="d-flex align-items-center flex-wrap">
          {renderDepositData()}
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
    [rangeFilter, renderDepositData]
  );

  const processedGraphData = useMemo(() => {
    if (balances.length > 2) {
      return {
        dataset: balances.map((balance) =>
          parseFloat(ethers.utils.formatEther(balance.balance))
        ),
        labels: balances.map((balance) => new Date(balance.timestamp * 1000)),
      };
    }

    if (balances.length === 1) {
      return {
        dataset: [
          parseFloat(
            ethers.utils.formatEther(
              balances[0].balance.sub(balances[0].yieldEarned)
            )
          ),
          parseFloat(ethers.utils.formatEther(balances[0].balance)),
        ],
        labels: [
          afterDate?.toDate() || new Date(),
          new Date(balances[0].timestamp * 1000),
        ],
      };
    }

    return {
      dataset: [
        parseFloat(ethers.utils.formatEther(vaultBalanceInAsset)),
        parseFloat(ethers.utils.formatEther(vaultBalanceInAsset)),
      ],
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
              state={calculatedKPI.yield.gt(0) ? "green" : undefined}
            >
              {renderYieldEarnedText()}
            </KPIText>
            <DepositCurrency>{active ? currency : ""}</DepositCurrency>
          </KPI>
        </KPIColumn>
        <KPIColumn>
          <ColumnLabel>ROI</ColumnLabel>
          <KPIText
            active={active}
            state={calculatedKPI.roi > 0 ? "green" : undefined}
          >
            {active ? `+${calculatedKPI.roi.toFixed(2)}%` : "---"}
          </KPIText>
        </KPIColumn>
      </PerformanceColumn>
    </PerformanceContainer>
  );
};

export default PortfolioPerformance;
