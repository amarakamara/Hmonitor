import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useUser } from "../contexts/UserContext";
import { useMonitoring } from "../contexts/StateContext";
import { useTab } from "../contexts/TabContext";
import { useAuth } from "../contexts/AuthContext";

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

export default function NewPatientForm(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const { isMonitoring, setIsMonitoring } = useMonitoring();
  const { patientInfo, setPatientInfo } = useUser();

  const { token } = useAuth();

  const { setShowPatientForm, setShowResult } = useTab();

  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    weight: "",
    height: "",
  });

  const headers = {
    Authorization: `Bearer ${token}`,
    "content-type": "application/json",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPatientData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleSavePatient = async (event) => {
    event.preventDefault();

    const weight = parseFloat(patientData.weight);
    const height = parseFloat(patientData.height);

    let bmi = 0;
    if (!isNaN(weight) && !isNaN(height) && weight > 0 && height > 0) {
      bmi = Math.round(weight / (height * height));
    } else {
      bmi = 0.0;
    }

    const data = {
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      username: patientData.username,
      weight: weight || 0.0,
      height: height || 0.0,
      bmi,
    };

    try {
      const response = await fetch(apiBase + "/health-data/", {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        setPatientInfo(data);
        localStorage.setItem("patientInfo", JSON.stringify(data));
        setIsMonitoring(true);
        setShowPatientForm(false);
        setShowResult(false);
        if (currentPath !== "/home") {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-screen h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-teal-900 bg-opacity-50">
      <button
        onClick={() => setShowPatientForm(false)}
        className="absolute top-4 right-2 lg:top-6 lg:right-6 sm:top-6 sm:right-6 p-0 bg-transparent text-white font-extrabold"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="flex justify-center items-center h-full">
        <form
          className="form text-center max-w-2/4 w-80 md:w-96 lg:w-96 h-auto rounded-md shadow-md bg-white border border-teal-900 px-4 md:py-10 lg:py-10 py-6"
          onSubmit={handleSavePatient}
        >
          <h1 className="font-extrabold text-xl mb-4">Create A New Patient</h1>
          <input
            className="input rounded-md"
            name="firstName"
            value={patientData.firstName}
            placeholder="Your first name"
            type="text"
            onChange={handleChange}
          />
          <input
            className="input rounded-md"
            name="lastName"
            value={patientData.lastName}
            placeholder="Your last name"
            type="text"
            onChange={handleChange}
          />
          <input
            className="input rounded-md"
            name="username"
            value={patientData.username}
            placeholder="Your email"
            type="email"
            onChange={handleChange}
          />
          <input
            className="input rounded-md"
            name="weight"
            value={patientData.weight}
            placeholder="Your weight in kg (optional) "
            type="text"
            onChange={handleChange}
          />
          <input
            className="input rounded-md"
            name="height"
            value={patientData.height}
            placeholder="Your height  in cm (optional)"
            type="text"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-teal-900 text-white px-4 py-2 rounded-md shadow-md hover:bg-teal-700 transition duration-300"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
