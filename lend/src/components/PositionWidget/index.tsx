import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { VaultOptions, VaultVersion } from "../../constants/constants";
import { getVaultColor } from "../../utils/vault";
import AssetCircleContainer from "shared/lib/components/Common/AssetCircleContainer";
import { getAssetDecimals, getAssetLogo } from "../../utils/asset";
import { Title } from "../../designSystem";
import colors from "shared/lib/designSystem/colors";
import { formatBigNumber, isPracticallyZero } from "../../utils/math";
import sizes from "../../designSystem/sizes";
import { useVaultsData } from "../../hooks/web3DataContext";
import { components } from "../../designSystem/components";
import { delayedUpwardFade } from "../animations";

const DesktopContainer = styled.div<{ color: string }>`
  display: flex;
  position: sticky;
  margin-left: auto;
  bottom: calc(${components.footer}px + 26px);
  right: 26px;
  width: max-content;
  border-radius: 48px;
  background: linear-gradient(
    96.84deg,
    ${(props) => props.color}14 1.04%,
    ${(props) => props.color}03 98.99%
  );
  @media (max-width: ${sizes.lg}px) {
    bottom: calc(${components.footer * 2}px + 26px);
  }
  ${delayedUpwardFade}
`;

const FloatingPositionCard = styled.div<{ color: string }>`
  border-radius: 48px;
  padding: 4px;
  backdrop-filter: blur(32px);
  background: linear-gradient(
    96.84deg,
    ${(props) => props.color}14 1.04%,
    ${(props) => props.color}03 98.99%
  );
`;

const PositionBox = styled.div`
  display: flex;
  flex-direction: row;
`;

const PositionContainer = styled.div`
  margin-right: 48px;
  width: 100%;
`;

const PositionInfoText = styled(Title)<{ size: number; color?: string }>`
  letter-spacing: 1px;
  font-size: ${(props) => props.size}px;
  color: ${(props) => (props.color ? props.color : colors.primaryText)};
  line-height: 16px;
`;

interface YourPositionProps {
  vault: {
    vaultOption: VaultOptions;
    vaultVersion: VaultVersion;
  };
  onShowHook?: (show: boolean) => void;
}

const PositionWidget: React.FC<YourPositionProps> = ({
  vault: { vaultOption },
  onShowHook,
}) => {
  const Logo = getAssetLogo("USDC");
  const { data: vaultDatas } = useVaultsData();
  const decimals = getAssetDecimals("USDC");
  const color = getVaultColor(vaultOption);
  const poolData = vaultDatas[vaultOption];

  useEffect(() => {
    onShowHook &&
      onShowHook(
        Boolean(
          poolData && !isPracticallyZero(poolData.vaultBalanceInAsset, decimals)
        )
      );
  }, [decimals, onShowHook, poolData]);

  const positionWidget = useMemo(() => {
    if (
      poolData &&
      !isPracticallyZero(poolData.vaultBalanceInAsset, decimals)
    ) {
      return (
        <DesktopContainer color={color}>
          <FloatingPositionCard color={color}>
            <PositionBox>
              <div className="d-flex justify-content-center">
                <AssetCircleContainer color={color} size={48}>
                  <Logo width={"100%"} height={"100%"} />
                </AssetCircleContainer>
              </div>
              <PositionContainer>
                <div className="d-flex flex-column justify-content-center p-2">
                  <PositionInfoText size={10} color={colors.text}>
                    Your Balance
                  </PositionInfoText>
                  <div className="d-flex">
                    <PositionInfoText size={14}>
                      {poolData
                        ? formatBigNumber(
                            poolData.vaultBalanceInAsset,
                            decimals
                          )
                        : "0.00"}
                    </PositionInfoText>
                  </div>
                </div>
              </PositionContainer>
            </PositionBox>
          </FloatingPositionCard>
        </DesktopContainer>
      );
    }
    return <></>;
  }, [poolData, decimals, color, Logo]);

  return positionWidget;
};

export default PositionWidget;
