import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import moment from "moment";
import { ethers } from "ethers";

import { VaultActivity, VaultActivityType } from "shared/lib/models/vault";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import { SecondaryText, Title } from "shared/lib/designSystem";
import { formatSignificantDecimals, formatOption } from "shared/lib/utils/math";
import { getAssets, VaultOptions } from "shared/lib/constants/constants";
import { getAssetDecimals, getAssetDisplay } from "shared/lib/utils/asset";

const VaultActivityRow = styled.div`
  display: flex;
  flex-direction: column;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: ${theme.border.radius};
  margin-bottom: 16px;
  padding: 16px;

  &:first-child {
    margin-top: 24px;
  }
`;

const VaultSecondaryInfoText = styled(SecondaryText)`
  font-size: 12px;
  margin-top: 4px;
`;

const VaultActivityInfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const VaultActivityYieldText = styled(Title)`
  color: ${colors.green};
`;

const VaultActivityIcon = styled.div<{ type: VaultActivityType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 100px;
  background-color: ${(props) => colors.vaultActivity[props.type]}14;
  margin-left: auto;

  i {
    color: ${(props) => colors.vaultActivity[props.type]};
  }
`;

interface MobileVaultActivityListProps {
  activities: VaultActivity[];
  vaultOption: VaultOptions;
}

const MobileVaultActivityList: React.FC<MobileVaultActivityListProps> = ({
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

  const renderVaultActivity = useCallback(
    (activity: VaultActivity) => {
      switch (activity.type) {
        case "minting":
          return (
            <>
              <Title>
                MINTED{" "}
                {formatSignificantDecimals(
                  ethers.utils.formatUnits(activity.depositAmount, decimals),
                  2
                )}{" "}
                CONTRACTS
              </Title>
              <VaultSecondaryInfoText>
                O-{asset}-
                {moment(activity.expiry, "X").format("DD-MMM-YY").toUpperCase()}
                -{formatOption(activity.strikePrice)}C
              </VaultSecondaryInfoText>
              <VaultActivityInfoRow>
                <div className="d-flex flex-column">
                  <Title>-</Title>
                  <VaultSecondaryInfoText>
                    {moment(activity.openedAt, "X").fromNow()}
                  </VaultSecondaryInfoText>
                </div>
                <VaultActivityIcon type={activity.type}>
                  <i className="fas fa-layer-group" />
                </VaultActivityIcon>
              </VaultActivityInfoRow>
            </>
          );
        case "sales":
          return (
            <>
              <Title>
                SOLD{" "}
                {formatSignificantDecimals(
                  formatOption(activity.sellAmount).toFixed(6)
                )}{" "}
                CONTRACTS
              </Title>
              <VaultSecondaryInfoText>
                O-{asset}-
                {moment(activity.vaultShortPosition.expiry, "X")
                  .format("DD-MMM-YY")
                  .toUpperCase()}
                -{formatOption(activity.vaultShortPosition.strikePrice)}C
              </VaultSecondaryInfoText>
              <VaultActivityInfoRow>
                <div className="d-flex flex-column">
                  <VaultActivityYieldText>
                    +
                    {formatSignificantDecimals(
                      ethers.utils.formatUnits(activity.premium, decimals)
                    )}{" "}
                    {getAssetDisplay(asset)}
                  </VaultActivityYieldText>
                  <VaultSecondaryInfoText>
                    {moment(activity.timestamp, "X").fromNow()}
                  </VaultSecondaryInfoText>
                </div>
                <VaultActivityIcon type={activity.type}>
                  <i className="fas fa-dollar-sign" />
                </VaultActivityIcon>
              </VaultActivityInfoRow>
            </>
          );
      }
    },
    [asset, decimals]
  );

  return (
    <div className="d-flex flex-column">
      {activities.map((activity, index) => (
        <VaultActivityRow key={index}>
          {renderVaultActivity(activity)}
        </VaultActivityRow>
      ))}
    </div>
  );
};

export default MobileVaultActivityList;
