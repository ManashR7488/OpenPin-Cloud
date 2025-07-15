import React from 'react';
import {
  FiBox,
  FiPlay,
  FiCode,
  FiInfo,
  FiServer,
} from 'react-icons/fi';

const cards = [
  {
    title: 'Project Description',
    icon: <FiBox size={28} />,
    content:
      'OpenPin Cloud is a next‑gen IoT platform that lets you connect ESP32, ESP8266, Arduino, and more to a real‑time dashboard via MQTT & WebSockets. Define virtual pins, manage projects & devices, and visualize or control your data from anywhere.',
    gradient: 'from-purple-700 to-indigo-600',
  },
  {
    title: 'Quick Setup',
    icon: <FiPlay size={28} />,
    content: (
      <ol className="list-decimal list-inside space-y-1 text-sm">
        <li>Register & log in to OpenPin Cloud.</li>
        <li>Create a new project in your dashboard.</li>
        <li>Add a device—OpenPin will generate a secret for you.</li>
        <li>Flash your board with our SDK, supplying your Wi‑Fi & secret.</li>
        <li>Watch your device appear live in the dashboard!</li>
      </ol>
    ),
    gradient: 'from-green-600 to-teal-500',
  },
  {
    title: 'SDK Usage',
    icon: <FiCode size={28} />,
    content: (
      <pre className="text-xs overflow-auto whitespace-pre-wrap">
{`#include <OpenPin.h>

OpenPin device;

void setup() {
  device.begin("YOUR_SSID", "YOUR_PASS");
  device.connect("YOUR_SECRET");
}

void loop() {
  float temp = readTemperature();
  device.virtualWrite("temperature", temp);
  device.loop();
}`}
      </pre>
    ),
    gradient: 'from-zinc-500 to-orange-500',
  },
  {
    title: 'About the SDK',
    icon: <FiInfo size={28} />,
    content: (
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li><strong>begin(ssid, pass)</strong>: Init Wi‑Fi & MQTT</li>
        <li><strong>connect(secret)</strong>: Auth & subscribe</li>
        <li><strong>virtualWrite(pin, val)</strong>: Publish data</li>
        <li><strong>virtualRead(pin, cb)</strong>: Handle commands</li>
        <li><strong>loop()</strong>: Keep MQTT alive</li>
      </ul>
    ),
    gradient: 'from-pink-600 to-purple-500',
  },
  {
    title: 'How It Works',
    icon: <FiServer size={28} />,
    content:
      'Device → MQTT Broker → Node.js Bridge → Socket.IO → Frontend Dashboard. Data is published by your board, relayed in real‑time, and visualized instantly.',
    gradient: 'from-blue-600 to-indigo-500',
  },
];

export default function OverviewSection() {
  return (
    <section className="py-20 bg-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto px-6 text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight">
          Platform Overview & Setup Guide
        </h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Everything you need to know to go from zero to a live IoT dashboard—fast.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {cards.map(({ title, icon, content, gradient }, idx) => (
          <div
            key={title}
            className={`
              relative p-6 rounded-3xl shadow-2xl overflow-hidden
              bg-gradient-to-br ${gradient}
              transform hover:scale-105 transition-transform duration-300
              before:absolute before:inset-0 before:bg-white before:opacity-5
            `}
          >
            <div className="relative z-10 flex items-center mb-4">
              <div className={`p-2 bg-white text-zinc-500 bg-opacity-20 rounded-full mr-3 animate-pulse duration-1000`}>
                {icon}
              </div>
              <h3 className="text-2xl font-semibold">{title}</h3>
            </div>
            <div className="relative z-10 text-gray-200 space-y-2">
              {content}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
