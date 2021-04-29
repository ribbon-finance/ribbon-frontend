import React, { useMemo } from "react";
import styled from "styled-components";
import { BigNumber, ethers } from "ethers";

import PositionIcon from "../../assets/img/positionIcon.svg";
import { Title } from "shared/lib/designSystem";
import useAssetPrice from "../../hooks/useAssetPrice";
import useBalances from "../../hooks/useBalances";
import useVaultData from "shared/lib/hooks/useVaultData";
import { assetToUSD, formatBigNumber } from "shared/lib/utils/math";
import { VaultOptions } from "shared/lib/constants/constants";
import { getAssetDisplay } from "shared/lib/utils/asset";

const PositionsContainer = styled.div`
  font-family: VCR, sans-serif;
  color: white;
  background: #1c1a19;
  border: 1px solid #2b2b2b;
  box-sizing: border-box;
  border-radius: 8px;
  height: 76px;
`;

const PositionTitle = styled(Title)`
  font-size: 14px;
`;

const ProfitText = styled.span`
  color: #16ceb9;
  font-size: 12px;
  line-height: 16px;
  text-transform: capitalize;
`;

const AmountText = styled.span`
  font-size: 12px;
  line-height: 16px;
  text-transform: capitalize;
  color: rgba(255, 255, 255, 0.64);
`;

interface YourPositionProps {
  vaultOption: VaultOptions;
  className?: string;
}

const YourPosition: React.FC<YourPositionProps> = ({
  vaultOption,
  className,
}) => {
  const { status, vaultBalanceInAsset, asset, decimals } = useVaultData(
    vaultOption,
    {
      poll: true,
    }
  );
  const { price: assetPrice } = useAssetPrice({ asset: asset });
  const isLoading = status === "loading";
  const positionAssetAmount = formatBigNumber(vaultBalanceInAsset, 6, decimals);
  const { balances } = useBalances();

  const allTimeROI = useMemo(() => {
    if (balances.length <= 0) {
      return 0;
    }

    let totalInvestment = BigNumber.from(0);
    let yieldEarned = BigNumber.from(0);
    let lastBalance = BigNumber.from(0);

    for (let i = 0; i < balances.length; i++) {
      const currentBalanceObj = balances[i];
      totalInvestment = totalInvestment.add(
        currentBalanceObj.balance
          .sub(lastBalance)
          .sub(currentBalanceObj.yieldEarned)
      );
      yieldEarned = yieldEarned.add(currentBalanceObj.yieldEarned);
      lastBalance = currentBalanceObj.balance;
    }

    if (totalInvestment.lte(0)) {
      return 0;
    }

    return (
      (parseFloat(ethers.utils.formatUnits(yieldEarned, decimals)) /
        parseFloat(ethers.utils.formatUnits(totalInvestment, decimals))) *
      100
    );
  }, [balances, decimals]);

  return (
    <PositionsContainer
      className={`d-flex flex-row justify-content-center align-items-center ${className}`}
    >
      <img style={{ width: 45 }} src={PositionIcon} alt="Positions" />

      <div className="w-100">
        <div className="w-100 d-flex flex-row align-items-center justify-content-between ml-2">
          <PositionTitle>Your Position</PositionTitle>
          <PositionTitle>
            {isLoading
              ? "Loading"
              : `${positionAssetAmount} ${getAssetDisplay(asset)}`}
          </PositionTitle>
        </div>
        <div className="w-100 d-flex flex-row align-items-center justify-content-between ml-2 mt-1">
          <ProfitText>+{allTimeROI.toFixed(4)}%</ProfitText>
          <AmountText>
            {assetToUSD(vaultBalanceInAsset, assetPrice, decimals)}
          </AmountText>
        </div>
      </div>
    </PositionsContainer>
  );
};

export default YourPosition;
