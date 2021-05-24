import React, { useMemo } from "react";
import styled from "styled-components";
import { ethers } from "ethers";

import PositionIcon from "../../assets/img/positionIcon.svg";
import { Title } from "shared/lib/designSystem";
import useAssetPrice from "../../hooks/useAssetPrice";
import useVaultData from "shared/lib/hooks/useVaultData";
import { assetToUSD, formatBigNumber } from "shared/lib/utils/math";
import { VaultOptions } from "shared/lib/constants/constants";
import { getAssetDisplay } from "shared/lib/utils/asset";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import useVaultAccounts from "../../hooks/useVaultAccounts";

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
  // Uses useMemo to create array so that useVaultAccounts does not constantly create new array that causes website lag
  const vaultOptions = useMemo(() => [vaultOption], [vaultOption]);
  const { vaultAccounts, loading: vaultAccountLoading } =
    useVaultAccounts(vaultOptions);
  const isLoading = status === "loading" || vaultAccountLoading;
  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    isLoading
  );
  const positionAssetAmount = formatBigNumber(vaultBalanceInAsset, 6, decimals);

  const allTimeROI = useMemo(() => {
    const vaultAccount = vaultAccounts[vaultOption];

    if (!vaultAccount) {
      return 0;
    }

    return (
      (parseFloat(
        ethers.utils.formatUnits(vaultAccount.totalYieldEarned, decimals)
      ) /
        parseFloat(
          ethers.utils.formatUnits(vaultAccount.totalDeposits, decimals)
        )) *
      100
    );
  }, [vaultAccounts, vaultOption, decimals]);

  return (
    <PositionsContainer
      className={`d-flex flex-row justify-content-center align-items-center ${className}`}
    >
      <img style={{ width: 45 }} src={PositionIcon} alt="Positions" />

      <div className="w-100">
        <div className="d-flex flex-row align-items-center justify-content-between ml-2">
          <PositionTitle>Your Position</PositionTitle>
          <PositionTitle>
            {isLoading
              ? loadingText
              : `${positionAssetAmount} ${getAssetDisplay(asset)}`}
          </PositionTitle>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-between ml-2 mt-1">
          <ProfitText>
            {isLoading ? loadingText : `+${allTimeROI.toFixed(4)}%`}
          </ProfitText>
          <AmountText>
            {assetToUSD(vaultBalanceInAsset, assetPrice, decimals)}
          </AmountText>
        </div>
      </div>
    </PositionsContainer>
  );
};

export default YourPosition;
