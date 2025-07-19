// src/pages/Project/Projects.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { ImSpinner3 } from "react-icons/im";
import useDataStore from "../../store/useDataStore";
import moment from "moment";

export default function Projects() {
  const {
    projects,
    isLoading,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  } = useDataStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!form.name.trim()) return;
    try {
      await addProject(form);
      setLoading(false);
      setShowNewForm(false);
      setForm({ name: "", description: "" });
    } catch {
      setLoading(false);
      setShowNewForm(false);
      setForm({ name: "", description: "" });
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setEditName(project.name);
    setEditDescription(project.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleSave = async (id) => {
    if (!editName.trim()) return;
    try {
      await updateProject({ name: editName, description: editDescription }, id);
      cancelEdit();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
    } catch {}
  };

  if ((!isLoading || loading) && projects.length === 0) {
    return (
      <div className="relative p-6 text-center max-w-md mx-auto">
        <div className="mb-6">
          <FiPlus size={64} className="text-gray-300 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No Projects Yet</h2>
        <p className="text-gray-600 mb-4">
          Get started by creating your first project.
        </p>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center mx-auto gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg hover:scale-105 transition"
        >
          <FiPlus /> New Project
        </button>
        {showNewForm && (
          <div className="fixed h-full inset-0 bg-[#00000058] backdrop-blur-[2px] bg-opacity-50 flex justify-center items-start pt-20 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">New Project</h2>
                <button
                  onClick={() => {
                    setForm({ name: "", description: "" });
                    setShowNewForm(false);
                  }}
                  aria-label="Close"
                >
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Enter project name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    placeholder="Enter project description"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ name: "", description: "" });
                      setShowNewForm(false);
                    }}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {loading ? (
                      <ImSpinner3 className="animate-spin" />
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isLoading && projects.length === 0) {
    return (
      <div className="p-6 space-y-6 animate-pulse max-w-6xl mx-auto">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 bg-gray-100 rounded-2xl space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Projects</h1>
        <button
          onClick={() => setShowNewForm((s) => !s)}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full shadow-lg transform hover:scale-105 transition"
        >
          <FiPlus /> New Project
        </button>
      </div>

      {/* New Project Form */}
      {showNewForm && (
        <div className="fixed h-full inset-0 bg-[#00000058] backdrop-blur-[2px] bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">New Project</h2>
              <button onClick={() => setShowNewForm(false)} aria-label="Close">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Enter project name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Enter project description"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ImSpinner3 className="animate-spin" />
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && projects.length === 0 && (
        <div className="flex items-center gap-2 text-gray-600">
          <ImSpinner3 className="animate-spin" /> Loading projects...
        </div>
      )}

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects
            .slice()
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map((project) => (
              <div
                key={project._id}
                className="relative bg-white h-fit p-6 rounded-2xl shadow-lg overflow-hidden transform hover:scale-101 transition "
              >
                {/* Decorative Circle */}
                <div className="absolute -top-5 -right-5 w-24 h-24 bg-blue-100 rounded-full animate-pulse opacity-50 pointer-events-none" />

                {editingId === project._id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full mb-3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full mb-4 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleSave(project._id)}
                        className="flex items-center justify-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
                      >
                        {/* <FiSave /> */}
                        {isLoading ? (
                          <ImSpinner3 className="animate-spin" size={18} />
                        ) : (
                          <FiSave />
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center justify-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition"
                      >
                        <FiX />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col justify-between h-full overflow-hidden">
                    <div className="">
                      <div className="w-fit hover:underline text-blue-600">
                        <Link to={`/app/projects/${project._id}`} className="">
                          <h3 className="text-xl font-semibold text-blue-600 mb-2 ">
                            {project.name}
                          </h3>
                        </Link>
                      </div>
                      <p className="text-gray-600 mb-4 text-wrap">
                        {project.description || "No description"}
                      </p>
                    </div>
                    <div className="flex justify-between items-end gap-2">
                      <div className="text-xs flex flex-col">
                        <span>
                          Last Update:{" "}
                          {moment(project.updatedAt)
                            .local()
                            .format("Do MMM YY, hh:mm:ss a")}
                        </span>
                        <span>
                          Create At:{" "}
                          {moment(project.createdAt)
                            .local()
                            .format("Do MMM YY, hh:mm:ss a")}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(project)}
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full transition"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-400 hover:bg-red-500 text-white rounded-full transition"
                        >
                          {/* <FiTrash2 /> */}
                          {isLoading ? (
                            <ImSpinner3 className="animate-spin" size={18} />
                          ) : (
                            <FiTrash2 />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        !isLoading && (
          <p className="text-gray-600 text-center">You have no projects yet.</p>
        )
      )}
    </div>
  );
}
