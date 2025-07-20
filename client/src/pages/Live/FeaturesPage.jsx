// client/src/pages/Live/FeaturesPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFeatureStore from "../../store/useFeatureStore";
import useLiveStore from "../../store/useLiveStore";
import {
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiSun,
  FiWind,
  FiDroplet,
  FiZap,
  FiThermometer,
  FiActivity,
} from "react-icons/fi";
import PowerSwitch from "../../components/PowerSwitch/PowerSwitch";

export default function FeaturesPage() {
  const { pid: projectId, did: deviceId } = useParams();
  const {
    currentDevice,
    features,
    loading,
    error,
    fetchDevice,
    fetchFeatures,
    addFeature,
    updateFeature,
    deleteFeature,
    setFeatureValue,
  } = useFeatureStore();
  const { liveData, connect, disconnect, sendControl } = useLiveStore();

  const [showNew, setShowNew] = useState(false);
  const [newFeat, setNewFeat] = useState({ key: "", name: "", type: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", type: "" });

  // Theme config for feature types
  // Theme config for feature types
  const themes = {
    light: {
      pulse: "bg-yellow-100",
      iconBg: "bg-yellow-200",
      iconColor: "text-yellow-600",
      accent: "bg-yellow-50",
      button: "bg-yellow-500 hover:bg-yellow-600",
      butRing: "ring-yellow-300 hover:ring-yellow-400",
      text: "text-yellow-600",
    },
    switch: {
      pulse: "bg-blue-100",
      iconBg: "bg-blue-200",
      iconColor: "text-blue-600",
      accent: "bg-blue-50",
      button: "bg-blue-500 hover:bg-blue-600",
      butRing: "ring-blue-300 hover:ring-blue-400",
      text: "text-blue-600",
    },
    relay: {
      pulse: "bg-red-100",
      iconBg: "bg-red-200",
      iconColor: "text-red-600",
      accent: "bg-red-50",
      button: "bg-red-500 hover:bg-red-600",
      butRing: "ring-red-300 hover:ring-red-400",
      text: "text-red-600",
    },
    fan: {
      pulse: "bg-green-100",
      iconBg: "bg-green-200",
      iconColor: "text-green-600",
      accent: "bg-green-50",
      button: "bg-green-500 hover:bg-green-600",
      butRing: "ring-green-300 hover:ring-green-400",
      text: "text-green-600",
    },
    temperature: {
      pulse: "bg-orange-100",
      iconBg: "bg-orange-200",
      iconColor: "text-orange-600",
      accent: "bg-orange-50",
      button: "bg-orange-500 hover:bg-orange-600",
      butRing: "ring-orange-300 hover:ring-orange-400",
      text: "text-orange-300",
    },
    humidity: {
      pulse: "bg-teal-100",
      iconBg: "bg-teal-200",
      iconColor: "text-teal-600",
      accent: "bg-teal-50",
      button: "bg-teal-500 hover:bg-teal-600",
      butRing: "ring-teal-300 hover:ring-teal-400",
      text: "text-teal-300",
    },
    gas: {
      pulse: "bg-purple-100",
      iconBg: "bg-purple-200",
      iconColor: "text-purple-600",
      accent: "bg-purple-50",
      button: "bg-purple-500 hover:bg-purple-600",
      butRing: "ring-purple-300 hover:ring-purple-400",
      text: "text-purple-300",
    },
    sensor: {
      pulse: "bg-gray-100",
      iconBg: "bg-gray-200",
      iconColor: "text-gray-600",
      accent: "bg-gray-50",
      button: "bg-gray-500 hover:bg-gray-600",
      butRing: "ring-gray-300 hover:ring-gray-400",
      text: "text-gray-300",
    },
  };

  // Icon map
  const icons = {
    light: <FiSun size={32} className="" />,
    switch: <FiZap size={32} />,
    relay: <FiZap size={32} />,
    fan: <FiWind size={32} />,
    temperature: <FiThermometer size={32} />,
    humidity: <FiDroplet size={32} />,
    gas: <FiActivity size={32} />,
    sensor: <FiActivity size={32} />,
  };

  // Load device and features
  useEffect(() => {
    if (projectId && deviceId) {
      fetchDevice(projectId, deviceId);
      fetchFeatures(projectId, deviceId);
    }
  }, [projectId, deviceId]);

  // Connect live socket
  useEffect(() => {
    if (currentDevice?.secret) {
      connect(currentDevice.secret);
      return () => disconnect();
    }
  }, [currentDevice]);

  // Sync liveData
  useEffect(() => {
    Object.entries(liveData).forEach(([key, val]) => setFeatureValue(key, val));
  }, [liveData]);

  if (loading) return <p className="text-center py-10">Loading features...</p>;
  if (error)
    return <p className="text-center text-red-600 py-10">Error: {error}</p>;

  const secret = currentDevice?.secret;

  // Handlers
  const handleAdd = async (e) => {
    e.preventDefault();
    await addFeature(projectId, deviceId, newFeat);
    setNewFeat({ key: "", name: "", type: "" });
    setShowNew(false);
  };
  const startEdit = (f) => {
    setEditingId(f._id);
    setEditForm({ name: f.name, type: f.type });
  };
  const handleSave = async (id, key) => {
    await updateFeature(projectId, deviceId, id, { key, ...editForm });
    setEditingId(null);
  };
  const handleDelete = async (id) => {
    if (confirm("Delete this feature?"))
      await deleteFeature(projectId, deviceId, id);
  };
  const handleToggle = (key, newValue) => {
    sendControl(secret, key, newValue);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">
            {currentDevice?.name || "Device"}
          </h2>
        </div>
        <button
          onClick={() => setShowNew((s) => !s)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-2xl shadow-lg hover:opacity-90 transition"
        >
          <FiPlus /> Add Feature
        </button>
      </header>

      {showNew && (
        <div className="bg-white p-6 rounded-2xl shadow-md grid gap-4 md:grid-cols-3 mb-6">
          <input
            placeholder="Key"
            value={newFeat.key}
            onChange={(e) => setNewFeat((f) => ({ ...f, key: e.target.value }))}
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-300"
            required
          />
          <input
            placeholder="Name"
            value={newFeat.name}
            onChange={(e) =>
              setNewFeat((f) => ({ ...f, name: e.target.value }))
            }
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-300"
            required
          />
          <select
            value={newFeat.type}
            onChange={(e) =>
              setNewFeat((f) => ({ ...f, type: e.target.value }))
            }
            className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-300"
            required
          >
            <option value="">Select Type</option>
            {Object.keys(themes).map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            className="md:col-span-3 bg-green-500 text-white py-2 rounded-2xl shadow hover:bg-green-600 transition"
          >
            Create Feature
          </button>
        </div>
      )}

      <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const theme = themes[f.type] || themes.sensor;
          const liveVal = liveData[f.key] ?? f.value;
          const editing = editingId === f._id;
          return (
            <div
              key={f._id}
              className={`relative p-6 rounded-2xl shadow-lg overflow-hidden transform hover:scale-101 transition ${theme.accent}`}
            >
              <div
                className={`absolute -top-5 -right-5 w-24 h-24 ${theme.pulse} rounded-full animate-pulse opacity-50 pointer-events-none`}
              />
              <div className="absolute h-full w-full top-0 left-0 flex justify-end overflow-hidden pointer-events-none">
                <div
                  className={`w-32 h-32 ${theme.iconBg} rounded-full flex items-center justify-center opacity-20`}
                >
                  {icons[f.type]}
                </div>
              </div>

              {editing ? (
                <>
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((d) => ({ ...d, name: e.target.value }))
                    }
                    className="w-full mb-2 px-3 py-2 border rounded-lg"
                  />
                  <select
                    value={editForm.type}
                    onChange={(e) =>
                      setEditForm((d) => ({ ...d, type: e.target.value }))
                    }
                    className="w-full mb-4 px-3 py-2 border rounded-lg"
                  >
                    {Object.keys(themes).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleSave(f._id, f.key)}
                      className="flex items-center justify-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition"
                    >
                      <FiX />
                    </button>
                  </div>
                </>
              ) : (
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {icons[f.type]}
                      <h3 className="text-lg font-semibold text-gray-800">
                        {f.name}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(f)}
                        className={`p-1 ${theme.button} text-white rounded-full transition`}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="p-1 bg-red-400 hover:bg-red-500 text-white rounded-full transition"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {["switch", "light", "relay", "fan"].includes(f.type) ? (
                      <label className="inline-flex items-center gap-2">
                        <PowerSwitch
                          isOn={!!f.value}
                          theme={themes[f.type]}
                          onToggle={(newVal) => handleToggle(f.key, newVal)}
                        />
                        {/* {f.type} */}
                      </label>
                    ) : (
                      <span className="text-xl font-bold">
                        {liveVal != null ? liveVal : "--"}
                        {f.unit || ""}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
