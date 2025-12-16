import React, { useState, ChangeEvent, useEffect } from "react";

export interface Comment {
  user: string;
  comment: string;
  time: string;
}

export interface Assignee {
  id: string; // Changed from number to string to match USER_ID
  name: string;
}

export interface Task {
  _id?: string;
  title: string;
  status: string;
  priority: "normal" | "high" | "medium" | "low"; // Updated to match your API
  dueDate: string; // ISO string format
  description: string;
  assignedTo?: string; // USER_ID
  projectId?: string; // Added projectId
  tags?: string[]; // Added tags
  assignees?: Assignee[];
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onSave: (updatedTask: Task & { comment?: string }) => void;
  projectId?: string; // Added projectId prop
  availableUsers?: Assignee[]; // For assigning users
  isLoading?: boolean;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  projectId,
  availableUsers = [],
  isLoading = false,
}) => {
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState<Task["priority"]>(task.priority);
  const [dueDate, setDueDate] = useState(() => {
    // Convert ISO date to YYYY-MM-DD format for input
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      return date.toISOString().split("T")[0];
    }
    return "";
  });
  const [description, setDescription] = useState(task.description);
  const [assignedTo, setAssignedTo] = useState(task.assignedTo || "");
  const [tags, setTags] = useState<string[]>(task.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [comment, setComment] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Assignee[]>(
    task.assignees || []
  );

  // Reset form when task changes
  useEffect(() => {
    setTitle(task.title);
    setStatus(task.status);
    setPriority(task.priority);
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      setDueDate(date.toISOString().split("T")[0]);
    } else {
      setDueDate("");
    }
    setDescription(task.description);
    setAssignedTo(task.assignedTo || "");
    setTags(task.tags || []);
    setSelectedUsers(task.assignees || []);
  }, [task]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updatedTask: Task & { comment?: string } = {
      title,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : "",
      description,
      assignedTo,
      tags,
      projectId: projectId || task.projectId,
      comment: comment.trim() ? comment : undefined,
    };

    // Add existing ID if it's an update
    if (task._id) {
      updatedTask._id = task._id;
    }

    onSave(updatedTask);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleUserSelect = (userId: string) => {
    const user = availableUsers.find((u) => u.id === userId);
    if (user && !selectedUsers.some((u) => u.id === userId)) {
      setSelectedUsers([...selectedUsers, user]);
      setAssignedTo(userId);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
    if (assignedTo === userId) {
      setAssignedTo("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white/5 glass-effect rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* HEADER */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none focus:outline-none w-full text-white"
              placeholder="Task Title"
            />
            <button
              onClick={onClose}
              className="cursor-pointer text-purple-300 hover:text-white"
              disabled={isLoading}
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm w-fit text-white"
              disabled={isLoading}
            >
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task["priority"])}
              className={`px-3 py-1.5 rounded-lg text-sm w-fit ${
                priority === "high"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : priority === "medium"
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              }`}
              disabled={isLoading}
            >
              <option value="normal">Normal</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 resize-none"
              placeholder="Task Description"
              disabled={isLoading}
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Assignee
            </label>
            <div className="flex flex-col gap-3">
              <select
                value={assignedTo}
                onChange={(e) => {
                  const userId = e.target.value;
                  setAssignedTo(userId);
                  if (userId && !selectedUsers.some((u) => u.id === userId)) {
                    const user = availableUsers.find((u) => u.id === userId);
                    if (user) {
                      setSelectedUsers([...selectedUsers, user]);
                    }
                  }
                }}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                disabled={isLoading || availableUsers.length === 0}
              >
                <option value="">Select Assignee</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

              {/* Selected Users Display */}
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-purple-900 text-xs flex items-center justify-center font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm text-white">{user.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-red-400 hover:text-red-300"
                        disabled={isLoading}
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Tags
            </label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="Add a tag (e.g., api, backend)"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>

              {/* Tags Display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-lg"
                    >
                      <span className="text-sm text-purple-300">#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-purple-300 hover:text-white"
                        disabled={isLoading}
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer px-6 py-2.5 glass-effect rounded-lg hover:bg-white/20 transition-all"
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`cursor-pointer px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-900 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
