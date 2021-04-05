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

  &:hover {
    box-shadow: rgba(255, 56, 92, 0.4) 4px 8px 120px;
  }

  @media (max-width: ${sizes.md}px) {
    margin: 0 40px;
  }
`;

const ProductTagContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
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
  letter-spacing: 1.5px;
`;

const YieldText = styled(Title)`
  font-size: 32px;
  width: 100%;
  margin-bottom: 24px;
`;

const YieldCard = () => {
  const history = useHistory();
  const { status, deposits, vaultLimit } = useVaultData();
  const isLoading = status === "loading";

  const totalDepositStr = isLoading
    ? 0
    : parseFloat(formatSignificantDecimals(formatEther(deposits)));
  const depositLimitStr = isLoading
    ? 1
    : parseFloat(formatSignificantDecimals(formatEther(vaultLimit)));

  const renderTag = (name: string) => (
    <ProductTag>
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
    <ProductCard onClick={() => history.push("/theta-vault")} role="button">
      <ProductTagContainer>
        {renderTag("THETA VAULT")}
        {renderTag("ETH")}
      </ProductTagContainer>
      <ProductTitle>T-100-E</ProductTitle>
      <ProductDescription>
        Theta Vault is a yield-generating strategy on ETH. The vault runs an
        automated covered call strategy.
      </ProductDescription>
      <ExpectedYieldTitle>CURRENT PROJECTED YIELD (APY)</ExpectedYieldTitle>
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
