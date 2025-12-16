"use client";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import TaskCard from "@/components/dashboard/TaskCard";

interface Task {
  _id: string;
  title: string;
  projectId: {
    _id: string;
    title: string;
  };
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  assignedTo: {
    _id: string;
    username: string;
    email: string;
  };
}

export default function MyTasks() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  // --------------------
  // Fetch tasks from backend
  // --------------------
  const { data, isLoading, isError } = useQuery<Task[]>({
    queryKey: ["myTasks"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/tasks/my", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      });
      return res.data.tasks;
    },
  });

  // --------------------
  // Delete task mutation
  // --------------------
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await axios.delete(`http://localhost:5000/tasks/delete/${taskId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myTasks"]); // refresh tasks
    },
  });

  // --------------------
  // Update task mutation (status)
  // --------------------
  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: string;
      status: "todo" | "inprocess" | "completed";
    }) => {
      await axios.put(
        `http://localhost:5000/tasks/status/${taskId}`,
        { status },
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myTasks"]); // refresh tasks
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-purple-300 animate-pulse">Loading tasks...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded">
        Error loading tasks.
      </div>
    );
  }

  return (
    <div id="my-tasks" className="view-section active p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
        <p className="text-purple-300">
          All tasks assigned to you across projects.
        </p>
      </div>

      <div className="glass-effect rounded-2xl p-6">
        <div className="space-y-3">
          {data && data.length > 0 ? (
            data.map((task) => (
              <TaskCard
                key={task._id}
                title={task.title}
                project={task.projectId.title}
                priority={task.priority}
                dueDate={new Date(task.dueDate).toLocaleDateString()}
                assigneeInitials={[task.assignedTo.username[0]]}
                onClick={() => console.log("Open modal for", task.title)}
                // Delete handler
                onDelete={() => deleteTaskMutation.mutate(task._id)}
                // Update handler (example: mark as completed)
                onMarkCompleted={() =>
                  updateTaskStatusMutation.mutate({
                    taskId: task._id,
                    status: "completed",
                  })
                }
              />
            ))
          ) : (
            <p className="text-purple-300 text-center">
              No tasks assigned to you.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
