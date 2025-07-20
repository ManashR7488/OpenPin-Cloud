import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiPlus,
  FiCpu,
  FiSettings,
} from "react-icons/fi";
import { ImSpinner3 } from "react-icons/im";
import useDataStore from "./../../store/useDataStore";

export default function ProjectDetails() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const {
    isLoading,
    currentProject,
    isFetching,
    fetchOneProject,
    devices,
    addDevice,
    updateDevice,
    deleteDevice,
    updateProject,
  } = useDataStore();

  // Project state
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [projForm, setProjForm] = useState({ name: "", description: "" });
  const [deleteingId, setDeleteingId] = useState("");
  // Device state
  const [showNewDev, setShowNewDev] = useState(false);
  const [devForm, setDevForm] = useState({ name: "", deviceType: "" });
  const [editingDevId, setEditingDevId] = useState(null);
  const [editDevForm, setEditDevForm] = useState({ name: "", deviceType: "" });

  const themes = {
    arduino: {
      pulse: "bg-teal-100",
      iconBg: "bg-teal-200",
      iconColor: "text-teal-600",
      button: "bg-teal-500 hover:bg-teal-600",
      accent: "bg-teal-50",
    },
    esp32: {
      pulse: "bg-green-100",
      iconBg: "bg-green-200",
      iconColor: "text-green-600",
      button: "bg-green-500 hover:bg-green-600",
      accent: "bg-green-50",
    },
    esp8266: {
      pulse: "bg-orange-100",
      iconBg: "bg-orange-200",
      iconColor: "text-orange-600",
      button: "bg-orange-500 hover:bg-orange-600",
      accent: "bg-orange-50",
    },
    other: {
      pulse: "bg-gray-100",
      iconBg: "bg-gray-200",
      iconColor: "text-gray-600",
      button: "bg-gray-500 hover:bg-gray-600",
      accent: "bg-gray-50",
    },
  };

  // Fetch project + devices
  const fetchProject = async () => {
    setLoading(true);
    try {
      await fetchOneProject(projectId);
      setProjForm({
        name: currentProject.name,
        description: currentProject.description || "",
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      navigate("/app/projects");
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  // Project handlers
  const handleProjSave = async () => {
    try {
      await updateProject(projForm, projectId);
      setEditMode(false);
      fetchProject();
    } catch {}
  };

  const handleNewDevice = async (e) => {
    e.preventDefault();
    try {
      const res = await addDevice(devForm);
      setDevForm({ name: "", deviceType: "" });
      setShowNewDev(false);
    } catch {
      //
    }
  };

  const startEditDev = (dev) => {
    setEditingDevId(dev._id);
    setEditDevForm({ name: dev.name, deviceType: dev.deviceType });
  };

  const cancelEditDev = () => setEditingDevId(null);

  const handleSaveDev = async (id) => {
    try {
      await updateDevice(editDevForm, id);
      setEditingDevId(null);
    } catch {
      //
    } finally {
      //
    }
  };

  const handleDelDev = async (id) => {
    setTimeout(async () => {
      if (!window.confirm("Delete this device?")) {
        setDeleteingId("");
        return;
      }
    }, 0);
    try {
      await deleteDevice(id);
    } catch {
      //
    } finally {
      setDeleteingId("");
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>

        {/* Add Button Skeleton */}
        <div className="h-10 bg-gray-200 rounded w-40"></div>

        {/* Device Cards Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 bg-gray-100 rounded-2xl space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const selectedKey = devForm.deviceType.toLowerCase();
  const formTheme = themes[selectedKey] || themes.other;

  return (
    <div className="p-6 space-y-8">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        {editMode ? (
          <div className="flex-1 space-y-2">
            <input
              value={projForm.name}
              onChange={(e) =>
                setProjForm((f) => ({ ...f, name: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              value={projForm.description}
              onChange={(e) =>
                setProjForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              rows={2}
            />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentProject.name}
            </h1>
            {currentProject.description && (
              <p className="text-gray-600">{currentProject.description}</p>
            )}
          </div>
        )}

        <div className="flex-shrink-0 flex items-center gap-2">
          {editMode ? (
            <div className="flex flex-col items-end justify-between gap-2">
              <button
                onClick={handleProjSave}
                className="flex items-center justify-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
              >
                {isLoading ? (
                  <ImSpinner3 className="animate-spin" />
                ) : (
                  <>
                    <FiSave /> Save
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setProjForm({
                    name: currentProject.name,
                    description: currentProject.description || "",
                  });
                }}
                className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition"
              >
                <FiX /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setProjForm({
                  name: currentProject.name,
                  description: currentProject.description || "",
                });
                setEditMode(true);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full transition"
            >
              <FiEdit2 /> Edit
            </button>
          )}
        </div>
      </div>

      {/* New Device Form */}
      <div>
        <button
          onClick={() => setShowNewDev((s) => !s)}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow hover:opacity-90 transition"
        >
          <FiPlus /> Add Device
        </button>

        {showNewDev && (
          <form
            onSubmit={handleNewDevice}
            className={
              `mt-4 p-6 rounded-2xl shadow-md grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-end ` +
              formTheme.accent
            }
          >
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Name
              </label>
              <input
                placeholder="e.g. My ESP32 Sensor"
                value={devForm.name}
                onChange={(e) =>
                  setDevForm((f) => ({ ...f, name: e.target.value }))
                }
                className={
                  `w-full px-3 py-2 border rounded-lg focus:ring-2 ` +
                  `focus:ring-${formTheme.color}-400`
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Type
              </label>
              <select
                value={devForm.deviceType}
                onChange={(e) =>
                  setDevForm((f) => ({ ...f, deviceType: e.target.value }))
                }
                className={
                  `w-full px-3 py-2 border rounded-lg focus:ring-2 ` +
                  `focus:ring-${formTheme.color}-400`
                }
                required
              >
                <option value="">Select Type</option>
                <option value="Arduino">Arduino</option>
                <option value="esp32">ESP32</option>
                <option value="esp8266">ESP8266</option>
                <option value="other">Others</option>
              </select>
            </div>

            <div className="flex gap-2 md:col-span-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowNewDev(false);
                  setDevForm({ name: "", deviceType: "" });
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={
                  `px-4 py-2 text-white rounded-full transition flex items-center justify-center ` +
                  formTheme.button
                }
                disabled={isFetching}
              >
                {isFetching ? (
                  <ImSpinner3 className="animate-spin" />
                ) : (
                  "Create Device"
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices
          .slice()
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .map((dev) => {
            const key = dev.deviceType.toLowerCase();
            const theme = themes[key] || themes.other;

            return (
              <div
                key={dev._id}
                className={`relative p-6 rounded-2xl shadow-lg overflow-hidden transform hover:scale-101 transition ${theme.accent}`}
              >
                <div
                  className={`absolute -top-5 -right-5 w-24 h-24 ${theme.pulse} rounded-full animate-pulse opacity-50 pointer-events-none`}
                />

                <div className="absolute h-full w-full top-0 left-0 flex justify-end overflow-hidden pointer-events-none">
                  <div
                    className={`w-32 h-32 ${theme.iconBg} rounded-full flex items-center justify-center opacity-30`}
                  >
                    <FiCpu size={48} className={`${theme.iconColor}`} />
                  </div>
                </div>

                {editingDevId === dev._id ? (
                  <>
                    <input
                      value={editDevForm.name}
                      onChange={(e) =>
                        setEditDevForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full mb-2 px-3 py-2 border rounded-lg"
                    />
                    <select
                      value={editDevForm.deviceType}
                      onChange={(e) =>
                        setEditDevForm((f) => ({
                          ...f,
                          deviceType: e.target.value,
                        }))
                      }
                      className="w-full mb-4 px-3 py-2 border rounded-lg"
                    >
                      <option value="esp32">ESP32</option>
                      <option value="esp8266">ESP8266</option>
                      <option value="Arduino">Arduino</option>
                      <option value="Others">Others</option>
                    </select>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleSaveDev(dev._id)}
                        className="flex items-center justify-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
                      >
                        {isFetching ? (
                          <ImSpinner3 className="animate-spin" />
                        ) : (
                          <FiSave />
                        )}
                      </button>
                      <button
                        onClick={cancelEditDev}
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
                        <FiCpu className={`${theme.iconColor}`} size={24} />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {dev.name}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditDev(dev)}
                          className={`p-1 ${theme.button} text-white rounded-full transition`}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteingId(dev._id);
                            handleDelDev(dev._id);
                          }}
                          className="p-1 bg-red-400 hover:bg-red-500 text-white rounded-full transition"
                        >
                          {isFetching && deleteingId === dev._id ? (
                            <ImSpinner3 className="animate-spin" />
                          ) : (
                            <FiTrash2 />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">Type: {dev.deviceType}</p>
                    <Link
                      to={`/app/projects/${projectId}/devices/${dev._id}`}
                      className={`inline-block px-4 py-2 ${theme.button} text-white text-sm rounded-full`}
                    >
                      <FiSettings className="inline-block mr-1" /> Manage
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
