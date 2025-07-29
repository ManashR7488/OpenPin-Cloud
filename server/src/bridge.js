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
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://openpin-cloud.vercel.app"
        : "http://localhost:5173",
  },
  path: "/api/socket.io",
});

// --- MQTT Bridge ---
const mqttClient = mqtt.connect(
  process.env.MQTT_BROKER_URL || "mqtt://broker.emqx.io"
);

mqttClient.on("connect", () => {
  console.log("✅ Connected to MQTT broker");

  // 1) Listen for device connect requests
  mqttClient.subscribe("openpin/+/connect");

  // 2) Listen for device subscribe requests
  mqttClient.subscribe("openpin/+/subscribe");

  // 3) Listen for telemetry from device
  mqttClient.subscribe("openpin/+/fromDevice");

  // 4) Listen for device status
  mqttClient.subscribe("openpin/+/status");
});

mqttClient.on("message", async (topic, message) => {
  const parts = topic.split("/");
  // topic = openpin/{secret}/{action}
  const [, secret, action] = parts;
  const payload = message.toString();

  if (action === "status") {
    // payload is "online" or "offline"
    io.to(secret).emit("deviceStatus", { secret, status: payload });
    console.log(`🔔 Device ${secret} is now ${payload}`);
    return;
  }

  // ===== 1) CONNECT HANDSHAKE =====
  if (action === "connect") {
    const device = await Device.findOne({ secret });
    const ackTopic = `openpin/${secret}/connect/ack`;

    if (device) {
      console.log(`Handshake OK: device ${device._id} online`);
      io.to(secret).emit("deviceStatus", { secret, status: "online" });
      mqttClient.publish(ackTopic, JSON.stringify({ status: "ok" }));
    } else {
      console.warn(`Handshake FAILED: unknown token ${secret}`);
      mqttClient.publish(ackTopic, JSON.stringify({ status: "error" }));
    }
    return;
  }

  // ===== 2) SUBSCRIBE HANDSHAKE =====
  if (action === "subscribe") {
    let req;
    try {
      req = JSON.parse(payload);
    } catch (e) {
      console.warn("Bad JSON on subscribe request:", payload);
      return;
    }
    const { key } = req;
    const ackTopic = `openpin/${secret}/subscribe/ack`;

    const device = await Device.findOne({ secret });
    const feature = device
      ? await Feature.findOne({ deviceId: device._id, key })
      : null;

    if (device && feature) {
      console.log(`Subscribe OK: device ${device._id} → key ${key}`);
      mqttClient.publish(ackTopic, JSON.stringify({ key }));
    } else {
      console.warn(
        `Subscribe FAILED: token=${secret} key=${key}`
      );
      mqttClient.publish(
        ackTopic,
        JSON.stringify({ key, error: "unauthorized" })
      );
    }
    return;
  }

  // ===== 3) TELEMETRY FROM DEVICE =====
  if (action === "fromDevice") {
    let data;
    try {
      data = JSON.parse(payload);
    } catch (e) {
      console.warn("Bad JSON on fromDevice:", payload);
      return;
    }
    const { key, value } = data;

    const device = await Device.findOne({ secret });
    if (!device) return;

    const feature = await Feature.findOne({
      deviceId: device._id,
      key,
    });
    if (!feature) return;

    // Update feature in MongoDB
    feature.value = value;
    await feature.save();

    // Optionally keep a flat data map on the device
    device.data = { ...device.data, [key]: value };
    await device.save();

    // Emit to Socket.IO clients
    io.to(secret).emit("dataUpdate", { data: device.data });
    console.log(`[MQTT→WS] ${secret}: ${key} = ${value}`);
    return;
  }
});

// --- Socket.IO connection handling ---
io.on("connection", (socket) => {
  socket.on("register", ({ secret }) => {
    socket.join(secret);
  });

  // Client requests to control a pin
  socket.on("control", async ({ secret, key, value }) => {
    // 1) Publish control over MQTT
    const topic = `openpin/${secret}/toDevice`;
    mqttClient.publish(topic, JSON.stringify({ key, value }));

    // 2) Mirror in MongoDB
    const device = await Device.findOne({ secret });
    if (!device) return;

    const feature = await Feature.findOne({
      deviceId: device._id,
      key,
    });
    if (feature) {
      feature.value = value;
      await feature.save();
    }
  });

  socket.on("disconnect", () => {
    // Optionally mark device offline here if you track socket→device mapping
  });
});

export { app, server };
