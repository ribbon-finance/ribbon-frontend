import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits } from "@ethersproject/units";

import {
  getAssets,
  getDisplayAssets,
  VaultOptions,
  VaultVersion,
} from "../../constants/constants";
import { getVaultColor } from "../../utils/vault";
import theme from "../../designSystem/theme";
import AssetCircleContainer from "../../components/Common/AssetCircleContainer";
import {
  getAssetDecimals,
  getAssetDisplay,
  getAssetLogo,
} from "../../utils/asset";
import { Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import useVaultAccounts from "../../hooks/useVaultAccounts";
import { formatBigNumber, isPracticallyZero } from "../../utils/math";
import sizes from "../../designSystem/sizes";
import { useGlobalState } from "../../store/store";
import { WidgetPauseIcon } from "shared/lib/assets/icons/icons";
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

const ActionLogoContainer = styled.div<{
  size: number;
  color: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  border: ${theme.border.width} ${theme.border.style} ${(props) => props.color};
  border-radius: 1000px;
  padding: 2px 2px 2px 2px;
  background: ${(props) => props.color}29;
`;

const FloatingPositionCard = styled.div<{ color: string }>`
  display: flex;
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

const PauseButton = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: 32px;
  border: ${theme.border.width} ${theme.border.style} ${(props) => props.color};
  border-radius: 4px;
  padding: 0px 8px;
  background: ${(props) => props.color}29;
`;

const PauseButtonText = styled(Title)<{ size: number }>`
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
  alwaysShowPosition?: boolean;
}

const YourPosition: React.FC<YourPositionProps> = ({
  vault: { vaultOption, vaultVersion },
  variant,
  onShowHook,
  alwaysShowPosition = false,
}) => {
  const color = getVaultColor(vaultOption);
  const asset = getAssets(vaultOption);
  const decimals = getAssetDecimals(asset);
  const Logo = getAssetLogo(getDisplayAssets(vaultOption));
  const { vaultAccounts } = useVaultAccounts(vaultVersion);
  const [, setVaultPositionModal] = useGlobalState("vaultPositionModal");
  const [, setVaultPauseModal] = useGlobalState("vaultPauseModal");
  const [, setVaultResumeModal] = useGlobalState("vaultResumeModal");

  const [roi, isPaused] = useMemo(() => {
    const vaultAccount = vaultAccounts[vaultOption];

    if (
      !vaultAccount ||
      isPracticallyZero(vaultAccount.totalDeposits, decimals)
    ) {
      return [0, true]; //placeholder isPaused is always false
    }

    return [
      (parseFloat(
        formatUnits(
          vaultAccount.totalBalance.sub(vaultAccount.totalDeposits),
          decimals
        )
      ) /
        parseFloat(formatUnits(vaultAccount.totalDeposits, decimals))) *
        100,
      true,
    ]; //placeholder isPaused is always false
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

  const setShowPositionModal = useCallback(() => {
    setVaultPositionModal({
      show: true,
      vaultOption,
      vaultVersion,
    });
  }, [setVaultPositionModal, vaultOption, vaultVersion]);

  const setShowPauseModal = useCallback(
    (e) => {
      e.stopPropagation();
      setVaultPauseModal({
        show: true,
        vaultOption,
        vaultVersion,
      });
    },
    [setVaultPauseModal, vaultOption, vaultVersion]
  );

  const setShowResumeModal = useCallback(
    (e) => {
      e.stopPropagation();
      setVaultResumeModal({
        show: true,
        vaultOption,
        vaultVersion,
      });
    },
    [setVaultResumeModal, vaultOption, vaultVersion]
  );

  if (
    alwaysShowPosition ||
    (vaultAccount && !isPracticallyZero(vaultAccount.totalBalance, decimals))
  ) {
    switch (variant) {
      case "desktop":
        return (
          <DesktopContainer>
            <FloatingPositionCard
              color={color}
              role="button"
              onClick={setShowPositionModal}
            >
              {isPaused ? (
                <div className="d-flex flex-column justify-content-center p-2">
                  <ActionLogoContainer color={color} size={32}>
                    <WidgetPauseIcon color={color} width={32} />
                  </ActionLogoContainer>
                </div>
              ) : (
                <AssetCircleContainer color={color} size={48}>
                  <Logo width={"100%"} height={"100%"} />
                </AssetCircleContainer>
              )}

              <div className="d-flex flex-column justify-content-center p-2">
                <PositionInfoText size={10} color={colors.text}>
                  position ({getAssetDisplay(asset)})
                </PositionInfoText>
                <div className="d-flex">
                  <PositionInfoText size={14}>
                    {vaultAccount
                      ? formatBigNumber(vaultAccount.totalBalance, decimals)
                      : "0.00"}
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
              <div className="d-flex align-items-center ml-4 mr-3">
                <PauseButton
                  color={color}
                  role="button"
                  onClick={(e) => {
                    if (isPaused) {
                      setShowResumeModal(e);
                    } else {
                      setShowPauseModal(e);
                    }
                  }}
                >
                  <PauseButtonText color={color} size={12}>
                    {isPaused ? "RESUME" : "PAUSE"}
                  </PauseButtonText>
                </PauseButton>
              </div>
            </FloatingPositionCard>
          </DesktopContainer>
        );
      case "mobile":
        return (
          <MobileContainer color={color} onClick={setShowPositionModal}>
            <div className="d-flex flex-column justify-content-center p-2">
              {isPaused ? (
                <ActionLogoContainer color={color} size={32}>
                  <WidgetPauseIcon color={color} width={"100%"} />
                </ActionLogoContainer>
              ) : (
                <AssetCircleContainer color={color} size={48}>
                  <Logo width={"100%"} height={"100%"} />
                </AssetCircleContainer>
              )}
            </div>
            <div className="d-flex flex-column justify-content-center p-2">
              <PositionInfoText size={10} color={colors.text}>
                position ({getAssetDisplay(asset)})
              </PositionInfoText>
              <div className="d-flex">
                <PositionInfoText size={14}>
                  {vaultAccount
                    ? formatBigNumber(vaultAccount.totalBalance, decimals)
                    : "0.00"}
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
              <PauseButton
                color={color}
                role="button"
                onClick={(e) => {
                  if (isPaused) {
                    setShowResumeModal(e);
                  } else {
                    setShowPauseModal(e);
                  }
                }}
              >
                <PauseButtonText color={color} size={12}>
                  {isPaused ? "resume" : "pause"}
                </PauseButtonText>
              </PauseButton>
            </div>
          </MobileContainer>
        );
    }
  }

  return <></>;
};

export default YourPosition;
