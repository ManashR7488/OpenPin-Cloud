// src/pages/Project/Projects.jsx
import React, { useEffect, useState } from "react";
import axios from "../../config/axios.configer";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import useDataStore from "../../store/useDataStore";
import { ImSpinner3 } from "react-icons/im";

export default function Projects() {
  const {
    projects,
    isLoading,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  } = useDataStore();

  const [error, setError] = useState(null);

  const [showNewForm, setShowNewForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  // Track which project is in edit mode
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [addProject, updateProject]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await addProject(form);
      toast.success("Project created!");
      setForm({ name: "", description: "" });
      setShowNewForm(false);
    } catch (err) {
      toast.error(err);
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setEditName(project.name);
    setEditDescription(project.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleSave = async (id) => {
    if (!editName.trim()) return;
    try {
      await updateProject({ name: editName, description: editDescription }, id);
      cancelEdit();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await deleteProject(id);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Your Projects</h1>
        <button
          onClick={() => setShowNewForm((show) => !show)}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
        >
          <FiPlus /> New Project
        </button>
      </div>

      {/* New Project Form */}
      {showNewForm && (
        <form onSubmit={handleCreate} className="mb-6">
          <div className="flex flex-col gap-2 mb-6">
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((state) => ({ ...state, name: e.target.value }))
              }
              placeholder="Project name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <textarea
              type=""
              value={form.description}
              onChange={(e) =>
                setForm((state) => ({
                  ...state,
                  description: e.target.value,
                }))
              }
              placeholder="Project Description"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none max-h-[50vh]"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition h-fit"
            >
              {isLoading ? (
                <ImSpinner3 size={20} className="animate-spin duration-[5s]" />
              ) : (
                "Create"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setForm({});
              }}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-200 text-gray-700 rounded-lg transition h-fit"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Loading & Error */}
      {isLoading && (
        <p className="text-gray-600">
          Loading projects... <ImSpinner3 />{" "}
        </p>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {/* Project List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...projects]
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .map((project) => (
            <div
              key={project._id}
              className="relative p-6 bg-white rounded-2xl shadow hover:shadow-lg transition hover:ring-2 box-border ring-zinc-400  border-blue-700 cursor-pointer"
            >
              {/* Edit Mode */}
              {editingId === project._id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none mb-4"
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none mb-4"
                    placeholder="Project Description"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(project._id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition"
                    >
                      {isLoading ? (
                        <ImSpinner3
                          size={20}
                          className="animate-spin duration-[5s]"
                        />
                      ) : (
                        <>
                          <FiSave /> Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-300 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                      <FiX /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {/* Optionally show description */}
                    {project?.description}
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => startEdit(project)}
                      className=" flex items-center justify-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-white rounded-lg transition"
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className=" flex items-center justify-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg transition"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
