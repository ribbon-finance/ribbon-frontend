import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import moment from "moment";

import { getEtherscanURI } from "../../constants/constants";
import { BaseLink, SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import { VaultActivity, VaultActivityType } from "../../models/vault";
import {
  ethToUSD,
  optionToUSD,
  formatSignificantDecimals,
} from "../../utils/math";
import { ethers } from "ethers";
import useAssetPrice from "../../hooks/useAssetPrice";
import useElementSize from "../../hooks/useElementSize";

const VaultActivityContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  margin-bottom: 16px;
  padding: 16px;
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

const VaultActivityCol = styled.div<{
  orientation?: "left" | "right";
  containerWidth?: number;
}>`
  display: flex;
  flex-direction: column;
  width: ${(props) =>
    props.containerWidth
      ? `calc((${props.containerWidth}px - 32px - 56px - 120px) * 0.25)`
      : `20%`};

  text-align: ${(props) => {
    switch (props.orientation) {
      case "left":
      case "right":
        return props.orientation;
      default:
        return "left";
    }
  }};
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
  ${(props) => (props.fontFamily ? `font-family: ${props.fontFamily};` : "")}
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
`;

const ExternalLink = styled.i`
  color: white;
  opacity: 0.48;
`;

interface VaultActivityListProps {
  activities: VaultActivity[];
}

const VaultActivityList: React.FC<VaultActivityListProps> = ({
  activities,
}) => {
  const { price: ethPrice, loading: ethPriceLoading } = useAssetPrice({});
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useElementSize(containerRef);

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
              <VaultActivityCol containerWidth={width}>
                <VaultPrimaryText>MINTED CONTRACTS</VaultPrimaryText>
                <VaultSecondaryText>
                  {moment(activity.openedAt * 1000).fromNow()}
                </VaultSecondaryText>
              </VaultActivityCol>

              {/** Option Details */}
              <VaultActivityCol containerWidth={width}>
                <VaultPrimaryText>
                  O-WETH {moment(activity.expiry, "X").format("M/DD")} CALL
                </VaultPrimaryText>
                <VaultSecondaryText>
                  Strike {optionToUSD(activity.strikePrice)}
                </VaultSecondaryText>
              </VaultActivityCol>

              {/** Quantity */}
              <VaultActivityCol orientation="right" containerWidth={width}>
                <VaultPrimaryText>
                  {formatSignificantDecimals(
                    ethers.utils.formatEther(activity.depositAmount)
                  )}
                </VaultPrimaryText>
              </VaultActivityCol>

              {/** Yield */}
              <VaultActivityCol orientation="right" containerWidth={width}>
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
              <VaultActivityCol containerWidth={width}>
                <VaultPrimaryText>SOLD CONTRACTS</VaultPrimaryText>
                <VaultSecondaryText>
                  {moment(activity.timestamp * 1000).fromNow()}
                </VaultSecondaryText>
              </VaultActivityCol>

              {/** Option Details */}
              <VaultActivityCol containerWidth={width}>
                <VaultPrimaryText>
                  O-WETH{" "}
                  {moment(activity.vaultShortPosition.expiry, "X").format(
                    "M/DD"
                  )}{" "}
                  CALL
                </VaultPrimaryText>
                <VaultSecondaryText>
                  Strike {optionToUSD(activity.vaultShortPosition.strikePrice)}
                </VaultSecondaryText>
              </VaultActivityCol>

              {/** Quantity */}
              <VaultActivityCol orientation="right" containerWidth={width}>
                <VaultPrimaryText>
                  {formatSignificantDecimals(
                    ethers.utils.formatEther(activity.sellAmount)
                  )}
                </VaultPrimaryText>
              </VaultActivityCol>

              {/** Yield */}
              <VaultActivityCol orientation="right" containerWidth={width}>
                <VaultPrimaryText variant="green">
                  +
                  {formatSignificantDecimals(
                    ethers.utils.formatEther(activity.premium)
                  )}{" "}
                  ETH
                </VaultPrimaryText>
                <VaultSecondaryText fontFamily="VCR">
                  {ethPriceLoading
                    ? "Loading ..."
                    : `+${ethToUSD(activity.premium, ethPrice)}`}
                </VaultSecondaryText>
              </VaultActivityCol>
            </>
          );
      }
    },
    [width, ethPrice, ethPriceLoading]
  );

  return (
    <div className="d-flex flex-column" ref={containerRef}>
      {activities.map((activity) => (
        <VaultActivityContainer>
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
        </VaultActivityContainer>
      ))}
    </div>
  );
};

export default VaultActivityList;
