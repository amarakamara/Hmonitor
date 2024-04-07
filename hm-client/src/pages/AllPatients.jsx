import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import { useMonitoring } from "../contexts/StateContext";
import { useTab } from "../contexts/TabContext";
import PatientInformation from "../components/PatientInformation";
import MobileMenu from "../components/MobileMenu";
import RenderPatients from "../components/RenderPatients";
import PatientCard from "../components/PatientCard";
import Menu from "../components/Menu";
import NewPatientForm from "../components/NewPatientForm";

import "../index.css";

const apiBase =
  import.meta.env.VITE_ENV === "development"
    ? import.meta.env.VITE_DEV_API_BASE
    : import.meta.env.VITE_PROD_API_BASE;

function AllPatients() {
  const { token } = useAuth();

  const navigate = useNavigate();

  const {
    patientInfo,
    setPatientInfo,
    setPatients,
    patients,
    getPatients,
    setGetPatients,
  } = useUser();

  const { isMonitoring, setIsMonitoring } = useMonitoring();

  const {
    showPatientForm,
    setShowPatientForm,
    setShowMobileMenu,
    showMobileMenu,
  } = useTab();

  const [thingSpeakData, setThingSpeakData] = useState({
    temperatureVal: 0,
    heartRateVal: 0,
  });

  const [temperature, setTemperature] = useState(0);
  const [heartRate, setHeartRate] = useState(0);

  const [showMenu, setShowMenu] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
    "content-type": "application/json",
  };

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
      }
    } catch {
      console.error("Failed to log out.");
    }
  };
  //Fetch patients on delete
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
          setGetPatients(false);
          localStorage.setItem("patients", JSON.stringify(data));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatients();
  }, [setPatients, getPatients]);

  const handleDeletePatient = async (patientId) => {
    try {
      const response = await fetch(apiBase + `/delete-patient/${patientId}`, {
        method: "DELETE",
        credentials: "include",
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        const deletedPatientId = data.id;

        setPatients(patients.filter(() => patientId !== deletedPatientId));
        if (deletedPatientId === patientInfo._id) {
          setPatientInfo({});
        }
        setGetPatients(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-screen h-screen overflow-hidden bg-white text-teal-900">
        <div className="inner-div flex flex-row w-full h-full">
          <Menu />
          {showMobileMenu && <MobileMenu handleLogout={handleLogout} />}

          <div className="w-full h-full overflow-y-auto">
            <div className="sticky top-0 bg-white z-40">
              <div className="w-full h-12 flex justify-start items-center border border-b">
                <button
                  onClick={() => setShowMobileMenu(true)}
                  className="block lg:hidden md:hidden w-20 h-10 bg-transparent"
                >
                  <span className="material-symbols-outlined">menu</span>
                </button>
              </div>
              <div className="text-center w-full h-12 border border-b">
                <h1 className="mt-2 text-3xl font-extrabold">
                  Patients Record
                </h1>
              </div>
            </div>
            <div className="my-flexbox w-full mt-4 text-white overflow-y-scroll no-scrollbar">
              {patients.map((patient) => (
                <PatientCard
                  key={patient._id}
                  patient={patient}
                  onDelete={handleDeletePatient}
                />
              ))}
            </div>
            {showPatientForm && <NewPatientForm />}
          </div>
        </div>
        <PatientInformation />
      </div>
    </>
  );
}

export default AllPatients;
