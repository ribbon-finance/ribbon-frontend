import React from "react";

type SVGProps = React.SVGAttributes<SVGElement & { color?: string }>;

const Logo: React.FC<SVGProps> = ({ color, ...props }) => (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0)">
      <circle cx="48" cy="48" r="48" fill={color || "#FF385C"} />
      <path
        d="M3 71.9068L47.8065 25L71.61 49.5036L47.5 75.5"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="square"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="96" height="96" rx="48" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default Logo;
