import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import moment from "moment";

import {
  Chains,
  getAssets,
  getExplorerURI,
  VaultOptions,
  getVaultChain,
} from "../../constants/constants";
import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { VaultActivity, VaultActivityType } from "../../models/vault";
import {
  assetToUSD,
  formatBigNumber,
  formatOptionAmount,
  formatOptionStrike,
} from "shared/lib/utils/math";
import { useAssetsPriceHistory } from "shared/lib/hooks/useAssetPrice";
import sizes from "shared/lib/designSystem/sizes";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";
import PoolTableWithFixedHeader from "./PoolTableWithFixedHeaders";
import { PrimaryText } from "../../designSystem";
import { getAssetLogo } from "../../utils/asset";

const VaultPrimaryText = styled(PrimaryText)`
  font-size: 16px;
  color: ${colors.primaryText};

  &:last-child {
    margin-bottom: 0px;
  }
`;

const VaultSecondaryText = styled(SecondaryText)<{
  fontFamily?: string;
}>`
  color: ${colors.tertiaryText};
  font-size: 12px;
  ${(props) =>
    props.fontFamily ? `font-family: ${props.fontFamily}, sans-serif;` : ""}
`;

const VaultSecondaryTextContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
`;

const StyledTitle = styled(Title)``;
interface DesktopVaultActivityListProps {
  activities: VaultActivity[];
  vaultOption: VaultOptions;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  perPage: number;
}

const PoolActivityList: React.FC<DesktopVaultActivityListProps> = ({
  activities,
  vaultOption,
  page,
  setPage,
  perPage,
}) => {
  const { asset, decimals } = useMemo(() => {
    const asset = getAssets(vaultOption);
    return {
      asset: asset,
      decimals: getAssetDecimals(asset),
    };
  }, [vaultOption]);
  const chain = getVaultChain(vaultOption);

  const { searchAssetPriceFromTimestamp, histories } = useAssetsPriceHistory();

  const { width: screenWidth } = useScreenSize();
  const loadingText = useLoadingText();
  const AssetLogo = getAssetLogo("USDC");
  const getVaultActivityExternalURL = useCallback(
    (activity: VaultActivity) => {
      switch (activity.type) {
        case "borrow":
          return `${getExplorerURI(chain || Chains.Ethereum)}/tx/${
            activity.borrowTxhash
          }`;
        case "repay":
          return `${getExplorerURI(chain || Chains.Ethereum)}/tx/${
            activity.repayTxhash
          }`;
      }
    },
    [chain]
  );

  const getVaultActivityTableData = useCallback(
    (activity: VaultActivity) => {
      switch (activity.type) {
        case "borrow":
          return [
            <>
              <VaultPrimaryText>Borrowed</VaultPrimaryText>
              <VaultSecondaryTextContainer>
                <VaultSecondaryText>
                  {moment(activity.borrowedAt * 1000).fromNow()}
                </VaultSecondaryText>
              </VaultSecondaryTextContainer>
            </>,
            <div className="d-flex justify-content-end mr-3">
              <LogoContainer>
                <AssetLogo />
              </LogoContainer>
              <div className="ml-2">
                <StyledTitle>
                  {formatBigNumber(activity.borrowAmount, decimals)}
                </StyledTitle>
              </div>
            </div>,
          ];
        case "repay":
          return [
            <>
              <VaultPrimaryText>Repaid</VaultPrimaryText>
              <VaultSecondaryTextContainer>
                <VaultSecondaryText>
                  {moment(activity.repaidAt * 1000).fromNow()}
                </VaultSecondaryText>
              </VaultSecondaryTextContainer>
            </>,
            <div className="d-flex justify-content-end mr-3">
              <LogoContainer>
                <AssetLogo />
              </LogoContainer>
              <div className="ml-2">
                <StyledTitle>
                  {formatBigNumber(activity.repaidAmount, decimals)}
                </StyledTitle>
              </div>
            </div>,
          ];
      }
    },
    [AssetLogo, decimals]
  );

  return (
    <PoolTableWithFixedHeader
      weights={[0.75, 0.25]}
      orientations={["left", "right"]}
      labels={["Action", "Yield"]}
      data={activities.map((activity) => getVaultActivityTableData(activity))}
      externalLinks={activities.map((activity) =>
        getVaultActivityExternalURL(activity)
      )}
      perPage={perPage}
      pageController={{
        page,
        setPage,
      }}
    />
  );
};

export default PoolActivityList;
