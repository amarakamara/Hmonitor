import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  temperatureValue: Number,
  heartRate: Number,
  username: String,
  weight: Number,
  height: Number,
  bmi: Number,
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
