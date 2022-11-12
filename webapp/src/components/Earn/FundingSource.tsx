import React from "react";
import styled from "styled-components";
import { SecondaryText } from "shared/lib/designSystem";
import CounterpartyDetail from "./CounterpartyDetail";
import { getDisplayAssets, VaultOptions } from "shared/lib/constants/constants";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { getAssetColor, getAssetLogo } from "shared/lib/utils/asset";
import { getVaultColor } from "shared/lib/utils/vault";
import { Title } from "shared/lib/designSystem";
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

interface FundingSourceProps {
  vaultOption: VaultOptions;
}

// Calls user_checkpoint and shows a transaction loading screen
const FundingSource: React.FC<FundingSourceProps> = ({ vaultOption }) => {
  const asset = getDisplayAssets(vaultOption);
  const Logo = getAssetLogo(asset);
  const color = getVaultColor(vaultOption);
  const logo = <Logo height="100%" />;

  return (
    <Container>
      <TitleRow>
        <ProductAssetLogoContainer>{logo}</ProductAssetLogoContainer>
        <TitleContent>
          <Title>LIDO</Title>
          <StyledSecondaryText>4.23% Staking Yield</StyledSecondaryText>
        </TitleContent>
      </TitleRow>
      <ParagraphText>
        The vault funds its weekly sharkfin strategy with the yield earned by
        staking stETH in Lido.
      </ParagraphText>
    </Container>
  );
};

export default FundingSource;
