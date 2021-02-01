import React from "react";
import { Link } from "react-router-dom";
import DashboardCard from "./DashboardCard";

const Positions: React.FC<{ numPositions: number }> = ({ numPositions }) => {
  return (
    <Link to="/portfolio">
      <DashboardCard
        value={numPositions.toString()}
        text={"Active Position" + (numPositions > 1 ? "s" : "")}
        icon={"Equalizer"}
      ></DashboardCard>
    </Link>
  );
};

export default Positions;
