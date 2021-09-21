import React, { useCallback, useEffect, useMemo, useState } from "react";
import BootstrapToast from "react-bootstrap/Toast";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import sizes from "shared/lib/designSystem/sizes";
import { Title } from "shared/lib/designSystem";
import useScreenSize from "shared/lib/hooks/useScreenSize";

interface BarConfig {
  width: number;
  height: number;
  margin: number;
}

const PendingBar = styled.div<BarConfig & { color: string }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background: ${(props) => props.color};

  &:not(:last-child) {
    margin-right: ${(props) => props.margin}px;
  }
`;

const MobileToastContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 14px 0px;
`;

const DesktopToast = styled(BootstrapToast)`
  position: fixed;
  background: none;
  color: rgba(255, 255, 255, 0.64);
  z-index: 10;

  @media (max-width: ${sizes.lg}px) {
    width: 90%;
    max-width: 90%;
    top: 70px;
    left: 5%;
    right: 5%;
    height: 80px;
  }

  @media (min-width: ${sizes.lg}px) {
    top: 70px;
    right: 30px;
    width: 343px;
    height: 80px;
  }
`;

const DesktopBody = styled(BootstrapToast.Body)`
  height: 100%;
  background: ${colors.backgroundDarker};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: ${sizes.lg}px) {
    width: 100%;
    padding-left: 20px;
    padding-right: 25px;
  }
`;

interface PendingAnimatingBarsProps {
  color: string;
  count: number;
  barConfig: BarConfig;
  duration: number;
}

const PendingAnimatingBars: React.FC<PendingAnimatingBarsProps> = ({
  color,
  count,
  barConfig,
  duration,
}) => {
  const [activeBarIndex, setActiveBarIndex] = useState<number>(0);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setActiveBarIndex((prev) => (prev + 1) % Math.floor(count / 2));
    }, (duration / count) * 2);

    return () => clearInterval(animationInterval);
  }, [count, duration]);

  const gapToAlpha = useCallback((gap: number) => {
    switch (gap) {
      case 0:
        return "FF";
      case 1:
        return "A3";
      case 2:
        return "7A";
      case 3:
        return "3D";
      case 4:
        return "29";
      default:
        return "14";
    }
  }, []);

  return (
    <div className="d-flex">
      {[...Array(count)].map((_, index) => (
        <PendingBar
          {...barConfig}
          color={`${color}${gapToAlpha(
            Math.min(
              Math.abs(index - (activeBarIndex + 1 + Math.floor(count / 2))),
              Math.abs(index - Math.floor(count / 2)),
              Math.abs(Math.floor(count / 2) - index - (activeBarIndex + 1))
            )
          )}`}
        />
      ))}
    </div>
  );
};

interface PendingToastProps {
  title: string;
  color: string;
}

const PendingToast: React.FC<PendingToastProps> = ({ title, color }) => {
  const { width } = useScreenSize();

  const body = useMemo(
    () => (
      <>
        <Title fontSize={14} className="mb-2">
          {title}
        </Title>
        <PendingAnimatingBars
          color={color}
          count={width > sizes.lg ? 39 : Math.floor((width * 0.9) / 8)}
          barConfig={{
            width: 4,
            height: 16,
            margin: 4,
          }}
          duration={800}
        />
      </>
    ),
    [color, title, width]
  );

  return width > sizes.lg ? (
    <DesktopToast show={true}>
      <DesktopBody>{body}</DesktopBody>
    </DesktopToast>
  ) : (
    <MobileToastContainer>{body}</MobileToastContainer>
  );
};

export default PendingToast;
