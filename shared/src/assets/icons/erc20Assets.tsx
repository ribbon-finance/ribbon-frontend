import React, { useRef } from "react";
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

const SideYearnLogo = styled(YearnLogo)<{
  width: number;
  height: number;
  bottom?: string;
  right?: string;
  border?: string;
}>`
  position: absolute;
  bottom: ${(props) => (props.bottom ? props.bottom : "0px")};
  right: ${(props) =>
    props.right ? props.right : `calc(-${props.width}px * 0.2)`};
  border-radius: 100px;
  border: ${(props) =>
    props.border
      ? props.border
      : `${props.width * 0.03}px ${theme.border.style} ${colors.border}`};
`;

export const YVUSDcLogo: React.FC<
  SVGProps & {
    markerConfig?: {
      height?: number;
      width?: number;
      bottom?: string;
      right?: string;
      border?: string;
    };
  }
> = ({ markerConfig, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(ref);
  const yearnDimension = Math.min(width, height) * 0.35;

  return (
    <YVUSDcLogoContainer ref={ref}>
      <USDCLogo {...props} />
      <SideYearnLogo
        width={markerConfig?.height || yearnDimension}
        height={markerConfig?.width || yearnDimension}
        bottom={markerConfig?.bottom}
        right={markerConfig?.right}
        border={markerConfig?.border}
      />
    </YVUSDcLogoContainer>
  );
};

export const STETHLogo: React.FC<SVGProps> = (props) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.0533 18.3815L10.7973 18.7743C7.91001 23.2034 8.55481 29.0039 12.3475 32.7201C14.5788 34.9064 17.5032 35.9997 20.4276 36C20.4276 36 20.4276 36 11.0533 18.3815Z"
      fill="#00A3FF"
    />
    <path
      opacity="0.6"
      d="M20.4256 23.7363L11.0513 18.3815C20.4256 36 20.4256 36 20.4256 36C20.4256 32.1628 20.4256 27.7659 20.4256 23.7363Z"
      fill="#00A3FF"
    />
    <path
      opacity="0.6"
      d="M29.8119 18.3815L30.0679 18.7743C32.9552 23.2034 32.3104 29.0039 28.5176 32.7201C26.2864 34.9064 23.362 35.9997 20.4376 36C20.4376 36 20.4376 36 29.8119 18.3815Z"
      fill="#00A3FF"
    />
    <path
      opacity="0.2"
      d="M20.4366 23.7363L29.811 18.3815C20.4367 36 20.4366 36 20.4366 36C20.4366 32.1628 20.4366 27.7659 20.4366 23.7363Z"
      fill="#00A3FF"
    />
    <path
      opacity="0.2"
      d="M20.4401 11.7751V21.0104L28.515 16.3957L20.4401 11.7751Z"
      fill="#00A3FF"
    />
    <path
      opacity="0.6"
      d="M20.4376 11.7751L12.3568 16.3956L20.4376 21.0104V11.7751Z"
      fill="#00A3FF"
    />
    <path
      d="M20.4376 4.0067L12.3568 16.3971L20.4376 11.7636V4.0067Z"
      fill="#00A3FF"
    />
    <path
      opacity="0.6"
      d="M20.4401 11.7629L28.5212 16.3966L20.4401 4V11.7629Z"
      fill="#00A3FF"
    />
  </svg>
);

export const AAVELogo: React.FC<SVGProps & { showBackground?: boolean }> = ({
  showBackground = false,
  ...props
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {showBackground && (
      <path
        d="M16 32.125C24.8366 32.125 32 24.9616 32 16.125C32 7.28844 24.8366 0.125 16 0.125C7.16344 0.125 0 7.28844 0 16.125C0 24.9616 7.16344 32.125 16 32.125Z"
        fill="#2EBAC6"
        fill-opacity="0.08"
      />
    )}
    <path
      d="M23.0022 22.5003L17.5919 9.41985C17.2867 8.74356 16.8331 8.41367 16.2352 8.41367H15.7568C15.1589 8.41367 14.7053 8.74356 14.4001 9.41985L12.0455 15.1188H10.264C9.73209 15.1229 9.2991 15.5518 9.29498 16.0879V16.1003C9.2991 16.6322 9.73209 17.0652 10.264 17.0693H11.2207L8.97333 22.5003C8.93209 22.6199 8.90735 22.7436 8.90735 22.8714C8.90735 23.1766 9.00219 23.4157 9.17127 23.6013C9.34034 23.7869 9.58364 23.8776 9.88879 23.8776C10.0909 23.8735 10.2847 23.8116 10.4455 23.692C10.6187 23.5724 10.7383 23.3992 10.8331 23.2013L13.3073 17.0652H15.0228C15.5548 17.0611 15.9877 16.6322 15.9919 16.0961V16.0714C15.9877 15.5394 15.5548 15.1065 15.0228 15.1023H14.1073L15.996 10.3972L21.1424 23.1972C21.2372 23.3951 21.3568 23.5683 21.53 23.6879C21.6908 23.8075 21.8888 23.8693 22.0867 23.8735C22.3919 23.8735 22.631 23.7827 22.8042 23.5972C22.9774 23.4116 23.0682 23.1724 23.0682 22.8673C23.0723 22.7436 23.0517 22.6157 23.0022 22.5003Z"
      fill="#2EBAC6"
    />
  </svg>
);

export const WAVAXLogo: React.FC<SVGProps & { showBackground?: boolean }> = ({
  showBackground = false,
  ...props
}) => (
  <svg
    viewBox="0 0 208 208"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {showBackground && (
      <path
        d="M104 208C161.438 208 208 161.438 208 104C208 46.5624 161.438 0 104 0C46.5624 0 0 46.5624 0 104C0 161.438 46.5624 208 104 208Z"
        fill="#E84142"
        fill-opacity="0.12"
      />
    )}
    <path
      d="M140.686 106.702C144.289 100.479 150.103 100.479 153.706 106.702L176.144 146.091C179.747 152.315 176.799 157.392 169.593 157.392H124.39C117.265 157.392 114.317 152.315 117.838 146.091L140.686 106.702ZM97.284 30.8724C100.887 24.6488 106.619 24.6488 110.223 30.8724L115.218 39.8803L127.01 60.5984C129.876 66.4945 129.876 73.4551 127.01 79.3512L87.4572 147.893C83.8541 153.461 77.8761 156.983 71.2431 157.392H38.4053C31.199 157.392 28.2509 152.397 31.8541 146.091L97.284 30.8724Z"
      fill="#E84142"
    />
  </svg>
);
