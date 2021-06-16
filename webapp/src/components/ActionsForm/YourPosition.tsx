import React, { useMemo } from "react";
import styled from "styled-components";
import { ethers } from "ethers";

import PositionIcon from "../../assets/img/positionIcon.svg";
import { SecondaryText, Subtitle, Title } from "shared/lib/designSystem";
import useAssetPrice from "../../hooks/useAssetPrice";
import useVaultData from "shared/lib/hooks/useVaultData";
import { assetToUSD, formatBigNumber } from "shared/lib/utils/math";
import { VaultOptions } from "shared/lib/constants/constants";
import { getAssetDisplay } from "shared/lib/utils/asset";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import useVaultAccounts from "../../hooks/useVaultAccounts";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";

const PositionsContainer = styled.div`
  font-family: VCR, sans-serif;
  color: white;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  box-sizing: border-box;
  border-radius: ${theme.border.radius};
`;

const PositionMainContent = styled.div`
  border-radius: ${theme.border.radius};
  border-bottom: ${theme.border.width} ${theme.border.style} ${colors.border};
  background: ${colors.background};
  padding: 16px;
  z-index: 2;
`;

const PositionStakedContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: ${theme.border.radius};
  background: ${colors.backgroundLighter};
  padding: 24px 16px 8px 16px;
  margin-top: -16px;
  z-index: 1;
`;

const PositionTitle = styled(Title)`
  font-size: 14px;
`;

const ProfitText = styled.span<{ roi: number }>`
  color: ${(props) => (props.roi >= 0 ? colors.green : colors.red)};
  font-size: 12px;
  line-height: 16px;
  text-transform: capitalize;
`;

const AmountText = styled(Subtitle)`
  font-size: 12px;
  line-height: 16px;
  color: ${colors.text};
  letter-spacing: unset;
`;

const StakeLabel = styled(SecondaryText)`
  font-size: 12px;
  line-height: 20px;
`;

interface YourPositionProps {
  vaultOption: VaultOptions;
  className?: string;
}

const YourPosition: React.FC<YourPositionProps> = ({
  vaultOption,
  className,
}) => {
  const { status, asset, decimals } = useVaultData(vaultOption, {
    poll: true,
  });
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

  const [positionAssetAmount, positionAssetAmountUSD] = useMemo(() => {
    const vaultAccount = vaultAccounts[vaultOption];

    if (vaultAccountLoading) {
      return [loadingText, loadingText];
    }

    if (!vaultAccount) {
      return ["0", "$0.00"];
    }

    return [
      formatBigNumber(vaultAccount.totalBalance, 6, decimals),
      assetToUSD(vaultAccount.totalBalance, assetPrice, decimals),
    ];
  }, [
    vaultAccountLoading,
    vaultAccounts,
    loadingText,
    vaultOption,
    decimals,
    assetPrice,
  ]);

  const roi = useMemo(() => {
    const vaultAccount = vaultAccounts[vaultOption];

    if (!vaultAccount) {
      return 0;
    }

    return (
      (parseFloat(
        ethers.utils.formatUnits(
          vaultAccount.totalBalance.sub(vaultAccount.totalDeposits),
          decimals
        )
      ) /
        parseFloat(
          ethers.utils.formatUnits(vaultAccount.totalDeposits, decimals)
        )) *
      100
    );
  }, [vaultAccounts, vaultOption, decimals]);

  const stakingText = useMemo(() => {
    const vaultAccount = vaultAccounts[vaultOption];

    if (vaultAccount && !vaultAccount.totalBalance.isZero()) {
      return `${formatBigNumber(
        vaultAccount.totalStakedBalance,
        6,
        decimals
      )} ${getAssetDisplay(asset)}`;
    }

    return undefined;
  }, [asset, decimals, vaultAccounts, vaultOption]);

  return (
    <>
      <PositionsContainer className={`d-flex flex-column ${className}`}>
        <PositionMainContent className="d-flex flex-row justify-content-center align-items-center">
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
              <ProfitText roi={roi}>
                {isLoading
                  ? loadingText
                  : `${roi >= 0 ? "+" : ""}${roi.toFixed(4)}%`}
              </ProfitText>
              <AmountText>{positionAssetAmountUSD}</AmountText>
            </div>
          </div>
        </PositionMainContent>
        {stakingText && (
          <PositionStakedContainer>
            <StakeLabel className="mr-auto">Staked Amount</StakeLabel>
            <AmountText>{stakingText}</AmountText>
          </PositionStakedContainer>
        )}
      </PositionsContainer>
    </>
  );
};

export default YourPosition;
