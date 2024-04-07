import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useMonitoring } from "../contexts/StateContext";

export default function PatientCard(props) {
  const { flexWidth } = props;

  const navigate = useNavigate();

  const { setPatients, patients, getPatients, setGetPatients, setPatientInfo } =
    useUser();
  const { isMonitoring, setIsMonitoring } = useMonitoring();

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const handleRemonitor = async () => {
    if (isMonitoring === true) {
      setShowMessage(true);
      return;
    }
    setPatientInfo(props.patient);
    setIsMonitoring(true);
    navigate("/home");
  };

  return (
    <div className="bg-teal-900 bg-opacity-70 h-auto m-2 p-2 font-medium">
      <h1 className="text-xl font-extrabold">
        Patient Name: {props.patient.firstName}
      </h1>
      <hr />
      <div className="w-full h-auto flex justify-left text-red-400">
        {showMessage && (
          <h3 className="text-xs">Another Patient is being Monitored</h3>
        )}
      </div>
      <div className="flex my-1 text-md whitespace-nowrap">
        <p className="mr-2 ">T/P: {props.patient.temperatureValue} °C</p>
        <p className="inline">H/R: {props.patient.heartRate} BPM</p>
      </div>
      <div className="flex flex-col my-1 text-md whitespace-nowrap">
        <p className="mr-2">Weight:{props.patient.weight} kg</p>
        <p className="mr-2">Height:{props.patient.height} ft</p>
        <p className="mr-2">BMI: {props.patient.bmi} kg</p>
      </div>
      <div className="flex flex-row justify-start text-xs mt-2 mb-0">
        <button
          onClick={() => props.onDelete(props.patient._id)}
          className="mr-2 bg-white text-teal-900  px-4 py-1 rounded-md shadow-md  transition duration-300"
        >
          Delete
        </button>
        <button className="mr-2 bg-white text-teal-900  px-4 py-1 rounded-md shadow-md  transition duration-300">
          <Link
            className="text-teal-900"
            to={`/email-share/${props.patient._id}/${props.patient.firstName}`}
          >
            Share
          </Link>
        </button>
        <button
          onClick={handleRemonitor}
          className=" bg-white text-teal-900  px-4 py-1 rounded-md shadow-md  transition duration-300"
        >
          Monitor
        </button>
      </div>
    </div>
  );
}
