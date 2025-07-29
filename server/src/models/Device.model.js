import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    deviceType: {
      type: String,
      enum: ["esp32", "esp8266", "Arduino", "other"],
      default: "esp32",
      required: true,
    },

    secret: { type: String, required: true, unique: true },

    features: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
    }], // your virtual pins

    data: {
      type: mongoose.Schema.Types.Mixed, // { relay_1: "ON", temperature: 27.8 }
      default: {},
    },
    meta: {
      icon: { type: String },
      color: { type: String },
    },
  },
  { timestamps: true }
);

const Device = mongoose.model('Device', deviceSchema);
export default Device;
