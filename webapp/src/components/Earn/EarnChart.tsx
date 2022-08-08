// import React, { useCallback, useMemo } from "react";
// import Chart, { ChartOptions, ChartData } from "chart.js";
// import { Line } from "react-chartjs-2";
// import currency from "currency.js";

// import colors from "shared/lib/designSystem/colors";
// import { getRange } from "shared/lib/utils/math";

// /**
//  * Strike: Strike price of the option
//  * Price: The price of which the profit is to be calculated
//  * Premium: Premium of the option, assume per unit over here
//  * Quantity: Quantity of which the user has
//  * Expiry: Expiry of the option
//  */
// interface ProfitChartProps {
//   strike: number;
//   price: number;
//   premium: number;
//   isPut: boolean;
//   onHover: (price: number | undefined) => void;
// }

// const EarnChart: React.FC<ProfitChartProps> = ({
//   strike,
//   price,
//   premium,
//   isPut,
//   onHover,
// }) => {
//   const calculateProfit = useCallback(
//     (p: number) => {
//       if (isPut) {
//         return p >= strike ? premium : p - strike + premium;
//       }

//       return p <= strike ? premium : strike - p + premium;
//     },
//     [isPut, premium, strike]
//   );

//   const breakeven = useMemo(() => {
//     const breakeven = isPut ? strike - premium : strike + premium;
//     return breakeven;
//   }, [isPut, premium, strike]);

//   const findNeighbourPoint = useCallback((nums: number[], point: number) => {
//     let closestSmallerNum = undefined;
//     let closestBiggerNum = undefined;

//     for (let i = 0; i < nums.length; i++) {
//       const currNum = nums[i];

//       // Find closest bigger number
//       if (
//         currNum >= point &&
//         (closestSmallerNum === undefined || currNum < closestSmallerNum)
//       ) {
//         if (closestSmallerNum === undefined || currNum < closestSmallerNum) {
//           closestSmallerNum = currNum;
//         }
//       }

//       // Find closest smaller number
//       if (
//         currNum <= point &&
//         (closestBiggerNum === undefined || currNum > closestBiggerNum)
//       ) {
//         closestBiggerNum = currNum;
//       }
//     }

//     // return 2 closest point
//     return [closestSmallerNum!, closestBiggerNum!];
//   }, []);

//   const priceRange = useMemo(() => {
//     return premium > 0
//       ? getRange(
//           Math.round(breakeven * (1 - (premium * 5) / strike)),
//           Math.round(breakeven * (1 + (premium * 5) / strike)),
//           breakeven *
//             (premium > 0
//               ? premium / strike / 10
//               : breakeven * (1 + (premium * 5) / strike))
//         )
//       : getRange(
//           Math.round(breakeven * 0.9),
//           Math.round(breakeven * 1.1),
//           breakeven * 0.02
//         );
//   }, [breakeven, premium, strike]);

//   const drawPricePoint = useCallback(
//     (chart: any, price: number, drawIndex: number) => {
//       const ctx = chart.chart.ctx;
//       // Get breakeven datasaet because of stability over every point
//       const datasetIndex = chart.chart.data.datasets.findIndex(
//         (dataset: any) => dataset.label === "breakeven"
//       );
//       const meta = chart.chart.getDatasetMeta(datasetIndex);
//       // draw line behind dot
//       // ctx.globalCompositeOperation = "destination-over";
//       const leftX = chart.chart.scales["x-axis-0"].left;
//       const rightX = chart.chart.scales["x-axis-0"].right;
//       const topY = chart.chart.scales["y-axis-0"].top;
//       const bottomY = chart.chart.scales["y-axis-0"].bottom - 1;
//       /**
//        * Draw price point
//        */
//       const priceElement = meta.data[drawIndex];
//       const priceX = priceElement._view.x;

//       ctx.save();
//       ctx.beginPath();
//       ctx.moveTo(priceX, topY);
//       ctx.lineTo(priceX, bottomY);
//       ctx.lineWidth = 2;
//       ctx.strokeStyle = colors.primaryText;
//       ctx.stroke();
//       ctx.restore();

//       /**
//        * Draw price text
//        */
//       ctx.fillStyle = "white";
//       const fontSize = 12;
//       const fontStyle = "normal";
//       const fontFamily = "VCR, sans-serif";
//       ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       const padding = 8;

//       const text = `${drawIndex === 0 ? "<<< " : ""}${currency(
//         price
//       ).format()}${drawIndex === meta.data.length - 1 ? " >>>" : ""}`;
//       const textLength = ctx.measureText(text).width;

//       let xPosition = priceX;

//       if (xPosition - textLength / 2 < leftX) {
//         xPosition = leftX + padding + textLength / 2;
//       }

//       if (xPosition + textLength / 2 > rightX) {
//         xPosition = rightX - padding - textLength / 2;
//       }

//       ctx.fillText(text, xPosition, topY - fontSize / 2 - padding);

//       ctx.globalCompositeOperation = "source-over";
//     },
//     []
//   );

//   const options = useMemo((): ChartOptions => {
//     return {
//       maintainAspectRatio: false,
//       legend: { display: false },
//       layout: { padding: { top: 24 } },
//       scales: {
//         yAxes: [
//           {
//             display: false,
//           },
//         ],
//         xAxes: [{ display: false }],
//       },
//       animation: { duration: 0 },
//       hover: { animationDuration: 0, intersect: false },
//       tooltips: {
//         enabled: false,
//         intersect: false,
//         mode: "nearest",
//       },
//       onHover: (_: any, elements: any) => {
//         if (elements && elements.length) {
//           onHover(priceRange[elements[0]._index]);
//           return;
//         }
//         onHover(undefined);
//       },
//     };
//   }, [isPut, priceRange, calculateProfit, onHover]);

//   const getData = useCallback(
//     (canvas: any): ChartData => {
//       const ctx = canvas.getContext("2d");
//       const green = ctx.createLinearGradient(0, 130, 0, 148);
//       green.addColorStop(1, `${colors.green}05`);
//       green.addColorStop(0, `${colors.green}14`);
//       console.log(priceRange);
//       return {
//         labels: [1, 2, 3],
//         datasets: [
//           {
//             label: "green",
//             // @ts-ignore
//             data: [1, 2, 3],
//             type: "line",
//             pointRadius: 0,
//             pointHoverRadius: 0,
//             borderDash: undefined,
//             borderWidth: 2,
//             borderColor: `${colors.green}`,
//             fill: "-1",
//             backgroundColor: green,
//             lineTension: 0,
//           },
//         ],
//       };
//     },
//     [breakeven, calculateProfit, findNeighbourPoint, price, priceRange]
//   );

//   const chart = useMemo(() => {
//     const neighbourPointToStrike = findNeighbourPoint(priceRange, strike);
//     const closestStrikePoint =
//       Math.abs(strike - neighbourPointToStrike[0]) <
//       Math.abs(strike - neighbourPointToStrike[1])
//         ? neighbourPointToStrike[0]
//         : neighbourPointToStrike[1];
//     const closestStrikeIndex = priceRange.findIndex(
//       (p) => p === closestStrikePoint
//     );

//     return (
//       <Line
//         type="line"
//         data={getData}
//         options={options}
//         plugins={[
//           {
//             afterDraw: (chart: any) => {
//               const ctx = chart.chart.ctx;
//               // draw line behind dot
//               // ctx.globalCompositeOperation = "destination-over";
//               const leftX = chart.chart.scales["x-axis-0"].left;
//               const rightX = chart.chart.scales["x-axis-0"].right;
//               const topY = chart.chart.scales["y-axis-0"].top;
//               const bottomY = chart.chart.scales["y-axis-0"].bottom - 1;

//               /**
//                * Draw top and bottom border
//                */
//               ctx.save();
//               ctx.beginPath();
//               ctx.moveTo(leftX, topY);
//               ctx.lineTo(rightX, topY);
//               ctx.lineWidth = 1;
//               ctx.strokeStyle = colors.border;
//               ctx.stroke();
//               ctx.beginPath();
//               ctx.moveTo(leftX, bottomY);
//               ctx.lineTo(rightX, bottomY);
//               ctx.stroke();
//               ctx.restore();
//             },
//           },
//         ]}
//       />
//     );
//   }, [
//     drawPricePoint,
//     getData,
//     findNeighbourPoint,
//     priceRange,
//     strike,
//     options,
//   ]);

//   return chart;
// };

// export default EarnChart;

import React, { useCallback, useMemo } from "react";
import { ChartOptions, ChartData } from "chart.js";
// import Chart from "chart.js";
import { Line } from "react-chartjs-2";
// import currency from "currency.js";

import colors from "shared/lib/designSystem/colors";

/**
 * Strike: Strike price of the option
 * Price: The price of which the profit is to be calculated
 * Premium: Premium of the option, assume per unit over here
 * Quantity: Quantity of which the user has
 * Expiry: Expiry of the option
 */
interface ProfitChartProps {
  strike: number;
  price: number;
  premium: number;
  isPut: boolean;
  onHover: (price: number | undefined) => void;
}

const EarnChart: React.FC<ProfitChartProps> = ({
  strike,
  price,
  premium,
  isPut,
  onHover,
}) => {
  // const breakeven = useMemo(() => {
  //   const breakeven = isPut ? strike - premium : strike + premium;
  //   return breakeven;
  // }, [isPut, premium, strike]);

  // const findNeighbourPoint = useCallback((nums: number[], point: number) => {
  //   let closestSmallerNum = undefined;
  //   let closestBiggerNum = undefined;

  //   for (let i = 0; i < nums.length; i++) {
  //     const currNum = nums[i];

  //     // Find closest bigger number
  //     if (
  //       currNum >= point &&
  //       (closestSmallerNum === undefined || currNum < closestSmallerNum)
  //     ) {
  //       if (closestSmallerNum === undefined || currNum < closestSmallerNum) {
  //         closestSmallerNum = currNum;
  //       }
  //     }

  //     // Find closest smaller number
  //     if (
  //       currNum <= point &&
  //       (closestBiggerNum === undefined || currNum > closestBiggerNum)
  //     ) {
  //       closestBiggerNum = currNum;
  //     }
  //   }

  //   // return 2 closest point
  //   return [closestSmallerNum!, closestBiggerNum!];
  // }, []);

  // const priceRange = useMemo(() => {
  //   return premium > 0
  //     ? getRange(
  //         Math.round(breakeven * (1 - (premium * 5) / strike)),
  //         Math.round(breakeven * (1 + (premium * 5) / strike)),
  //         breakeven *
  //           (premium > 0
  //             ? premium / strike / 10
  //             : breakeven * (1 + (premium * 5) / strike))
  //       )
  //     : getRange(
  //         Math.round(breakeven * 0.9),
  //         Math.round(breakeven * 1.1),
  //         breakeven * 0.02
  //       );
  // }, [breakeven, premium, strike]);

  const priceRange = useMemo(() => {
    var leftArray = [];
    var array = [];
    var rightArray = [];
    for (let i = -28; i < -8; i += 1) {
      leftArray.push(i);
    }

    for (let i = -8; i <= 8; i += 1) {
      array.push(i);
    }

    for (let i = 9; i <= 28; i += 1) {
      rightArray.push(i);
    }

    console.log([...leftArray, -8.1, ...array, 8.1, ...rightArray]);
    return [...leftArray, -8.1, ...array, 8.1, ...rightArray];
  }, []);

  const otherRange = useMemo(() => {
    var leftArray = [];
    var array = [];
    var rightArray = [];

    for (let i = -28; i < -8; i += 1) {
      leftArray.push(4);
    }

    for (let i = -8; i <= 8; i += 1) {
      array.push(4 + Math.abs(i / 8) * 25);
    }

    for (let i = 9; i <= 28; i += 1) {
      rightArray.push(4);
    }

    console.log([...leftArray, 4, ...array, 4, ...rightArray]);
    return [...leftArray, 4, ...array, 4, ...rightArray];
  }, []);

  // const drawPricePoint = useCallback(
  //   (chart: any, price: number, drawIndex: number) => {
  //     const ctx = chart.chart.ctx;
  //     // Get breakeven datasaet because of stability over every point
  //     const datasetIndex = chart.chart.data.datasets.findIndex(
  //       (dataset: any) => dataset.label === "breakeven"
  //     );
  //     const meta = chart.chart.getDatasetMeta(datasetIndex);
  //     // draw line behind dot
  //     ctx.globalCompositeOperation = "destination-over";
  //     const leftX = chart.chart.scales["x-axis-0"].left;
  //     const rightX = chart.chart.scales["x-axis-0"].right;
  //     const topY = chart.chart.scales["y-axis-0"].top;
  //     const bottomY = chart.chart.scales["y-axis-0"].bottom - 1;
  //     /**
  //      * Draw price point
  //      */
  //     const priceElement = meta.data[drawIndex];
  //     const priceX = priceElement._view.x;

  //     ctx.save();
  //     ctx.beginPath();
  //     ctx.moveTo(priceX, topY);
  //     ctx.lineTo(priceX, bottomY);
  //     ctx.lineWidth = 2;
  //     ctx.strokeStyle = colors.primaryText;
  //     ctx.stroke();
  //     ctx.restore();

  //     /**
  //      * Draw price text
  //      */
  //     ctx.fillStyle = "white";
  //     const fontSize = 12;
  //     const fontStyle = "normal";
  //     const fontFamily = "VCR, sans-serif";
  //     ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
  //     ctx.textAlign = "center";
  //     ctx.textBaseline = "middle";
  //     const padding = 8;

  //     const text = `${drawIndex === 0 ? "<<< " : ""}${currency(
  //       price
  //     ).format()}${drawIndex === meta.data.length - 1 ? " >>>" : ""}`;
  //     const textLength = ctx.measureText(text).width;

  //     let xPosition = priceX;

  //     if (xPosition - textLength / 2 < leftX) {
  //       xPosition = leftX + padding + textLength / 2;
  //     }

  //     if (xPosition + textLength / 2 > rightX) {
  //       xPosition = rightX - padding - textLength / 2;
  //     }

  //     ctx.fillText(text, xPosition, topY - fontSize / 2 - padding);

  //     ctx.globalCompositeOperation = "source-over";
  //   },
  //   []
  // );

  const options = useMemo((): ChartOptions => {
    return {
      maintainAspectRatio: false,
      legend: { display: false },
      layout: { padding: { top: 24 } },
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
          onHover(priceRange[elements[0]._index]);
          return;
        }
        onHover(undefined);
      },
    };
  }, [priceRange, onHover]);

  const getData = useCallback(
    (canvas: any): ChartData => {
      const ctx = canvas.getContext("2d");
      const green = ctx.createLinearGradient(0, 130, 0, 148);
      green.addColorStop(1, `${colors.green}05`);
      green.addColorStop(0, `${colors.green}14`);

      // const neighbourPointToBreakeven = findNeighbourPoint(
      //   priceRange,
      //   breakeven
      // );
      // const closestBreakevenPoint =
      //   Math.abs(breakeven - neighbourPointToBreakeven[0]) <
      //   Math.abs(breakeven - neighbourPointToBreakeven[1])
      //     ? neighbourPointToBreakeven[0]
      //     : neighbourPointToBreakeven[1];

      // const neighbourPointToPrice = findNeighbourPoint(
      //   priceRange,
      //   price
      // ).filter((neighbour) => neighbour);
      // const closestPricePoint =
      //   neighbourPointToPrice.length < 2 ||
      //   Math.abs(price - neighbourPointToPrice[0]) <
      //     Math.abs(price - neighbourPointToPrice[1])
      //     ? neighbourPointToPrice[0]
      //     : neighbourPointToPrice[1];

      return {
        labels: priceRange,
        datasets: [
          {
            label: "green",
            // @ts-ignore
            data: otherRange,
            type: "line",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderDash: undefined,
            borderWidth: 2,
            borderColor: `${colors.green}`,
            fill: "-1",
            lineTension: 0,
          },
          {
            label: "breakevenPoint",
            data: priceRange.map((p) => (p === -8 || p === 8 ? 29 : null)),
            type: "line",
            pointRadius: 8,
            pointHoverRadius: 8,
            backgroundColor: colors.primaryText,
          },
          // {
          //   label: "breakeven",
          //   data: priceRange.map((price) => price),
          //   type: "line",
          //   pointRadius: 0,
          //   pointHoverRadius: 0,
          //   borderColor: "#FFFFFF66",
          //   borderWidth: 1,
          //   lineTension: 0,
          // },
        ],
      };
    },
    [otherRange, priceRange]
  );

  const chart = useMemo(() => {
    // const neighbourPointToStrike = findNeighbourPoint(priceRange, strike);
    // const closestStrikePoint =
    //   Math.abs(strike - neighbourPointToStrike[0]) <
    //   Math.abs(strike - neighbourPointToStrike[1])
    //     ? neighbourPointToStrike[0]
    //     : neighbourPointToStrike[1];
    // const closestStrikeIndex = priceRange.findIndex(
    //   (p) => p === closestStrikePoint
    // );

    return (
      <Line
        type="line"
        data={getData}
        options={options}
        plugins={[
          {
            afterDraw: (chart: any) => {
              const ctx = chart.chart.ctx;
              // Get breakeven datasaet because of stability over every point
              // const datasetIndex = chart.chart.data.datasets.findIndex(
              //   (dataset: any) => dataset.label === "breakeven"
              // );
              // const meta = chart.chart.getDatasetMeta(datasetIndex);
              // draw line behind dot
              ctx.globalCompositeOperation = "destination-over";
              const leftX = chart.chart.scales["x-axis-0"].left;
              const rightX = chart.chart.scales["x-axis-0"].right;
              const topY = chart.chart.scales["y-axis-0"].top;
              const bottomY = chart.chart.scales["y-axis-0"].bottom - 1;

              /**
               * Draw top and bottom border
               */
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(leftX, topY);
              ctx.lineTo(rightX, topY);
              ctx.lineWidth = 1;
              ctx.strokeStyle = colors.border;
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(leftX, bottomY);
              ctx.lineTo(rightX, bottomY);
              ctx.stroke();
              ctx.restore();

              // /**
              //  * Draw strike point
              //  */
              // const strikeElement = meta.data[closestStrikeIndex];
              // const strikeX = strikeElement._view.x;

              // ctx.save();
              // ctx.beginPath();
              // ctx.setLineDash([5, 5]);
              // ctx.moveTo(strikeX, topY);
              // ctx.lineTo(strikeX, bottomY);
              // ctx.lineWidth = 1;
              // ctx.strokeStyle = `${colors.primaryText}66`;
              // ctx.stroke();
              // ctx.restore();

              /**
               * Draw price point
               */
              // const priceDatasetIndex = chart.chart.data.datasets.findIndex(
              //   (dataset: any) => dataset.label === "price"
              // );
              // const priceDataset = chart.chart.data.datasets[priceDatasetIndex];

              // drawPricePoint(
              //   chart,
              //   priceDataset.data.find((data: any) => data !== null),
              //   priceDataset.data.findIndex((data: any) => data !== null)
              // );
            },
          },
        ]}
      />
    );
  }, [getData, options]);

  return chart;
};

export default EarnChart;
