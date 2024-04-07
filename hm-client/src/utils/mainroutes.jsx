import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "../components/App";
import EmailShare from "../pages/EmailShare";
import Login from "../pages/Login";
import EmailSent from "../pages/EmailSent";
import AllPatients from "../pages/AllPatients";
import "../index.css";
import PrivateRoute from "./PrivateRoute";
export default function MainRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<App />} />
      </Route>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/email-share/:id/:username" element={<EmailShare />} />
      <Route path="/email-sent/:status" element={<EmailSent />} />
      <Route path="/all-patients/" element={<AllPatients />} />
    </Routes>
  );
}
