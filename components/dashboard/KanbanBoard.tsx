"use client";

import React, { useState, useEffect } from "react";
import Column from "./Column";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useTasks } from "@/lib/hooks/useTasks";
import axios from "axios";
import { Task } from "@/types/task";

// -------------------- TYPES --------------------
export interface Member {
  _id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
}

export interface TaskInput {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: "low" | "normal" | "medium" | "high";
  status?: string;
}

interface KanbanBoardProps {
  projectId: string;
  members: Member[];
}

// -------------------- MAIN COMPONENT --------------------
const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, members: propMembers }) => {
  const { tasksQuery, updateTaskStatus } = useTasks(projectId);

  const [isDragging, setIsDragging] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [members, setMembers] = useState<Member[]>(propMembers || []);
  const [taskInput, setTaskInput] = useState<TaskInput>({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "normal",
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // -------------------- FETCH PROJECT MEMBERS --------------------
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const res = await axios.get(`http://localhost:5000/project/${projectId}`, {
          withCredentials: true,
        });

        const project = res.data.project;

        const allMembers: Member[] = [
          { 
            _id: project.createdBy._id, 
            username: project.createdBy.username, 
            email: project.createdBy.email,
            isAdmin: true
          },
          ...(project.teamMembers || [])
        ];

        setMembers(allMembers);
      } catch (err) {
        console.error("Error fetching project members:", err);
      }
    };
    fetchProject();
  }, [projectId]);

  // -------------------- HANDLE BODY SCROLL DURING DRAG --------------------
  useEffect(() => {
    if (isDragging) {
      document.body.classList.add("dragging-active");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("dragging-active");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("dragging-active");
      document.body.style.overflow = "";
    };
  }, [isDragging]);

  // -------------------- LOADING & ERROR --------------------
  if (tasksQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-purple-300 animate-pulse">Loading tasks...</div>
      </div>
    );
  }

  if (tasksQuery.isError) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded">
        Error loading tasks: {(tasksQuery.error as any)?.message || "Unknown error"}
      </div>
    );
  }

  const tasks = tasksQuery.data || [];

  // -------------------- COLUMNS --------------------
  const columnData: Record<string, Task[]> = {
    todo: tasks.filter((task) => task.status === "todo"),
    inprocess: tasks.filter((task) => task.status === "inprocess"),
    completed: tasks.filter((task) => task.status === "completed"),
  };

  const columnColors: { [key: string]: string } = {
    todo: "bg-blue-500",
    inprocess: "bg-yellow-500",
    completed: "bg-green-500",
  };

  const onDragStart = () => setIsDragging(true);

  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    updateTaskStatus.mutate({
      id: draggableId,
      data: { status: destination.droppableId },
    });
  };

  // -------------------- HANDLERS --------------------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTaskInput({ ...taskInput, [e.target.name]: e.target.value });
  };

  const openTaskModal = (task?: Task, status?: string) => {
    if (task) {
      setEditingTask(task);
      setTaskInput({
        title: task.title,
        description: task.description,
        assignedTo: (task.assignedTo as any)?._id || "",
        dueDate: task.dueDate.split("T")[0],
        priority: task.priority.toLowerCase() as any,
        status: task.status,
      });
    } else {
      setEditingTask(null);
      setTaskInput({ title: "", description: "", assignedTo: "", dueDate: "", priority: "normal", status });
    }
    setShowTaskModal(true);
  };

  const handleCreateOrUpdateTask = async () => {
    if (!taskInput.title || !taskInput.assignedTo || !taskInput.dueDate) {
      alert("Title, Assignee and Due Date are required!");
      return;
    }

    try {
      if (editingTask) {
        await axios.put(`http://localhost:5000/tasks/update/${editingTask._id}`, taskInput, {
          withCredentials: true,
        });
      } else {
        await axios.post(`http://localhost:5000/tasks/create`, { ...taskInput, projectId }, {
          withCredentials: true,
        });
      }

      setShowTaskModal(false);
      setEditingTask(null);
      setTaskInput({ title: "", description: "", assignedTo: "", dueDate: "", priority: "normal" });
      tasksQuery.refetch();
    } catch (err) {
      console.error("Error creating/updating task:", err);
      alert("Failed to create/update task.");
    }
  };

  const handleDeleteTask = async () => {
    if (!editingTask) return;
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`http://localhost:5000/tasks/delete/${editingTask._id}`, { withCredentials: true });
      setShowTaskModal(false);
      setEditingTask(null);
      setTaskInput({ title: "", description: "", assignedTo: "", dueDate: "", priority: "normal" });
      tasksQuery.refetch();
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task.");
    }
  };

  // -------------------- JSX --------------------
  return (
    <div className={`${isDragging ? "select-none" : ""}`}>
      <button
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
        onClick={() => openTaskModal(undefined, "todo")}
      >
        + Create Task
      </button>

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.keys(columnData).map((columnId) => (
            <Column
              key={columnId}
              id={columnId}
              title={columnId.replace("-", " ").toUpperCase()}
              tasks={columnData[columnId]}
              color={columnColors[columnId]}
              projectId={projectId}
              openTaskModal={openTaskModal}
            />
          ))}
        </div>
      </DragDropContext>

      {showTaskModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setShowTaskModal(false)}
        >
          <div
            className="bg-gray-900/90 text-white p-6 rounded-3xl shadow-2xl w-full max-w-md border border-purple-500 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              {editingTask ? "Update Task" : "Create Task"}
            </h2>

            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={taskInput.title}
              onChange={handleInputChange}
              className="w-full mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:border-yellow-400 transition"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={taskInput.description}
              onChange={handleInputChange}
              className="w-full mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:border-yellow-400 transition"
            />

            <select
              name="assignedTo"
              value={taskInput.assignedTo}
              onChange={handleInputChange}
              className="w-full mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-400 transition"
            >
              <option value="">Select Assignee</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.username}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="dueDate"
              value={taskInput.dueDate}
              onChange={handleInputChange}
              className="w-full mb-3 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-400 transition"
            />

            <select
              name="priority"
              value={taskInput.priority}
              onChange={handleInputChange}
              className="w-full mb-5 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-400 transition"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl shadow-lg transition transform hover:scale-105"
                onClick={handleCreateOrUpdateTask}
              >
                {editingTask ? "Update Task" : "Create Task"}
              </button>
              {editingTask && (
                <button
                  className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105"
                  onClick={handleDeleteTask}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
