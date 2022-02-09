import React, { useCallback, useMemo, useState } from "react";
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
import ModalContentExtra from "shared/lib/components/Common/ModalContentExtra";
import {
  getAssets,
  VaultLiquidityMiningMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import StakingPoolDropdown, { StakingPoolOption } from "./StakingPoolDropdown";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import FilterDropdown from "shared/lib/components/Common/FilterDropdown";

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
  margin-bottom: 4px;
  align-items: center;
  justify-content: space-between;

  &:last-child {
    margin-bottom: unset;
  }
`;

const Subcalculations = styled.div`
  padding: 0 8px 16px 8px;
  width: 100%;
`;

const SubcalculationColumn = styled(CalculationColumn)`
  margin-bottom: 0;
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

const RewardsCalculatorModal: React.FC<RewardsCalculatorModalProps> = ({
  show,
  onClose,
}) => {
  const stakingPools = useMemo(() => {
    return Object.keys(VaultLiquidityMiningMap.lg5) as VaultOptions[];
  }, []);
  const stakingPoolDropdownOptions: StakingPoolOption[] = useMemo(() => {
    return (Object.keys(VaultLiquidityMiningMap.lg5) as VaultOptions[]).map(
      (option) => {
        const Logo = getAssetLogo(getAssets(option));
        return {
          value: option,
          label: option,
          logo: (
            <Logo
              style={{
                margin: 0,
                width: 32,
                height: 32,
              }}
            />
          ),
        };
      }
    );
  }, []);
  const lockupDurationOptions = useMemo(() => {
    return (Object.keys(lockupPeriodToDays) as LockupPeriodKey[]).map((key) => {
      return {
        display: lockupPeriodDisplay(key),
        value: key,
      };
    });
  }, []);

  // INPUTS
  const [currentPool, setCurrentPool] = useState(stakingPools[0]);
  const [stakeInput, setStakeInput] = useState<string>("");
  // TODO: - Get the default pool size. Also set as the placeholder
  const [poolSizeInput, setPoolSizeInput] = useState<string>("3000");
  const [rbnLockedInput, setRBNLockedInput] = useState<string>("");

  // Locked duration, in number of days
  const [lockupPeriod, setLockupPeriod] = useState<string>(
    lockupDurationOptions[0].value
  );

  // Parse input to number
  const parseInput = useCallback((input: string) => {
    const parsedInput = parseFloat(input);
    return isNaN(parsedInput) || parsedInput < 0 ? "" : `${parsedInput}`;
  }, []);

  const onMaxStake = useCallback(() => {}, []);

  return (
    <ModalContainer show={show} headerBackground height={570} onClose={onClose}>
      <>
        <ModalColumn marginTop={8}>
          <Title style={{ zIndex: 1 }}>REWARDS CALCULATOR</Title>
        </ModalColumn>
        <ModalColumn marginTop={40} className="justify-content-start">
          <StakingPoolContainer>
            <BaseInputLabel>STAKING POOL</BaseInputLabel>
            <StakingPoolDropdown
              selectedValue={currentPool}
              options={stakingPoolDropdownOptions}
              onSelectOption={(option: string) =>
                setCurrentPool(option as VaultOptions)
              }
            />
          </StakingPoolContainer>
        </ModalColumn>
        <ModalColumn marginTop={16}>
          <div className="d-flex flex-column mr-2">
            <BaseInputLabel>YOUR STAKE</BaseInputLabel>
            <SmallerInputContainer>
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
            <BaseInputLabel>TOTAL POOL SIZE</BaseInputLabel>
            <SmallerInputContainer>
              <SmallerInput
                type="number"
                min="0"
                className="form-control"
                placeholder="0"
                value={poolSizeInput}
                onChange={(e) => setPoolSizeInput(parseInput(e.target.value))}
              />
            </SmallerInputContainer>
          </div>
        </ModalColumn>
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
                  topBuffer: 16,
                }}
                className="flex-grow-1"
              />
            </SmallerInputContainer>
          </div>
        </ModalColumn>
        <ModalContentExtra backgroundColor={colors.background.two}>
          <CalculationContainer>
            <CalculationColumn>
              <SecondaryText
                fontSize={14}
                fontWeight={500}
                className="mr-auto"
                color={colors.asset[getAssets(currentPool)]}
              >
                APY
              </SecondaryText>
              <CalculationData color={colors.asset[getAssets(currentPool)]}>
                0.00%
              </CalculationData>
            </CalculationColumn>
            <Subcalculations>
              <SubcalculationColumn>
                <ContainerWithTooltip>
                  <SecondaryText fontSize={12} className="mr-auto">
                    Base Rewards
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
                <CalculationData>0.0</CalculationData>
              </SubcalculationColumn>
              <SubcalculationColumn>
                <ContainerWithTooltip>
                  <SecondaryText fontSize={12} className="mr-auto">
                    Boosted Rewards
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
                <CalculationData>0.0</CalculationData>
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
              <CalculationData>0.0</CalculationData>
            </CalculationColumn>
          </CalculationContainer>
        </ModalContentExtra>
      </>
    </ModalContainer>
  );
};

export default RewardsCalculatorModal;
