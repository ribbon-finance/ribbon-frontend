import React, { useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";

import { Title, BaseText } from "../../designSystem";
import sizes from "../../designSystem/sizes";
import colors from "shared/lib/designSystem/colors";
import { SubgraphDataContext } from "shared/lib/hooks/subgraphDataContext";
import { BigNumber } from "ethers";
import useTVL from "shared/lib/hooks/useTVL";
import { formatAmount, formatBigNumberAmount } from "shared/lib/utils/math";
import { ExternalAPIDataContext } from "shared/lib/hooks/externalAPIDataContext";
import { Assets } from "shared/lib/store/types";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { formatUnits } from "ethers/lib/utils";

const MainContainer = styled(Container)`
  padding: 80px 0;
  position: relative;
`;

const MissionTitleRow = styled(Row)`
  margin: 0;
  text-align: center;
  justify-content: center;
  width: 100%;
`;

const MissionSubtitleRow = styled(Row)`
  margin: 0;
  margin-top: 24px;
  justify-content: center;
  width: 100%;
`;

const MissionTitle = styled(Title)`
  font-size: 48px;
  line-height: 56px;
  width: 100%;
  text-transform: uppercase;
  text-align: center;

  @media (max-width: ${sizes.md}px) {
    font-size: 40px;
    line-height: 40px;
  }
`;

const MissionSubtitle = styled(BaseText)`
  display: flex;
  font-size: 16px;
  line-height: 24px;
  color: ${colors.text};
  text-align: center;
`;

const MissionFactor = styled(Row)`
  font-size: 16px;
  color: ${colors.text};
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(4px);
  border-radius: 6px;
  padding: 18px 0px;
  text-align: center;
  width: 100%;
  margin: 0;

  > div {
    padding: 0px 24px;

    @media (min-width: ${sizes.md}px) {
      &:not(:last-child) {
        border-right: 2px solid ${colors.background.three};
      }
    }
  }

  @media (max-width: ${sizes.md}px) {
    padding: 0;

    > div {
      padding: 18px 0;
      border-bottom: 1px solid ${colors.background.three};
    }
  }
`;

const FactorTitle = styled.div`
  font-size: 12px;
  margin-bottom: 4px;
`;

const FactorAmount = styled.div`
  font-family: VCR;
  color: ${colors.primaryText};
`;

const Frame = styled.div`
  display: none;

  @media (min-width: ${sizes.md}px) {
    position: absolute;
    display: flex;
    background: #333;
    top: 80px;
    height: calc(100% - 160px);
    width: 100%;
    filter: blur(30px);
  }
`;

const glow = keyframes`
  0% {
    border-left: 10px solid ${colors.red};
    border-right: 10px solid ${colors.red};
    box-shadow: 2px 4px 40px ${colors.red};
    background: ${colors.red}cc;
  }

  25% {
    background: black;
  }
`;

const Bar = styled.div<{ delay: number }>`
  width: calc(100% / 10);
  height: 100%;
  background: black;

  animation: 4s ${glow} infinite;
  animation-delay: ${(props) => props.delay}s;
`;

const Mission = () => {
  const { vaultSubgraphData } = useContext(SubgraphDataContext);
  const { assetsPrice } = useContext(ExternalAPIDataContext);
  const { totalTVL } = useTVL();
  const [notional, setNotional] = useState<string>("0");
  const [revenue, setRevenue] = useState<string>("0");

  useEffect(() => {
    const revenue: number[] = [];
    const notional: BigNumber[] = [];

    Object.values(vaultSubgraphData.vaults.v1).forEach((vault) => {
      if (
        vault &&
        vault.totalWithdrawalFee &&
        BigNumber.from(vault.totalWithdrawalFee).gt(0)
      ) {
        const assetPrice =
          assetsPrice.data[vault.underlyingSymbol as Assets].latestPrice;
        const assetDecimal = getAssetDecimals(vault.underlyingSymbol as Assets);

        if (assetDecimal && assetPrice && assetPrice > 0) {
          revenue.push(
            Math.round(
              parseFloat(formatUnits(vault.totalWithdrawalFee, assetDecimal)) *
                assetPrice
            )
          );
        }
      }

      if (vault && vault.totalNotionalVolume)
        notional.push(vault.totalNotionalVolume);
    });

    Object.values(vaultSubgraphData.vaults.v2).forEach((vault) => {
      if (
        vault &&
        vault.totalFeeCollected &&
        BigNumber.from(vault.totalFeeCollected).gt(0)
      ) {
        const assetPrice =
          assetsPrice.data[vault.underlyingSymbol as Assets].latestPrice;
        const assetDecimal = getAssetDecimals(vault.underlyingSymbol as Assets);

        if (assetDecimal && assetPrice && assetPrice > 0) {
          revenue.push(
            Math.round(
              parseFloat(formatUnits(vault.totalFeeCollected, assetDecimal)) *
                assetPrice
            )
          );
        }
      }

      if (vault && vault.totalNotionalVolume)
        notional.push(vault.totalNotionalVolume);
    });

    setNotional(
      formatBigNumberAmount(
        notional.reduce((acc, curr) => acc.add(curr), BigNumber.from(0)),
        16
      )
    );

    setRevenue(
      formatAmount(
        revenue.reduce((acc, curr) => acc + curr, 0),
        true
      )
    );
  }, [vaultSubgraphData, assetsPrice]);

  return (
    <MainContainer>
      <Frame>
        {[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5].map((i) => (
          <Bar key={i} delay={i}></Bar>
        ))}
      </Frame>
      <MissionTitleRow fluid>
        <Col xs={12} lg={10} xl={8}>
          <Container>
            <MissionTitle>Decentralised Structured Products</MissionTitle>
          </Container>
        </Col>
      </MissionTitleRow>

      <MissionSubtitleRow>
        <Col md={12} xl={6}>
          <Container>
            <MissionSubtitle>
              The Ribbon Protocol uses derivatives like options to generate
              sustainable, risk-adjusted yield. Users just deposit their assets,
              and let the smart contracts do the rest.
            </MissionSubtitle>
          </Container>
        </Col>
      </MissionSubtitleRow>

      <MissionSubtitleRow>
        <Col xs={12} md={12} lg={8}>
          <Container>
            <MissionFactor>
              <Col xs={12} md={4}>
                <FactorTitle>Total Value Locked</FactorTitle>
                <FactorAmount>${formatAmount(totalTVL)}</FactorAmount>
              </Col>
              <Col xs={12} md={4}>
                <FactorTitle>Notional Options Sold</FactorTitle>
                <FactorAmount>${notional}</FactorAmount>
              </Col>
              <Col xs={12} md={4}>
                <FactorTitle>Protocol Revenue</FactorTitle>
                <FactorAmount>${revenue}</FactorAmount>
              </Col>
            </MissionFactor>
          </Container>
        </Col>
      </MissionSubtitleRow>
    </MainContainer>
  );
};

export default Mission;
