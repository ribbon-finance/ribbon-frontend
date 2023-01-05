import React from "react";

type SVGProps = React.SVGAttributes<SVGElement>;

export const YearnLogo: React.FC<SVGProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" {...props}>
    <title>yearn-finance-yfi</title>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path
          id="SVGID"
          className="background"
          d="M500,0c276.1,0,500,223.9,500,500s-223.9,500-500,500S0,776.1,0,500,223.9,0,500,0Z"
          fill="#006ae3"
          fillRule="evenodd"
        />
        <polygon
          id="SVGID-2"
          className="content"
          data-name="SVGID"
          points="479.4 710.8 479.4 294.8 524.7 294.8 524.7 710.8 479.4 710.8"
          fill="#fff"
        />
        <path
          id="SVGID-3"
          className="content"
          data-name="SVGID"
          d="M710,433.4,570.1,470.5,538.9,325.3l41.6-9.4,16.4,68.8s37.8-62-12.6-126.2c-29.7-33-43.8-34.4-77.1-39.6-29.3-4.2-97.4,5.7-117.7,85.2-8.6,51.2,1.1,89.1,67.1,138.7L452.9,498s-73.7-51.9-92.7-88.3c-14.7-28.8-39.9-85.7,5.6-164.9,24.5-39.6,72.8-77.6,157.9-73.6C566.5,173,671,225.3,654.8,347.5c-2.8,22.9-14.7,53.4-14.7,53.4l57.4-12.8L710,433.4Z"
          fill="#fff"
        />
        <path
          id="SVGID-4"
          className="content"
          data-name="SVGID"
          d="M630.1,758.9c-25.6,38.9-74.9,75.6-159.8,69.4-42.8-2.9-145.8-58-126.4-179.7,3.4-22.8,16.1-52.9,16.1-52.9l-57.7,11.2L291,561.4,431.9,528l27.4,146-41.9,8.3L402.8,613s-39.4,60.9,9.2,126.5c28.8,33.8,42.8,35.5,76.1,41.6,29.1,5,97.5-3.2,119.9-82.1,9.9-50.9,1.2-89.1-63.4-140.5l5.2-55.1s72.3,53.8,90.3,90.7c13.8,29.3,37.5,86.9-10,164.8Z"
          fill="#fff"
        />
      </g>
    </g>
  </svg>
);

export const ParadigmLogo: React.FC<SVGProps> = (props) => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M21.8875 52C31.7666 52 39.7751 44.0582 39.7751 34.2614C39.7751 24.4647 31.7666 16.5229 21.8875 16.5229C12.0085 16.5229 4 24.4647 4 34.2614C4 44.0582 12.0085 52 21.8875 52Z"
      fill={props.color}
    />
    <path
      d="M52 27.5754C52 40.2015 41.7332 50.4264 29.0584 50.4264C16.3837 50.4264 6.11687 40.2015 6.11687 27.5754C6.11687 14.9492 16.3837 4.72437 29.0584 4.72437C41.7332 4.72437 52 14.9492 52 27.5754Z"
      fill="url(#paint0_radial_801_59)"
      fill-opacity="0.5"
    />
    <path
      d="M51.9735 21.7386C51.9735 31.5503 43.8236 39.4771 33.7949 39.4771C23.7398 39.4771 15.6163 31.5245 15.6163 21.7386C15.6163 11.9268 23.7663 4 33.7949 4C43.8501 4 51.9735 11.9527 51.9735 21.7386Z"
      fill={props.color}
      fill-opacity="0.64"
    />
    <defs>
      <radialGradient
        id="paint0_radial_801_59"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(29.0545 27.5841) rotate(90) scale(22.8583 23.4253)"
      >
        <stop stop-color="#051323" />
        <stop offset="1" stop-color="#051323" stop-opacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

export const FlexLogo: React.FC<SVGProps> = (props) => (
  <svg
    width="27"
    height="24"
    viewBox="0 0 27 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M0 24V0H3.15328V8.05839H10.6861L0 24Z" fill="#14F195" />
    <path
      d="M26.2774 24H22.9489V16.1168H15.2409L26.2774 0V24Z"
      fill="#14F195"
    />
  </svg>
);
