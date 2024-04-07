import React, { useEffect } from "react";
import { useUser } from "../contexts/UserContext";

export default function PatientInformation(props) {
  const { patientInfo, setPatientInfo } = useUser();

  useEffect(() => {
    setPatientInfo(patientInfo);
  }, [patientInfo]);

  return (
    <div className="px-2 flex flex-row lg:flex-col md:flex-col sm:flex-row items-center w-full lg:w-1/2 md:w-1/1 sm:w-full bg-teal-900 shadow-md hover:shadow-lg transition duration-300 rounded-lg overflow-hidden">
      <div className="w-full h-1/1 mt-2 flex justify-center">
        <img
          className="w-24 object-cover"
          src="/assets/human.png"
          alt="human body"
        />
      </div>
      <div className="w-full h-auto flex flex-col justify-center md:items-center lg:items-center p-0">
        <h2 className="text-xl font-bold whitespace-nowrap">Patient Info</h2>
        <div className="w-5/6 h-0.5 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full shadow-lg">
          <hr className="h-0.5 bg-transparent animate-pulse" />
        </div>
        <div className="text-left md:ml-2 lg:ml-2">
          <h4 className="mt-2 md:mt-0 lg:mt-0 text-md text-left lg:text-center font-extrabold">
            Name: <span className="inline ml-6">{patientInfo.firstName}</span>
          </h4>
          <div className="flex flex-col justify-between md:flex-row lg:flex-row my-2 text-md md:text-xs lg:text-xs">
            <h4 className="font-semibold whitespace-nowrap md:mr-4 lg:mr-4">
              W: {patientInfo.weight}kg
            </h4>
            <h4 className="font-semibold whitespace-nowrap md:mr-4 lg:mr-4">
              H: {patientInfo.height}ft
            </h4>
            <h4 className="font-semibold whitespace-nowrap md:mr-4 lg:mr-4">
              BMI: {patientInfo.bmi} kg
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
