import React from "react";
import DashboardCard from "./DashboardCard";

const Positions = () => {
  return (
    <a href="/portfolio">
      <DashboardCard
        value={"3"}
        text={"Active Positions"}
        icon={"Equalizer"}
      ></DashboardCard>
    </a>
  );
};

export default Positions;
