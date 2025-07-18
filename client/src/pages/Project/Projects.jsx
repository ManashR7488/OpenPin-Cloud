// src/pages/Project/Projects.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { ImSpinner3 } from "react-icons/im";
import { toast } from "react-toastify";
import useDataStore from "../../store/useDataStore";
import moment from "moment";
import { locale } from "./../../../node_modules/moment/src/lib/moment/locale";

export default function Projects() {
  const {
    projects,
    isLoading,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  } = useDataStore();

  const [showNewForm, setShowNewForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await addProject(form);
      setForm({ name: "", description: "" });
      setShowNewForm(false);
    } catch {}
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
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
        >
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((st) => ({ ...st, name: e.target.value }))}
            placeholder="Project name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
          />
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((st) => ({ ...st, description: e.target.value }))
            }
            placeholder="Project description (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition resize-none"
            rows={3}
          />
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow transition"
            >
              {isLoading ? (
                <ImSpinner3 className="animate-spin" size={18} />
              ) : (
                "Create"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setForm({ name: "", description: "" });
              }}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition"
            >
              Cancel
            </button>
          </div>
        </form>
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
                className="relative bg-white p-6 rounded-2xl shadow-lg overflow-hidden transform hover:scale-101 transition"
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
                  <>
                    <div className="w-fit hover:underline text-blue-600">
                      <Link to={`/app/projects/${project._id}`} className="">
                        <h3 className="text-xl font-semibold text-blue-600 mb-2 ">
                          {project.name}
                        </h3>
                      </Link>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {project.description || "No description"}
                    </p>
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
                  </>
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
