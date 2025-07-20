import express from "express";
import http from "http";
import { Server } from "socket.io";
import mqtt from "mqtt";
import mongoose from "mongoose";
import Device from "./models/Device.model.js";
import Feature from "./models/Feature.model.js";

// … import other routes, middleware, etc.

const app = express();

// Create HTTP + Socket.IO server
const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: "*" },
  path: "/api/socket.io",
});

// --- MQTT Bridge ---
const mqttClient = mqtt.connect(
  process.env.MQTT_BROKER_URL || "mqtt://broker.emqx.io"
);

mqttClient.on("connect", () => {
  mqttClient.subscribe("openpin/+/fromDevice");
  // console.log("✅ Connected to MQTT broker");
});

mqttClient.on("message", async (topic, message) => {
  // topic format: openpin/{secret}/fromDevice
  const [, secret, dir] = topic.split("/");
  if (dir !== "fromDevice") return;

  let payload;
  try {
    payload = JSON.parse(message.toString());
  } catch (e) {
    console.error("Invalid JSON:", e);
    return;
  }

  // 1) Find the device by secret
  const device = await Device.findOne({ secret }).populate("features");
  // console.log(device)
  if (!device) {
    // console.warn(`No device found for secret ${secret}`);
    return;
  }

  const feature = await Feature.findOne({
    deviceId: device._id,
    key: payload.key,
  });

  if (feature) {
    feature.value = payload.value;
    await feature.save();
    // console.log(`✔️ Feature ${feature.key} updated to ${payload.value}`);
  } else {
    console
      .warn
      // `No feature matching key="${payload.key}" on device ${device._id}`
      ();
  }

  // 3) Update its latest data in DB
  device.data = { ...device.data, [payload.key]: payload.value };
  await device.save();

  io.to(secret).emit("dataUpdate", { data: device.data });

  // console.log(`[MQTT→WS] ${secret}: ${payload.key} = ${payload.value}`);
});

// --- Socket.IO connection handling ---
io.on("connection", (socket) => {
  // console.log("🔌 Client connected:", socket.id);

  socket.on("register", ({ secret }) => {
    socket.join(secret);
    // console.log(`📥 Socket ${socket.id} joined room ${secret}`);
  });

  socket.on("control", ({ secret, key, value }) => {
    // Relay control back to device via MQTT
    const topic = `openpin/${secret}/toDevice`;
    const msg = JSON.stringify({ key, value });
    mqttClient.publish(topic, msg);
    // console.log(`[WS→MQTT] ${secret}: ${key} = ${value}`);
  });

  socket.on("disconnect", () => {
    // console.log("🔌 Client disconnected:", socket.id);
  });
});

export { app, server };
