// components/TaskCard.tsx
import React from "react";

interface TaskCardProps {
  title: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  assigneeInitials: string[];
  onClick?: () => void;
}

const priorityColors = {
  High: "bg-red-500/20 text-red-400",
  Medium: "bg-yellow-500/20 text-yellow-400",
  Low: "bg-blue-500/20 text-blue-400",
};

export default function TaskCard({
  title,
  project,
  priority,
  dueDate,
  assigneeInitials,
  onClick,
}: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
    >
      <div className="flex items-start sm:items-center space-x-4">
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-white/20 bg-white/10 text-yellow-400 mt-1 sm:mt-0"
        />
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-purple-300">{project}</p>  
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-3 sm:mt-0">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[priority]}`}
        >
          {priority} Priority
        </span>
        <span className="text-sm text-purple-300">Due: {dueDate}</span>
        <div className="flex -space-x-2">
          {assigneeInitials.map((initial, index) => (
            <div
              key={index}
              className="avatar-circle bg-gradient-to-br from-yellow-400 to-amber-500 text-purple-900 text-sm  border-purple-900"
            >
              {initial}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
