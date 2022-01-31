import React from "react";

type SVGProps = React.SVGAttributes<SVGElement>;

export interface SVGPropsWithColor extends SVGProps {
  color?: string;
}
