import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { SecondaryText, Subtitle, Title } from "../../designSystem";
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
`;

const DepositChartExtra = styled.div`
  padding: 16px;
`;

const DateFilters = styled.div`
  margin-left: auto;
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

const KPIColumn = styled.div`
  width: 50%;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;

  &:first-child {
    border-right: ${theme.border.width} ${theme.border.style} ${colors.border};
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

const DepositText = styled(Title)`
  font-size: 18px;
  line-height: 24px;
  color: ${colors.green};
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
  const ethPrice = useAssetPrice({ asset: "WETH" });
  const [currentBalance, setCurrentBalance] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [rangeFilter, setRangeFilter] = useState<dateFilterType>("1w");

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

  useEffect(() => {
    setCurrentBalance(vaultBalanceInAsset);
  }, [vaultBalanceInAsset, balances]);

  const getDepositAmount = useCallback(() => {
    switch (currency) {
      case "eth":
        return toETH(currentBalance);
      case "usd":
        return ethToUSD(currentBalance, ethPrice);
    }
  }, [currency, currentBalance, ethPrice]);

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
      if (hoverInfo.focused) {
        const currentBalanceItem = balances.find(
          (balance) => balance.timestamp * 1000 === hoverInfo.xData.getTime()
        );
        setCurrentBalance(currentBalanceItem!.balance);
        return;
      }

      setCurrentBalance(vaultBalanceInAsset);
    },
    [vaultBalanceInAsset, balances]
  );

  return (
    <PerformanceContainer>
      <DepositColumn>
        <PerformanceChart
          dataset={balances.map((balance) =>
            parseFloat(ethers.utils.formatEther(balance.balance))
          )}
          labels={balances.map((balance) => new Date(balance.timestamp * 1000))}
          onChartHover={handleChartHover}
          extras={
            <DepositChartExtra>
              <ColumnLabel>Deposits</ColumnLabel>
              <div className="d-flex align-items-center">
                {renderDepositData()}
                <DateFilters>
                  {dateFilterOptions.map((currRange) => (
                    <DateFilter
                      active={rangeFilter === currRange}
                      onClick={() => setRangeFilter(currRange)}
                    >
                      {currRange.toUpperCase()}
                    </DateFilter>
                  ))}
                </DateFilters>
              </div>
            </DepositChartExtra>
          }
        />
      </DepositColumn>
      <PerformanceColumn>
        <KPIColumn>
          <ColumnLabel>Yield Earned</ColumnLabel>
          <KPI>
            <DepositText>+10.12</DepositText>
            <DepositCurrency>{currency}</DepositCurrency>
          </KPI>
        </KPIColumn>
        <KPIColumn>
          <ColumnLabel>ROI</ColumnLabel>
          <DepositText>+35.42%</DepositText>
        </KPIColumn>
      </PerformanceColumn>
    </PerformanceContainer>
  );
};

export default PortfolioPerformance;
