import React from "react";
import styled from "styled-components";
import { SecondaryText } from "shared/lib/designSystem";
import { getDisplayAssets, VaultOptions } from "shared/lib/constants/constants";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { getAssetDecimals, getAssetLogo } from "shared/lib/utils/asset";
import { Title } from "shared/lib/designSystem";
import { useV2VaultData } from "shared/lib/hooks/web3DataContext";
import { formatUnits } from "ethers/lib/utils";
import { useSTETHStakingApr } from "shared/lib/hooks/useSTETHStakingApr";
import useLoadingText from "shared/lib/hooks/useLoadingText";

const ParagraphText = styled(SecondaryText)`
  color: rgba(255, 255, 255, 0.64);
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

const Container = styled.div`
  overflow-x: hidden;
`;

const TitleRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  background: ${colors.background.three};
  border-radius: ${theme.border.radius};
  padding: 8px;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0px;
  }
`;

const ProductAssetLogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;
  border-radius: 50%;
  position: relative;
`;

const TitleContent = styled.div`
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledSecondaryText = styled(SecondaryText)<{
  marginTop?: number;
}>`
  color: ${colors.tertiaryText};
  margin-top: ${(props) => (props.marginTop ? `${props.marginTop}px` : `0px`)};
  font-size: 12px;
  line-height: 24px;
`;

const CounterpartyData = styled(SecondaryText)<{
  marginTop?: number;
}>`
  color: ${colors.tertiaryText};
  margin-top: ${(props) => (props.marginTop ? `${props.marginTop}px` : `0px`)};
  font-size: 12px;
  line-height: 24px;
`;

const CounterpartyDetails = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-top: 16px;
`;

interface FundingSourceProps {
  vaultOption: VaultOptions;
}

// Calls user_checkpoint and shows a transaction loading screen
const FundingSource: React.FC<FundingSourceProps> = ({ vaultOption }) => {
  const asset = getDisplayAssets(vaultOption);
  const Logo = getAssetLogo(asset);
  const loadingText = useLoadingText();
  const {
    loading: stakingAprLoading,
    currentApr,
    weeklyAvgApr,
  } = useSTETHStakingApr();
  const decimals = getAssetDecimals(asset);
  const logo = <Logo height="100%" />;
  const {
    loading: vaultLoading,
    data: { totalBalance },
  } = useV2VaultData(vaultOption);
  return (
    <Container>
      <TitleRow>
        <ProductAssetLogoContainer>{logo}</ProductAssetLogoContainer>
        <TitleContent>
          <Title>LIDO</Title>
          <StyledSecondaryText>
            {stakingAprLoading ? "---" : `${currentApr.toFixed(2)}%`} Staking
            Yield
          </StyledSecondaryText>
        </TitleContent>
      </TitleRow>
      <ParagraphText>
        The vault funds its weekly sharkfin strategy with the yield earned by
        staking stETH in Lido.
      </ParagraphText>
      <CounterpartyDetails>
        <Detail>
          <CounterpartyData color={colors.tertiaryText} fontSize={12}>
            Principal Outstanding
          </CounterpartyData>
          <Title>
            <>
              {vaultLoading
                ? "---"
                : `${(
                    parseFloat(formatUnits(totalBalance, decimals)) * 0.9956
                  ).toFixed(2)} ${asset}`}
            </>
          </Title>
          <CounterpartyData
            color={colors.tertiaryText}
            fontSize={12}
            marginTop={16}
          >
            Weekly Average Yield
          </CounterpartyData>
          <Title>
            {stakingAprLoading ? loadingText : `${weeklyAvgApr.toFixed(2)}%`}
          </Title>
        </Detail>
        <Detail>
          <CounterpartyData color={colors.tertiaryText} fontSize={12}>
            Current Staking Yield
          </CounterpartyData>
          <Title>
            {stakingAprLoading ? loadingText : `${currentApr.toFixed(2)}%`}
          </Title>
        </Detail>
      </CounterpartyDetails>
    </Container>
  );
};

export default FundingSource;
