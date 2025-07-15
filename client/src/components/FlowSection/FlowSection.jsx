import React from 'react';
import { FiCpu, FiCloud, FiServer, FiMonitor } from 'react-icons/fi';

export default function FlowSection() {
  const steps = [
    { icon: <FiCpu size={32} />, label: 'Device' },
    { icon: <FiCloud size={32} />, label: 'Broker' },
    { icon: <FiServer size={32} />, label: 'Backend' },
    { icon: <FiMonitor size={32} />, label: 'Dashboard' },
  ];

  return (
    <section className="py-16 bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="mt-2 text-gray-400">
          Data travels from your device to your dashboard in real time.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-6">
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center animate-pulse">
              <div className="p-4 bg-indigo-600 rounded-full">
                {step.icon}
              </div>
              <span className="mt-2 text-sm">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="text-indigo-400 text-2xl">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
