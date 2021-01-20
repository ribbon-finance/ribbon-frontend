import { Statistic } from "antd";
import React from "react";

type Props = {
  title: string;
  value: string;
};

const StyledStatistic: React.FC<Props> = ({ title, value }) => {
  return (
    <Statistic
      valueStyle={{ fontSize: 15, fontWeight: "bold", paddingBottom: "15px" }}
      title={title}
      value={value}
    />
  );
};
export default StyledStatistic;
