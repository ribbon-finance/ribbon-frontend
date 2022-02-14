import { useEffect, useState } from "react";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import CircularProgress from "./CircularProgress";

const Container = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colors.background.four};
  border-radius: 999px;
  padding: 8px;
  flex: 1;
`;

const Label = styled(Title)`
  padding-left: 8px;
`;

interface DistributionStatProps {
  title: string;
  percentage: number; // Number between 0-100
  style?: React.CSSProperties;
}

const DistributionStat: React.FC<DistributionStatProps> = ({
  title,
  percentage,
}) => {
  const [startingPercentage, setStartingPercentage] = useState(0);

  useEffect(() => {
    if (percentage) {
      setTimeout(() => {
        setStartingPercentage(percentage);
      }, 1000);
    }
  }, [percentage]);

  return (
    <Container>
      <CircularProgress percentage={startingPercentage} />
      <Label fontSize={14} color={colors.green}>
        {title}
      </Label>
    </Container>
  );
};

export default DistributionStat;
