import { ActionButton } from "shared/lib/components/Common/buttons";
import styled from "styled-components";
import LiveryBar from "shared/lib/components/Deposit/LiveryBar";
import {
  getDisplayAssets,
  VaultOptions,
  vaultOptionToName,
} from "shared/lib/constants/constants";
import { getAssetColor, getAssetLogo } from "shared/lib/utils/asset";
import { useMemo } from "react";
import { SecondaryText, Title } from "shared/lib/designSystem";
import GaugeStat from "./GaugeStat";

const CardContainer = styled.div`
  position: relative;
  min-width: 300px;
  width: 100%;
`;

const Background = styled.div<{ color: string }>`
  position: absolute;
  pointer-events: none;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0.08;
  background: linear-gradient(
    180deg,
    ${(props) => props.color} 0%,
    ${(props) => props.color}A3 100%
  );
`;

const Content = styled.div.attrs({
  className: "p-3 mb-2",
})``;

const Header = styled.div.attrs<{ color: string }>({
  className: "d-flex align-items-center p-2",
})`
  margin-bottom: 8px;
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
`;

const TitleContainer = styled.div.attrs({
  className: "d-flex flex-column pl-2",
})``;

const StatContainer = styled.div`
  padding-top: 8px;
  padding-bottom: 24px;
`;

const VoteButton = styled(ActionButton)`
  padding: 6px;
  border-radius: 100px;
`;

interface SingleGaugeCardProps {
  vaultOption: VaultOptions;
}

const SingleGaugeCard: React.FC<SingleGaugeCardProps> = ({ vaultOption }) => {
  const displayAsset = getDisplayAssets(vaultOption);
  const color = getAssetColor(displayAsset);

  const assetLogo = useMemo(() => {
    const Logo = getAssetLogo(displayAsset);
    return (
      <div
        style={{
          width: 40,
          height: 40,
        }}
      >
        <Logo />
      </div>
    );
  }, [displayAsset]);

  return (
    <CardContainer>
      <Background color={color} />
      <LiveryBar color={color} animationStyle="leftToRight" height={4} />
      <Content>
        <Header color={color}>
          {assetLogo}
          <TitleContainer>
            <Title>{vaultOptionToName(vaultOption)}</Title>
            <SecondaryText fontSize={12} lineHeight={16}>
              TVL: $123
            </SecondaryText>
          </TitleContainer>
        </Header>
        <StatContainer>
          <GaugeStat
            accentColor={color}
            title="Next Expected Weight"
            percentage={34}
          />
          <GaugeStat title="Current Weight" percentage={34} />
          <GaugeStat title="Previous Weight" percentage={24} />
        </StatContainer>
        <VoteButton onClick={() => {}} color={color}>
          VOTE
        </VoteButton>
      </Content>
    </CardContainer>
  );
};

export default SingleGaugeCard;
