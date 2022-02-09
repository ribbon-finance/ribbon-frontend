import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";

const Circle: React.FC<{ percentage: number }> = ({ percentage }) => {
  const r = 22.5;
  const circleSize = 50;

  let val = percentage;
  let strokeOffset = 0;
  if (isNaN(percentage)) {
    val = 100;
  } else {
    var c = Math.PI * (r * 2);
    if (val < 0) {
      val = 0;
    }
    if (val > 100) {
      val = 100;
    }
    const pct = ((100 - val) / 100) * c;
    strokeOffset = pct;
  }

  return (
    <svg
      id="svg"
      width={circleSize}
      height={circleSize}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: "rotate(-90deg)",
      }}
    >
      <circle
        r={r}
        cx={circleSize / 2}
        cy={circleSize / 2}
        fill={`${colors.green}1F`}
        stroke-dasharray="141.37"
        stroke-dashoffset="0"
        style={{
          transition: "stroke-dashoffset 1s linear",
          stroke: "transparent",
          strokeWidth: "2px",
        }}
      />
      <circle
        // Minus 0.5 to offset the stroke
        r={r - 0.5}
        cx={circleSize / 2 - 0.5}
        cy={circleSize / 2 - 0.5}
        fill="transparent"
        stroke-dasharray="141.37"
        stroke-dashoffset={strokeOffset}
        style={{
          transition: "stroke-dashoffset 1s linear",
          strokeWidth: "2px",
          stroke: colors.green,
        }}
      />
    </svg>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled(Title)`
  position: absolute;
  margin-top: -2px;
`;

const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <Container>
      <Circle percentage={percentage} />
      <Label color={colors.green} fontSize={12}>
        {percentage}%
      </Label>
    </Container>
  );
};

export default CircularProgress;
