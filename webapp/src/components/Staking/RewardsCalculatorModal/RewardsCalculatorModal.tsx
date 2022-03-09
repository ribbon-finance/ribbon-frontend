import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import BasicModal from "shared/lib/components/Common/BasicModal";
import {
  BaseInputContainer,
  BaseInputLabel,
  SecondaryText,
  Title,
  BaseInput,
  BaseInputButton,
} from "shared/lib/designSystem";
import { getAssetLogo } from "shared/lib/utils/asset";
import {
  LockupPeriodKey,
  lockupPeriodToDays,
} from "shared/lib/models/lockupPeriod";
import colors from "shared/lib/designSystem/colors";
import {
  getDisplayAssets,
  VaultLiquidityMiningMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import StakingPoolDropdown, { StakingPoolOption } from "./StakingPoolDropdown";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import FilterDropdown from "shared/lib/components/Common/FilterDropdown";
import {
  useLiquidityGaugeV5PoolData,
  useV2VaultData,
} from "shared/lib/hooks/web3DataContext";
import useVotingEscrow from "shared/lib/hooks/useVotingEscrow";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import {
  calculateBaseRewards,
  calculateBoostMultiplier,
  calculateInitialveRBNAmount,
  calculateBoostedRewards,
} from "shared/lib/utils/governanceMath";
import { useAssetsPrice } from "shared/lib/hooks/useAssetPrice";
import { BigNumber } from "ethers";
import moment from "moment";

const ModalContainer = styled(BasicModal)``;

const CalculationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  align-items: center;
  align-content: center;
`;

const CalculationColumn = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 8px;
  align-items: center;
  justify-content: space-between;

  &:last-child {
    margin-bottom: unset;
  }
`;

const Subcalculations = styled.div`
  padding: 0 0 16px 8px;
  width: 100%;
`;

const SubcalculationColumn = styled(CalculationColumn)`
  margin-bottom: 4px;
`;

const ContainerWithTooltip = styled.div`
  display: flex;
  align-items: center;
`;

const ModalColumn = styled.div<{ marginTop?: number | "auto" }>`
  display: flex;
  justify-content: center;
  margin-top: ${(props) =>
    props.marginTop === "auto"
      ? props.marginTop
      : `${props.marginTop === undefined ? 24 : props.marginTop}px`};
`;

const StakingPoolContainer = styled.div`
  width: 100%;
`;

const CalculationData = styled(Title)<{ color?: string }>`
  color: ${({ color }) => color || colors.primaryText};
`;

const SmallerInputContainer = styled(BaseInputContainer)`
  height: 48px;
`;
const SmallerInput = styled(BaseInput)`
  font-size: 16px;
`;

const DurationDropdown = styled(FilterDropdown)`
  position: absolute;
  top: 50%;
  transform: translate(-8px, -50%);
  right: 0;
  z-index: 1;
`;

interface RewardsCalculatorModalProps {
  show: boolean;
  onClose: () => void;
}

const lockupPeriodDisplay = (key: LockupPeriodKey) => {
  switch (key) {
    case "WEEK":
      return "1 WEEK";
    case "MONTH":
      return "1 MONTH";
    case "3MONTH":
      return "3 MONTHS";
    case "6MONTH":
      return "6 MONTHS";
    case "YEAR":
      return "1 YEAR";
    case "2YEAR":
      return "2 YEARS";
  }
};

const stakingPools = Object.keys(VaultLiquidityMiningMap.lg5) as VaultOptions[];
const stakingPoolDropdownOptions: StakingPoolOption[] = (
  Object.keys(VaultLiquidityMiningMap.lg5) as VaultOptions[]
).map((option) => {
  const Logo = getAssetLogo(getDisplayAssets(option));
  return {
    value: option,
    label: option,
    logo: (
      <div
        style={{
          width: 32,
          height: 32,
        }}
      >
        <Logo style={{ margin: 0 }} />
      </div>
    ),
  };
});
const lockupDurationOptions = (
  Object.keys(lockupPeriodToDays) as LockupPeriodKey[]
).map((key) => {
  return {
    display: lockupPeriodDisplay(key),
    value: key,
  };
});

const RewardsCalculatorModal: React.FC<RewardsCalculatorModalProps> = ({
  show,
  onClose,
}) => {
  const votingEscrowContract = useVotingEscrow();

  // Current Gauge
  const [currentGauge, setCurrentGauge] = useState(stakingPools[0]);

  const { prices, loading: assetPricesLoading } = useAssetsPrice();
  const { data: lg5Data, loading: lg5DataLoading } =
    useLiquidityGaugeV5PoolData(currentGauge);
  const {
    data: { asset, decimals, pricePerShare },
    loading: vaultDataLoading,
  } = useV2VaultData(currentGauge);

  const loadingText = useLoadingText();

  // Used for boost rewards calculation
  const [totalVeRBN, setTotalVeRBN] = useState<BigNumber>();

  // INPUTS
  const [stakeInput, setStakeInput] = useState<string>("");
  const [poolSizeInput, setPoolSizeInput] = useState<string>("");
  const [rbnLockedInput, setRBNLockedInput] = useState<string>("");
  const [lockupPeriod, setLockupPeriod] = useState<string>(
    lockupDurationOptions[0].value
  );

  // Initial data
  useEffect(() => {
    if (lg5Data) {
      setPoolSizeInput(formatUnits(lg5Data.poolSize, decimals));
    }
  }, [lg5Data, decimals]);

  // Fetch totalverbn
  useEffect(() => {
    if (votingEscrowContract && !totalVeRBN) {
      votingEscrowContract["totalSupply()"]().then((totalSupply: BigNumber) => {
        setTotalVeRBN(totalSupply);
      });
    }
  }, [votingEscrowContract, totalVeRBN]);

  const stakeInputHasError = useMemo(() => {
    return false;
  }, []);

  // =======================================================
  // CALCULATE REWARDS BOOSTER (using formula from CurveDAO)
  // =======================================================
  const getRewardsBooster = useCallback(() => {
    if (!stakeInput || !poolSizeInput) {
      return 0;
    }

    let working_balances = lg5Data?.workingBalances || BigNumber.from("0");
    let working_supply = lg5Data?.workingSupply || BigNumber.from("0");

    // Staking Pool
    let gaugeBalance = BigNumber.from("0");
    let poolLiquidity = BigNumber.from("0");
    let rbnLockedAmount = BigNumber.from("0");

    // If parseUnits fails, it means the number overflowed.
    // defaults to the largest number when that happens.
    try {
      gaugeBalance = parseUnits(stakeInput || "0", decimals);
    } catch (error) {
      gaugeBalance = BigNumber.from(String(Number.MAX_SAFE_INTEGER));
    }
    try {
      poolLiquidity = parseUnits(poolSizeInput || "0", decimals);
    } catch (error) {
      poolLiquidity = BigNumber.from(String(Number.MAX_SAFE_INTEGER));
    }
    try {
      rbnLockedAmount = parseUnits(rbnLockedInput || "0", 18);
    } catch (error) {
      rbnLockedAmount = BigNumber.from(String(Number.MAX_SAFE_INTEGER));
    }

    const duration = moment.duration(
      lockupPeriodToDays[lockupPeriod as LockupPeriodKey],
      "days"
    );
    const veRBNAmount = calculateInitialveRBNAmount(rbnLockedAmount, duration);
    return calculateBoostMultiplier({
      workingBalance: working_balances,
      workingSupply: working_supply,
      gaugeBalance,
      poolLiquidity,
      veRBNAmount,
      totalVeRBN: totalVeRBN || BigNumber.from("0"),
    });
  }, [
    lg5Data,
    decimals,
    lockupPeriod,
    poolSizeInput,
    rbnLockedInput,
    stakeInput,
    totalVeRBN,
  ]);

  // For display
  const displayRewards = useMemo(() => {
    let totalAPY: JSX.Element | string;
    let baseRewards: JSX.Element | string;
    let boostedRewards: JSX.Element | string;
    let rewardsBooster: JSX.Element | string;

    if (stakeInputHasError) {
      totalAPY = "---";
      baseRewards = "---";
      boostedRewards = "---";
      rewardsBooster = "---";
    } else if (lg5DataLoading || assetPricesLoading || vaultDataLoading) {
      totalAPY = loadingText;
      baseRewards = loadingText;
      boostedRewards = loadingText;
      rewardsBooster = loadingText;
    } else {
      let base = 0;
      if (lg5Data) {
        let poolLiquidity = BigNumber.from("0");
        // If parseUnits fails, it means the number overflowed.
        // defaults to the largest number when that happens.
        try {
          const yourStake = parseUnits(stakeInput || "0", decimals);
          poolLiquidity = parseUnits(poolSizeInput || "0", decimals).add(
            yourStake
          );
        } catch (error) {
          poolLiquidity = BigNumber.from(String(Number.MAX_SAFE_INTEGER));
        }
        base = calculateBaseRewards({
          poolSize: poolLiquidity,
          poolReward: lg5Data.poolRewardForDuration,
          pricePerShare,
          decimals,
          assetPrice: prices[asset],
          rbnPrice: prices["RBN"],
        });
      }
      const boosterMultiplier = getRewardsBooster();
      const boosted = calculateBoostedRewards(base, boosterMultiplier);
      baseRewards = `${base.toFixed(2)}%`;
      boostedRewards = `${boosted.toFixed(2)}%`;
      rewardsBooster = boosterMultiplier ? boosterMultiplier.toFixed(2) : "---";
      totalAPY = `${(base + boosted).toFixed(2)}%`;
    }

    return {
      totalAPY,
      baseRewards,
      boostedRewards,
      rewardsBooster,
    };
  }, [
    asset,
    decimals,
    lg5Data,
    pricePerShare,
    prices,
    stakeInputHasError,
    lg5DataLoading,
    assetPricesLoading,
    vaultDataLoading,
    loadingText,
    getRewardsBooster,
    poolSizeInput,
    stakeInput,
  ]);

  // Parse input to number
  const parseInput = useCallback((input: string) => {
    const parsedInput = parseFloat(input);
    return isNaN(parsedInput) || parsedInput < 0 ? "" : input;
  }, []);

  const onMaxStake = useCallback(() => {
    if (lg5Data) {
      setStakeInput(formatUnits(lg5Data.unstakedBalance, decimals));
    }
  }, [lg5Data, decimals]);

  return (
    <ModalContainer show={show} headerBackground height={532} onClose={onClose}>
      <>
        <ModalColumn marginTop={8}>
          <Title style={{ zIndex: 1 }}>REWARDS CALCULATOR</Title>
        </ModalColumn>
        <ModalColumn marginTop={40} className="justify-content-start">
          <StakingPoolContainer>
            <BaseInputLabel>STAKING POOL</BaseInputLabel>
            <StakingPoolDropdown
              selectedValue={currentGauge}
              options={stakingPoolDropdownOptions}
              onSelectOption={(option: string) =>
                setCurrentGauge(option as VaultOptions)
              }
            />
          </StakingPoolContainer>
        </ModalColumn>
        <ModalColumn marginTop={16}>
          <div className="d-flex flex-column mr-2">
            <BaseInputLabel>YOUR STAKE</BaseInputLabel>
            <SmallerInputContainer error={stakeInputHasError}>
              <SmallerInput
                type="number"
                min="0"
                className="form-control"
                placeholder="0"
                value={stakeInput}
                onChange={(e) => setStakeInput(parseInput(e.target.value))}
              />
              <BaseInputButton onClick={onMaxStake}>MAX</BaseInputButton>
            </SmallerInputContainer>
          </div>
          <div className="d-flex flex-column ml-2">
            <BaseInputLabel>TOTAL STAKED</BaseInputLabel>
            <SmallerInputContainer>
              <SmallerInput
                type="number"
                min="0"
                className="form-control"
                placeholder={
                  lg5Data ? formatUnits(lg5Data.poolSize, decimals) : "0"
                }
                value={poolSizeInput}
                onChange={(e) => setPoolSizeInput(parseInput(e.target.value))}
              />
            </SmallerInputContainer>
          </div>
        </ModalColumn>
        {stakeInputHasError && (
          <SecondaryText
            fontSize={12}
            lineHeight={16}
            color={colors.red}
            className="mt-2"
          >
            Your stake must be smaller than the total pool size
          </SecondaryText>
        )}
        <ModalColumn marginTop={16}>
          <div className="d-flex flex-column w-100">
            <BaseInputLabel>RBN LOCKED</BaseInputLabel>
            <SmallerInputContainer>
              <SmallerInput
                type="number"
                min="0"
                className="form-control"
                placeholder="0"
                contentEditable={false}
                value={rbnLockedInput}
                onChange={(e) => setRBNLockedInput(parseInput(e.target.value))}
              />
              <DurationDropdown
                options={lockupDurationOptions}
                value={lockupPeriodDisplay(lockupPeriod as LockupPeriodKey)}
                onSelect={(option: string) => {
                  setLockupPeriod(option);
                }}
                buttonConfig={{
                  background: colors.background.four,
                  activeBackground: colors.background.four,
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                  color: colors.primaryText,
                }}
                dropdownMenuConfig={{
                  horizontalOrientation: "right",
                  topBuffer: 8,
                  backgroundColor: colors.background.three,
                }}
                menuItemConfig={{
                  firstItemPaddingTop: "8px",
                  lastItemPaddingBottom: "8px",
                }}
                menuItemTextConfig={{
                  fontSize: 12,
                  lineHeight: 16,
                }}
                className="flex-grow-1"
              />
            </SmallerInputContainer>
          </div>
        </ModalColumn>
        <ModalColumn marginTop={32}>
          <CalculationContainer>
            <CalculationColumn>
              <SecondaryText
                fontSize={14}
                fontWeight={500}
                className="mr-auto"
                color={colors.asset[getDisplayAssets(currentGauge)]}
              >
                APY
              </SecondaryText>
              <CalculationData
                color={colors.asset[getDisplayAssets(currentGauge)]}
              >
                {displayRewards.totalAPY}
              </CalculationData>
            </CalculationColumn>
            <Subcalculations>
              <SubcalculationColumn>
                <ContainerWithTooltip>
                  <SecondaryText fontSize={12} className="mr-auto">
                    Base Rewards
                  </SecondaryText>
                  <TooltipExplanation
                    title="Base Rewards"
                    explanation="The rewards for staking rTokens."
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HelpInfo containerRef={ref} {...triggerHandler}>
                        i
                      </HelpInfo>
                    )}
                  />
                </ContainerWithTooltip>
                <CalculationData>{displayRewards.baseRewards}</CalculationData>
              </SubcalculationColumn>
              <SubcalculationColumn>
                <ContainerWithTooltip>
                  <SecondaryText fontSize={12} className="mr-auto">
                    Boosted Rewards
                  </SecondaryText>
                  <TooltipExplanation
                    title="Boosted Rewards"
                    explanation="The additional rewards veRBN holders earn for staking their rTokens. Base rewards can be boosted by up to 2.5X."
                    renderContent={({ ref, ...triggerHandler }) => (
                      <HelpInfo containerRef={ref} {...triggerHandler}>
                        i
                      </HelpInfo>
                    )}
                  />
                </ContainerWithTooltip>
                <CalculationData>
                  {displayRewards.boostedRewards}
                </CalculationData>
              </SubcalculationColumn>
            </Subcalculations>
            <CalculationColumn>
              <ContainerWithTooltip>
                <SecondaryText fontSize={14} className="mr-auto">
                  Rewards Booster
                </SecondaryText>
                <TooltipExplanation
                  title="Rewards Booster"
                  explanation="The multiplier applied to the base rewards of veRBN holders."
                  renderContent={({ ref, ...triggerHandler }) => (
                    <HelpInfo containerRef={ref} {...triggerHandler}>
                      i
                    </HelpInfo>
                  )}
                />
              </ContainerWithTooltip>
              <CalculationData>{displayRewards.rewardsBooster}</CalculationData>
            </CalculationColumn>
          </CalculationContainer>
        </ModalColumn>
      </>
    </ModalContainer>
  );
};

export default RewardsCalculatorModal;
