import React from "react";

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
    viewBox="0 0 256 417"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    {...props}
  >
    <g>
      <polygon
        fill="#343434"
        points="127.9611 0 125.1661 9.5 125.1661 285.168 127.9611 287.958 255.9231 212.32"
      />
      <polygon
        fill="#8C8C8C"
        points="127.962 0 0 212.32 127.962 287.959 127.962 154.158"
      />
      <polygon
        fill="#3C3C3B"
        points="127.9611 312.1866 126.3861 314.1066 126.3861 412.3056 127.9611 416.9066 255.9991 236.5866"
      />
      <polygon
        fill="#8C8C8C"
        points="127.962 416.9052 127.962 312.1852 0 236.5852"
      />
      <polygon
        fill="#141414"
        points="127.9611 287.9577 255.9211 212.3207 127.9611 154.1587"
      />
      <polygon
        fill="#393939"
        points="0.0009 212.3208 127.9609 287.9578 127.9609 154.1588"
      />
    </g>
  </svg>
);

export default WETHLogo;
