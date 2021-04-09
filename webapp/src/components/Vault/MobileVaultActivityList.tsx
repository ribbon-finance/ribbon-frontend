import React, { useCallback } from "react";
import styled from "styled-components";
import moment from "moment";
import { ethers } from "ethers";

import { VaultActivity, VaultActivityType } from "../../models/vault";
import theme from "../../designSystem/theme";
import colors from "../../designSystem/colors";
import { SecondaryText, Title } from "../../designSystem";
import {
  formatSignificantDecimals,
  formatOption,
  toETH,
} from "../../utils/math";

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
}

const MobileVaultActivityList: React.FC<MobileVaultActivityListProps> = ({
  activities,
}) => {
  const renderVaultActivity = useCallback((activity: VaultActivity) => {
    switch (activity.type) {
      case "minting":
        return (
          <>
            <Title>
              MINTED{" "}
              {formatSignificantDecimals(toETH(activity.depositAmount), 2)}{" "}
              CONTRACTS
            </Title>
            <VaultSecondaryInfoText>
              O-WETH-
              {moment(activity.expiry, "X").format("DD-MMM-YY").toUpperCase()}-
              {formatOption(activity.strikePrice)}C
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
              O-WETH-
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
                    ethers.utils.formatEther(activity.premium)
                  )}{" "}
                  ETH
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
  }, []);
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
