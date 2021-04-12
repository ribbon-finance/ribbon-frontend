import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { ethers } from "ethers";

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
import DepositCapBar from "../../../pages/DepositPage/DepositCapBar";
import useVaultData from "../../../hooks/useVaultData";
import { formatSignificantDecimals } from "../../../utils/math";
import { useLatestAPY } from "../../../hooks/useAirtableData";
import useTextAnimation from "../../../hooks/useTextAnimation";
import {
  VaultOptions,
  VaultList,
  VaultNameOptionMap,
} from "../../../constants/constants";
import { productCopies } from "./productCopies";

const { formatEther } = ethers.utils;

const ProductCard = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  background-color: ${colors.background};
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  padding: 16px 24px 24px 16px;
  box-shadow: 4px 8px 80px rgba(255, 56, 92, 0.16);
  margin: 0 64px;
  transition: 0.25s box-shadow ease-out;
  max-width: 343px;

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
    margin: 0 40px;
  }
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

const ArrowContainer = styled.div`
  background: rgba(255, 255, 255, 0.04);
  width: 40px;
  height: 40px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ArrowRight = styled.i`
  color: white;
  transform: rotate(-45deg);
`;

interface YieldCardProps {
  vault?: VaultOptions;
}

const YieldCard: React.FC<YieldCardProps> = ({ vault = VaultList[0] }) => {
  const history = useHistory();
  const { status, deposits, vaultLimit } = useVaultData(vault);
  const isLoading = status === "loading";

  const totalDepositStr = isLoading
    ? 0
    : parseFloat(formatSignificantDecimals(formatEther(deposits)));
  const depositLimitStr = isLoading
    ? 1
    : parseFloat(formatSignificantDecimals(formatEther(vaultLimit)));

  const renderTag = (name: string) => (
    <ProductTag key={name}>
      <Subtitle>{name}</Subtitle>
    </ProductTag>
  );

  const latestAPY = useLatestAPY();

  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    !latestAPY.fetched
  );
  const perfStr = latestAPY.res ? `${latestAPY.res.toFixed(2)}%` : loadingText;

  return (
    <ProductCard
      onClick={() =>
        window.open(
          `/theta-vault/${
            Object.keys(VaultNameOptionMap)[
              Object.values(VaultNameOptionMap).indexOf(vault)
            ]
          }`
        )
      }
      role="button"
    >
      <TopContainer>
        <ProductTagContainer>
          {productCopies[vault].tags.map((tag) => renderTag(tag))}
        </ProductTagContainer>

        <ArrowContainer>
          <ArrowRight className="fas fa-arrow-right"></ArrowRight>
        </ArrowContainer>
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
      />
    </ProductCard>
  );
};

export default YieldCard;
