import Chart, { ChartData, ChartOptions } from "chart.js";
import React, { useCallback, useMemo } from "react";
import { Line } from "react-chartjs-2";
import colors from "shared/lib/designSystem/colors";
import currency from "currency.js";

interface StrikeChartProps {
  strike: number;
  current: number;
  profitable: boolean;
}

const StrikeChart: React.FC<StrikeChartProps> = ({
  strike,
  current,
  profitable,
}) => {
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

      hover: { animationDuration: 0, intersect: false },
      tooltips: {
        enabled: false,
        intersect: false,
        mode: "nearest",
      },
    };
  }, []);

  const getData = useCallback(
    (canvas: any): ChartData => {
      const ctx = canvas.getContext("2d");
      const green = ctx.createLinearGradient(0, 0, 0, 104);
      green.addColorStop(strike > current ? 0 : 1, `${colors.green}05`);
      green.addColorStop(strike > current ? 1 : 0, `${colors.green}14`);
      const red = ctx.createLinearGradient(0, 0, 0, 104);
      red.addColorStop(strike > current ? 0 : 1, `${colors.red}05`);
      red.addColorStop(strike > current ? 1 : 0, `${colors.red}14`);

      return {
        labels: ["start", "end"],
        datasets: [
          {
            label: "current",
            data: [current, current],
            type: "line",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderDash: undefined,
            borderWidth: 2,
            borderColor: `${profitable ? colors.green : colors.red}`,
            fill: "none",
          },
          {
            label: "strike",
            data: [strike, strike],
            type: "line",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderDash: [8, 8],
            borderColor: "#FFFFFF66",
            borderWidth: 1,
            fill: "-1",
            backgroundColor: profitable ? green : red,
          },
        ],
      };
    },
    [current, strike, profitable]
  );

  const chart = useMemo(
    () => (
      <Line
        data={getData}
        options={options}
        plugins={[
          {
            afterDatasetsDraw: (chart: any) => {
              const ctx = chart.chart.ctx;
              chart.chart.data.datasets.forEach((dataset: any, i: number) => {
                const meta = chart.chart.getDatasetMeta(i);
                const element = meta.data[i];

                // Set font
                ctx.fillStyle =
                  i === 1 ? "white" : profitable ? colors.green : colors.red;
                const fontSize = 12;
                const fontStyle = "normal";
                const fontFamily = "VCR, sans-serif";
                ctx.font = Chart.helpers.fontString(
                  fontSize,
                  fontStyle,
                  fontFamily
                );
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                const padding = 8;
                const position = element.tooltipPosition();

                const text = currency(dataset.data[i]).format({ symbol: "" });
                const offsetLength = ctx.measureText(text).width / 2 + 23;

                ctx.fillText(
                  text,
                  position.x + (i === 0 ? offsetLength : -offsetLength),
                  position.y - fontSize / 2 - padding
                );
              });
            },
          },
        ]}
      />
    ),
    [getData, options, profitable]
  );

  return chart;
};

export default StrikeChart;
