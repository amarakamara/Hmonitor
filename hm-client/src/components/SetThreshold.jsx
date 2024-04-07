import React, { useState, useEffect } from "react";
import { useThreshold } from "../contexts/ThresholdContext";
import { useUser } from "../contexts/UserContext";

export default function SetThreshold() {
  const { patientThreshold, setPatientThreshold } = useThreshold();

  const [threshold, setThreshold] = useState({
    temperatureMax: "",
    temperatureMin: "",
    heartRateMax: "",
    heartRateMin: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setPatientThreshold({
      tempMax: threshold.temperatureMax,
      tempMin: threshold.temperatureMin,
      heartMax: threshold.heartRateMax,
      heartMin: threshold.heartRateMin,
    });
    setThreshold({
      temperatureMax: "",
      temperatureMin: "",
      heartRateMax: "",
      heartRateMin: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setThreshold((prevValue) => ({ ...prevValue, [name]: value }));
  };

  return (
    <form
      className="threshold-form w-full text-teal-900 text-xs bg-teal-900 rounded-md p-2"
      onSubmit={handleSubmit}
    >
      <p className="text-white text-xs">Temperature</p>
      <div className="flex flex-row w-full">
        <input
          className="w-1/2 mr-1"
          onChange={handleChange}
          value={threshold.temperatureMax}
          type="text"
          name="temperatureMax"
          placeholder="Max"
        />
        <input
          className="w-1/2"
          onChange={handleChange}
          value={threshold.temperatureMin}
          type="text"
          name="temperatureMin"
          placeholder="Min"
        />
      </div>
      <p className="text-white text-xs">HeartRate</p>
      <div className="flex  flex-row w-full">
        <input
          className="w-1/2 mr-1"
          onChange={handleChange}
          value={threshold.heartRateMax}
          type="text"
          name="heartRateMax"
          placeholder="Max"
        />
        <input
          className="w-1/2"
          onChange={handleChange}
          value={threshold.heartRateMin}
          type="text"
          name="heartRateMin"
          placeholder="Min"
        />
      </div>
      <button className="w-full p-1 mt-1 bg-white text-teal-900" type="submit">
        Set
      </button>
    </form>
  );
}
