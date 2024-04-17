import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { useSpring, animated } from "@react-spring/web";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import { useMonitoring } from "../contexts/StateContext";
import { useTab } from "../contexts/TabContext";
import { useThreshold } from "../contexts/ThresholdContext";
import io from "socket.io-client";
import TempChart from "./TempChart";
import Card from "./Card";
import PatientInformation from "./PatientInformation";
import NewPatientForm from "./NewPatientForm";
import TextBody from "./TextBody";
import MobileMenu from "./MobileMenu";
import RenderResult from "./RenderResult";
import Menu from "./Menu";
import SetThreshold from "./SetThreshold";

import "../index.css";

const apiBase =
  import.meta.env.VITE_ENV === "development"
    ? import.meta.env.VITE_DEV_API_BASE
    : import.meta.env.VITE_PROD_API_BASE;

const socket = io(apiBase, {
  transports: ["websocket"],
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
});

function App() {
  const navigate = useNavigate();

  //context inputs
  const { patientThreshold } = useThreshold();

  const {
    patientInfo,
    setPatientInfo,
    setPatients,
    patients,
    getPatients,
    setGetPatients,
  } = useUser();

  const { setAuthenticated, authenticated, token } = useAuth();

  const { isMonitoring, setIsMonitoring } = useMonitoring();

  const {
    setShowResult,
    showResult,
    showPatientForm,
    setShowPatientForm,
    setShowMobileMenu,
    showMobileMenu,
  } = useTab();

  const headers = {
    Authorization: `Bearer ${token}`,
    "content-type": "application/json",
  };

  useEffect(() => {
    if (!authenticated) {
      setAuthenticated(false);
      navigate("/login", { replace: true });
    } else {
      return;
    }
  }, [authenticated]);

  //state variables
  const [thingSpeakData, setThingSpeakData] = useState({
    temperatureVal: 0,
    heartRateVal: 0,
  });

  const [temperature, setTemperature] = useState(0);
  const [heartRate, setHeartRate] = useState(0);

  const [showMenu, setShowMenu] = useState(false);

  const [monitoringMessage, setMonitoringMessage] = useState("");
  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    if (isMonitoring) {
      setMonitoringMessage(`Monitoring ${patientInfo.firstName}'s Health`);
      setBgColor("#134E4A");
    } else {
      setMonitoringMessage("Not Monitoring");
      setBgColor("#F87171");
    }
  }, [isMonitoring]);

  //fetch all patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(apiBase + "/get-patients", {
          method: "GET",
          credentials: "include",
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          setPatients(data);
          localStorage.setItem("patients", JSON.stringify(data));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatients();
  }, [getPatients]);

  //establish socket connection
  useEffect(() => {
    if (socket && isMonitoring) {
      socket.on("sensorData", (responseData) => {
        const { temp, heart } = responseData;
        if (temp !== undefined && heart !== undefined) {
          setThingSpeakData({ temperatureVal: temp, heartRateVal: heart });
          setTemperature((prevTemperature) => responseData.temp);
          setHeartRate((prevHeartRate) => responseData.heart);
        }
      });

      return () => {
        if (socket.readyState === 1) {
          socket.disconnect();
        }
      };
    }
  }, [socket, isMonitoring]);

  //update the patient temp and h/r
  useEffect(() => {
    const updatePatientData = async () => {
      if (isMonitoring) {
        try {
          const data = {
            temp: thingSpeakData.temperatureVal,
            heart: thingSpeakData.heartRateVal,
          };

          const response = await fetch(
            apiBase + `/update-data/${patientInfo._id}`,
            {
              method: "PUT",
              credentials: "include",
              headers,
              body: JSON.stringify(data),
            }
          );
        } catch (error) {
          console.error(error);
        }
      }
    };
    updatePatientData();
  }, [isMonitoring, thingSpeakData]);

  //reset
  const handleReset = () => {
    socket.emit("reset");
  };

  const handleStopMonitoring = () => {
    socket.emit("stop monitoring");
    setIsMonitoring(false);
    setShowResult(true);
    setGetPatients(true);
  };

  //logout
  const handleLogout = async () => {
    try {
      const response = await fetch(apiBase + "/logout/", {
        method: "GET",
        credentials: "include",
        headers,
      });

      if (response.ok) {
        localStorage.clear();
        navigate("/login", { replace: true });
        setIsMonitoring(false);
        setShowResult(false);
        setAuthenticated(false);
        setShowMobileMenu(false);
      }
    } catch {
      console.error("Failed to log out.");
    }
  };

  return (
    <>
      <div className="w-screen h-screen bg-white text-teal-900">
        {showResult && <RenderResult id={patientInfo._id} />}
        <div className="inner-div flex flex-row w-full h-full">
          <Menu />
          {showMobileMenu && <MobileMenu handleLogout={handleLogout} />}

          <div className="w-full h-full overflow-y-auto">
            <div className="w-full h-12 flex justify-start items-center border border-b sticky z-50 bg-white top-0">
              <button
                onClick={() => setShowMobileMenu(true)}
                className="block lg:hidden md:hidden   w-20 h-10 bg-transparent"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
            <div className="px-2">
              <h1 className="mt-2 text-center text-3xl font-extrabold">
                HMonitor- Your Health Monitoring System
              </h1>
              <div
                className="w-full h-auto mt-5 text-white bg-opacity-80 rounded-t-md flex justify-center"
                style={{ backgroundColor: `${bgColor}` }}
              >
                <p>{monitoringMessage}</p>
              </div>
              <div className="w-full flex flex-col-reverse lg:flex-row md:flex-row sm:flex-col-reverse bg-teal-900 bg-opacity-15  rounded-bl-md rounded-br-md shadow-md text-white p-2">
                <div className="w-full lg:w-1/2 md:w-1/2 sm:w-full flex flex-col justify-center">
                  <Card
                    title="Temperature"
                    value={temperature}
                    imgSource="../assets/temperatureGif.gif"
                    imageAlt="temperature icon"
                    symbol="°C"
                    threshold={patientThreshold}
                  />
                  <Card
                    title="Heart Rate"
                    value={heartRate}
                    imgSource="../assets/heartbeatGif.gif"
                    imageAlt="heartbeat icon"
                    symbol="BPM"
                    threshold={patientThreshold}
                  />
                </div>
                <div className="w-full overflow-hidden my-2 md:mx-2 lg:mx-2 md:max-w-1/3 lg:max-w-1/3 lg:w-1/3 md:w-1/3 sm:w-full flex flex-row lg:flex-col md:flex-col sm:flex-row justify-center">
                  <div className="w-1/2 md:w-full lg:w-full relative">
                    <SetThreshold />
                  </div>

                  <div className="w-auto md:w-full lg:w-full flex flex-col justify-between">
                    <button
                      onClick={handleReset}
                      className="btn w-32 xxs:w-20 sm:w-32 md:w-32 lg:w-32  m-2 bg-teal-900 flex justify-center"
                    >
                      Reset
                      <span className="material-symbols-outlined">
                        autorenew
                      </span>
                    </button>
                    <button
                      onClick={handleStopMonitoring}
                      className="btn w-32 xxs:w-20 sm:w-32 md:w-32 lg:w-32  m-2 bg-teal-900 flex justify-center"
                    >
                      End
                      <span className="material-symbols-outlined">stop</span>
                    </button>
                  </div>
                </div>
                <div className="w-full lg:w-auto md:w-auto sm:w-full flex flex-col-reverse lg:flex-row md:flex-row sm:flex-col-reverse">
                  <PatientInformation />
                </div>
              </div>
              <TextBody />
              {showPatientForm && <NewPatientForm />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
