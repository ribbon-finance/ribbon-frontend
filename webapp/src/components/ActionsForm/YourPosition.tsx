import React, { useMemo } from "react";
import styled from "styled-components";
import { BigNumber, ethers } from "ethers";

import PositionIcon from "../../assets/img/positionIcon.svg";
import { Title } from "../../designSystem";
import useAssetPrice from "../../hooks/useAssetPrice";
import useBalances from "../../hooks/useBalances";
import useVaultData from "../../hooks/useVaultData";
import { formatBigNumber } from "../../utils/math";

const PositionsContainer = styled.div`
  font-family: VCR;
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
  className?: string;
}

const YourPosition: React.FC<YourPositionProps> = ({ className }) => {
  const { status, vaultBalanceInAsset } = useVaultData({
    poll: true,
  });
  const { price: ethusd } = useAssetPrice({ asset: "WETH" });
  const isLoading = status === "loading";
  const positionAssetAmount = formatBigNumber(vaultBalanceInAsset);
  const positionInUSD = parseFloat(positionAssetAmount) * ethusd;
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
      (parseFloat(ethers.utils.formatEther(yieldEarned)) /
        parseFloat(ethers.utils.formatEther(totalInvestment))) *
      100
    );
  }, [balances]);

  return (
    <PositionsContainer
      className={`d-flex flex-row justify-content-center align-items-center ${className}`}
    >
      <img style={{ width: 45 }} src={PositionIcon} alt="Positions" />

      <div className="w-100">
        <div className="w-100 d-flex flex-row align-items-center justify-content-between ml-2">
          <PositionTitle>Your Position</PositionTitle>
          <PositionTitle>
            {isLoading ? "Loading" : `${positionAssetAmount} ETH`}
          </PositionTitle>
        </div>
        <div className="w-100 d-flex flex-row align-items-center justify-content-between ml-2 mt-1">
          <ProfitText>+{allTimeROI.toFixed(4)}%</ProfitText>
          <AmountText>${positionInUSD.toFixed(2)}</AmountText>
        </div>
      </div>
    </PositionsContainer>
  );
};

export default YourPosition;
