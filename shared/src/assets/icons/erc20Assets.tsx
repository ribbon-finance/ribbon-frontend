import React, {  useRef } from "react";
import styled from "styled-components";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";
import useElementSize from "../../hooks/useElementSize";
import { YearnLogo } from "./defiApp";

type SVGProps = React.SVGAttributes<SVGElement>;

export const WBTCLogo: React.FC<SVGProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 109.26 109.26"
    {...props}
  >
    <defs>
      <style>{`.cls-1{fill:#5a5564;}.cls-2{fill:#f09242;}.cls-3{fill:#282138;}`}</style>
    </defs>
    <title>wrapped-bitcoin-wbtc</title>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <g id="Page-1">
          <g id="wbtc_colour" data-name="wbtc colour">
            <path
              id="Shape"
              className="cls-1"
              d="M89.09,22.93l-3,3a42.47,42.47,0,0,1,0,57.32l3,3a46.76,46.76,0,0,0,0-63.39Z"
            />
            <path
              id="Shape-2"
              data-name="Shape"
              className="cls-1"
              d="M26,23.19a42.47,42.47,0,0,1,57.32,0l3-3a46.76,46.76,0,0,0-63.39,0Z"
            />
            <path
              id="Shape-3"
              data-name="Shape"
              className="cls-1"
              d="M23.19,83.28a42.47,42.47,0,0,1,0-57.29l-3-3a46.76,46.76,0,0,0,0,63.39Z"
            />
            <path
              id="Shape-4"
              data-name="Shape"
              className="cls-1"
              d="M83.28,86.05a42.47,42.47,0,0,1-57.32,0l-3,3a46.76,46.76,0,0,0,63.39,0Z"
            />
            <path
              id="Shape-5"
              data-name="Shape"
              className="cls-2"
              d="M73.57,44.62c-.6-6.26-6-8.36-12.83-9V27H55.46v8.46c-1.39,0-2.81,0-4.22,0V27H46v8.68H35.29v5.65s3.9-.07,3.84,0a2.73,2.73,0,0,1,3,2.32V67.41a1.85,1.85,0,0,1-.64,1.29,1.83,1.83,0,0,1-1.36.46c.07.06-3.84,0-3.84,0l-1,6.31H45.9v8.82h5.28V75.6H55.4v8.65h5.29V75.53c8.92-.54,15.14-2.74,15.92-11.09.63-6.72-2.53-9.72-7.58-10.93C72.1,52,74,49.2,73.57,44.62ZM66.17,63.4c0,6.56-11.24,5.81-14.82,5.81V57.57C54.93,57.58,66.17,56.55,66.17,63.4ZM63.72,47c0,6-9.38,5.27-12.36,5.27V41.69C54.34,41.69,63.72,40.75,63.72,47Z"
            />
            <path
              id="Shape-6"
              data-name="Shape"
              className="cls-3"
              d="M54.62,109.26a54.63,54.63,0,1,1,54.64-54.64A54.63,54.63,0,0,1,54.62,109.26Zm0-105A50.34,50.34,0,1,0,105,54.62,50.34,50.34,0,0,0,54.62,4.26Z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const WETHLogo: React.FC<SVGProps> = (props) => (
  <svg
    width="296"
    height="480"
    viewBox="0 0 296 480"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g opacity="0.8">
      <path
        opacity="0.6"
        d="M147.687 177.339L0.444031 244.304L147.687 331.296L294.871 244.304L147.687 177.339Z"
        fill="#627EEA"
      />
    </g>
    <g opacity="0.65">
      <path
        opacity="0.45"
        d="M0.444031 244.304L147.686 331.296V0L0.444031 244.304Z"
        fill="#627EEA"
      />
    </g>
    <path
      opacity="0.8"
      d="M147.687 0V331.296L294.871 244.304L147.687 0Z"
      fill="#627EEA"
    />
    <g opacity="0.65">
      <path
        opacity="0.45"
        d="M0.444031 272.202L147.686 479.638V359.193L0.444031 272.202Z"
        fill="#627EEA"
      />
    </g>
    <path
      opacity="0.8"
      d="M147.687 359.193V479.638L294.987 272.202L147.687 359.193Z"
      fill="#627EEA"
    />
  </svg>
);

export const USDCLogo: React.FC<SVGProps> = (props) => (
  <svg
    data-name="86977684-12db-4850-8f30-233a7c267d11"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 2000 2000"
    {...props}
  >
    <path
      d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z"
      fill="#2775ca"
      className="background"
    />
    <path
      d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z"
      fill="#fff"
      className="content"
    />
    <path
      d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z"
      fill="#fff"
      className="content"
    />
  </svg>
);

const YVUSDcLogoContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: relative;

  .background {
    fill: #1c202a;
  }

  .content {
    fill: #006ae3;
  }
`;

const SideYearnLogo = styled(YearnLogo)<{ width: number; height: number }>`
  position: absolute;
  bottom: 0px;
  right: calc(-${(props) => props.width}px * 0.2);
  border-radius: 100px;
  border: ${(props) => props.width * 0.03}px ${theme.border.style}
    ${colors.border};
`;

export const YVUSDcLogo: React.FC<
  SVGProps & { markerConfig?: { height: number; width: number } }
> = ({ markerConfig, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(ref);
  const yearnDimension = Math.min(width, height) * 0.35;

  return (
    <YVUSDcLogoContainer ref={ref}>
      <USDCLogo {...props} />
      <SideYearnLogo
        width={markerConfig ? markerConfig.height : yearnDimension}
        height={markerConfig ? markerConfig.width : yearnDimension}
      />
    </YVUSDcLogoContainer>
  );
};
