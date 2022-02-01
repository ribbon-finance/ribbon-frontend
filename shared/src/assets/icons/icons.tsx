import React from "react";
import styled from "styled-components";
import theme from "../../designSystem/theme";

type SVGProps = React.SVGAttributes<SVGElement>;

export interface SVGPropsWithColor extends SVGProps {
  color?: string;
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

export const GlobeIcon: React.FC<IconProps> = ({
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
        d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.66669 10H18.3334"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 1.66667C12.0844 3.94863 13.269 6.91003 13.3334 10C13.269 13.09 12.0844 16.0514 10 18.3333C7.91562 16.0514 6.73106 13.09 6.66669 10C6.73106 6.91003 7.91562 3.94863 10 1.66667V1.66667Z"
        stroke={color}
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

const StakeCircle = styled.div<{
  type: "solid" | "hollow";
  size: string;
  color: string;
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
          border: ${theme.border.width} ${theme.border.style} ${props.color}
        `;
    }
  }}
`;

export const UnstakeIcon: React.FC<{ color?: string; size?: string }> = ({
  color,
  size,
}) => (
  <StakeCircle size={size || "30%"} type="hollow" color={color || "white"} />
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
