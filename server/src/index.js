import express from "express";
import os from "os";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import userRoute from "./routes/user.route.js";
import projectRoute from "./routes/prject.route.js";
import deviceRoutes from "./routes/device.route.js";
import featureRoutes from "./routes/feature.route.js";
import connectDB from "./config/db.js";
import { app, server } from "./bridge.js";

// const app = express();
console.log(process.env.PROJECT_NAME);

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://openpin-cloud.vercel.app"
        : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

process.env.NODE_ENV === "production" && (await connectDB()); // in production we connect to database first.

app.get("/", (req, res) => {
  res.send("Hello from OpenPin Express server!");
});

app.use("/api/auth", userRoute);
app.use("/api/projects", projectRoute);
app.use("/api/projects/:projectId/devices", deviceRoutes);
app.use("/api/projects/:projectId/devices/:deviceId/features", featureRoutes);

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });
}

server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
  printLocalIP();
});
