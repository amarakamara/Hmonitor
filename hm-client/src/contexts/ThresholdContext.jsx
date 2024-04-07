import react, { createContext, useContext, useState, useEffect } from "react";

const thresholdContext = createContext();

export function useThreshold() {
  return useContext(thresholdContext);
}

export function ThresholdContextProvider(props) {
  const initialThresholdState = localStorage.getItem("patientThreshold")
    ? JSON.parse(localStorage.getItem("patientThreshold"))
    : {};

  const [patientThreshold, setPatientThreshold] = useState(
    initialThresholdState
  );

  useEffect(() => {
    localStorage.setItem("patientThreshold", JSON.stringify(patientThreshold));
  }, [patientThreshold]);

  useEffect(() => {
    localStorage.setItem("patientThreshold", JSON.stringify(patientThreshold));
  }, [patientThreshold]);

  const values = {
    patientThreshold,
    setPatientThreshold,
  };

  return (
    <thresholdContext.Provider value={values}>
      {props.children}
    </thresholdContext.Provider>
  );
}
