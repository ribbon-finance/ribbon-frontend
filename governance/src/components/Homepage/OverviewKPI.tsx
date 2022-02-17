import React, { useMemo } from "react";
import styled from "styled-components";
import currency from "currency.js";
import { Col, Row } from "react-bootstrap";
import ReactPlayer from "react-player";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import { useRBNToken } from "shared/lib/hooks/useRBNTokenSubgraph";
import ProgressBar from "shared/lib/components/Deposit/ProgressBar";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import {
  BaseUnderlineLink,
  PrimaryText,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import useAssetPrice, { useAssetInfo } from "shared/lib/hooks/useAssetPrice";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import useTreasuryAccount from "shared/lib/hooks/useTreasuryAccount";
import useTVL from "shared/lib/hooks/useTVL";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import { formatAmount } from "shared/lib/utils/math";

const Content = styled(Row)`
  z-index: 1;
`;

const KPICard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  background: #ffffff0a;
  backdrop-filter: blur(40px);
  border-radius: ${theme.border.radius};

  &:not(:first-child) {
    margin-top: 16px;
  }
`;

const FloatingBackgroundContainer = styled.div<{ backgroundColor?: string }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  height: 100%;
  width: 100vw;
  overflow: hidden;
  ${(props) =>
    props.backgroundColor ? `background: ${props.backgroundColor};` : ""};
`;

const OverviewKPI = () => {
  const { width, height } = useScreenSize();
  const { data: rbnToken, loading: rbnTokenAccountLoading } = useRBNToken();
  const { info, loading: assetInfoLoading } = useAssetInfo("RBN");
  const { price: RBNPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: "RBN",
  });
  const { total, loading: treasuryLoading } = useTreasuryAccount();
  const { totalTVL } = useTVL();

  const loadingText = useTextAnimation(
    assetPriceLoading ||
      treasuryLoading ||
      rbnTokenAccountLoading ||
      assetInfoLoading
  );

  const percentageStaked = useMemo(() => {
    if (info.circulating_supply) {
      const totalStakedNumber = parseFloat(
        formatUnits(rbnToken?.totalStaked || BigNumber.from(0), 18)
      );
      return (totalStakedNumber / info.circulating_supply) * 100;
    }
    return 0;
  }, [info, rbnToken]);

  const [videoWidth, videoHeight] = useMemo(() => {
    /**
     * Screen size exactly 16:9
     */
    if (width / height === 16 / 9) {
      return [width, height];
    }

    /**
     * If screen are longer than 16:9
     */
    if (width / height > 16 / 9) {
      return [width, width * (9 / 16)];
    }

    return [height * (16 / 9), height];
  }, [height, width]);

  return (
    <>
      <Content className="justify-content-center">
        {/* Left text */}
        <Col
          xs={12}
          lg={5}
          className="d-flex flex-column justify-content-center"
        >
          <Title
            fontSize={width >= sizes.lg ? 56 : 48}
            lineHeight={width >= sizes.lg ? 60 : 56}
            letterSpacing={1}
            className={width < sizes.lg ? "text-center" : ""}
          >
            RIBBON GOVERNANCE
          </Title>
          <SecondaryText
            fontSize={16}
            lineHeight={24}
            className={`mt-4 ${width < sizes.lg ? "text-center px-4" : ""}`}
          >
            The Ribbon Finance Protocol is owned and governed by RBN holders via
            fully on-chain governance
          </SecondaryText>
          <BaseUnderlineLink
            // TODO: Replace URL
            to="https://google.com"
            target="_blank"
            rel="noreferrer noopener"
            className={`d-flex mt-4 ${width < sizes.lg ? "mx-auto" : ""}`}
          >
            <PrimaryText fontSize={16} lineHeight={24} fontWeight={400}>
              Learn More
            </PrimaryText>
            <ExternalIcon className="ml-2" color={colors.primaryText} />
          </BaseUnderlineLink>
        </Col>

        {/* Right KPI */}
        <Col
          lg={{ span: 5, offset: 1 }}
          className="d-none d-lg-flex flex-column justify-content-center"
        >
          <KPICard>
            <SecondaryText fontSize={12} lineHeight={16}>
              Protocol TVL
            </SecondaryText>
            <Title
              fontSize={16}
              lineHeight={24}
              letterSpacing={1}
              className="mt-2"
            >
              {currency(totalTVL).format()}
            </Title>
          </KPICard>
          <KPICard>
            <div className="d-flex flex-row align-items-center justify-content-between mb-2">
              <SecondaryText fontSize={12} lineHeight={16}>
                Total Locked RBN
              </SecondaryText>
              <Title fontSize={16} lineHeight={24} letterSpacing={1}>
                {rbnTokenAccountLoading
                  ? loadingText
                  : formatAmount(
                      Number(
                        formatUnits(rbnToken?.totalStaked || BigNumber.from(0))
                      ),
                      true
                    )}
              </Title>
            </div>
            <ProgressBar
              config={{ height: 4, extraClassNames: "my-2", radius: 2 }}
              percent={percentageStaked}
              color={colors.green}
            />
            <div className="d-flex flex-row align-items-center justify-content-between mt-2">
              <SecondaryText fontSize={12} lineHeight={16}>
                RBN Floating Supply
              </SecondaryText>
              <Title fontSize={16} lineHeight={24} letterSpacing={1}>
                {assetInfoLoading
                  ? loadingText
                  : formatAmount(info.circulating_supply, true)}
              </Title>
            </div>
          </KPICard>
          <KPICard>
            <SecondaryText fontSize={12} lineHeight={16}>
              Ribbon Treasury
            </SecondaryText>
            <Title
              fontSize={16}
              lineHeight={24}
              letterSpacing={1}
              className="mt-2"
            >
              {treasuryLoading ? loadingText : currency(total).format()}
            </Title>
          </KPICard>
          <KPICard>
            <SecondaryText fontSize={12} lineHeight={16}>
              RBN Price
            </SecondaryText>
            <Title
              fontSize={16}
              lineHeight={24}
              letterSpacing={1}
              className="mt-2"
            >
              {assetPriceLoading ? loadingText : `$${RBNPrice.toFixed(2)}`}
            </Title>
          </KPICard>
        </Col>
      </Content>
      <FloatingBackgroundContainer>
        <ReactPlayer
          key="video-player"
          url="https://storage.googleapis.com/ribbon-bucket/verbn/launch.mp4"
          playing={true}
          width={videoWidth}
          height={videoHeight}
          style={{
            minWidth: videoWidth,
            minHeight: videoHeight,
          }}
          muted
          loop
        />
      </FloatingBackgroundContainer>
      <FloatingBackgroundContainer backgroundColor="#000000E0" />
    </>
  );
};

export default OverviewKPI;
