import React from "react";
import DashboardCard from "./DashboardCard";

const Positions: React.FC<{ numPositions: number }> = ({ numPositions }) => {
  return (
    <a href="/portfolio">
      <DashboardCard
        value={numPositions.toString()}
        text={"Active Positions"}
        icon={"Equalizer"}
      ></DashboardCard>
    </a>
  );
};

export default Positions;
