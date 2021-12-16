import React from "react";

type SVGProps = React.SVGAttributes<SVGElement>;

export interface SVGPropsWithColor extends SVGProps {
  color?: string;
}
export interface IconProps extends SVGPropsWithColor {
  containerStyle?: React.CSSProperties;
}

export const WhitelistIcon: React.FC<SVGPropsWithColor> = ({
    color,
    ...props
  }) => (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    > 
    <path 
      d="M36 24H38C38.5304 24 39.0391 24.2107 39.4142 24.5858C39.7893 24.9609 40 25.4696 40 26V40C40 40.5304 39.7893 41.0391 39.4142 41.4142C39.0391 41.7893 38.5304 42 38 42H26C25.4696 42 24.9609 41.7893 24.5858 41.4142C24.2107 41.0391 24 40.5304 24 40V26C24 25.4696 24.2107 24.9609 24.5858 24.5858C24.9609 24.2107 25.4696 24 26 24H28" 
      stroke={color || "white"}
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <path 
      d="M35 22H29C28.4477 22 28 22.4477 28 23V25C28 25.5523 28.4477 26 29 26H35C35.5523 26 36 25.5523 36 25V23C36 22.4477 35.5523 22 35 22Z" 
      stroke={color || "white"}
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    </svg>
  );