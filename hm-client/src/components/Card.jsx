import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useMonitoring } from "../contexts/StateContext";

export default function Card(props) {
  const animateVal = props.value;
  const { isMonitoring } = useMonitoring();

  const Animation = useSpring({
    animateVal,
    from: { animateVal: 0 },
  });
  const [tempStatus, setTempStatus] = useState(" ");
  const [heartStatus, setHeartStatus] = useState(" ");

  //determine the status
  useEffect(() => {
    const pThreshold = props.threshold;
    if (Object.keys(pThreshold).length !== 0 && isMonitoring) {
      if (props.title === "Temperature") {
        if (props.value > pThreshold.tempMax) {
          setTempStatus("High");
        } else if (props.value < pThreshold.tempMin) {
          setTempStatus("Low");
        } else {
          setTempStatus("Normal");
        }
      }
      if (props.title === "Heart Rate") {
        if (props.value > pThreshold.heartMax) {
          setHeartStatus("Dangerous");
        } else if (props.value < pThreshold.heartMin) {
          setHeartStatus("Critical");
        } else {
          setHeartStatus("Safe");
        }
      }
    }
  }, [props.value, props.threshold, isMonitoring]);

  return (
    <div className="w-auto my-2 bg-teal-900 flex flex-row shadow-md hover:shadow-lg transition duration-300 rounded-lg">
      <div className="w-1/3">
        <img
          className="w-full h-full object-cover"
          src={props.imgSource}
          alt={props.imageAlt}
        />
      </div>
      <div className="w-1/2 flex flex-col justify-center p-2">
        <h3 className="card-title font-extrabold text-2xl whitespace-nowrap">
          {props.title}
        </h3>
        <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full shadow-lg">
          <hr className="h-0.5 bg-transparent animate-pulse" />
        </div>
        <animated.div className="sensor-val text-4xl my-2 font-bold whitespace-nowrap">
          {Animation.animateVal.to(
            (value) => `${value.toFixed(1)} ${props.symbol}`
          )}
        </animated.div>
        <h6 className="text-md whitespace-nowrap">
          Status: {props.title === "Temperature" ? tempStatus : heartStatus}
        </h6>
      </div>
    </div>
  );
}
