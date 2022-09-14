import { SVGProps } from "react";

const ExternalLinkIcon: React.FC<SVGProps<any>> = (props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      stroke="white"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path
          d="M4.66669 11.3333L11.3334 4.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4.66669 4.66667H11.3334V11.3333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
};

export default ExternalLinkIcon;
