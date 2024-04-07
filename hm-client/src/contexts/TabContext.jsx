// UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const TabContext = createContext();

export function useTab() {
  return useContext(TabContext);
}

export function TabContextProvider(props) {
  const [showResult, setShowResult] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const values = {
    showResult,
    setShowResult,
    showPatientForm,
    setShowPatientForm,
    showMobileMenu,
    setShowMobileMenu,
  };

  return (
    <TabContext.Provider value={values}>{props.children}</TabContext.Provider>
  );
}
