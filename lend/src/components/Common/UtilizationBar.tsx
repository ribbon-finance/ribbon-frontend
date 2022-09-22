import styled from "styled-components";

const BarContainer = styled.div<{ width: number }>`
  display: flex;
  position: relative;
  align-items: center;
  width: ${(props) => props.width}px;
  margin-right: 16px;
`;

const BackgroundBar = styled.div<{ height: number; radius: number }>`
  display: flex;
  height: ${(props) => props.height}px;
  width: 100%;
  background: rgba(255, 255, 255, 0.16);
  border-radius: ${(props) => props.radius}px;
`;

const ForegroundBar = styled.div<{ height: number; radius: number }>`
  position: absolute;
  display: flex;
  height: ${(props) => props.height}px;
  border-radius: ${(props) => props.radius}px;
  width: 100%;
`;

export interface BarConfig {
  height: number;
  extraClassNames: string;
  radius: number;
}
interface ProgressBarProps {
  // Number between 0-100
  percent: number;
  config?: BarConfig;
  color?: string;
  width: number;
}

const UtilizationBar = ({
  percent,
  config = {
    height: 4,
    extraClassNames: "",
    radius: 100,
  },
  color = "#ffffff",
  width,
}: ProgressBarProps) => {
  return (
    <BarContainer width={width}>
      <BackgroundBar height={config.height} radius={config.radius} />
      <ForegroundBar
        height={config.height}
        style={{
          width: `${percent}%`,
          background: color,
        }}
        radius={config.radius}
      />
    </BarContainer>
  );
};

export default UtilizationBar;
