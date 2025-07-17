import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import axios from "../../config/axios.configer";
import {
  FiBox,
  FiCloud,
  FiCode,
  FiZap,
  FiBookOpen,
  FiUsers,
  FiFolder,
  FiCheckCircle,
  FiXCircle,
  FiPlayCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [projectCount, setProjectCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [deviceStats, setDeviceStats] = useState({ online: 0, offline: 0 });

  // Fetch project count for overview
  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await axios.get("/api/projects");
        setProjectCount(res.data.projects.length);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    }
    fetchCount();

    // Fetch recent projects
    axios.get('/api/projects?limit=3')
      .then(res => setProjects(res.data.projects))
      .catch(console.error);

    // Fetch device status summary
    axios.get('/api/devices/status-summary')
      .then(res => setDeviceStats(res.data))
      .catch(console.error);

  }, []);

  const sections = [
    {
      title: "Your Projects",
      icon: <FiBox size={28} className="text-blue-500" />,
      content: `${projectCount} project${
        projectCount !== 1 ? "s" : ""
      } created`,
      link: { to: "/app/projects", label: "Manage Projects" },
      gradient: "from-blue-100 to-blue-50",
    },
    {
      title: "Cloud & Devices",
      icon: <FiCloud size={28} className="text-green-500" />,
      content:
        "Connect your ESP32/ESP8266 via MQTT to broker.emqx.io and manage data in real time.",
      link: { to: "/app/devices", label: "View Devices" },
      gradient: "from-green-100 to-green-50",
    },
    {
      title: "SDK & Code",
      icon: <FiCode size={28} className="text-purple-500" />,
      content:
        "Use OpenPin.h: begin(), connect(), virtualWrite(), virtualRead(), loop()—get started in minutes.",
      link: { to: "/app/settings", label: "SDK Settings" },
      gradient: "from-purple-100 to-purple-50",
    },
    {
      title: "Quick Actions",
      icon: <FiZap size={28} className="text-yellow-500" />,
      content:
        "Create, update, and delete projects/devices. Explore credentials and integrations.",
      link: { to: "/app/credentials", label: "Manage API Keys" },
      gradient: "from-yellow-100 to-yellow-50",
    },
  ];

  return (
    <div className="p-6">
      {/* Greeting */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome back{user ? `, ${user?.name?.split(" ")[0]} ${user?.name?.split(" ")[1]}` : ""}!
      </h1>
      <p className="text-gray-600 mb-8">
        Here’s a quick overview of your OpenPin Cloud workspace.
      </p>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map(({ title, icon, content, link, gradient }) => (
          <div
            key={title}
            className={`p-6 rounded-lg shadow hover:shadow-md transition bg-gradient-to-br ${gradient}`}
          >
            <div className="flex items-center mb-3">
              <div className="p-2 bg-white rounded-full mr-3">{icon}</div>
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            </div>
            <p className="text-gray-700 mb-4 text-sm">{content}</p>
            <a
              href={link.to}
              className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
            >
              {link.label} →
            </a>
          </div>
        ))}
      </div>

      {/* Additional Guidance */}
      <div className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Getting Started
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>Create a Project</strong> to group your devices and data.
          </li>
          <li>
            <strong>Add Devices</strong> to your project—OpenPin will generate a
            secret.
          </li>
          <li>
            <strong>Flash Your Board</strong> with OpenPin SDK and provide SSID
            & secret.
          </li>
          <li>
            <strong>Open the Dashboard</strong> to see your data live—no extra
            setup required.
          </li>
        </ul>
      </div>

      {/* New Section: Resources & Documentation */}
      <div className="mt-12 max-w">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Resources & Documentation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <Link
            to="/app/settings#sdk"
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <FiCode className="text-purple-500 mr-4" size={24} />
            <div>
              <h3 className="font-semibold text-gray-800">SDK Reference</h3>
              <p className="text-gray-600 text-sm">API docs & code samples</p>
            </div>
          </Link>
          <a
            href="https://github.com/your-org/openpin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <FiBookOpen className="text-blue-500 mr-4" size={24} />
            <div>
              <h3 className="font-semibold text-gray-800">GitHub Repo</h3>
              <p className="text-gray-600 text-sm">
                Source code & issue tracker
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* New Section: Community & Support */}
      <div className="mt-12 max-w">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Community & Support
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a
            href="https://discord.gg/your-invite"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <FiUsers className="text-teal-500 mr-4" size={24} />
            <div>
              <h3 className="font-semibold text-gray-800">Join Discord</h3>
              <p className="text-gray-600 text-sm">Chat with the community</p>
            </div>
          </a>
          <Link
            to="/app/credentials#support"
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <FiCloud className="text-green-500 mr-4" size={24} />
            <div>
              <h3 className="font-semibold text-gray-800">Support Center</h3>
              <p className="text-gray-600 text-sm">
                Open a ticket or browse FAQs
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <section className="my-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Recent Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {projects.length ? (
            projects.map((proj) => (
              <Link
                key={proj._id}
                to={`/app/projects/${proj._id}`}
                className="
                  relative overflow-hidden rounded-2xl
                  bg-gradient-to-br from-indigo-100 to-indigo-50
                  shadow-lg transform hover:scale-105 transition
                "
              >
                {/* Decorative overlay */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200 opacity-30 rounded-full animate-pulse"></div>

                <div className="relative z-10 p-6 flex flex-col items-start">
                  <div className="p-3 bg-white rounded-full mb-4 shadow">
                    <FiFolder className="text-indigo-500" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {proj.name}
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    {proj.devices.length} device
                    {proj.devices.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-600">No recent projects.</p>
          )}
        </div>
      </section>

      {/* Device Status Summary */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Device Status Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              count: deviceStats.online,
              label: 'Online Devices',
              icon: <FiCheckCircle size={32} className="text-green-500" />,
              gradient: 'from-green-100 to-green-50'
            },
            {
              count: deviceStats.offline,
              label: 'Offline Devices',
              icon: <FiXCircle size={32} className="text-red-500" />,
              gradient: 'from-red-100 to-red-50'
            }
          ].map((stat) => (
            <div
              key={stat.label}
              className={`
                relative overflow-hidden rounded-2xl
                bg-gradient-to-br ${stat.gradient}
                shadow-lg transform hover:scale-105 transition
              `}
            >
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-20 rounded-full animate-pulse"></div>
              <div className="relative z-10 p-6 flex items-center">
                <div className="p-3 bg-white rounded-full shadow mr-4">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.count}
                  </p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Tutorials */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Video Tutorials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { id: 'dQw4w9WgXcQ', title: 'Getting Started' },
            { id: '3JZ_D3ELwOQ', title: 'Advanced SDK' }
          ].map((vid) => (
            <a
              key={vid.id}
              href={`https://youtu.be/${vid.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                relative overflow-hidden rounded-2xl
                bg-gradient-to-br from-yellow-100 to-yellow-50
                shadow-lg transform hover:scale-105 transition
              "
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-200 opacity-20 rounded-full animate-pulse"></div>
              <div className="relative z-10 p-6 flex items-center">
                <FiPlayCircle className="text-yellow-500 mr-4" size={28} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {vid.title}
                  </h3>
                  <p className="text-gray-600 text-sm">Watch on YouTube</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
