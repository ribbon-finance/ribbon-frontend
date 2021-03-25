import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Line } from "react-chartjs-2";
import moment from "moment";
import { ChartOptions } from "chart.js";
import { SecondaryText, Title } from "../../designSystem";
import colors from "../../designSystem/colors";

const PerformanceChartContainer = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 4px;
`;

const APYNumber = styled(Title)`
  font-size: 28px;
  line-height: 36px;
`;

const DateTooltip = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
`;

interface DateFilterProps {
  active: boolean;
}

const DateFilter = styled(Title)<DateFilterProps>`
  letter-spacing: 1.5px;
  cursor: pointer;
  color: ${(props) => (props.active ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)")};
`;

const PerformanceChart: React.FC = () => {
  // mocked data for now
  const originalDataset = useMemo(
    () => [3, 5, 2, 3, 5, 4, 3, 1, 4, 5, 7, 8.5, 8, 7.5],
    []
  );
  const originalLabels = useMemo(() => {
    const now = moment(new Date());
    return originalDataset
      .map((_, index) =>
        now
          .subtract(index * 7, "days")
          .utc()
          .toDate()
      )
      .reverse();
  }, [originalDataset]);

  // states
  const [date, setDate] = useState<Date | null>(null);
  const [datePosition, setDatePosition] = useState(0);
  const [monthFilter, setMonthFilter] = useState(true);
  const [performance, setPerformance] = useState<number>(
    originalDataset[originalDataset.length - 1]
  );

  const aMonthFromNow = moment(new Date()).subtract(1, "months");
  const dataset = monthFilter
    ? originalDataset.filter((_, index) => {
        return moment(originalLabels[index]).isAfter(aMonthFromNow);
      })
    : originalDataset;

  const labels = monthFilter
    ? originalLabels.filter((date) => {
        return moment(date).isAfter(aMonthFromNow);
      })
    : originalLabels;

  // formatted data
  const perfStr = `${performance.toFixed(2)}%`;
  const dateStr = moment(date || new Date()).format("ddd, MMMM wo");

  const handleChartHover = useCallback(
    (hoverInfo: HoverInfo) => {
      if (hoverInfo.focused) {
        setPerformance(hoverInfo.yData);
        setDate(hoverInfo.xData);
        setDatePosition(hoverInfo.xPosition);
      } else {
        setPerformance(originalDataset[originalDataset.length - 1]);
        setDate(null);
        setDatePosition(0);
      }
    },
    [originalDataset, setPerformance, setDate]
  );

  const chart = useMemo(
    () => (
      <Chart
        dataset={dataset}
        labels={labels}
        onHover={handleChartHover}
      ></Chart>
    ),
    [dataset, labels, handleChartHover]
  );

  return (
    <PerformanceChartContainer className="pt-4" style={{ paddingBottom: 40 }}>
      <div className="d-flex align-items-center justify-content-between mb-3 px-4">
        <div>
          <SecondaryText className="d-block">Yield (APY)</SecondaryText>
          <APYNumber>{perfStr}</APYNumber>
        </div>
        <div>
          <DateFilter
            active={monthFilter}
            className="mr-3"
            onClick={() => setMonthFilter(true)}
          >
            1m
          </DateFilter>
          <DateFilter
            active={!monthFilter}
            onClick={() => setMonthFilter(false)}
          >
            All
          </DateFilter>
        </div>
      </div>
      <div style={{ position: "relative", height: "224px", width: "100%" }}>
        {chart}
      </div>
      {date !== null ? (
        <DateTooltip
          className="position-absolute"
          style={{
            whiteSpace: "nowrap",
            left: datePosition - 15,
          }}
        >
          {dateStr}
        </DateTooltip>
      ) : null}
    </PerformanceChartContainer>
  );
};

type HoverInfo =
  | {
      focused: true;
      xData: Date;
      yData: number;
      xPosition: number;
    }
  | { focused: false };

const Chart: React.FC<{
  dataset: number[];
  labels: Date[];
  onHover: (hoverInfo: HoverInfo) => void;
  borderColor?: string;
  gradientStartColor?: string;
  gradientStopColor?: string;
  pointBackgroundColor?: string;
}> = ({
  dataset,
  labels,
  onHover,
  borderColor = "#16CEB9",
  gradientStartColor = "rgba(121, 255, 203, 0.24)",
  gradientStopColor = "rgba(121, 255, 203, 0)",
  pointBackgroundColor = "rgba(121, 255, 203, 1)",
}) => {
  const options = useMemo(() => {
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
      onHover: (_: any, elements: any) => {
        if (elements && elements.length) {
          const chartElem = elements[0];
          const chart = chartElem._chart;
          const ctx = chart.ctx;

          // draw line behind dot
          ctx.globalCompositeOperation = "destination-over";
          const x = chartElem._view.x;
          const topY = chart.scales["y-axis-0"].top;
          const bottomY = chart.scales["y-axis-0"].bottom;

          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([5, 5]);
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();
          ctx.restore();

          // now we have to revert to the dot drawing above everything
          ctx.globalCompositeOperation = "source-over";

          onHover({
            focused: true,
            xData: labels[chartElem._index],
            yData: dataset[chartElem._index],
            xPosition: x,
          });
        } else {
          onHover({ focused: false });
        }
      },
    };
  }, [dataset, labels, onHover]);

  const getData = useCallback(
    (canvas: any) => {
      const ctx = canvas.getContext("2d");
      let gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, gradientStartColor);
      gradient.addColorStop(1, gradientStopColor);

      return {
        labels,
        datasets: [
          {
            data: dataset,
            type: "line",
            pointRadius: 8,
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 1,
            pointHitRadius: 20,
            pointBackgroundColor: "rgba(0, 0, 0, 0)",
            pointBorderColor: "rgba(0, 0, 0, 0)",
            pointHoverBackgroundColor: pointBackgroundColor,
            pointHoverBorderColor: pointBackgroundColor,
            tension: 0,
            fill: "start",
            borderColor,
            backgroundColor: gradient,
          },
        ],
      };
    },
    [
      dataset,
      labels,
      borderColor,
      gradientStartColor,
      gradientStopColor,
      pointBackgroundColor,
    ]
  );

  return <Line data={getData} options={options as ChartOptions}></Line>;
};

export default PerformanceChart;
