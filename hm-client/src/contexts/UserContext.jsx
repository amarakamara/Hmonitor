// UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserInfoProvider(props) {
  const initialUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const initialPatientInfo =
    JSON.parse(localStorage.getItem("patientInfo")) || {};

  const initialPatientsState =
    JSON.parse(localStorage.getItem("patients")) || [];

  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [patientInfo, setPatientInfo] = useState(initialPatientInfo);
  const [patients, setPatients] = useState(initialPatientsState);

  const [getPatients, setGetPatients] = useState(false);

  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  useEffect(() => {
    localStorage.setItem("patientInfo", JSON.stringify(patientInfo));
  }, [patientInfo]);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  const values = {
    userInfo,
    setUserInfo,
    patientInfo,
    setPatientInfo,
    patients,
    setPatients,
    getPatients,
    setGetPatients,
  };

  return (
    <UserContext.Provider value={values}>{props.children}</UserContext.Provider>
  );
}
