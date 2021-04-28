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
        fillRule="evenodd"
        clipRule="evenodd"
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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

export const ExternalIcon: React.FC<IconProps> = ({
  containerStyle = {},
  color = "white",
  onClick = () => {},
}) => (
  <span style={containerStyle}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <g opacity="0.48">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.75 4.5C13.75 4.08579 14.0858 3.75 14.5 3.75H19.5C19.6017 3.75 19.6987 3.77024 19.7871 3.80691C19.8755 3.84351 19.9584 3.89776 20.0303 3.96967C20.1022 4.04158 20.1565 4.12445 20.1931 4.21291C20.2251 4.29009 20.2446 4.37376 20.249 4.46141C20.2497 4.47419 20.25 4.48706 20.25 4.5V9.5C20.25 9.91421 19.9142 10.25 19.5 10.25C19.0858 10.25 18.75 9.91421 18.75 9.5V6.31066L10.8637 14.197C10.5708 14.4899 10.0959 14.4899 9.803 14.197C9.51011 13.9041 9.51011 13.4292 9.803 13.1363L17.6893 5.25H14.5C14.0858 5.25 13.75 4.91421 13.75 4.5ZM6.16667 7.75C5.92355 7.75 5.69039 7.84658 5.51849 8.01849C5.34658 8.19039 5.25 8.42355 5.25 8.66667V17.8333C5.25 18.0764 5.34658 18.3096 5.51849 18.4815C5.69039 18.6534 5.92355 18.75 6.16667 18.75H15.3333C15.5764 18.75 15.8096 18.6534 15.9815 18.4815C16.1534 18.3096 16.25 18.0764 16.25 17.8333V12.8333C16.25 12.4191 16.5858 12.0833 17 12.0833C17.4142 12.0833 17.75 12.4191 17.75 12.8333V17.8333C17.75 18.4743 17.4954 19.089 17.0422 19.5422C16.589 19.9954 15.9743 20.25 15.3333 20.25H6.16667C5.52573 20.25 4.91104 19.9954 4.45783 19.5422C4.00461 19.089 3.75 18.4743 3.75 17.8333V8.66667C3.75 8.02573 4.00461 7.41104 4.45783 6.95783C4.91104 6.50461 5.52573 6.25 6.16667 6.25H11.1667C11.5809 6.25 11.9167 6.58579 11.9167 7C11.9167 7.41421 11.5809 7.75 11.1667 7.75H6.16667Z"
          fill={color}
        />
      </g>
    </svg>
  </span>
);
