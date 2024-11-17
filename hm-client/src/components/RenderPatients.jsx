import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useTab } from "../contexts/TabContext";

export default function RenderPatients(props) {
  const { patients } = useUser();
  const { setShowMobileMenu } = useTab();
  const lastThreePatients = patients.slice(-3);

  return (
    <div className="mt-auto">
      <h2 className="text-sm font-bold bg-white mb-1 text-teal-900">
        Recent Patients
      </h2>

      <ul className="text-xs">
        {patients.length === 0 && (
          <li className="bg-white text-center bg-opacity-15">
            <h3>No Patients Yet</h3>
          </li>
        )}
        {lastThreePatients.map((patient) => (
          <li
            className="bg-white px-1 text-white bg-opacity-15"
            key={patient._id}
          >
            <h3>Name:{patient.firstName}</h3>
            <div className="flex flex-row text-left">
              <p className="mr-1">Temp: {patient.temperatureValue}</p>
              <p>HeartRate: {patient.heartRate}</p>
            </div>
            <hr />
          </li>
        ))}
      </ul>
      <button
        onClick={() => setShowMobileMenu(false)}
        className="w-full p-1 rounded-none text-xs mt-auto mb-2 bg-slate-400 bg-opacity-25 flex justify-center whitespace-nowrap self-end"
      >
        <Link className="text-red-400 hover:text-red-400" to="/all-patients">
          See All Patients
        </Link>
        <span className="text-red-400 material-symbols-outlined text-xs">
          arrow_forward
        </span>
      </button>
    </div>
  );
}
