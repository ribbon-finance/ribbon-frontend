import ProgressBar from "shared/lib/components/Deposit/ProgressBar";
import { SecondaryText, Title } from "shared/lib/designSystem";
import styled from "styled-components";
const Header = styled.div.attrs({
  className: "d-flex align-items-center justify-content-between pt-3",
})``;

interface GaugeStatProps {
  title: string;
  // Number betweeen 0-100
  percentage: number;
  accentColor?: string;
}

const GaugeStat: React.FC<GaugeStatProps> = ({
  title,
  percentage,
  accentColor,
}) => {
  return (
    <div>
      <Header>
        <SecondaryText>{title}</SecondaryText>
        <Title color={accentColor}>{percentage}%</Title>
      </Header>
      <ProgressBar
        percent={percentage}
        color={accentColor}
        config={{
          height: 4,
          extraClassNames: "mt-3",
          radius: 2,
        }}
      />
    </div>
  );
};

export default GaugeStat;
