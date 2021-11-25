import React, { useCallback } from "react";
import styled from "styled-components";
import {
  AAVEIcon,
  CompoundIcon,
  DDEXIcon,
  DYDXIcon,
  OasisIcon,
} from "../../../assets/icons/defiApp";
import Logo from "../../../assets/icons/logo";

import {
  getAssets,
  VaultOptions,
  VaultVersion,
} from "../../../constants/constants";
import { BaseText, Title } from "../../../designSystem";
import colors from "../../../designSystem/colors";
import theme from "../../../designSystem/theme";
import useLatestAPY from "../../../hooks/useLatestAPY";
import useTextAnimation from "../../../hooks/useTextAnimation";
import { DefiScoreProtocol } from "../../../models/defiScore";
import { AssetYieldsInfo } from "../../../store/types";
import { getAssetDisplay } from "../../../utils/asset";
import { productCopies } from "../productCopies";

const YieldComparisonCard = styled.div<{ background: string }>`
  display: flex;
  width: 100%;
  border-radius: ${theme.border.radius};
  background-color: ${(props) => props.background};
  padding: 8px;
  margin-top: 8px;
`;

const YieldComparisonTitle = styled(BaseText)`
  color: ${colors.primaryText}A3;
  width: 100%;
  font-size: 12px;
  margin-top: 24px;

  &:first-child {
    margin-top: 14px;
  }
`;

interface YieldComparisonProps {
  vault: VaultOptions;
  vaultVersion: VaultVersion;
  config?: {
    background: string;
  };
  yieldInfos: AssetYieldsInfo;
}

const YieldComparison: React.FC<YieldComparisonProps> = ({
  vault,
  vaultVersion,
  config = {
    background: colors.background.three,
  },
  yieldInfos,
}) => {
  const asset = getAssets(vault);

  const latestAPY = useLatestAPY(vault, vaultVersion);

  const loadingText = useTextAnimation(!latestAPY.fetched);
  const perfStr = latestAPY.fetched
    ? `${latestAPY.res.toFixed(2)}%`
    : loadingText;

  const renderProtocolLogo = useCallback((protocol: DefiScoreProtocol) => {
    switch (protocol) {
      case "aave":
        return <AAVEIcon height="24" width="24" />;
      case "compound":
        return <CompoundIcon height="24" width="24" />;
      case "ddex":
        return <DDEXIcon height="24" width="24" />;
      case "dydx":
        return (
          <DYDXIcon height="24" width="24" style={{ borderRadius: "100px" }} />
        );
      case "mcd":
        return <OasisIcon height="24" width="24" />;
    }
  }, []);

  return (
    <>
      <YieldComparisonTitle>Current Projected Yield (APY)</YieldComparisonTitle>
      <YieldComparisonCard background={config.background}>
        <Logo height="24" width="24" />
        <Title fontSize={14} lineHeight={24} className="ml-2">
          {productCopies[vault].title}
        </Title>
        <Title fontSize={14} lineHeight={24} className="ml-auto">
          {perfStr}
        </Title>
      </YieldComparisonCard>
      <YieldComparisonTitle>
        Market {getAssetDisplay(asset)} Yields (APY)
      </YieldComparisonTitle>
      {yieldInfos
        .slice(0, 3)
        .map(
          ({ protocol, apr }: { protocol: DefiScoreProtocol; apr: number }) => {
            if (apr < 0.01) {
              return <></>;
            }

            return (
              <YieldComparisonCard
                key={protocol}
                background={config.background}
              >
                {renderProtocolLogo(protocol)}
                <Title fontSize={14} lineHeight={24} className="ml-2">
                  {protocol}
                </Title>
                <Title
                  fontSize={14}
                  lineHeight={24}
                  className="ml-auto"
                >{`${apr.toFixed(2)}%`}</Title>
              </YieldComparisonCard>
            );
          }
        )}
    </>
  );
};

export default YieldComparison;
