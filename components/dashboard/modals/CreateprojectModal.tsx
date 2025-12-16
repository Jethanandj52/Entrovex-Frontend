"use client";

import { Project } from "@/types/project";
import API, { getAuthHeader } from "@/lib/api";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  onCreated?: (data: any) => void; // optional, safer
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  project,
  setProject,
  onCreated,
}: CreateProjectModalProps) {
  if (!isOpen) return null;

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  const handleCreate = async () => {
    try {
      if (!project.name || !project.description) {
        alert("Project name and description are required");
        return;
      }

      const body = {
        title: project.name,
        description: project.description,
        color: project.color || "",
        teamMembers: project.members
          ? project.members.split(",").map((m) => m.trim())
          : [],
      };

      const res = await API.post("/project/create", body, {
        headers: getAuthHeader(),
      });

      // Safely call onCreated if provided
      onCreated?.(res.data);

      onClose();
      // Reset project after creation
      setProject({ name: "", description: "", color: "", members: "" });
    } catch (err: any) {
      console.error("Create Project Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating project");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-effect rounded-3xl max-w-2xl w-full">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Project</h2>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Project Name</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              placeholder="Enter project name..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              rows={3}
              value={project.description}
              onChange={(e) =>
                setProject({ ...project, description: e.target.value })
              }
              placeholder="Describe your project..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 resize-none"
            />
          </div>

          {/* Project Color */}
          <div>
            <label className="block text-sm font-semibold mb-2">Project Color</label>
            <div className="flex items-center space-x-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setProject({ ...project, color })}
                  className={`w-10 h-10 rounded-lg transition-transform hover:scale-110 ${color} ${
                    project.color === color ? "ring-2 ring-white" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Add Team Members (comma-separated emails)
            </label>
            <input
              type="text"
              value={project.members}
              onChange={(e) => setProject({ ...project, members: e.target.value })}
              placeholder="e.g. user1@mail.com, user2@mail.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 glass-effect rounded-lg hover:bg-white/20 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-900 rounded-lg font-semibold hover:shadow-lg cursor-pointer"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
