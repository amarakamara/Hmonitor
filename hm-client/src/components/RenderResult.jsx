import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import { useMonitoring } from "../contexts/StateContext";
import { useTab } from "../contexts/TabContext";
import TempChart from "./TempChart";
import HeartChart from "./HeartRateChart";

const apiBase = "http://localhost:5000";

export default function RenderResult(props) {
  const { token } = useAuth();

  const { patientInfo } = useUser();

  const { isMonitoring, setIsMonitoring } = useMonitoring();

  const { setShowPatientForm } = useTab();

  const { setShowResult, showResult } = useTab();

  const [patientData, setPatientData] = useState({});

  const headers = {
    Authorization: `Bearer ${token}`,
    "content-type": "application/json",
  };

  useEffect(() => {
    const getPatientData = async () => {
      try {
        if (!patientInfo) return;

        const response = await fetch(
          apiBase + `/patient-data/${patientInfo._id}`,
          {
            method: "GET",
            credentials: "include",
            headers,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPatientData(data);
        } else {
          throw new Error("Failed to fetch patient data");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    getPatientData();
  }, []);

  return (
    <>
      <div
        className=" flex bg-white flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 text-center max-w-1/2 w-5/6 md:w-4/6 lg:w-4/6 h-auto shadow-md  border border-teal-900 pb-6"
        style={{
          borderRadius: "10px",
        }}
      >
        <div
          className="w-full h-auto bg-teal-900 flex flex-row justify-end items-center"
          style={{
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <button
            onClick={() => setShowResult(false)}
            className="w-10 p-0 bg-transparent text-white font-extrabold"
          >
            <span className="material-symbols-outlined">close</span>{" "}
          </button>
        </div>
        <div className="w-full sticky flex justify-center items-center shadow-md bg-white top-0">
          <h1 className="font-extrabold text-sm md:text-xl lg:text-2xl my-1">
            {`Here's ${patientData.firstName}'s Result:`}
          </h1>
        </div>
        <div className="w-full flex flex-col p-2 h-60 overflow-y-auto">
          <div className="w-full h-auto flex flex-col md:flex-row lg:flex-row grow-0 shrink-0 justify-center mt-4">
            <div className="w-full md:w-1/2 lg:w-1/2 rounded-md bg-teal-900 bg-opacity-15 md:mr-1 lg:mr-0 mb-4 md:mb-0">
              <h2 className="font-extrabold text-1xl">Temperature</h2>
              <h3 className="text-4xl my-2 font-bold">
                {patientData.temperatureValue} °C
              </h3>
              <TempChart value={patientData.temperatureValue} />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/2 rounded-md bg-teal-900 bg-opacity-15 md:ml-1 lg:ml-0">
              <h2 className="font-extrabold text-1xl">HeartRate</h2>
              <h3 className="text-4xl my-2 font-bold">
                {patientData.heartRate} BPM
              </h3>
              <HeartChart value={patientData.heartRate} />
            </div>
          </div>

          <div className="w-full h-auto flex flex-row mt-2">
            <button className="w-1/2 mr-2 bg-teal-900 text-white px-2 py-2 rounded-md shadow-md hover:bg-teal-700 transition duration-300">
              <Link
                className="text-white text-xs"
                to={`/email-share/${patientData._id}/${patientData.firstName}`}
              >
                Share
              </Link>
            </button>
            <button
              onClick={() => setShowPatientForm(true)}
              className="w-1/2 text-xs bg-teal-900 text-white px-2 py-2 rounded-md shadow-md hover:bg-teal-700 transition duration-300"
            >
              New Patient
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
