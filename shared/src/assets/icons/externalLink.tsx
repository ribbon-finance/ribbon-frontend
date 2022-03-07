import { SVGPropsWithColor } from "./icons";

const ExternalLink: React.FC<SVGPropsWithColor> = ({
  color = "#FFFFFF",
  ...props
}) => (
  <svg
    width="12px"
    height="12px"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
    {...props}
  >
    <g transform="translate(-144.000000, -507.000000)">
      <g transform="translate(144.000000, 507.000000)">
        <path d="M1.77777778,0 C0.8061664,0 0,0.8061664 0,1.77777778 L0,14.2222222 C0,15.1938338 0.8061664,16 1.77777778,16 L14.2222222,16 C15.1938338,16 16,15.1938338 16,14.2222222 L16,8 L14.2222222,8 L14.2222222,14.2222222 L1.77777778,14.2222222 L1.77777778,1.77777778 L8,1.77777778 L8,0 L1.77777778,0 Z M9.77777778,0 L9.77777778,1.77777778 L12.9652782,1.77777778 L4.70486116,10.0381947 L5.96180551,11.2951387 L14.2222222,3.03472222 L14.2222222,6.22222222 L16,6.22222222 L16,0 L9.77777778,0 Z"></path>
      </g>
    </g>
  </svg>
);

export default ExternalLink;
