// src/pages/Home/Home.jsx
import React from "react";
import {
  FiArrowRight,
  FiPlus,
  FiLayers,
} from "react-icons/fi";
import { SiArduino, SiEspressif } from "react-icons/si";

import { Link } from "react-router-dom";
import FlowSection from "../../components/FlowSection/FlowSection";
import OverviewSection from "../../components/Overview/OverviewSection";

const supportedDevices = [
  { name: "Arduino", icon: <SiArduino size={32} /> },
  { name: "ESP32", icon: <SiEspressif size={32} /> },
  { name: "ESP8266", icon: <SiEspressif size={32} /> },
  { name: "Other", icon: <FiPlus size={32} /> },
];

const features = [
  {
    title: "Real–Time Dashboard",
    desc: "Live updates via MQTT & WebSocket",
    icon: <FiLayers size={24} />,
  },
  {
    title: "Easy Setup",
    desc: "Zero–config device onboarding",
    icon: <FiArrowRight size={24} />,
  },
  {
    title: "Customizable UI",
    desc: "Drag‑and‑drop widgets & themes",
    icon: <FiPlus size={24} />,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="w-full flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold flex flex-col items-start">
          <h1>OpenPin</h1>
          <h1 className="text-[10px] font-[200] self-end ml-10">Powered By MR</h1>
        </div>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-transparent border border-gray-500 hover:border-gray-400 rounded-full text-gray-200 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            to="/app"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col-reverse lg:flex-row items-center max-w-6xl mx-auto px-6 py-16 gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">
            Build{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
              next‑gen
            </span>{" "}
            IoT Clouds
          </h1>
          <p className="text-gray-300 text-lg">
            OpenPin Cloud gives you instant real‑time control and monitoring of
            your IoT devices—no boilerplate, fully open‑source.
          </p>
          <div className="space-x-4">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-semibold transition">
              Get Started
            </button>
            <button className="px-6 py-3 border border-gray-500 hover:border-gray-400 rounded-full transition">
              Learn More
            </button>
          </div>
        </div>
        <div className="flex-1">
          {/* Placeholder for an illustration */}
          <div className="w-full h-64 lg:h-80 bg-gradient-to-tr from-indigo-700 to-purple-800 rounded-2xl shadow-xl" />
        </div>
      </section>

      {/* Supported Devices */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold">Supported Devices</h2>
          <div className="flex justify-center gap-12 mt-8">
            {supportedDevices.map((d) => (
              <div
                key={d.name}
                className="flex flex-col items-center space-y-2"
              >
                <div className="p-4 bg-gray-800 rounded-xl">{d.icon}</div>
                <span className="text-gray-200">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <h2 className="text-3xl font-bold text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 bg-gray-700 rounded-2xl hover:bg-gray-600 transition"
              >
                <div className="p-3 inline-block bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-gray-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold">
            Ready to power your IoT vision?
          </h2>
          <button className="mt-6 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-semibold transition">
            Start Your Free Trial
          </button>
        </div>
      </section>

      <OverviewSection />

      {/* How It Works Flow */}
      <FlowSection />
      <footer className="bg-gray-800 text-gray-400 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          {/* Left: Copyright */}
          <div className="text-sm">
            &copy; {new Date().getFullYear()} OpenPin. All rights reserved.
          </div>

          {/* Right: Links */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="https://github.com/your-org/openpin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              GitHub
            </a>
            <a href="/terms" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
