import { SVGProps } from "./shared";

export const Samb: React.FC<SVGProps> = ({ ...props }) => (
  <svg
    width="500"
    height="500"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="56" height="56" rx="28" fill="#457EFF" fill-opacity="0.12" />
    <g clip-path="url(#clip0_802_54)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.2195 43.9332C16.0113 44.0601 15.7401 44.0012 15.6032 43.7994L15.0789 43.0264C14.942 42.8245 14.988 42.5512 15.18 42.4009C16.9069 41.0497 18.3264 39.5267 19.4427 37.8955C23.5993 31.8217 23.5993 24.1783 19.4427 18.1045C18.3264 16.4733 16.9069 14.9503 15.18 13.5991C14.988 13.4488 14.942 13.1755 15.0789 12.9737L15.6032 12.2006C15.7401 11.9988 16.0113 11.9399 16.2195 12.0669L39.509 26.264C40.8088 27.0564 40.8088 28.9436 39.509 29.736L16.2195 43.9332Z"
        fill="#457EFF"
      />
    </g>
    <defs>
      <clipPath id="clip0_802_54">
        <rect width="56" height="56" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
