import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function HeartRateChart(props) {
  const heartRateChartRef = useRef(null);

  useEffect(() => {
    const renderHeartChart = () => {
      const heartCtx = document.getElementById(`heartChart${props.value}`);
      if (!heartCtx) {
        return;
      }

      const heartLower = 60;
      const patientHeartRate = props.value;
      const heartHigh = 120;

      const heartData = [heartLower, patientHeartRate, heartHigh];

      const heartConfig = {
        type: "line",
        data: {
          labels: ["Lower", "Patient", "High"],
          datasets: [
            {
              label: "Real-Time Heart Rate (BPM)",
              data: heartData,
              borderColor: "red",
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

      if (heartRateChartRef.current) {
        heartRateChartRef.current.destroy();
      }

      heartRateChartRef.current = new Chart(heartCtx, heartConfig);
      heartRateChartRef.current.update();
    };

    renderHeartChart();

    return () => {
      if (heartRateChartRef.current) {
        heartRateChartRef.current.destroy();
      }
    };
  }, [props.value]);

  return (
    <>
      <canvas
        id={`heartChart${props.value}`}
        className="max-h-36 h-36"
      ></canvas>
    </>
  );
}
