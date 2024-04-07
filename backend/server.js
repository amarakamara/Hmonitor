import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import pkg from "mongoose";
const { ServerApiVersion } = pkg;
import passport from "passport";
import cors from "cors";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
//const passportLocalMongoose = require("passport-local-mongoose");
import passportLocalMongoose from "passport-local-mongoose";

const thingSpeakChannel = process.env.CHANNEL_ID;
const thingSpeakReadKey = process.env.READ_KEY;
const port = process.env.PORT || 3001;

import sendEmail from "./utils/sendMail.js";

// Express config
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Mongo Connection
const uri = process.env.MONGO_URI;

mongoose.set("strictQuery", true);

mongoose
  .connect(uri, {
    serverApi: {
      version: "1",
      deprecationErrors: true,
    },
  })
  .then(() => {
    console.log("connected to dB");
  })
  .catch((err) => {
    console.error(err);
  });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const devOrigin = "http://localhost:4000";

const prodOrigin = process.env.PROD_ORIGIN;

// Routes
const options = {
  origin: process.env.NODE_ENV === "development" ? devOrigin : prodOrigin,
  credentials: true,
  exposedHeaders: ["Authorization"],
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(options));

import Admin from "./models/admin.js";
import Patient from "./models/patient.js";

// Passport config
passport.use(Admin.createStrategy());

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
// socket.io connection
io.on("connection", (socket) => {
  let temp = 0;
  let heart = 0;

  const fetchThingSpeakData = async () => {
    try {
      const response = await fetch(
        `https://api.thingspeak.com/channels/${thingSpeakChannel}/feeds.json?api_key=${thingSpeakReadKey}&results=1`,
        { method: "GET" }
      );

      const responseData = await response.json();

      temp = parseInt(responseData.feeds[0].field1);
      heart = parseInt(responseData.feeds[0].field2);

      const data = {
        temp,
        heart,
      };
      console.log(data);
      socket.emit("sensorData", data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchThingSpeakData();

  const intervalId = setInterval(fetchThingSpeakData, 9000);

  // Handle recalibrate event
  socket.on("reset", () => {
    temp = 0;
    heart = 0;
    console.log("Sensors recalibrated");
    const data = {
      temp,
      heart,
    };
    socket.emit("sensorData", data);
    fetchThingSpeakData();
  });

  // Handle stop monitoring event
  socket.on("stop monitoring", () => {
    console.log("Monitoring stopped by user");
    socket.disconnect();
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    clearInterval(intervalId);
  });
});

//Admin Register Route

/**Register*/

const registerAdmin = async () => {
  const adminAccount = {
    username: "##$$$###",
    name: "Admin",
    password: "#######",
  };

  try {
    await Admin.register(adminAccount, adminAccount.password, (err, user) => {
      if (err) {
        console.error(err);
      }
      /* const token = jwt.sign({ _id: user._id }, jwtSecret, {
        expiresIn: "1d",
      });*/
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong, try again.",
    });
  }
};

//registerAdmin();

//Login
app.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) {
      console.log("Error in authentication");
      return res.status(500).json({
        message: "Something went wrong, try again.",
        authenticated: false,
      });
    }
    if (!user) {
      return res.status(401).json({
        authenticated: false,
      });
    }

    const token = jwt.sign({ _id: user._id }, jwtSecret, {
      expiresIn: "24h",
    });

    res.status(200).json({
      user: user,
      authenticated: true,
      token: token,
    });
  })(req, res, next);
});

//Admin logout Route
app.get("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

//Store sensor data to database
app.post("/health-data", verifyToken, async (req, res) => {
  const { firstName, lastName, username, weight, height, bmi } = req.body;

  try {
    const newPatient = new Patient({
      firstName,
      lastName,
      username,
      weight,
      height,
      bmi,
    });

    await newPatient.save();
    console.log(`Patient ${username} added`);
    res.status(200).json(newPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add patient" });
  }
});

//update patient data

app.put("/update-data/:id", verifyToken, async (req, res) => {
  try {
    const { temp, heart } = req.body;

    const updatedPatient = await Patient.findOne({ _id: req.params.id });

    if (!updatedPatient) {
      return res.status(404).send("No user found");
    }

    updatedPatient.temperatureValue = temp;
    updatedPatient.heartRate = heart;
    await updatedPatient.save();
    res.status(200).send("Value updated");
  } catch (err) {
    res.status(400).send(err);
  }
});

//return sensor data
app.get("/patient-data/:id", verifyToken, async (req, res) => {
  const userId = req.params.id;
  console.log("Id sent for getting info:", userId);
  try {
    const patientData = await Patient.findOne({ _id: userId });

    if (!patientData) {
      return res.status(404).json("No patient with that ID exists.");
    }

    res.status(200).json(patientData);
  } catch (error) {
    console.error(error);
  }
});

//get all patients
app.get("/get-patients", verifyToken, async (req, res) => {
  try {
    const patients = await Patient.find();
    return res.status(200).json(patients);
  } catch (error) {
    console.error("Error while fetching patients:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//Delete patient

app.delete("/delete-patient/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    const deletedPatient = await Patient.findOneAndDelete({ _id: id });

    if (!deletedPatient) {
      return res
        .status(404)
        .json({ message: "No patient with that ID exists." });
    }

    return res.status(200).json({
      message: "Patient deleted successfully",
      id: deletedPatient._id,
    });
  } catch (error) {
    console.error("Error while deleting patient:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//Share sensor data to email
app.post("/share-data/:id", verifyToken, async (req, res) => {
  const { recipientmail, recipientname, checked } = req.body;

  const patientId = req.params.id;

  const patient = await Patient.findOne({ _id: patientId });

  let recipients = [];

  if (!patient) {
    return res.status(201).json("No patient with that ID exists.");
  }

  if (checked) {
    recipients.push(recipientmail, patient.email);
  } else {
    recipients.push(recipientmail);
  }

  const mailOptions = {
    user: process.env.MY_EMAIL,
    password: process.env.MY_PASSWORD,
    from: process.env.MY_EMAIL,
    to: recipients,
    subject: `${patient.firstName}'s health data.`,
    text: `Hi,
      We monitored ${patient.firstName}"s health and here is the result for their temperature and heart rate:
      Temperature Value: ${patient.temperatureValue}
      Heart Rate: ${patient.heartRate},`,
  };

  try {
    await sendEmail(mailOptions);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

//verify token

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  jwt.verify(token.split(" ")[1], jwtSecret, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    next();
  });
}

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
