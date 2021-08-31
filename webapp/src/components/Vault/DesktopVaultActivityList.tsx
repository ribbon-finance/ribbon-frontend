import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import moment from "moment";

import {
  getAssets,
  getEtherscanURI,
  isPutVault,
  getOptionAssets,
  VaultOptions,
} from "shared/lib/constants/constants";
import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { VaultActivity, VaultActivityType } from "shared/lib/models/vault";
import {
  assetToUSD,
  formatBigNumber,
  formatOption,
} from "shared/lib/utils/math";
import useAssetPrice from "shared/lib/hooks/useAssetPrice";
import sizes from "shared/lib/designSystem/sizes";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import TableWithFixedHeader from "shared/lib/components/Common/TableWithFixedHeader";

const VaultActivityIcon = styled.div<{ type: VaultActivityType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border-radius: 100px;
  background-color: ${(props) => colors.vaultActivity[props.type]}14;

  i {
    color: ${(props) => colors.vaultActivity[props.type]};
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

  const { width: screenWidth } = useScreenSize();
  const loadingText = useTextAnimation(assetPriceLoading);

  const getVaultActivityExternalURL = useCallback((activity: VaultActivity) => {
    switch (activity.type) {
      case "minting":
        return `${getEtherscanURI()}/tx/${activity.openTxhash}`;
      case "sales":
        return `${getEtherscanURI()}/tx/${activity.txhash}`;
    }
  }, []);

  const getVaultActivityTableData = useCallback(
    (activity: VaultActivity) => {
      switch (activity.type) {
        case "minting":
          return [
            <>
              <VaultPrimaryText>
                {screenWidth > sizes.lg ? "MINTED CONTRACTS" : "MINTED"}
              </VaultPrimaryText>
              <VaultSecondaryText>
                {moment(activity.openedAt * 1000).fromNow()}
              </VaultSecondaryText>
            </>,
            <>
              <VaultPrimaryText>
                O-{asset} {moment(activity.expiry, "X").format("M/DD")}{" "}
                {isPutVault(vaultOption)
                  ? `${getOptionAssets(vaultOption)} PUT`
                  : "CALL"}
              </VaultPrimaryText>
              <VaultSecondaryText>
                Strike {formatOption(activity.strikePrice)}
              </VaultSecondaryText>
            </>,
            <VaultPrimaryText>
              {formatBigNumber(activity.depositAmount, decimals)}
            </VaultPrimaryText>,
            <>
              <VaultPrimaryText>-</VaultPrimaryText>
              <VaultSecondaryText>-</VaultSecondaryText>
            </>,
          ];
        case "sales":
          return [
            <>
              <VaultPrimaryText>
                {screenWidth > sizes.lg ? "SOLD CONTRACTS" : "SOLD"}
              </VaultPrimaryText>
              <VaultSecondaryText>
                {moment(activity.timestamp * 1000).fromNow()}
              </VaultSecondaryText>
            </>,
            <>
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
            </>,
            <>
              <VaultPrimaryText>
                {formatOption(activity.sellAmount).toLocaleString()}
              </VaultPrimaryText>
            </>,
            <>
              <VaultPrimaryText variant="green">
                +{formatBigNumber(activity.premium, decimals)}{" "}
                {getAssetDisplay(asset)}
              </VaultPrimaryText>
              <VaultSecondaryText fontFamily="VCR">
                {assetPriceLoading
                  ? loadingText
                  : `+${assetToUSD(activity.premium, assetPrice, decimals)}`}
              </VaultSecondaryText>
            </>,
          ];
      }
    },
    [
      assetPrice,
      assetPriceLoading,
      screenWidth,
      loadingText,
      asset,
      decimals,
      vaultOption,
    ]
  );

  const getActivityLogo = useCallback((activity: VaultActivity) => {
    switch (activity.type) {
      case "minting":
        return (
          <VaultActivityIcon type={activity.type}>
            <i className="fas fa-layer-group" />
          </VaultActivityIcon>
        );
      case "sales":
        return (
          <VaultActivityIcon type={activity.type}>
            <i className="fas fa-dollar-sign" />
          </VaultActivityIcon>
        );
    }
  }, []);

  return (
    <TableWithFixedHeader
      weights={[0.25, 0.35, 0.15, 0.25]}
      orientations={["left", "left", "right", "right"]}
      labels={["Action", "Contract", "Quantity", "Yield"]}
      data={activities.map((activity) => getVaultActivityTableData(activity))}
      externalLinks={activities.map((activity) =>
        getVaultActivityExternalURL(activity)
      )}
      logos={activities.map((activity) => getActivityLogo(activity))}
      perPage={6}
    />
  );
};

export default DesktopVaultActivityList;
