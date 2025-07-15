import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g., "relay_1", "temp"
  name: { type: String, required: true }, // Display label: "Light 1"
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "switch",
      "light",
      "relay",
      "fan",
      "temperature",
      "humidity",
      "gas",
      "sensor",
    ],
    required: true,
  },
  value: mongoose.Schema.Types.Mixed, // true / false / number / string
  unit: { type: String }, // optional: "°C", "ppm"
  pin: { type: Number }, // optional: GPIO pin
});

const Feature = mongoose.model("Feature", featureSchema);
export default Feature;
