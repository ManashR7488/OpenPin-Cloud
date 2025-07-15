import express from "express";
import os from "os";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config();
import userRoute from "./routes/user.route.js";
import projectRoute from "./routes/prject.route.js";
import deviceRoutes from "./routes/device.route.js";
import featureRoutes from "./routes/feature.route.js";
import connectDB from "./config/db.js";

const app = express();
console.log(process.env.PROJECT_NAME)

const PORT = process.env.PORT || 5000;

const PROJECT_NAME=process.env.PROJECT_NAME
const JWT_SECRET= process.env.JWT_SECRET
const MONGO_URI= process.env.MONGO_URI
const NODE_ENV = process.env.NODE_ENV

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? "https://openpin-cloud.vercel.app" : "http://localhost:5173",
  credentials:true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Hello from OpenPin Express server!");
});

app.use("/api/auth", userRoute);
app.use("/api/projects", projectRoute);
app.use("/api/projects/:projectId/devices", deviceRoutes);
app.use("/api/projects/:projectId/devices/:deviceId/features", featureRoutes);




// Endpoint to receive sensor data from devices

app.post("/api/sensordata", (req, res) => {
  console.log(req.body);

  res.send(`Received sensor data from device `);
});

function printLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        console.log(`Local IP address: ${iface.address}:${PORT}`);
        return iface.address;
      }
    }
  }
  console.log("Local IP address not found.");
  return null;
}

process.env.NODE_ENV === "production" && connectDB();

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
  printLocalIP();
});
