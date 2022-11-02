import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import moment from "moment";

import {
  Chains,
  getAssets,
  getExplorerURI,
  PoolOptions,
  getPoolChain,
} from "../../constants/constants";
import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import { PoolActivity } from "../../models/pool";
import { getAssetDecimals } from "shared/lib/utils/asset";
import PoolTableWithFixedHeader from "./PoolTableWithFixedHeaders";
import { PrimaryText } from "../../designSystem";
import { getAssetLogo } from "../../utils/asset";
import currency from "currency.js";
import { formatUnits } from "ethers/lib/utils";
const PoolPrimaryText = styled(PrimaryText)`
  font-size: 16px;
  color: ${colors.primaryText};

  &:last-child {
    margin-bottom: 0px;
  }
`;

const PoolSecondaryText = styled(SecondaryText)<{
  fontFamily?: string;
}>`
  color: ${colors.tertiaryText};
  font-size: 12px;
  ${(props) =>
    props.fontFamily ? `font-family: ${props.fontFamily}, sans-serif;` : ""}
`;

const PoolSecondaryTextContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
`;

const StyledTitle = styled(Title)``;
interface DesktopPoolActivityListProps {
  activities: PoolActivity[];
  poolOption: PoolOptions;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  perPage: number;
}

const PoolActivityList: React.FC<DesktopPoolActivityListProps> = ({
  activities,
  poolOption,
  page,
  setPage,
  perPage,
}) => {
  const { decimals } = useMemo(() => {
    const asset = getAssets(poolOption);
    return {
      asset: asset,
      decimals: getAssetDecimals(asset),
    };
  }, [poolOption]);
  const chain = getPoolChain(poolOption);

  const AssetLogo = getAssetLogo("USDC");
  const getPoolActivityExternalURL = useCallback(
    (activity: PoolActivity) => {
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

  const getPoolActivityTableData = useCallback(
    (activity: PoolActivity) => {
      switch (activity.type) {
        case "borrow":
          return [
            <>
              <PoolPrimaryText>Borrowed</PoolPrimaryText>
              <PoolSecondaryTextContainer>
                <PoolSecondaryText>
                  {moment(activity.borrowedAt * 1000).fromNow()}
                </PoolSecondaryText>
              </PoolSecondaryTextContainer>
            </>,
            <div className="d-flex justify-content-end align-items-center mr-3">
              <LogoContainer>
                <AssetLogo height={"100"} />
              </LogoContainer>
              <div className="ml-2">
                <StyledTitle>
                  {currency(formatUnits(activity.borrowAmount, decimals), {
                    symbol: "",
                  }).format()}
                </StyledTitle>
              </div>
            </div>,
          ];
        case "repay":
          return [
            <>
              <PoolPrimaryText>Repaid</PoolPrimaryText>
              <PoolSecondaryTextContainer>
                <PoolSecondaryText>
                  {moment(activity.repaidAt * 1000).fromNow()}
                </PoolSecondaryText>
              </PoolSecondaryTextContainer>
            </>,
            <div className="d-flex justify-content-end align-items-center mr-3">
              <LogoContainer>
                <AssetLogo height={"100"} />
              </LogoContainer>
              <div className="ml-2">
                <StyledTitle>
                  {currency(formatUnits(activity.repaidAmount, decimals), {
                    symbol: "",
                  }).format()}
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
      weights={[0.5, 0.5]}
      orientations={["left", "right"]}
      labels={["Action", "Yield"]}
      data={activities.map((activity) => getPoolActivityTableData(activity))}
      externalLinks={activities.map((activity) =>
        getPoolActivityExternalURL(activity)
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
