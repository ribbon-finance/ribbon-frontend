import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { formatUnits } from "@ethersproject/units";

import {
  getAssets,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { getVaultColor } from "shared/lib/utils/vault";
import theme from "shared/lib/designSystem/theme";
import AssetCircleContainer from "../Common/AssetCircleContainer";
import {
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "shared/lib/utils/asset";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import ButtonArrow from "shared/lib/components/Common/ButtonArrow";
import useVaultAccounts from "shared/lib/hooks/useVaultAccounts";
import { formatBigNumber, isPracticallyZero } from "shared/lib/utils/math";
import { useWebappGlobalState } from "../../store/store";
import sizes from "shared/lib/designSystem/sizes";

const DesktopContainer = styled.div`
  display: flex;
  position: sticky;
  bottom: 40px;
  left: 40px;
  width: max-content;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const MobileContainer = styled.div<{ color: string }>`
  display: none;

  @media (max-width: ${sizes.md}px) {
    display: flex;
    width: 100%;
    background: linear-gradient(
      96.84deg,
      ${(props) => props.color}14 1.04%,
      ${(props) => props.color}03 98.99%
    );
    padding: 4px 16px;
  }
`;

const FloatingPositionCard = styled.div<{ color: string }>`
  display: flex;
  border-radius: ${theme.border.radius};
  padding: 4px;
  backdrop-filter: blur(32px);
  background: linear-gradient(
    96.84deg,
    ${(props) => props.color}14 1.04%,
    ${(props) => props.color}03 98.99%
  );
`;

const PositionInfoText = styled(Title)<{ size: number }>`
  letter-spacing: 1px;
  font-size: ${(props) => props.size}px;
  line-height: 16px;
`;

interface YourPositionProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
  variant: "desktop" | "mobile";
  onShowHook?: (show: boolean) => void;
}

const YourPosition: React.FC<YourPositionProps> = ({
  vault: { vaultOption, vaultVersion },
  variant,
  onShowHook,
}) => {
  const color = getVaultColor(vaultOption);
  const asset = getAssets(vaultOption);
  const decimals = getAssetDecimals(asset);
  const Logo = getAssetLogo(asset);

  const vaultOptions = useMemo(() => [vaultOption], [vaultOption]);
  const { vaultAccounts } = useVaultAccounts(vaultOptions, vaultVersion, {
    poll: true,
  });
  const [, setShowVaultPosition] = useWebappGlobalState("showVaultPosition");

  const roi = useMemo(() => {
    const vaultAccount = vaultAccounts[vaultOption];

    if (
      !vaultAccount ||
      isPracticallyZero(vaultAccount.totalDeposits, decimals)
    ) {
      return 0;
    }

    return (
      (parseFloat(
        formatUnits(
          vaultAccount.totalBalance.sub(vaultAccount.totalDeposits),
          decimals
        )
      ) /
        parseFloat(formatUnits(vaultAccount.totalDeposits, decimals))) *
      100
    );
  }, [vaultAccounts, vaultOption, decimals]);

  const vaultAccount = vaultAccounts[vaultOption];

  useEffect(() => {
    onShowHook &&
      onShowHook(
        Boolean(
          vaultAccount &&
            !isPracticallyZero(vaultAccount.totalBalance, decimals)
        )
      );
  }, [decimals, onShowHook, vaultAccount]);

  if (vaultAccount && !isPracticallyZero(vaultAccount.totalBalance, decimals)) {
    switch (variant) {
      case "desktop":
        return (
          <DesktopContainer>
            <FloatingPositionCard
              color={color}
              role="button"
              onClick={() => setShowVaultPosition(true)}
            >
              <AssetCircleContainer color={color} size={48}>
                <Logo width={20} height={20} />
              </AssetCircleContainer>
              <div className="d-flex flex-column justify-content-center p-2">
                <PositionInfoText size={10} color={colors.text}>
                  POSITION ({getAssetDisplay(asset)})
                </PositionInfoText>
                <div className="d-flex">
                  <PositionInfoText size={14}>
                    {formatBigNumber(vaultAccount.totalBalance, decimals)}
                  </PositionInfoText>
                  <PositionInfoText
                    size={10}
                    color={roi >= 0 ? colors.green : colors.red}
                    className="ml-2"
                  >
                    {`${roi >= 0 ? "+" : ""}${parseFloat(roi.toFixed(4))}%`}
                  </PositionInfoText>
                </div>
              </div>
              <div className="d-flex align-items-center ml-5 mr-3">
                <ButtonArrow isOpen={false} color={colors.text} />
              </div>
            </FloatingPositionCard>
          </DesktopContainer>
        );
      case "mobile":
        return (
          <MobileContainer
            color={color}
            onClick={() => setShowVaultPosition(true)}
          >
            <AssetCircleContainer color={color} size={48}>
              <Logo width={20} height={20} />
            </AssetCircleContainer>
            <div className="d-flex flex-column justify-content-center p-2">
              <PositionInfoText size={10} color={colors.text}>
                POSITION ({getAssetDisplay(asset)})
              </PositionInfoText>
              <div className="d-flex">
                <PositionInfoText size={14}>
                  {formatBigNumber(vaultAccount.totalBalance, decimals)}
                </PositionInfoText>
                <PositionInfoText
                  size={10}
                  color={roi >= 0 ? colors.green : colors.red}
                  className="ml-2"
                >
                  {`${roi >= 0 ? "+" : ""}${parseFloat(roi.toFixed(4))}%`}
                </PositionInfoText>
              </div>
            </div>
            <div className="d-flex align-items-center ml-auto mr-3">
              <ButtonArrow isOpen={false} color={colors.text} />
            </div>
          </MobileContainer>
        );
    }
  }

  return <></>;
};

export default YourPosition;
