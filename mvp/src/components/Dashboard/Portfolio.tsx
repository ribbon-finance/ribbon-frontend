import React from "react";
import DashboardCard from "./DashboardCard";

type Props = {
  portfolioValue: number;
};

const Portfolio: React.FC<Props> = ({ portfolioValue }) => {
  return (
    <DashboardCard
      value={`$${portfolioValue.toFixed(2)}`}
      text={"Portfolio Value"}
      icon={"TrendingUp"}
    ></DashboardCard>
  );
};

export default Portfolio;
