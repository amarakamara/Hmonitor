import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function TempChart(props) {
  const tempChartRef = useRef(null);

  useEffect(() => {
    const renderTempChart = () => {
      const tempCtx = document.getElementById(`tempChart${props.value}`);

      if (!tempCtx) {
        return;
      }

      const tempLower = 35;
      const patientTemp = props.value;
      const tempHigh = 38;

      const tempData = [tempLower, patientTemp, tempHigh];

      const tempConfig = {
        type: "line",
        data: {
          labels: ["Lower", "Patient", "High"],
          datasets: [
            {
              label: "Real-Time Temperature",
              data: tempData,
              borderColor: "blue",
              backgroundColor: "transparent",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      };

      if (tempChartRef.current) {
        tempChartRef.current.destroy();
      }

      tempChartRef.current = new Chart(tempCtx, tempConfig);
      tempChartRef.current.update();
    };

    renderTempChart();

    return () => {
      if (tempChartRef.current) {
        tempChartRef.current.destroy();
      }
    };
  }, [props.value]);

  return (
    <>
      <canvas
        id={`tempChart${props.value}`} // Use unique ID based on props.value
        className="max-h-36 h-36"
      ></canvas>
    </>
  );
}
