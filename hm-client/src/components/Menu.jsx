import React from "react";
import { useNavigate, Link } from "react-router-dom";
import RenderPatients from "./RenderPatients";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import { useMonitoring } from "../contexts/StateContext";
import { useTab } from "../contexts/TabContext";

const apiBase =
  import.meta.env.VITE_ENV === "development"
    ? import.meta.env.VITE_DEV_API_BASE
    : import.meta.env.VITE_PROD_API_BASE;

export default function Menu() {
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
    setShowResult,
    showPatientForm,
    setShowPatientForm,
    setShowMobileMenu,
    showMobileMenu,
  } = useTab();

  const { token } = useAuth();

  const headers = {
    Authorization: `Bearer ${token}`,
    "content-type": "application/json",
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
      }
    } catch {
      console.error("Failed to log out.");
    }
  };
  return (
    <div className="hidden md:flex lg:flex md:flex-col lg:flex-col max-w-80 w-56 bg-teal-900 h-full py-12 px-2 text-cultured">
      <hr className="w-full" />
      <button
        onClick={() => setShowPatientForm(true)}
        className="w-full text-white mt-2 bg-slate-400 bg-opacity-25 flex justify-center whitespace-nowrap"
      >
        new patient <span className="material-symbols-outlined">add</span>
      </button>
      <button className="w-full mt-2 bg-slate-400 bg-opacity-25 flex justify-center whitespace-nowrap">
        <Link className="text-white hover:text-white" to="/home">
          Home
        </Link>
      </button>
      <RenderPatients />
      <button
        onClick={handleLogout}
        className="w-full text-white mt-auto bg-slate-400 bg-opacity-25 flex justify-center whitespace-nowrap self-end"
      >
        Logout
      </button>
    </div>
  );
}
