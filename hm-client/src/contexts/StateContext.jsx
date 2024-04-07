// UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext();

export function useMonitoring() {
  return useContext(StateContext);
}

export function StateInfoProvider(props) {
  const initialMonitoringState =
    JSON.parse(localStorage.getItem("isMonitoring")) || false;

  const [isMonitoring, setIsMonitoring] = useState(initialMonitoringState);

  useEffect(() => {
    localStorage.setItem("isMonitoring", JSON.stringify(isMonitoring));
  }, [isMonitoring]);

  const values = {
    isMonitoring,
    setIsMonitoring,
  };

  return (
    <StateContext.Provider value={values}>
      {props.children}
    </StateContext.Provider>
  );
}
