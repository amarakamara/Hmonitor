import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTab } from "../contexts/TabContext";
import RenderPatients from "./RenderPatients";


export default function MobileMenu(props) {
  const menuRef = useRef(null);

  const { setShowPatientForm, setShowMobileMenu, showMobileMenu } = useTab();

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMobileMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Add listener
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileMenu]);

  return (
    <>
      <div
        ref={menuRef}
        className="flex flex-col absolute shadow-md border-r border-b border-teal-900 left-0 top-0 max-w-80 h-96 z-50 bg-teal-900 px-2 text-cultured"
      >
        <div className="w-full h-12 flex justify-end border-b-2">
          <button
            onClick={() => setShowMobileMenu(false)}
            className="bg-transparent text-white font-extrabold p-0"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <button
          onClick={() => setShowPatientForm(true)}
          className="w-full text-sm mt-2 bg-slate-400 bg-opacity-25 flex justify-center whitespace-nowrap"
        >
          new patient <span className="material-symbols-outlined">add</span>
        </button>
        <button
          onClick={() => setShowMobileMenu(false)}
          className="w-full mt-2 bg-slate-400 bg-opacity-25 flex justify-center whitespace-nowrap"
        >
          <Link className="text-white hover:text-white" to="/home">
            Home
          </Link>
        </button>
        <RenderPatients />
        <button
          onClick={props.handleLogout}
          className="w-full mt-auto mb-2 bg-slate-400 bg-opacity-25 flex justify-center whitespace-nowrap self-end"
        >
          Logout
        </button>
      </div>
    </>
  );
}
