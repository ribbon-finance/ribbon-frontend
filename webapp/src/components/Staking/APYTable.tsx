import styled from "styled-components";
import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";

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

const CalculationData = styled(Title)<{ color?: string }>`
  color: ${({ color }) => color || colors.primaryText};
`;

interface TitleValueTooltip {
  title: string;
  value: string | JSX.Element;
  tooltip?: {
    title: string;
    explanation: string;
  };
}

interface APYTableProps {
  color?: string;
  overallAPY: TitleValueTooltip;
  baseAPY: TitleValueTooltip;
  boostedAPY: TitleValueTooltip;
  extras?: TitleValueTooltip[];
}

const APYTable: React.FC<APYTableProps> = ({
  color,
  overallAPY,
  baseAPY,
  boostedAPY,
  extras,
}) => {
  return (
    <CalculationContainer>
      <CalculationColumn>
        <SecondaryText
          fontSize={14}
          fontWeight={500}
          className="mr-auto"
          color={color}
        >
          {overallAPY.title}
        </SecondaryText>
        <CalculationData color={color}>{overallAPY.value}</CalculationData>
      </CalculationColumn>
      <Subcalculations>
        <SubcalculationColumn>
          <ContainerWithTooltip>
            <SecondaryText fontSize={12} className="mr-auto">
              {baseAPY.title}
            </SecondaryText>
            {baseAPY.tooltip && (
              <TooltipExplanation
                title={baseAPY.tooltip.title}
                explanation={baseAPY.tooltip.explanation}
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    i
                  </HelpInfo>
                )}
              />
            )}
          </ContainerWithTooltip>
          <CalculationData>{baseAPY.value}</CalculationData>
        </SubcalculationColumn>
        <SubcalculationColumn>
          <ContainerWithTooltip>
            <SecondaryText fontSize={12} className="mr-auto">
              {boostedAPY.title}
            </SecondaryText>
            {boostedAPY.tooltip && (
              <TooltipExplanation
                title={boostedAPY.tooltip.title}
                explanation={boostedAPY.tooltip.explanation}
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    i
                  </HelpInfo>
                )}
              />
            )}
          </ContainerWithTooltip>
          <CalculationData>{boostedAPY.value}</CalculationData>
        </SubcalculationColumn>
      </Subcalculations>

      {/* Any extra rows */}
      {extras &&
        extras.map((extra, index) => (
          <CalculationColumn key={`${extra.title}-${extra.value}`}>
            <ContainerWithTooltip>
              <SecondaryText fontSize={14} className="mr-auto">
                {extra.title}
              </SecondaryText>
              {extra.tooltip && (
                <TooltipExplanation
                  title={extra.tooltip.title}
                  explanation={extra.tooltip.explanation}
                  renderContent={({ ref, ...triggerHandler }) => (
                    <HelpInfo containerRef={ref} {...triggerHandler}>
                      i
                    </HelpInfo>
                  )}
                />
              )}
            </ContainerWithTooltip>
            <CalculationData>{extra.value}</CalculationData>
          </CalculationColumn>
        ))}
    </CalculationContainer>
  );
};

export default APYTable;
