import React from "react";

type SVGProps = React.SVGAttributes<SVGElement>;

export interface IconProps extends SVGProps {
  color?: string;
  containerStyle?: React.CSSProperties;
}

export const CloseIcon: React.FC<IconProps> = ({
  containerStyle = {},
  color = "white",
  onClick = () => {},
}) => (
  <span style={containerStyle}>
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.02424 5.93791L0 10.9622L0.913512 11.8757L5.93775 6.85143L11.0863 12L11.9998 11.0864L6.85126 5.93791L11.8757 0.913512L10.9622 0L5.93775 5.0244L1.03764 0.124294L0.124131 1.03781L5.02424 5.93791Z"
        fill={color}
      />
    </svg>
  </span>
);

export const SuccessIcon: React.FC<IconProps> = ({
  containerStyle = {},
  color = "white",
  onClick = () => {},
}) => (
  <span style={containerStyle}>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M16.6663 5L7.49967 14.1667L3.33301 10"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
);
