import React, { useCallback, useMemo, useRef } from "react";
import styled from "styled-components";
import moment from "moment";

import {
  getAssets,
  getEtherscanURI,
  isPutVault,
  getOptionAssets,
  VaultOptions,
} from "shared/lib/constants/constants";
import { BaseLink, SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { VaultActivity, VaultActivityType } from "shared/lib/models/vault";
import {
  assetToUSD,
  formatBigNumber,
  formatOption,
} from "shared/lib/utils/math";
import useAssetPrice from "shared/lib/hooks/useAssetPrice";
import useElementSize from "shared/lib/hooks/useElementSize";
import sizes from "shared/lib/designSystem/sizes";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import { ExternalIcon } from "shared/lib/assets/icons/icons";

const VaultActivityRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  margin-bottom: 16px;
  padding: 16px;

  &:nth-child(2) {
    margin-top: 24px;
  }
`;

const VaultActivityIcon = styled.div<{ type: VaultActivityType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 100px;
  background-color: ${(props) => colors.vaultActivity[props.type]}14;
  margin-right: 16px;

  i {
    color: ${(props) => colors.vaultActivity[props.type]};
  }
`;

const VaultActivityHeader = styled.div`
  display: flex;
  margin-top: 24px;
  padding: 0px 16px;
`;

const VaultActivityCol = styled.div<{
  orientation?: "left" | "right";
  containerWidth?: number;
  weight: number;
}>`
  display: flex;
  flex-direction: column;
  width: ${(props) =>
    props.containerWidth
      ? `calc((${props.containerWidth}px - 32px - 56px - 120px) * ${props.weight})`
      : `${props.weight * 100}%`};

  text-align: ${(props) => {
    switch (props.orientation) {
      case "left":
      case "right":
        return props.orientation;
      default:
        return "left";
    }
  }};

  @media (max-width: ${sizes.xl}px) {
    width: ${(props) =>
      props.containerWidth
        ? `calc((${props.containerWidth}px - 32px - 56px - 72px) * ${props.weight})`
        : `${props.weight * 100}%`};
  }
`;

const VaultActivityHeaderCol = styled(VaultActivityCol)`
  &:first-child {
    width: ${(props) =>
      props.containerWidth
        ? `calc((${props.containerWidth}px - 32px - 56px - 120px) * ${props.weight} + 56px)`
        : `${props.weight * 100}%`};
  }

  @media (max-width: ${sizes.xl}px) {
    &:first-child {
      width: ${(props) =>
        props.containerWidth
          ? `calc((${props.containerWidth}px - 32px - 56px - 72px) * ${props.weight} + 56px)`
          : `${props.weight * 100}%`};
    }
  }
`;

const VaultPrimaryText = styled(Title)<{
  variant?: "green";
}>`
  margin-bottom: 4px;

  ${(props) => {
    switch (props.variant) {
      case "green":
        return `color: ${colors.green};`;
      default:
        return null;
    }
  }}

  &:last-child {
    margin-bottom: 0px;
  }
`;

const VaultSecondaryText = styled(SecondaryText)<{
  fontFamily?: string;
}>`
  font-size: 12px;
  ${(props) =>
    props.fontFamily ? `font-family: ${props.fontFamily}, sans-serif;` : ""}
`;

const VaultActivityExternalLinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0px 24px 0px 56px;

  &:hover {
    i {
      opacity: 1;
    }
  }

  @media (max-width: ${sizes.xl}px) {
    margin: 0px 8px 0px 24px;
  }
`;

const ExternalLink = styled(ExternalIcon)`
  opacity: 0.48;
`;

interface DesktopVaultActivityListProps {
  activities: VaultActivity[];
  vaultOption: VaultOptions;
}

const DesktopVaultActivityList: React.FC<DesktopVaultActivityListProps> = ({
  activities,
  vaultOption,
}) => {
  const { asset, decimals } = useMemo(() => {
    const asset = getAssets(vaultOption);
    return {
      asset: asset,
      decimals: getAssetDecimals(asset),
    };
  }, [vaultOption]);
  const { price: assetPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: asset,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useElementSize(containerRef);
  const { width: screenWidth } = useScreenSize();
  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    assetPriceLoading
  );

  const getVaultActivityExternalURL = useCallback((activity: VaultActivity) => {
    switch (activity.type) {
      case "minting":
        return `${getEtherscanURI()}/tx/${activity.openTxhash}`;
      case "sales":
        return `${getEtherscanURI()}/tx/${activity.txhash}`;
    }
  }, []);

  const renderVaultActivity = useCallback(
    (activity: VaultActivity) => {
      switch (activity.type) {
        case "minting":
          return (
            <>
              {/** Icon */}
              <VaultActivityIcon type={activity.type}>
                <i className="fas fa-layer-group" />
              </VaultActivityIcon>

              {/** Name and date */}
              <VaultActivityCol containerWidth={width} weight={0.25}>
                <VaultPrimaryText>
                  {screenWidth > sizes.lg ? "MINTED CONTRACTS" : "MINTED"}
                </VaultPrimaryText>
                <VaultSecondaryText>
                  {moment(activity.openedAt * 1000).fromNow()}
                </VaultSecondaryText>
              </VaultActivityCol>

              {/** Option Details */}
              <VaultActivityCol containerWidth={width} weight={0.35}>
                <VaultPrimaryText>
                  O-{asset} {moment(activity.expiry, "X").format("M/DD")}{" "}
                  {isPutVault(vaultOption)
                    ? `${getOptionAssets(vaultOption)} PUT`
                    : "CALL"}
                </VaultPrimaryText>
                <VaultSecondaryText>
                  Strike {formatOption(activity.strikePrice)}
                </VaultSecondaryText>
              </VaultActivityCol>

              {/** Quantity */}
              <VaultActivityCol
                orientation="right"
                containerWidth={width}
                weight={0.15}
              >
                <VaultPrimaryText>
                  {/* Otokens have 8 decimals */}
                  {formatBigNumber(activity.mintAmount, 4, 8)}
                </VaultPrimaryText>
              </VaultActivityCol>

              {/** Yield */}
              <VaultActivityCol
                orientation="right"
                containerWidth={width}
                weight={0.25}
              >
                <VaultPrimaryText>-</VaultPrimaryText>
                <VaultSecondaryText>-</VaultSecondaryText>
              </VaultActivityCol>
            </>
          );
        case "sales":
          return (
            <>
              {/** Icon */}
              <VaultActivityIcon type={activity.type}>
                <i className="fas fa-dollar-sign" />
              </VaultActivityIcon>

              {/** Name and date */}
              <VaultActivityCol containerWidth={width} weight={0.25}>
                <VaultPrimaryText>
                  {screenWidth > sizes.lg ? "SOLD CONTRACTS" : "SOLD"}
                </VaultPrimaryText>
                <VaultSecondaryText>
                  {moment(activity.timestamp * 1000).fromNow()}
                </VaultSecondaryText>
              </VaultActivityCol>

              {/** Option Details */}
              <VaultActivityCol containerWidth={width} weight={0.35}>
                <VaultPrimaryText>
                  O-{asset + " "}
                  {moment(activity.vaultShortPosition.expiry, "X").format(
                    "M/DD"
                  )}{" "}
                  {isPutVault(vaultOption)
                    ? `${getOptionAssets(vaultOption)} PUT`
                    : "CALL"}
                </VaultPrimaryText>
                <VaultSecondaryText>
                  Strike {formatOption(activity.vaultShortPosition.strikePrice)}
                </VaultSecondaryText>
              </VaultActivityCol>

              {/** Quantity */}
              <VaultActivityCol
                orientation="right"
                containerWidth={width}
                weight={0.15}
              >
                <VaultPrimaryText>
                  {formatOption(activity.sellAmount).toLocaleString()}
                </VaultPrimaryText>
              </VaultActivityCol>

              {/** Yield */}
              <VaultActivityCol
                orientation="right"
                containerWidth={width}
                weight={0.25}
              >
                <VaultPrimaryText variant="green">
                  +{formatBigNumber(activity.premium, 6, decimals)}{" "}
                  {getAssetDisplay(asset)}
                </VaultPrimaryText>
                <VaultSecondaryText fontFamily="VCR">
                  {assetPriceLoading
                    ? loadingText
                    : `+${assetToUSD(activity.premium, assetPrice, decimals)}`}
                </VaultSecondaryText>
              </VaultActivityCol>
            </>
          );
      }
    },
    [
      width,
      assetPrice,
      assetPriceLoading,
      screenWidth,
      loadingText,
      asset,
      decimals,
      vaultOption,
    ]
  );

  return (
    <div className="d-flex flex-column" ref={containerRef}>
      <VaultActivityHeader>
        <VaultActivityHeaderCol weight={0.25} containerWidth={width}>
          <SecondaryText>Action</SecondaryText>
        </VaultActivityHeaderCol>
        <VaultActivityHeaderCol weight={0.35} containerWidth={width}>
          <SecondaryText>Contract</SecondaryText>
        </VaultActivityHeaderCol>
        <VaultActivityHeaderCol
          weight={0.15}
          containerWidth={width}
          orientation="right"
        >
          <SecondaryText>Quantity</SecondaryText>
        </VaultActivityHeaderCol>
        <VaultActivityHeaderCol
          weight={0.25}
          containerWidth={width}
          orientation="right"
        >
          <SecondaryText>Yield</SecondaryText>
        </VaultActivityHeaderCol>
      </VaultActivityHeader>
      {activities.map((activity, index) => (
        <VaultActivityRow key={index}>
          {/** Activity */}
          {renderVaultActivity(activity)}

          {/** External Link */}
          <BaseLink
            to={getVaultActivityExternalURL(activity)}
            target="_blank"
            rel="noreferrer noopener"
          >
            <VaultActivityExternalLinkContainer>
              <ExternalLink />
            </VaultActivityExternalLinkContainer>
          </BaseLink>
        </VaultActivityRow>
      ))}
    </div>
  );
};

export default DesktopVaultActivityList;
