import React, { useMemo } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { ethers } from "ethers";

import WETHLogo, { WBTCLogo } from "../../../assets/icons/erc20Assets";
import {
  BaseButton,
  Title,
  Subtitle,
  SecondaryText,
  BaseText,
} from "../../../designSystem";
import colors from "../../../designSystem/colors";
import sizes from "../../../designSystem/sizes";
import theme from "../../../designSystem/theme";
import DepositCapBar from "../../Deposit/DepositCapBar";
import useVaultData from "../../../hooks/useVaultData";
import { formatSignificantDecimals } from "../../../utils/math";
import { useLatestAPY } from "../../../hooks/useAirtableData";
import useTextAnimation from "../../../hooks/useTextAnimation";
import { VaultOptions, VaultNameOptionMap } from "../../../constants/constants";
import { productCopies } from "../productCopies";

const { formatUnits } = ethers.utils;

const ProductCard = styled.div`
  display: flex;
  background-color: ${colors.background};
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  padding: 16px 24px 24px 16px;
  box-shadow: 4px 8px 80px rgba(255, 56, 92, 0.16);
  margin: 0 80px;
  transition: 0.25s box-shadow ease-out;
  max-width: 343px;
  position: relative;
  height: 100%;

  @keyframes shimmerAnimation {
    0% {
      box-shadow: rgba(255, 56, 92, 0.4) 8px 8px 120px;
    }
    50% {
      box-shadow: rgba(255, 56, 92, 0.16) 8px 8px 120px;
    }
    100% {
      box-shadow: rgba(255, 56, 92, 0.4) 8px 8px 120px;
    }
  }

  animation: shimmerAnimation 3s infinite;

  &:hover {
    animation: none;
    box-shadow: rgba(255, 56, 92, 0.4) 8px 8px 120px;
  }

  @media (max-width: ${sizes.md}px) {
    min-width: 280px;
    margin: 0 12px;
  }
`;

const ProductContent = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  z-index: 1;
`;

const ProductTagContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const ProductTag = styled(BaseButton)`
  background: ${colors.pillBackground};
  padding: 8px;
  margin-right: 4px;
  margin-bottom: 8px;
`;

const ProductTitle = styled(Title)`
  color: ${colors.products.yield};
  font-size: 36px;
  margin-bottom: 8px;
`;

const ProductDescription = styled(SecondaryText)`
  line-height: 1.5;
  margin-bottom: 24px;
`;

const ExpectedYieldTitle = styled(BaseText)`
  color: ${colors.primaryText}A3;
  width: 100%;
  font-size: 12px;
`;

const YieldText = styled(Title)`
  font-size: 32px;
  width: 100%;
  margin-bottom: 24px;
`;

const TopContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
`;

const StyledWBTCLogo = styled(WBTCLogo)`
  && * {
    fill: white;
  }
`;

interface YieldCardProps {
  vault: VaultOptions;
  onClick: () => void;
}

const YieldCard: React.FC<YieldCardProps> = ({ vault, onClick }) => {
  const { status, deposits, vaultLimit, asset, decimals } = useVaultData(vault);
  const isLoading = status === "loading";

  const totalDepositStr = isLoading
    ? 0
    : parseFloat(formatSignificantDecimals(formatUnits(deposits, decimals), 2));
  const depositLimitStr = isLoading
    ? 1
    : parseFloat(formatSignificantDecimals(formatUnits(vaultLimit, decimals)));

  const renderTag = (name: string) => (
    <ProductTag key={name}>
      <Subtitle>{name}</Subtitle>
    </ProductTag>
  );

  const latestAPY = useLatestAPY(vault);

  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    !latestAPY.fetched
  );
  const perfStr = latestAPY.res ? `${latestAPY.res.toFixed(2)}%` : loadingText;

  const backgroundLogo = useMemo(() => {
    switch (vault) {
      case "rETH-THETA":
        return <WETHLogo width="40%" opacity="0.1" />;
      case "rBTC-THETA":
        return <StyledWBTCLogo width="50%" opacity="0.04" />;
      default:
        return <></>;
    }
  }, [vault]);

  return (
    <ProductCard onClick={onClick} role="button">
      <ProductContent>
        <TopContainer>
          <ProductTagContainer>
            {productCopies[vault].tags.map((tag) => renderTag(tag))}
          </ProductTagContainer>
        </TopContainer>

        <ProductTitle>{productCopies[vault].title}</ProductTitle>
        <ProductDescription>
          {productCopies[vault].description}
        </ProductDescription>
        <ExpectedYieldTitle>Current Projected Yield (APY)</ExpectedYieldTitle>
        <YieldText>{perfStr}</YieldText>
        <DepositCapBar
          loading={isLoading}
          totalDeposit={totalDepositStr}
          limit={depositLimitStr}
          copies={{
            totalDeposit: "Current Deposits",
            limit: "Max Capacity",
          }}
          labelConfig={{
            fontSize: 12,
          }}
          statsConfig={{
            fontSize: 12,
          }}
          asset={asset}
        />
      </ProductContent>
      <BackgroundContainer>{backgroundLogo}</BackgroundContainer>
    </ProductCard>
  );
};

export default YieldCard;
