import React from "react";

type SVGProps = React.SVGAttributes<SVGElement>;

export const MoneyLogo: React.FC<SVGProps & { baseColor: string }> = ({
  baseColor,
  ...props
}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 0.833328V19.1667"
      stroke={baseColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.1667 4.16667H7.91667C7.14312 4.16667 6.40125 4.47396 5.85427 5.02094C5.30729 5.56793 5 6.30979 5 7.08334C5 7.85689 5.30729 8.59875 5.85427 9.14573C6.40125 9.69271 7.14312 10 7.91667 10H12.0833C12.8569 10 13.5987 10.3073 14.1457 10.8543C14.6927 11.4013 15 12.1431 15 12.9167C15 13.6902 14.6927 14.4321 14.1457 14.9791C13.5987 15.526 12.8569 15.8333 12.0833 15.8333H5"
      stroke={baseColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
