import styled from "styled-components";

const BackgroundBar = styled.div<{ height: number; radius: number }>`
  height: ${(props) => props.height}px;
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border-radius: ${(props) => props.radius}px;
`;

const ForegroundBar = styled.div<{ height: number; radius: number }>`
  position: absolute;
  top: 0;
  left: 0;
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
}

const ProgressBar = ({
  percent,
  config = {
    height: 16,
    extraClassNames: "my-3",
    radius: 4,
  },
  color = "#ffffff",
}: ProgressBarProps) => {
  return (
    <div
      className={`d-flex flex-row position-relative ${config.extraClassNames}`}
    >
      <BackgroundBar height={config.height} radius={config.radius} />
      <ForegroundBar
        height={config.height}
        style={{
          width: `${percent}%`,
          background: color,
        }}
        radius={config.radius}
      />
    </div>
  );
};

export default ProgressBar;
