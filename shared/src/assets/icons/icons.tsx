import React from "react";
import styled from "styled-components";
import theme from "../../designSystem/theme";
import { getVaultColor } from "../../utils/vault";

type SVGProps = React.SVGAttributes<SVGElement>;

export interface SVGPropsWithColor extends SVGProps {
  color?: string;
  backgroundColor?: string;
}

export interface EarnRingProps extends SVGPropsWithColor {
  deposited?: boolean;
}
export interface IconProps extends SVGPropsWithColor {
  containerStyle?: React.CSSProperties;
}

export const CloseIcon: React.FC<IconProps> = ({
  containerStyle = { display: "flex" },
  color = "white",
  onClick = () => {},
  ...props
}) => (
  <span style={containerStyle}>
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...props}
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
  containerStyle = { display: "flex" },
  color = "white",
  onClick = () => {},
  ...props
}) => (
  <span style={containerStyle}>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...props}
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
  containerStyle = { display: "flex" },
  color = "#FFFFFF7A",
  onClick = () => {},
  ...props
}) => (
  <span style={containerStyle}>
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...props}
    >
      <g>
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

export const BarChartIcon: React.FC<IconProps> = ({
  containerStyle = { display: "flex" },
  color = "white",
  onClick = () => {},
  ...props
}) => (
  <span style={containerStyle}>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...props}
    >
      <path
        d="M6.66665 15H3.33331"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6666 10H3.33331"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6666 5L3.33331 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

export const GridIcon: React.FC<SVGProps> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.33333 2.5H2.5V8.33333H8.33333V2.5Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 2.5H11.6667V8.33333H17.5V2.5Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 11.6667H11.6667V17.5H17.5V11.6667Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.33333 11.6667H2.5V17.5H8.33333V11.6667Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GalleryIcon: React.FC<SVGProps> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask id="path-1-inside-1" fill="white">
      <rect x="6" y="2" width="8" height="16" rx="1" />
    </mask>
    <rect
      x="6"
      y="2"
      width="8"
      height="16"
      rx="1"
      stroke="white"
      strokeWidth="3"
      mask="url(#path-1-inside-1)"
    />
    <rect x="2.5" y="6.5" width="1" height="7" rx="0.5" stroke="white" />
    <rect x="16.5" y="6.5" width="1" height="7" rx="0.5" stroke="white" />
  </svg>
);

export const CheckIcon: React.FC<SVGPropsWithColor> = ({ color, ...props }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16.6667 5L7.50004 14.1667L3.33337 10"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SettingsIcon: React.FC<SVGProps> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
      stroke="white"
      strokeOpacity="0.64"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.1666 12.5C16.0557 12.7513 16.0226 13.0302 16.0716 13.3005C16.1206 13.5708 16.2495 13.8203 16.4416 14.0167L16.4916 14.0667C16.6465 14.2215 16.7695 14.4053 16.8533 14.6076C16.9372 14.8099 16.9804 15.0268 16.9804 15.2458C16.9804 15.4649 16.9372 15.6817 16.8533 15.8841C16.7695 16.0864 16.6465 16.2702 16.4916 16.425C16.3368 16.58 16.153 16.7029 15.9507 16.7868C15.7483 16.8706 15.5314 16.9138 15.3124 16.9138C15.0934 16.9138 14.8765 16.8706 14.6742 16.7868C14.4719 16.7029 14.288 16.58 14.1332 16.425L14.0833 16.375C13.8869 16.1829 13.6374 16.054 13.3671 16.005C13.0967 15.956 12.8179 15.9891 12.5666 16.1C12.3201 16.2056 12.1099 16.381 11.9618 16.6046C11.8138 16.8282 11.7343 17.0902 11.7333 17.3583V17.5C11.7333 17.942 11.5577 18.366 11.2451 18.6785C10.9325 18.9911 10.5086 19.1667 10.0666 19.1667C9.62456 19.1667 9.20063 18.9911 8.88807 18.6785C8.57551 18.366 8.39992 17.942 8.39992 17.5V17.425C8.39347 17.1492 8.30418 16.8817 8.14368 16.6573C7.98317 16.4328 7.75886 16.2619 7.49992 16.1667C7.24857 16.0557 6.96976 16.0226 6.69943 16.0717C6.4291 16.1207 6.17965 16.2496 5.98325 16.4417L5.93325 16.4917C5.77846 16.6466 5.59465 16.7696 5.39232 16.8534C5.18999 16.9373 4.97311 16.9805 4.75408 16.9805C4.53506 16.9805 4.31818 16.9373 4.11585 16.8534C3.91352 16.7696 3.72971 16.6466 3.57492 16.4917C3.41996 16.3369 3.29703 16.1531 3.21315 15.9507C3.12928 15.7484 3.08611 15.5315 3.08611 15.3125C3.08611 15.0935 3.12928 14.8766 3.21315 14.6743C3.29703 14.4719 3.41996 14.2881 3.57492 14.1333L3.62492 14.0833C3.81703 13.8869 3.94591 13.6375 3.99492 13.3672C4.04394 13.0968 4.01085 12.818 3.89992 12.5667C3.79428 12.3202 3.61888 12.11 3.39531 11.9619C3.17173 11.8139 2.90974 11.7344 2.64159 11.7333H2.49992C2.05789 11.7333 1.63397 11.5577 1.32141 11.2452C1.00885 10.9326 0.833252 10.5087 0.833252 10.0667C0.833252 9.62464 1.00885 9.20072 1.32141 8.88816C1.63397 8.5756 2.05789 8.4 2.49992 8.4H2.57492C2.85075 8.39355 3.11826 8.30427 3.34267 8.14376C3.56708 7.98325 3.73801 7.75895 3.83325 7.5C3.94418 7.24866 3.97727 6.96984 3.92826 6.69951C3.87924 6.42918 3.75037 6.17973 3.55825 5.98334L3.50825 5.93334C3.35329 5.77855 3.23036 5.59473 3.14649 5.3924C3.06261 5.19007 3.01944 4.97319 3.01944 4.75417C3.01944 4.53514 3.06261 4.31827 3.14649 4.11594C3.23036 3.9136 3.35329 3.72979 3.50825 3.575C3.66304 3.42004 3.84685 3.29711 4.04918 3.21324C4.25151 3.12936 4.46839 3.08619 4.68742 3.08619C4.90644 3.08619 5.12332 3.12936 5.32565 3.21324C5.52798 3.29711 5.7118 3.42004 5.86658 3.575L5.91658 3.625C6.11298 3.81712 6.36243 3.94599 6.63276 3.99501C6.90309 4.04402 7.1819 4.01093 7.43325 3.9H7.49992C7.74639 3.79437 7.9566 3.61897 8.10466 3.39539C8.25272 3.17181 8.33218 2.90982 8.33325 2.64167V2.5C8.33325 2.05797 8.50885 1.63405 8.82141 1.32149C9.13397 1.00893 9.55789 0.833336 9.99992 0.833336C10.4419 0.833336 10.8659 1.00893 11.1784 1.32149C11.491 1.63405 11.6666 2.05797 11.6666 2.5V2.575C11.6677 2.84316 11.7471 3.10515 11.8952 3.32872C12.0432 3.5523 12.2534 3.7277 12.4999 3.83334C12.7513 3.94426 13.0301 3.97736 13.3004 3.92834C13.5707 3.87932 13.8202 3.75045 14.0166 3.55834L14.0666 3.50834C14.2214 3.35337 14.4052 3.23044 14.6075 3.14657C14.8098 3.0627 15.0267 3.01952 15.2458 3.01952C15.4648 3.01952 15.6817 3.0627 15.884 3.14657C16.0863 3.23044 16.2701 3.35337 16.4249 3.50834C16.5799 3.66312 16.7028 3.84694 16.7867 4.04927C16.8706 4.2516 16.9137 4.46848 16.9137 4.6875C16.9137 4.90653 16.8706 5.12341 16.7867 5.32574C16.7028 5.52807 16.5799 5.71188 16.4249 5.86667L16.3749 5.91667C16.1828 6.11307 16.0539 6.36252 16.0049 6.63284C15.9559 6.90317 15.989 7.18199 16.0999 7.43334V7.5C16.2056 7.74648 16.381 7.95668 16.6045 8.10475C16.8281 8.25281 17.0901 8.33227 17.3583 8.33334H17.4999C17.9419 8.33334 18.3659 8.50893 18.6784 8.82149C18.991 9.13405 19.1666 9.55797 19.1666 10C19.1666 10.442 18.991 10.866 18.6784 11.1785C18.3659 11.4911 17.9419 11.6667 17.4999 11.6667H17.4249C17.1568 11.6677 16.8948 11.7472 16.6712 11.8953C16.4476 12.0433 16.2722 12.2535 16.1666 12.5V12.5Z"
      stroke="white"
      strokeOpacity="0.64"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DepositIcon: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16 6.66672V25.3334"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.3337 16L16.0003 25.3333L6.66699 16"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DepositGlowIcon: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    width="176"
    height="164"
    viewBox="0 0 176 164"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_1767_6244)">
      <rect
        x="54"
        y="40"
        width="64"
        height="64"
        rx="32"
        fill="#3E73C4"
        fillOpacity="0.12"
        shapeRendering="crispEdges"
      />
      <path
        d="M86 62.6667V81.3334"
        stroke={color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M95.3337 72L86.0003 81.3333L76.667 72"
        stroke={color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="55"
        y="41"
        width="62"
        height="62"
        rx="31"
        stroke={color || "white"}
        strokeWidth="2"
        shapeRendering="crispEdges"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_1767_6244"
        x="0"
        y="-12"
        width="176"
        height="176"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="16"
          operator="dilate"
          in="SourceAlpha"
          result="effect1_dropShadow_1767_6244"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="20" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.243137 0 0 0 0 0.45098 0 0 0 0 0.768627 0 0 0 0.16 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1767_6244"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1767_6244"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const WithdrawIcon: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16 25.3335L16 6.66683"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.66634 16L15.9997 6.66667L25.333 16"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MigrateIcon: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    viewBox="0 0 22 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11 20.3333L11 1.66658"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.66634 11L10.9997 1.66667L20.333 11"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="1" y="25" width="20" height="2" rx="1" fill={color || "white"} />
  </svg>
);

export const WithdrawGlowIcon: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    width="176"
    height="164"
    viewBox="0 0 176 164"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_1983_6790)">
      <rect
        x="54"
        y="40"
        width="64"
        height="64"
        rx="32"
        fill={color || "white"}
        fillOpacity="0.12"
        shapeRendering="crispEdges"
      />
      <path
        d="M86 81.3333V62.6666"
        stroke={color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M76.6663 72L85.9997 62.6667L95.333 72"
        stroke={color || "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="55"
        y="41"
        width="62"
        height="62"
        rx="31"
        stroke={color || "white"}
        strokeWidth="2"
        shapeRendering="crispEdges"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_1983_6790"
        x="0"
        y="-12"
        width="176"
        height="176"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="16"
          operator="dilate"
          in="SourceAlpha"
          result="effect1_dropShadow_1983_6790"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="20" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.243137 0 0 0 0 0.45098 0 0 0 0 0.768627 0 0 0 0.16 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1983_6790"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1983_6790"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const TransferIcon: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18.3334 1.66663L9.16675 10.8333"
      stroke={color || "white"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.3334 1.66663L12.5001 18.3333L9.16675 10.8333L1.66675 7.49996L18.3334 1.66663Z"
      stroke={color || "white"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PauseIcon: React.FC<SVGPropsWithColor> = ({ color, ...props }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M28 38V26"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M36 38V26"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const WidgetPauseIcon: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.3335 21V13"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.6665 21V13"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// todo: add resume svg
export const ResumeIcon: React.FC<SVGPropsWithColor> = ({
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
      d="M26.166 24.5L37.8327 32L26.166 39.5V24.5Z"
      fill={color || "white"}
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlayIcon: React.FC<SVGPropsWithColor> = ({ color, ...props }) => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13 7.32666C13 4.162 16.501 2.25063 19.163 3.96195L54.4327 26.6353C56.882 28.2098 56.882 31.7902 54.4327 33.3647L19.163 56.0381C16.501 57.7494 13 55.838 13 52.6733V7.32666Z"
      fill={color || "#FC0A54"}
    />
  </svg>
);

export const BellIcon: React.FC<SVGPropsWithColor> = ({ color, ...props }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 5.33325C12 4.27239 11.5786 3.25497 10.8284 2.50482C10.0783 1.75468 9.06087 1.33325 8 1.33325C6.93913 1.33325 5.92172 1.75468 5.17157 2.50482C4.42143 3.25497 4 4.27239 4 5.33325C4 9.99992 2 11.3333 2 11.3333H14C14 11.3333 12 9.99992 12 5.33325Z"
      stroke={color || "white"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.15335 14C9.03614 14.2021 8.86791 14.3698 8.6655 14.4864C8.46309 14.6029 8.2336 14.6643 8.00001 14.6643C7.76643 14.6643 7.53694 14.6029 7.33453 14.4864C7.13212 14.3698 6.96389 14.2021 6.84668 14"
      stroke={color || "white"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EarnInnerRing: React.FC<EarnRingProps> = ({ color, ...props }) => (
  <svg
    width="640"
    height="640"
    viewBox="0 0 640 640"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      opacity="0.24"
      cx="320"
      cy="320"
      r="319.5"
      stroke={color}
      strokeDasharray="4 4"
    />
  </svg>
);

export const EarnMiddleRing: React.FC<EarnRingProps> = ({
  color,
  ...props
}) => (
  <svg
    width="800"
    height="800"
    viewBox="0 0 800 800"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      opacity="0.24"
      cx="400"
      cy="400"
      r="399.5"
      stroke={color}
      strokeDasharray="4 4"
    />
  </svg>
);

export const EarnOuterRing: React.FC<EarnRingProps> = ({
  type,
  color,
  ...props
}) => (
  <svg
    width="1056"
    height="1056"
    viewBox="0 0 1056 1056"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter={`url(#filter0_d_623_1436_${type})`}>
      <circle
        cx="527"
        cy="527"
        r="478"
        stroke={color}
        strokeWidth="4"
        strokeDasharray="2 2"
        shapeRendering="crispEdges"
      />
    </g>
    <defs>
      <filter
        id={`filter0_d_623_1436_${type}`}
        x="0"
        y="0"
        width="1056"
        height="1056"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="8"
          operator="dilate"
          in="SourceAlpha"
          result="effect1_dropShadow_623_1436"
        />
        <feOffset dx="1" dy="2" />
        <feGaussianBlur stdDeviation="20" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values={
            type === getVaultColor("rEARN")
              ? "0 0 0 0 0.243137 0 0 0 0 0.45098 0 0 0 0 0.768627 0 0 0 0.25 0"
              : type === getVaultColor("rEARN-stETH")
              ? "0 0 0 0 0 0 0 0 0 0.639216 0 0 0 0 1 0 0 0 0.25 0"
              : "0 0 0 0 0.0862745 0 0 0 0 0.807843 0 0 0 0 0.72549 0 0 0 0.25 0"
          }
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_623_1436"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_623_1436"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const EarnCardMiddleCircle: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    width="160"
    height="160"
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      opacity="0.24"
      cx="80"
      cy="80"
      r="79.5"
      stroke={color}
      strokeDasharray="4 4"
    />
  </svg>
);

export const EarnCardOuterCircle: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    width="290"
    height="304"
    viewBox="0 0 290 304"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_1082_3282)">
      <circle
        cx="145"
        cy="150"
        r="118"
        stroke={color}
        strokeWidth="4"
        strokeDasharray="2 2"
        shapeRendering="crispEdges"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_1082_3282"
        x="-6"
        y="0"
        width="304"
        height="304"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="8"
          operator="dilate"
          in="SourceAlpha"
          result="effect1_dropShadow_1082_3282"
        />
        <feOffset dx="1" dy="2" />
        <feGaussianBlur stdDeviation="12" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.243137 0 0 0 0 0.45098 0 0 0 0 0.768627 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1082_3282"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1082_3282"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const OpenLoanIcon: React.FC<SVGPropsWithColor> = (props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="20" fill="#3E73C4" fillOpacity="0.12" />
    <path
      d="M20 27V13"
      stroke="#3E73C4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.9996 20L19.9996 13L26.9996 20"
      stroke="#3E73C4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CloseLoanIcon: React.FC<SVGPropsWithColor> = (props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="20" fill="#3E73C4" fillOpacity="0.08" />
    <path
      d="M20 10.8333V29.1667"
      stroke="#3E73C4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24.1667 14.1667H17.9167C17.1431 14.1667 16.4013 14.474 15.8543 15.021C15.3073 15.5679 15 16.3098 15 17.0834C15 17.8569 15.3073 18.5988 15.8543 19.1457C16.4013 19.6927 17.1431 20 17.9167 20H22.0833C22.8569 20 23.5987 20.3073 24.1457 20.8543C24.6927 21.4013 25 22.1431 25 22.9167C25 23.6902 24.6927 24.4321 24.1457 24.9791C23.5987 25.5261 22.8569 25.8334 22.0833 25.8334H15"
      stroke="#3E73C4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const OptionsBoughtIcon: React.FC<SVGPropsWithColor> = (props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="20" fill="#3E73C4" fillOpacity="0.08" />
    <circle cx="20" cy="20" r="11" stroke="#3E73C4" strokeWidth="2" />
  </svg>
);

export const OptionsRepaidIcon: React.FC<SVGPropsWithColor> = (props) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="20" fill="#16CEB9" fillOpacity="0.08" />
    <path
      d="M20 10.8333V29.1667"
      stroke="#16CEB9"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24.1667 14.1667H17.9167C17.1431 14.1667 16.4013 14.4739 15.8543 15.0209C15.3073 15.5679 15 16.3098 15 17.0833C15 17.8569 15.3073 18.5987 15.8543 19.1457C16.4013 19.6927 17.1431 20 17.9167 20H22.0833C22.8569 20 23.5987 20.3073 24.1457 20.8543C24.6927 21.4012 25 22.1431 25 22.9167C25 23.6902 24.6927 24.4321 24.1457 24.9791C23.5987 25.526 22.8569 25.8333 22.0833 25.8333H15"
      stroke="#16CEB9"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Grid: React.FC<SVGPropsWithColor> = (props) => (
  <svg
    width="290"
    height={props.height}
    viewBox={"0 0 290 " + props.height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M-0.5 516V0H0.5V23.5H23.5V0H24.5V23.5H47.5V0H48.5V23.5H71.5V0H72.5V23.5H95.5V0H96.5V23.5H119.5V0H120.5V23.5H143.5V0H144.5V23.5H167.5V0H168.5V23.5H191.5V0H192.5V23.5H215.5V0H216.5V23.5H239.5V0H240.5V23.5H263.5V0H264.5V23.5H287.5V0H288.5V23.5H290V24.5H288.5V47.5H290V48.5H288.5V71.5H290V72.5H288.5V95.5H290V96.5H288.5V119.5H290V120.5H288.5V143.5H290V144.5H288.5V167.5H290V168.5H288.5V191.5H290V192.5H288.5V215.5H290V216.5H288.5V239.5H290V240.5H288.5V263.5H290V264.5H288.5V287.5H290V288.5H288.5V311.5H290V312.5H288.5V335.5H290V336.5H288.5V359.5H290V360.5H288.5V383.5H290V384.5H288.5V407.5H290V408.5H288.5V431.5H290V432.5H288.5V455.5H290V456.5H288.5V479.5H290V480.5H288.5V503.5H290V504.5H288.5V516H287.5V504.5H264.5V516H263.5V504.5H240.5V516H239.5V504.5H216.5V516H215.5V504.5H192.5V516H191.5V504.5H168.5V516H167.5V504.5H144.5V516H143.5V504.5H120.5V516H119.5V504.5H96.5V516H95.5V504.5H72.5V516H71.5V504.5H48.5V516H47.5V504.5H24.5V516H23.5V504.5H0.5V516H-0.5ZM287.5 503.5V480.5H264.5V503.5H287.5ZM287.5 479.5V456.5H264.5V479.5H287.5ZM287.5 455.5V432.5H264.5V455.5H287.5ZM287.5 431.5V408.5H264.5V431.5H287.5ZM287.5 407.5V384.5H264.5V407.5H287.5ZM287.5 383.5V360.5H264.5V383.5H287.5ZM287.5 359.5V336.5H264.5V359.5H287.5ZM287.5 335.5V312.5H264.5V335.5H287.5ZM287.5 311.5V288.5H264.5V311.5H287.5ZM287.5 287.5V264.5H264.5V287.5H287.5ZM287.5 263.5V240.5H264.5V263.5H287.5ZM287.5 239.5V216.5H264.5V239.5H287.5ZM287.5 215.5V192.5H264.5V215.5H287.5ZM287.5 191.5V168.5H264.5V191.5H287.5ZM287.5 167.5V144.5H264.5V167.5H287.5ZM287.5 143.5V120.5H264.5V143.5H287.5ZM287.5 119.5V96.5H264.5V119.5H287.5ZM287.5 95.5V72.5H264.5V95.5H287.5ZM287.5 71.5V48.5H264.5V71.5H287.5ZM287.5 47.5V24.5H264.5V47.5H287.5ZM240.5 24.5H263.5V47.5H240.5V24.5ZM240.5 48.5H263.5V71.5H240.5V48.5ZM240.5 72.5H263.5V95.5H240.5V72.5ZM240.5 96.5H263.5V119.5H240.5V96.5ZM240.5 120.5H263.5V143.5H240.5V120.5ZM240.5 144.5H263.5V167.5H240.5V144.5ZM240.5 168.5H263.5V191.5H240.5V168.5ZM240.5 192.5H263.5V215.5H240.5V192.5ZM240.5 216.5H263.5V239.5H240.5V216.5ZM240.5 240.5H263.5V263.5H240.5V240.5ZM240.5 264.5H263.5V287.5H240.5V264.5ZM240.5 288.5H263.5V311.5H240.5V288.5ZM240.5 312.5H263.5V335.5H240.5V312.5ZM240.5 336.5H263.5V359.5H240.5V336.5ZM240.5 360.5H263.5V383.5H240.5V360.5ZM240.5 384.5H263.5V407.5H240.5V384.5ZM240.5 408.5H263.5V431.5H240.5V408.5ZM240.5 432.5H263.5V455.5H240.5V432.5ZM240.5 456.5H263.5V479.5H240.5V456.5ZM240.5 480.5H263.5V503.5H240.5V480.5ZM239.5 503.5V480.5H216.5V503.5H239.5ZM239.5 479.5V456.5H216.5V479.5H239.5ZM239.5 455.5V432.5H216.5V455.5H239.5ZM239.5 431.5V408.5H216.5V431.5H239.5ZM239.5 407.5V384.5H216.5V407.5H239.5ZM239.5 383.5V360.5H216.5V383.5H239.5ZM239.5 359.5V336.5H216.5V359.5H239.5ZM239.5 335.5V312.5H216.5V335.5H239.5ZM239.5 311.5V288.5H216.5V311.5H239.5ZM239.5 287.5V264.5H216.5V287.5H239.5ZM239.5 263.5V240.5H216.5V263.5H239.5ZM239.5 239.5V216.5H216.5V239.5H239.5ZM239.5 215.5V192.5H216.5V215.5H239.5ZM239.5 191.5V168.5H216.5V191.5H239.5ZM239.5 167.5V144.5H216.5V167.5H239.5ZM239.5 143.5V120.5H216.5V143.5H239.5ZM239.5 119.5V96.5H216.5V119.5H239.5ZM239.5 95.5V72.5H216.5V95.5H239.5ZM239.5 71.5V48.5H216.5V71.5H239.5ZM239.5 47.5V24.5H216.5V47.5H239.5ZM192.5 24.5H215.5V47.5H192.5V24.5ZM192.5 48.5H215.5V71.5H192.5V48.5ZM192.5 72.5H215.5V95.5H192.5V72.5ZM192.5 96.5H215.5V119.5H192.5V96.5ZM192.5 120.5H215.5V143.5H192.5V120.5ZM192.5 144.5H215.5V167.5H192.5V144.5ZM192.5 168.5H215.5V191.5H192.5V168.5ZM192.5 192.5H215.5V215.5H192.5V192.5ZM192.5 216.5H215.5V239.5H192.5V216.5ZM192.5 240.5H215.5V263.5H192.5V240.5ZM192.5 264.5H215.5V287.5H192.5V264.5ZM192.5 288.5H215.5V311.5H192.5V288.5ZM192.5 312.5H215.5V335.5H192.5V312.5ZM192.5 336.5H215.5V359.5H192.5V336.5ZM192.5 360.5H215.5V383.5H192.5V360.5ZM192.5 384.5H215.5V407.5H192.5V384.5ZM192.5 408.5H215.5V431.5H192.5V408.5ZM192.5 432.5H215.5V455.5H192.5V432.5ZM192.5 456.5H215.5V479.5H192.5V456.5ZM192.5 480.5H215.5V503.5H192.5V480.5ZM191.5 503.5V480.5H168.5V503.5H191.5ZM191.5 479.5V456.5H168.5V479.5H191.5ZM191.5 455.5V432.5H168.5V455.5H191.5ZM191.5 431.5V408.5H168.5V431.5H191.5ZM191.5 407.5V384.5H168.5V407.5H191.5ZM191.5 383.5V360.5H168.5V383.5H191.5ZM191.5 359.5V336.5H168.5V359.5H191.5ZM191.5 335.5V312.5H168.5V335.5H191.5ZM191.5 311.5V288.5H168.5V311.5H191.5ZM191.5 287.5V264.5H168.5V287.5H191.5ZM191.5 263.5V240.5H168.5V263.5H191.5ZM191.5 239.5V216.5H168.5V239.5H191.5ZM191.5 215.5V192.5H168.5V215.5H191.5ZM191.5 191.5V168.5H168.5V191.5H191.5ZM191.5 167.5V144.5H168.5V167.5H191.5ZM191.5 143.5V120.5H168.5V143.5H191.5ZM191.5 119.5V96.5H168.5V119.5H191.5ZM191.5 95.5V72.5H168.5V95.5H191.5ZM191.5 71.5V48.5H168.5V71.5H191.5ZM191.5 47.5V24.5H168.5V47.5H191.5ZM144.5 24.5H167.5V47.5H144.5V24.5ZM144.5 48.5H167.5V71.5H144.5V48.5ZM144.5 72.5H167.5V95.5H144.5V72.5ZM144.5 96.5H167.5V119.5H144.5V96.5ZM144.5 120.5H167.5V143.5H144.5V120.5ZM144.5 144.5H167.5V167.5H144.5V144.5ZM144.5 168.5H167.5V191.5H144.5V168.5ZM144.5 192.5H167.5V215.5H144.5V192.5ZM144.5 216.5H167.5V239.5H144.5V216.5ZM144.5 240.5H167.5V263.5H144.5V240.5ZM144.5 264.5H167.5V287.5H144.5V264.5ZM144.5 288.5H167.5V311.5H144.5V288.5ZM144.5 312.5H167.5V335.5H144.5V312.5ZM144.5 336.5H167.5V359.5H144.5V336.5ZM144.5 360.5H167.5V383.5H144.5V360.5ZM144.5 384.5H167.5V407.5H144.5V384.5ZM144.5 408.5H167.5V431.5H144.5V408.5ZM144.5 432.5H167.5V455.5H144.5V432.5ZM144.5 456.5H167.5V479.5H144.5V456.5ZM144.5 480.5H167.5V503.5H144.5V480.5ZM143.5 503.5V480.5H120.5V503.5H143.5ZM143.5 479.5V456.5H120.5V479.5H143.5ZM143.5 455.5V432.5H120.5V455.5H143.5ZM143.5 431.5V408.5H120.5V431.5H143.5ZM143.5 407.5V384.5H120.5V407.5H143.5ZM143.5 383.5V360.5H120.5V383.5H143.5ZM143.5 359.5V336.5H120.5V359.5H143.5ZM143.5 335.5V312.5H120.5V335.5H143.5ZM143.5 311.5V288.5H120.5V311.5H143.5ZM143.5 287.5V264.5H120.5V287.5H143.5ZM143.5 263.5V240.5H120.5V263.5H143.5ZM143.5 239.5V216.5H120.5V239.5H143.5ZM143.5 215.5V192.5H120.5V215.5H143.5ZM143.5 191.5V168.5H120.5V191.5H143.5ZM143.5 167.5V144.5H120.5V167.5H143.5ZM143.5 143.5V120.5H120.5V143.5H143.5ZM143.5 119.5V96.5H120.5V119.5H143.5ZM143.5 95.5V72.5H120.5V95.5H143.5ZM143.5 71.5V48.5H120.5V71.5H143.5ZM143.5 47.5V24.5H120.5V47.5H143.5ZM96.5 24.5H119.5V47.5H96.5V24.5ZM96.5 48.5H119.5V71.5H96.5V48.5ZM96.5 72.5H119.5V95.5H96.5V72.5ZM96.5 96.5H119.5V119.5H96.5V96.5ZM96.5 120.5H119.5V143.5H96.5V120.5ZM96.5 144.5H119.5V167.5H96.5V144.5ZM96.5 168.5H119.5V191.5H96.5V168.5ZM96.5 192.5H119.5V215.5H96.5V192.5ZM96.5 216.5H119.5V239.5H96.5V216.5ZM96.5 240.5H119.5V263.5H96.5V240.5ZM96.5 264.5H119.5V287.5H96.5V264.5ZM96.5 288.5H119.5V311.5H96.5V288.5ZM96.5 312.5H119.5V335.5H96.5V312.5ZM96.5 336.5H119.5V359.5H96.5V336.5ZM96.5 360.5H119.5V383.5H96.5V360.5ZM96.5 384.5H119.5V407.5H96.5V384.5ZM96.5 408.5H119.5V431.5H96.5V408.5ZM96.5 432.5H119.5V455.5H96.5V432.5ZM96.5 456.5H119.5V479.5H96.5V456.5ZM96.5 480.5H119.5V503.5H96.5V480.5ZM95.5 503.5V480.5H72.5V503.5H95.5ZM95.5 479.5V456.5H72.5V479.5H95.5ZM95.5 455.5V432.5H72.5V455.5H95.5ZM95.5 431.5V408.5H72.5V431.5H95.5ZM95.5 407.5V384.5H72.5V407.5H95.5ZM95.5 383.5V360.5H72.5V383.5H95.5ZM95.5 359.5V336.5H72.5V359.5H95.5ZM95.5 335.5V312.5H72.5V335.5H95.5ZM95.5 311.5V288.5H72.5V311.5H95.5ZM95.5 287.5V264.5H72.5V287.5H95.5ZM95.5 263.5V240.5H72.5V263.5H95.5ZM95.5 239.5V216.5H72.5V239.5H95.5ZM95.5 215.5V192.5H72.5V215.5H95.5ZM95.5 191.5V168.5H72.5V191.5H95.5ZM95.5 167.5V144.5H72.5V167.5H95.5ZM95.5 143.5V120.5H72.5V143.5H95.5ZM95.5 119.5V96.5H72.5V119.5H95.5ZM95.5 95.5V72.5H72.5V95.5H95.5ZM95.5 71.5V48.5H72.5V71.5H95.5ZM95.5 47.5V24.5H72.5V47.5H95.5ZM48.5 24.5H71.5V47.5H48.5V24.5ZM48.5 48.5H71.5V71.5H48.5V48.5ZM48.5 72.5H71.5V95.5H48.5V72.5ZM48.5 96.5H71.5V119.5H48.5V96.5ZM48.5 120.5H71.5V143.5H48.5V120.5ZM48.5 144.5H71.5V167.5H48.5V144.5ZM48.5 168.5H71.5V191.5H48.5V168.5ZM48.5 192.5H71.5V215.5H48.5V192.5ZM48.5 216.5H71.5V239.5H48.5V216.5ZM48.5 240.5H71.5V263.5H48.5V240.5ZM48.5 264.5H71.5V287.5H48.5V264.5ZM48.5 288.5H71.5V311.5H48.5V288.5ZM48.5 312.5H71.5V335.5H48.5V312.5ZM48.5 336.5H71.5V359.5H48.5V336.5ZM48.5 360.5H71.5V383.5H48.5V360.5ZM48.5 384.5H71.5V407.5H48.5V384.5ZM48.5 408.5H71.5V431.5H48.5V408.5ZM48.5 432.5H71.5V455.5H48.5V432.5ZM48.5 456.5H71.5V479.5H48.5V456.5ZM48.5 480.5H71.5V503.5H48.5V480.5ZM47.5 503.5V480.5H24.5V503.5H47.5ZM47.5 479.5V456.5H24.5V479.5H47.5ZM47.5 455.5V432.5H24.5V455.5H47.5ZM47.5 431.5V408.5H24.5V431.5H47.5ZM47.5 407.5V384.5H24.5V407.5H47.5ZM47.5 383.5V360.5H24.5V383.5H47.5ZM47.5 359.5V336.5H24.5V359.5H47.5ZM47.5 335.5V312.5H24.5V335.5H47.5ZM47.5 311.5V288.5H24.5V311.5H47.5ZM47.5 287.5V264.5H24.5V287.5H47.5ZM47.5 263.5V240.5H24.5V263.5H47.5ZM47.5 239.5V216.5H24.5V239.5H47.5ZM47.5 215.5V192.5H24.5V215.5H47.5ZM47.5 191.5V168.5H24.5V191.5H47.5ZM47.5 167.5V144.5H24.5V167.5H47.5ZM47.5 143.5V120.5H24.5V143.5H47.5ZM47.5 119.5V96.5H24.5V119.5H47.5ZM47.5 95.5V72.5H24.5V95.5H47.5ZM47.5 71.5V48.5H24.5V71.5H47.5ZM47.5 47.5V24.5H24.5V47.5H47.5ZM0.5 47.5V24.5H23.5V47.5H0.5ZM0.5 71.5V48.5H23.5V71.5H0.5ZM0.5 95.5V72.5H23.5V95.5H0.5ZM0.5 119.5V96.5H23.5V119.5H0.5ZM0.5 143.5V120.5H23.5V143.5H0.5ZM0.5 167.5V144.5H23.5V167.5H0.5ZM0.5 191.5V168.5H23.5V191.5H0.5ZM0.5 215.5V192.5H23.5V215.5H0.5ZM0.5 239.5V216.5H23.5V239.5H0.5ZM0.5 263.5V240.5H23.5V263.5H0.5ZM0.5 287.5V264.5H23.5V287.5H0.5ZM0.5 311.5V288.5H23.5V311.5H0.5ZM0.5 335.5V312.5H23.5V335.5H0.5ZM0.5 359.5V336.5H23.5V359.5H0.5ZM0.5 383.5V360.5H23.5V383.5H0.5ZM0.5 407.5V384.5H23.5V407.5H0.5ZM0.5 431.5V408.5H23.5V431.5H0.5ZM0.5 455.5V432.5H23.5V455.5H0.5ZM0.5 479.5V456.5H23.5V479.5H0.5ZM0.5 503.5V480.5H23.5V503.5H0.5Z"
      fill="white"
      fillOpacity="0.02"
    />
  </svg>
);

const StakeCircle = styled.div<{
  type: "solid" | "hollow";
  size: string;
  color: string;
  border?: {
    width?: string;
    style?: string;
    color?: string;
  };
}>`
  display: flex;
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  align-items: center;
  justify-content: center;
  border-radius: 100px;

  ${(props) => {
    switch (props.type) {
      case "solid":
        return `
          background: ${props.color};
        `;
      case "hollow":
        return `
          border: ${props?.border?.width || theme.border.width} ${
          props?.border?.style || theme.border.style
        } ${props?.border?.color || props.color}
        `;
    }
  }}
`;

export const UnstakeIcon: React.FC<{ color?: string; size?: string }> = ({
  color,
  size,
}) => (
  <StakeCircle
    size={size || "30%"}
    type="hollow"
    color={color || "white"}
    border={{ width: "2px" }}
  />
);

export const StakeIcon: React.FC<{ color?: string; size?: string }> = ({
  color,
  size,
}) => (
  <StakeCircle size={size || "50%"} type="hollow" color={color || "#FFFFFF66"}>
    <StakeCircle
      size={`${(2 / 3) * 100}%`}
      type="solid"
      color={color || "white"}
    />
  </StakeCircle>
);

export const IncreaseStakeTimeIcon: React.FC<{
  color?: string;
  size?: string;
}> = ({ color, size }) => (
  <StakeCircle
    size={size || "70%"}
    type="hollow"
    color={`${color || "#FFFFFF"}3D`}
  >
    <StakeCircle
      size={size || `${(10 / 13) * 100}%`}
      type="hollow"
      color={color || "#FFFFFF"}
    >
      <StakeCircle
        size={size || `${(2 / 3) * 100}%`}
        type="solid"
        color={color || "#FFFFFF"}
      />
    </StakeCircle>
  </StakeCircle>
);

export const IncreaseStakeAmountIcon: React.FC<{
  color?: string;
  size?: string;
}> = ({ color, size }) => (
  <StakeCircle size={size || "50%"} type="hollow" color={color || "#FFFFFF"}>
    <StakeCircle
      size={size || `${(7 / 9) * 100}%`}
      type="solid"
      color={`${color || "#FFFFFF"}A3`}
    >
      <StakeCircle
        size={size || `${(4 / 7) * 100}%`}
        type="solid"
        color={color || "#FFFFFF"}
      />
    </StakeCircle>
  </StakeCircle>
);

export const DelegateIcon: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      opacity="0.24"
      x="0.5"
      y="8.5"
      width="11"
      height="11"
      rx="2.5"
      stroke={color || "white"}
    />
    <rect
      opacity="0.56"
      x="4.5"
      y="4.5"
      width="11"
      height="11"
      rx="2.5"
      stroke={color || "white"}
    />
    <rect
      x="8.5"
      y="0.5"
      width="11"
      height="11"
      rx="2.5"
      stroke={color || "white"}
    />
  </svg>
);

export const VotingPowerIcon: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    width="96"
    height="100"
    viewBox="0 0 96 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g opacity="0.08" filter="url(#filter0_d_747_7680)">
      <rect
        x="14"
        y="92"
        width="6.5"
        height="64"
        transform="rotate(-90 14 92)"
        fill={color || "#FC0A54"}
      />
    </g>
    <g opacity="0.16" filter="url(#filter1_d_747_7680)">
      <rect
        x="14"
        y="81.5"
        width="6.5"
        height="64"
        transform="rotate(-90 14 81.5)"
        fill={color || "#FC0A54"}
      />
    </g>
    <g opacity="0.32" filter="url(#filter2_d_747_7680)">
      <rect
        x="14"
        y="71"
        width="6.5"
        height="64"
        transform="rotate(-90 14 71)"
        fill={color || "#FC0A54"}
      />
    </g>
    <g opacity="0.48" filter="url(#filter3_d_747_7680)">
      <rect
        x="14"
        y="60.5"
        width="6.5"
        height="64"
        transform="rotate(-90 14 60.5)"
        fill={color || "#FC0A54"}
      />
    </g>
    <g opacity="0.56" filter="url(#filter4_d_747_7680)">
      <rect
        x="14"
        y="50"
        width="6.5"
        height="64"
        transform="rotate(-90 14 50)"
        fill={color || "#FC0A54"}
      />
    </g>
    <g opacity="0.72" filter="url(#filter5_d_747_7680)">
      <rect
        x="14"
        y="39.5"
        width="6.5"
        height="64"
        transform="rotate(-90 14 39.5)"
        fill={color || "#FC0A54"}
      />
    </g>
    <g opacity="0.88" filter="url(#filter6_d_747_7680)">
      <rect
        x="14"
        y="29"
        width="6.5"
        height="64"
        transform="rotate(-90 14 29)"
        fill={color || "#FC0A54"}
      />
    </g>
    <g filter="url(#filter7_d_747_7680)">
      <rect
        x="14"
        y="18.5"
        width="6.5"
        height="64"
        transform="rotate(-90 14 18.5)"
        fill={color || "#FC0A54"}
      />
    </g>
    <defs>
      <filter
        id="filter0_d_747_7680"
        x="0"
        y="73.5"
        width="96"
        height="38.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="8" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.988235 0 0 0 0 0.0392157 0 0 0 0 0.329412 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_747_7680"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_747_7680"
          result="shape"
        />
      </filter>
      <filter
        id="filter1_d_747_7680"
        x="0"
        y="63"
        width="96"
        height="38.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="8" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.988235 0 0 0 0 0.0392157 0 0 0 0 0.329412 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_747_7680"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_747_7680"
          result="shape"
        />
      </filter>
      <filter
        id="filter2_d_747_7680"
        x="0"
        y="52.5"
        width="96"
        height="38.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="8" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.988235 0 0 0 0 0.0392157 0 0 0 0 0.329412 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_747_7680"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_747_7680"
          result="shape"
        />
      </filter>
      <filter
        id="filter3_d_747_7680"
        x="0"
        y="42"
        width="96"
        height="38.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="8" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.988235 0 0 0 0 0.0392157 0 0 0 0 0.329412 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_747_7680"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_747_7680"
          result="shape"
        />
      </filter>
      <filter
        id="filter4_d_747_7680"
        x="0"
        y="31.5"
        width="96"
        height="38.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="8" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.988235 0 0 0 0 0.0392157 0 0 0 0 0.329412 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_747_7680"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_747_7680"
          result="shape"
        />
      </filter>
      <filter
        id="filter5_d_747_7680"
        x="0"
        y="21"
        width="96"
        height="38.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="8" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.988235 0 0 0 0 0.0392157 0 0 0 0 0.329412 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_747_7680"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_747_7680"
          result="shape"
        />
      </filter>
      <filter
        id="filter6_d_747_7680"
        x="0"
        y="10.5"
        width="96"
        height="38.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="8" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.988235 0 0 0 0 0.0392157 0 0 0 0 0.329412 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_747_7680"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_747_7680"
          result="shape"
        />
      </filter>
      <filter
        id="filter7_d_747_7680"
        x="0"
        y="0"
        width="96"
        height="38.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="8" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.988235 0 0 0 0 0.0392157 0 0 0 0 0.329412 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_747_7680"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_747_7680"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const CalendarIcon: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.6667 2.66666H3.33333C2.59695 2.66666 2 3.26361 2 3.99999V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V3.99999C14 3.26361 13.403 2.66666 12.6667 2.66666Z"
      stroke={color || "white"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6665 1.33334V4.00001"
      stroke={color || "white"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.3335 1.33334V4.00001"
      stroke={color || "white"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 6.66666H14"
      stroke={color || "white"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M35 22H29C28.4477 22 28 22.4477 28 23V25C28 25.5523 28.4477 26 29 26H35C35.5523 26 36 25.5523 36 25V23C36 22.4477 35.5523 22 35 22Z"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BackIcon: React.FC<SVGPropsWithColor> = ({ color, ...props }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 12H5"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 19L5 12L12 5"
      stroke={color || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ThinBackIcon: React.FC<SVGPropsWithColor> = ({
  color,
  ...props
}) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M27 20H13"
      stroke={color || "white"}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 27.0003L13 20.0003L20 13.0003"
      stroke={color || "white"}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const VeRBNIcon: React.FC<SVGPropsWithColor> = () => (
  <svg
    width="114"
    height="114"
    viewBox="0 0 114 114"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="23"
      y="21"
      width="64"
      height="64"
      rx="32"
      fill="#FC0A54"
      fillOpacity="0.16"
    />
    <path
      d="M54.9201 40.52L27.4001 69.24C27.4001 69.24 27.0374 68.5976 26.6952 67.96C26.5409 67.6726 26.3909 67.3862 26.2801 67.16C26.1266 66.8468 26.0849 66.8182 25.9601 66.52C25.8307 66.28 25.6401 65.8 25.6401 65.8L25.5601 65.56L54.9201 34.84L73.4801 54.04L54.7601 74.12L51.8801 71.4L67.9601 54.04L54.9201 40.52Z"
      fill="#FC0A54"
    />
    <g opacity="0.24" filter="url(#filter0_d_1293_32)">
      <rect
        x="19"
        y="17"
        width="72"
        height="72"
        rx="36"
        stroke="#FC0A54"
        strokeWidth="2"
      />
    </g>
    <g opacity="0.12" filter="url(#filter1_d_1293_32)">
      <rect
        x="15"
        y="13"
        width="80"
        height="80"
        rx="40"
        stroke="#FC0A54"
        strokeWidth="2"
      />
    </g>
    <g filter="url(#filter2_d_1293_32)">
      <rect
        x="23"
        y="21"
        width="64"
        height="64"
        rx="32"
        stroke="#FC0A54"
        strokeWidth="2"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_1293_32"
        x="4"
        y="4"
        width="106"
        height="106"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="8" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.988235 0 0 0 0 0.0392157 0 0 0 0 0.329412 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1293_32"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1293_32"
          result="shape"
        />
      </filter>
      <filter
        id="filter1_d_1293_32"
        x="0"
        y="0"
        width="114"
        height="114"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="8" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.988235 0 0 0 0 0.0392157 0 0 0 0 0.329412 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1293_32"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1293_32"
          result="shape"
        />
      </filter>
      <filter
        id="filter2_d_1293_32"
        x="8"
        y="8"
        width="98"
        height="98"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="4" />
        <feGaussianBlur stdDeviation="8" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.988235 0 0 0 0 0.0392157 0 0 0 0 0.329412 0 0 0 0.64 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1293_32"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1293_32"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const BoostIcon: React.FC<SVGPropsWithColor> = ({
  color,
  backgroundColor,
  ...props
}) => (
  <svg
    width="400"
    height="400"
    viewBox="0 0 400 400"
    fill={backgroundColor}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="400" height="400" rx="200" fill={backgroundColor} />
    <path
      d="M199.5 122L28 302C28 302 24.1853 295.687 22 291.5C19.8985 287.474 17 281 17 281L199.5 86.5L315.5 206.5L198.5 332L180.5 315L281 206.5L199.5 122Z"
      fill={color}
    />
  </svg>
);

export const BuyIcon: React.FC<SVGPropsWithColor> = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 1024 1024"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M512.147 692C412.697 692 332.146 611.45 332.146 512C332.146 412.55 412.697 332 512.147 332C601.247 332 675.197 396.95 689.447 482H870.797C855.497 297.2 700.846 152 512.147 152C313.396 152 152.146 313.25 152.146 512C152.146 710.75 313.396 872 512.147 872C700.846 872 855.497 726.8 870.797 542H689.297C675.047 627.05 601.247 692 512.147 692Z"
      fill="white"
    />
  </svg>
);
