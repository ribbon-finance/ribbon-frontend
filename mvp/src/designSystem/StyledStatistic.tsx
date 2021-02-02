import { Statistic } from "antd";
import React, { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  suffix?: ReactNode;
  hideValue?: boolean;
};

const StyledStatistic: React.FC<Props> = ({
  title,
  value,
  hideValue = false,
  suffix,
}) => {
  return (
    <Statistic
      className={hideValue ? "ant-statistic-hide-value" : ""}
      valueStyle={{ fontSize: 15, fontWeight: "bold", paddingBottom: "15px" }}
      title={title}
      value={value}
      suffix={suffix}
    />
  );
};
export default StyledStatistic;
