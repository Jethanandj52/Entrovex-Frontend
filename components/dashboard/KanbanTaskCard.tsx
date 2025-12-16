"use client";

import React from "react";

type TaskCardProps = {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  assigneeInitials?: string[]; // ✅ optional
  index: number;
  projectId: string;
  onClick: () => void;
};

export default function KanbanTaskCard({
  id,
  title,
  description,
  priority,
  dueDate,
  assigneeInitials = [], // ✅ default empty array
  index,
  projectId,
  onClick,
}: TaskCardProps) {
  const dateObject = new Date(dueDate);
  const fullDateString = dateObject.toDateString();
  const parts = fullDateString.split(" ");
  const month = parts[1];
  const day = parts[2];

  const handleClick = () => {
    if (projectId) {
      localStorage.setItem("currentProjectId", projectId);
      console.log("Saved projectId:", projectId);
    }
    onClick();
  };

  return (
    <div
      className="task-card bg-white/10 border border-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-sm text-white">{title}</h4>
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-purple-300 hover:text-white"
        >
          <i className="fas fa-ellipsis-h text-xs"></i>
        </button>
      </div>

      <p className="text-xs text-purple-300 mb-5">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-purple-900 text-xs flex items-center justify-center font-medium">
            {assigneeInitials.join(", ")} {/* ✅ safe now */}
          </div>

          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              priority === "High"
                ? "bg-red-500/20 text-red-400"
                : priority === "Medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {priority}
          </span>
        </div>

        <span className="text-xs text-purple-300">{`${day} ${month}`}</span>
      </div>
    </div>
  );
}
