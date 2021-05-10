import { ChartData, ChartOptions } from "chart.js";
import React, { useCallback, useMemo } from "react";
import { Line } from "react-chartjs-2";
import colors from "shared/lib/designSystem/colors";

const StrikeChart = () => {
  const options = useMemo((): ChartOptions => {
    return {
      maintainAspectRatio: false,
      title: { display: false },
      legend: { display: false },
      layout: { padding: { top: 20, bottom: 20 } },
      scales: {
        yAxes: [
          {
            display: false,
          },
        ],
        xAxes: [{ display: false }],
      },
      animation: { duration: 0 },
      hover: { animationDuration: 0, intersect: false },
      tooltips: {
        enabled: false,
        intersect: false,
        mode: "nearest",
      },
    };
  }, []);

  const getData = useCallback((canvas: any): ChartData => {
    const ctx = canvas.getContext("2d");
    let gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, `${colors.green}05`);
    gradient.addColorStop(1, `${colors.green}14`);

    return {
      labels: ["start", "end"],
      datasets: [
        {
          label: "current price",
          data: [0, 0],
          type: "line",
          pointRadius: 0,
          pointHoverRadius: 0,
          borderDash: undefined,
          borderWidth: 2,
          borderColor: `${colors.green}`,
        },
        {
          label: "strike",
          data: [4200, 4200],
          type: "line",
          pointRadius: 0,
          pointHoverRadius: 0,
          borderDash: [8, 8],
          borderColor: "#FFFFFF66",
          borderWidth: 1,
          fill: "start",
          backgroundColor: gradient,
        },
      ],
    };
  }, []);

  return (
    <div style={{ height: "160px" }}>
      <Line data={getData} options={options} />
    </div>
  );
};

export default StrikeChart;
