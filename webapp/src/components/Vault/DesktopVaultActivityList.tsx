import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import moment from "moment";
import { ethers } from "ethers";

import { getEtherscanURI } from "../../constants/constants";
import { BaseLink, SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import { VaultActivity, VaultActivityType } from "../../models/vault";
import {
  ethToUSD,
  formatOption,
  formatSignificantDecimals,
} from "../../utils/math";
import useAssetPrice from "../../hooks/useAssetPrice";
import useElementSize from "../../hooks/useElementSize";
import sizes from "../../designSystem/sizes";
import useScreenSize from "../../hooks/useScreenSize";
import useTextAnimation from "../../hooks/useTextAnimation";

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

const ExternalLink = styled.i`
  color: white;
  opacity: 0.48;
`;

interface DesktopVaultActivityListProps {
  activities: VaultActivity[];
}

const DesktopVaultActivityList: React.FC<DesktopVaultActivityListProps> = ({
  activities,
}) => {
  const { price: ethPrice, loading: ethPriceLoading } = useAssetPrice({});
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useElementSize(containerRef);
  const { width: screenWidth } = useScreenSize();
  const loadingText = useTextAnimation(
    ["Loading", "Loading .", "Loading ..", "Loading ..."],
    250,
    ethPriceLoading
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
                  O-WETH {moment(activity.expiry, "X").format("M/DD")} CALL
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
                  {formatSignificantDecimals(
                    ethers.utils.formatEther(activity.depositAmount)
                  )}
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
                  O-WETH{" "}
                  {moment(activity.vaultShortPosition.expiry, "X").format(
                    "M/DD"
                  )}{" "}
                  CALL
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
                  {formatSignificantDecimals(
                    formatOption(activity.sellAmount).toFixed(6)
                  )}
                </VaultPrimaryText>
              </VaultActivityCol>

              {/** Yield */}
              <VaultActivityCol
                orientation="right"
                containerWidth={width}
                weight={0.25}
              >
                <VaultPrimaryText variant="green">
                  +
                  {formatSignificantDecimals(
                    ethers.utils.formatEther(activity.premium)
                  )}{" "}
                  ETH
                </VaultPrimaryText>
                <VaultSecondaryText fontFamily="VCR">
                  {ethPriceLoading
                    ? loadingText
                    : `+${ethToUSD(activity.premium, ethPrice)}`}
                </VaultSecondaryText>
              </VaultActivityCol>
            </>
          );
      }
    },
    [width, ethPrice, ethPriceLoading, screenWidth, loadingText]
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
      {activities.map((activity) => (
        <VaultActivityRow>
          {/** Activity */}
          {renderVaultActivity(activity)}

          {/** External Link */}
          <BaseLink
            to={getVaultActivityExternalURL(activity)}
            target="_blank"
            rel="noreferrer noopener"
          >
            <VaultActivityExternalLinkContainer>
              <ExternalLink className="fas fa-external-link-alt" />
            </VaultActivityExternalLinkContainer>
          </BaseLink>
        </VaultActivityRow>
      ))}
    </div>
  );
};

export default DesktopVaultActivityList;
