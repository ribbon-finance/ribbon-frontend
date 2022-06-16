import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits } from "@ethersproject/units";
import {
  getDisplayAssets,
  VaultOptions,
  VaultVersion,
  VaultAddressMap,
} from "../../constants/constants";
import { getVaultColor } from "../../utils/vault";
import theme from "../../designSystem/theme";
import AssetCircleContainer from "../../components/Common/AssetCircleContainer";
import { getAssetDisplay, getAssetLogo } from "../../utils/asset";
import { Title } from "../../designSystem";
import colors from "../../designSystem/colors";
import useVaultAccounts from "../../hooks/useVaultAccounts";
import { formatBigNumber, isPracticallyZero } from "../../utils/math";
import sizes from "../../designSystem/sizes";
import { useGlobalState } from "../../store/store";
import { WidgetPauseIcon } from "../../assets/icons/icons";
import { useV2VaultData } from "../../hooks/web3DataContext";
import { RibbonVaultPauser } from "../../codegen";
import useVaultPauser from "../../hooks/useV2VaultPauserContract";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import { AnimatePresence, motion } from "framer-motion";
import { BigNumber } from "ethers";
import ButtonArrow from "../Common/ButtonArrow";

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
  display: grid;
  grid-template-areas:
    " PositionBox"
    " TabContainer";
  border-radius: ${theme.border.radius};
  padding: 4px;
  backdrop-filter: blur(32px);
  background: linear-gradient(
    96.84deg,
    ${(props) => props.color}14 1.04%,
    ${(props) => props.color}03 98.99%
  );

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const MobileFloatingPositionCard = styled.div<{ color: string }>`
  display: none;
  @media (max-width: ${sizes.md}px) {
    display: grid;
    grid-template-areas:
      " PositionBox"
      " TabContainer";
    border-radius: ${theme.border.radius};
    padding: 4px;
    backdrop-filter: blur(32px);
    width: 100%;
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
  background: ${(props) => props.color}29;
`;

const PositionBox = styled.div`
  grid-area: PositionBox;
  display: flex;
  flex-direction: row;
`;

const PositionContainer = styled.div<{ color: string }>`
  margin-right: 48px;
  width: 100%;
`;

const PositionInfoText = styled(Title)<{ size: number }>`
  letter-spacing: 1px;
  font-size: ${(props) => props.size}px;
  line-height: 16px;
`;

const ActionButton = styled.div<{ color: string; show: boolean }>`
  display: ${(props) => (props.show ? "flex" : "none")};
  align-self: center;
  width: fit-content;
  height: 32px;
  border: ${theme.border.width} ${theme.border.style} ${(props) => props.color};
  border-radius: 4px;
  padding: 0px 8px;
  margin-right: 8px;
  background: ${(props) => props.color}29;
`;

const ActionButtonText = styled(Title)<{ size: number }>`
  align-self: center;
  letter-spacing: 1px;
  font-size: ${(props) => props.size}px;
`;

const TabContainer = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? "flex" : "none")};
  grid-area: TabContainer;
  justify-content: center;
  margin: 8px;
`;

const TabButton = styled.div<{
  marginLeft?: number;
  color: string;
  selected: boolean;
}>`
  display: flex;
  flex-direction: row;
  width: 50%;
  height: 4px;
  border-radius: 1px;
  margin-left: ${(props) =>
    `${props.marginLeft === undefined ? 0 : props.marginLeft}px`};
  background: ${(props) => (props.selected ? "#FFFFFF" : "#FFFFFF14")};
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
  const Logo = getAssetLogo(getDisplayAssets(vaultOption));
  const { vaultAccounts } = useVaultAccounts(vaultVersion);
  const [, setVaultPositionModal] = useGlobalState("vaultPositionModal");
  const [, setVaultPauseModal] = useGlobalState("vaultPauseModal");
  const [, setVaultResumeModal] = useGlobalState("vaultResumeModal");
  const [pausedAmount, setPausedAmount] = useState(BigNumber.from(0));
  // todo: disable pause and resume buttons
  const [canResume, setCanResume] = useState(false);
  const [canPause, setCanPause] = useState(false);
  const [widgetState, setWidgetState] = useState<"position" | "paused">(
    "position"
  );
  const [positionState, setPositionState] = useState<
    "position" | "paused" | "partiallyPaused"
  >("position");
  const {
    data: { asset, lockedBalanceInAsset, round, decimals },
  } = useV2VaultData(vaultOption);

  const { account, chainId } = useWeb3Wallet();
  const contract = useVaultPauser(chainId || 1) as RibbonVaultPauser;
  const vaultAddress = VaultAddressMap[vaultOption][vaultVersion];

  // temporary: set the paused amount and canResume bool;
  // to be replaced with subgraph data
  useEffect(() => {
    if (contract && vaultAddress && account) {
      contract
        .getPausePosition(vaultAddress, account)
        .then(([pauseRound, pauseAmount]) => {
          setPausedAmount(pauseAmount);
          setCanResume(pauseRound !== 0 && pauseRound < round); // edge case round returns 0
          setCanPause(!isPracticallyZero(lockedBalanceInAsset, decimals));
        });
    }
  }, [
    contract,
    canResume,
    vaultAddress,
    account,
    lockedBalanceInAsset,
    decimals,
    round,
  ]);

  // set state of user's position
  useMemo(() => {
    const vaultAccount = vaultAccounts[vaultOption];
    if (!vaultAccount) {
      return;
    }
    const isPaused = !isPracticallyZero(pausedAmount, decimals);
    const hasBalanceAfterPause = !isPracticallyZero(
      vaultAccount.totalBalance,
      decimals
    );
    if (isPaused && !hasBalanceAfterPause) {
      setPositionState("paused");
    }
    if (!isPaused && hasBalanceAfterPause) {
      setPositionState("position");
    }
    if (isPaused && hasBalanceAfterPause) {
      setPositionState("partiallyPaused");
    }
  }, [vaultAccounts, vaultOption, decimals, pausedAmount]);

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

  const setWidgetStateHandler = useCallback((e, positionChange) => {
    e.stopPropagation();
    setWidgetState(positionChange);
  }, []);

  const positionWidget = useMemo(() => {
    if (
      alwaysShowPosition ||
      (vaultAccount && !isPracticallyZero(vaultAccount.totalBalance, decimals))
    ) {
      switch (variant) {
        case "desktop":
          return (
            <DesktopContainer>
              <FloatingPositionCard color={color}>
                <AnimatePresence exitBeforeEnter initial={false}>
                  <motion.div
                    key={"position"}
                    transition={{
                      duration: 0.25,
                      type: "keyframes",
                      ease: "easeInOut",
                    }}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    <PositionBox role="button" onClick={setShowPositionModal}>
                      <div className="d-flex justify-content-center">
                        <AssetCircleContainer color={color} size={48}>
                          <Logo width={"100%"} height={"100%"} />
                        </AssetCircleContainer>
                      </div>
                      <PositionContainer color={color}>
                        <div className="d-flex flex-column justify-content-center p-2">
                          <PositionInfoText size={10} color={colors.text}>
                            position ({getAssetDisplay(asset)})
                          </PositionInfoText>
                          <div className="d-flex">
                            <PositionInfoText size={14}>
                              {vaultAccount
                                ? formatBigNumber(
                                    vaultAccount.totalBalance,
                                    decimals
                                  )
                                : "0.00"}
                            </PositionInfoText>
                            <PositionInfoText
                              size={10}
                              color={roi >= 0 ? colors.green : colors.red}
                              className="ml-2"
                            >
                              {`${roi >= 0 ? "+" : ""}${parseFloat(
                                roi.toFixed(4)
                              )}%`}
                            </PositionInfoText>
                          </div>
                        </div>
                      </PositionContainer>
                      {canPause ? (
                        <ActionButton
                          color={color}
                          show={true}
                          role="button"
                          onClick={(e) => {
                            setShowPauseModal(e);
                          }}
                        >
                          <ActionButtonText color={color} size={12}>
                            PAUSE
                          </ActionButtonText>
                        </ActionButton>
                      ) : (
                        <div className="d-flex align-items-center ml-auto mr-3">
                          <ButtonArrow isOpen={false} color={colors.text} />
                        </div>
                      )}
                    </PositionBox>
                  </motion.div>
                </AnimatePresence>
                <TabContainer show={positionState === "partiallyPaused"}>
                  <TabButton
                    color={colors.text}
                    role="button"
                    selected={widgetState === "position"}
                    onClick={(e) => {
                      setWidgetStateHandler(e, "position");
                    }}
                  ></TabButton>
                  <TabButton
                    marginLeft={12}
                    color={colors.text}
                    role="button"
                    selected={widgetState === "paused"}
                    onClick={(e) => {
                      setWidgetStateHandler(e, "paused");
                    }}
                  ></TabButton>
                </TabContainer>
              </FloatingPositionCard>
            </DesktopContainer>
          );
        case "mobile":
          return (
            <MobileContainer color={color}>
              <MobileFloatingPositionCard color={color}>
                <AnimatePresence exitBeforeEnter initial={false}>
                  <motion.div
                    key={"m-position"}
                    transition={{
                      duration: 0.25,
                      type: "keyframes",
                      ease: "easeInOut",
                    }}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                  >
                    <PositionBox role="button" onClick={setShowPositionModal}>
                      <div className="d-flex justify-content-center">
                        <AssetCircleContainer color={color} size={48}>
                          <Logo width={"100%"} height={"100%"} />
                        </AssetCircleContainer>
                      </div>
                      <PositionContainer color={color}>
                        <div className="d-flex flex-column justify-content-center p-2">
                          <PositionInfoText size={10} color={colors.text}>
                            position ({getAssetDisplay(asset)})
                          </PositionInfoText>
                          <div className="d-flex">
                            <PositionInfoText size={14}>
                              {vaultAccount
                                ? formatBigNumber(
                                    vaultAccount.totalBalance,
                                    decimals
                                  )
                                : "0.00"}
                            </PositionInfoText>
                            <PositionInfoText
                              size={10}
                              color={roi >= 0 ? colors.green : colors.red}
                              className="ml-2"
                            >
                              {`${roi >= 0 ? "+" : ""}${parseFloat(
                                roi.toFixed(4)
                              )}%`}
                            </PositionInfoText>
                          </div>
                        </div>
                      </PositionContainer>
                      {canPause ? (
                        <ActionButton
                          color={color}
                          show={true}
                          role="button"
                          onClick={(e) => {
                            setShowPauseModal(e);
                          }}
                        >
                          <ActionButtonText color={color} size={12}>
                            PAUSE
                          </ActionButtonText>
                        </ActionButton>
                      ) : (
                        <div className="d-flex align-items-center ml-auto mr-3">
                          <ButtonArrow isOpen={false} color={colors.text} />
                        </div>
                      )}
                    </PositionBox>
                  </motion.div>
                </AnimatePresence>
                <TabContainer show={positionState === "partiallyPaused"}>
                  <TabButton
                    color={colors.text}
                    role="button"
                    selected={widgetState === "position"}
                    onClick={(e) => {
                      setWidgetStateHandler(e, "position");
                    }}
                  ></TabButton>
                  <TabButton
                    marginLeft={12}
                    color={colors.text}
                    role="button"
                    selected={widgetState === "paused"}
                    onClick={(e) => {
                      setWidgetStateHandler(e, "paused");
                    }}
                  ></TabButton>
                </TabContainer>
              </MobileFloatingPositionCard>
            </MobileContainer>
          );
      }
    }
    return <></>;
  }, [
    positionState,
    widgetState,
    setWidgetStateHandler,
    vaultAccount,
    Logo,
    alwaysShowPosition,
    canPause,
    asset,
    color,
    decimals,
    roi,
    setShowPauseModal,
    setShowPositionModal,
    variant,
  ]);

  const pausedPositionWidget = useMemo(() => {
    switch (variant) {
      case "desktop":
        return (
          <DesktopContainer>
            <FloatingPositionCard color={color}>
              <AnimatePresence exitBeforeEnter initial={false}>
                <motion.div
                  key={"pause"}
                  transition={{
                    duration: 0.25,
                    type: "keyframes",
                    ease: "easeInOut",
                  }}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                >
                  <PositionBox role="button" onClick={setShowPositionModal}>
                    <div className="d-flex justify-content-center p-2">
                      <ActionLogoContainer color={color} size={32}>
                        <WidgetPauseIcon color={color} width={"100%"} />
                      </ActionLogoContainer>
                    </div>
                    <PositionContainer color={color}>
                      <div className="d-flex flex-column justify-content-center p-2">
                        <PositionInfoText size={10} color={colors.text}>
                          Paused ({getAssetDisplay(asset)})
                        </PositionInfoText>
                        <div className="d-flex">
                          <PositionInfoText size={14}>
                            {formatBigNumber(pausedAmount, decimals)}
                          </PositionInfoText>
                        </div>
                      </div>
                    </PositionContainer>
                    {canResume ? (
                      <ActionButton
                        color={color}
                        show={true}
                        role="button"
                        onClick={(e) => {
                          setShowResumeModal(e);
                        }}
                      >
                        <ActionButtonText color={color} size={12}>
                          RESUME
                        </ActionButtonText>
                      </ActionButton>
                    ) : (
                      <div className="d-flex align-items-center ml-auto mr-3">
                        <ButtonArrow isOpen={false} color={colors.text} />
                      </div>
                    )}
                  </PositionBox>
                </motion.div>
              </AnimatePresence>
              <TabContainer show={positionState === "partiallyPaused"}>
                <TabButton
                  color={colors.text}
                  role="button"
                  selected={widgetState === "position"}
                  onClick={(e) => {
                    setWidgetStateHandler(e, "position");
                  }}
                ></TabButton>
                <TabButton
                  marginLeft={12}
                  color={colors.text}
                  role="button"
                  selected={widgetState === "paused"}
                  onClick={(e) => {
                    setWidgetStateHandler(e, "paused");
                  }}
                ></TabButton>
              </TabContainer>
            </FloatingPositionCard>
          </DesktopContainer>
        );
      case "mobile":
        return (
          <MobileContainer color={color}>
            <MobileFloatingPositionCard color={color}>
              <AnimatePresence exitBeforeEnter initial={false}>
                <motion.div
                  key={"m-pause"}
                  transition={{
                    duration: 0.25,
                    type: "keyframes",
                    ease: "easeInOut",
                  }}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                >
                  <PositionBox role="button" onClick={setShowPositionModal}>
                    <div className="d-flex justify-content-center p-2">
                      <ActionLogoContainer color={color} size={32}>
                        <WidgetPauseIcon color={color} width={"100%"} />
                      </ActionLogoContainer>
                    </div>
                    <PositionContainer color={color}>
                      <div className="d-flex flex-column justify-content-center p-2">
                        <PositionInfoText size={10} color={colors.text}>
                          Paused ({getAssetDisplay(asset)})
                        </PositionInfoText>
                        <div className="d-flex">
                          <PositionInfoText size={14}>
                            {formatBigNumber(pausedAmount, decimals)}
                          </PositionInfoText>
                          <PositionInfoText
                            size={10}
                            color={roi >= 0 ? colors.green : colors.red}
                            className="ml-2"
                          >
                            {`${roi >= 0 ? "+" : ""}${parseFloat(
                              roi.toFixed(4)
                            )}%`}
                          </PositionInfoText>
                        </div>
                      </div>
                    </PositionContainer>
                    {canResume ? (
                      <ActionButton
                        color={color}
                        show={true}
                        role="button"
                        onClick={(e) => {
                          setShowResumeModal(e);
                        }}
                      >
                        <ActionButtonText color={color} size={12}>
                          RESUME
                        </ActionButtonText>
                      </ActionButton>
                    ) : (
                      <div className="d-flex align-items-center ml-auto mr-3">
                        <ButtonArrow isOpen={false} color={colors.text} />
                      </div>
                    )}
                  </PositionBox>
                </motion.div>
              </AnimatePresence>
              <TabContainer show={positionState === "partiallyPaused"}>
                <TabButton
                  color={colors.text}
                  role="button"
                  selected={widgetState === "position"}
                  onClick={(e) => {
                    setWidgetStateHandler(e, "position");
                  }}
                ></TabButton>
                <TabButton
                  marginLeft={12}
                  color={colors.text}
                  role="button"
                  selected={widgetState === "paused"}
                  onClick={(e) => {
                    setWidgetStateHandler(e, "paused");
                  }}
                ></TabButton>
              </TabContainer>
            </MobileFloatingPositionCard>
          </MobileContainer>
        );
    }
  }, [
    positionState,
    widgetState,
    setWidgetStateHandler,
    pausedAmount,
    canResume,
    decimals,
    asset,
    color,
    roi,
    setShowPositionModal,
    setShowResumeModal,
    variant,
  ]);

  const render = useMemo(() => {
    if (!vaultAccount) {
      return <></>;
    }
    // return paused widget if account has paused balance and no vault balance
    switch (positionState) {
      case "position":
        return positionWidget;
      case "paused":
        return pausedPositionWidget;
      case "partiallyPaused":
        switch (widgetState) {
          case "position":
            return positionWidget;
          case "paused":
            return pausedPositionWidget;
        }
    }
  }, [
    vaultAccount,
    positionState,
    positionWidget,
    pausedPositionWidget,
    widgetState,
  ]);

  return render;
};

export default YourPosition;
