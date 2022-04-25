import { ReactNode } from "react";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import SegmentControl from "shared/lib/components/Common/SegmentControl";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import { SecondaryText } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";

const Container = styled.div.attrs({
  className: "d-flex flex-grow-1 align-items-center",
})``;

interface ToggleRowItemProps {
  title: string;
  tooltip?: {
    title: string;
    explanation: ReactNode;
  };
  isChecked: boolean;
  onChecked: (checked: boolean) => void;
}

const ToggleRowItem: React.FC<ToggleRowItemProps> = ({
  title,
  tooltip,
  isChecked,
  onChecked,
}) => {
  const segments = [
    {
      value: "true",
      display: "YES",
      textColor: isChecked ? colors.green : colors.tertiaryText,
    },
    {
      value: "false",
      display: "NO",
      textColor: isChecked ? colors.tertiaryText : colors.red,
    },
  ];

  return (
    <Container>
      <SecondaryText fontSize={14} color={colors.tertiaryText}>
        {title}
      </SecondaryText>
      {tooltip && (
        <TooltipExplanation
          title={tooltip.title}
          explanation={tooltip.explanation}
          renderContent={({ ref, ...triggerHandler }) => (
            <HelpInfo containerRef={ref} {...triggerHandler}>
              i
            </HelpInfo>
          )}
        />
      )}
      <div className="ml-auto">
        <SegmentControl
          segments={segments}
          value={isChecked ? "true" : "false"}
          onSelect={(value) => onChecked(value === "true")}
          config={{
            theme: "outline",
            color: isChecked ? colors.green : colors.red,
            backgroundColor: colors.background.three,
            button: {
              px: 12,
              py: 8,
              fontSize: 11,
              lineHeight: 16,
            },
          }}
        />
      </div>
    </Container>
  );
};

export default ToggleRowItem;
