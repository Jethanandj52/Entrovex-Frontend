"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApiData from "@/api/project";
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  
} from "@/types/task";

export const useTasks = (projectId: string) => {
  const queryClient = useQueryClient();

  // Fetch tasks for a specific project
  const tasksQuery = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async (): Promise<Task[]> => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      const res = await ApiData.task.getTasksOfProject(projectId);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch tasks");
      }

      return res.data.tasks || [];
    },
    enabled: !!projectId, // Only run query if projectId exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create task
  const createTask = useMutation({
    mutationFn: async (data: CreateTaskInput): Promise<Task> => {
      const res = await ApiData.task.createTask(data);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create task");
      }

      return res.data.task;
    },
    onSuccess: (newTask) => {
      // Update cache for this specific project
      queryClient.setQueryData<Task[]>(["tasks", projectId], (old = []) => [
        ...old,
        newTask,
      ]);
    },
    onError: (error: Error) => {
      console.error("Failed to create task:", error.message);
    },
  });

  // Update task (general update)
  const updateTask = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTaskInput;
    }): Promise<Task> => {
      const res = await ApiData.task.updateTask(data, id);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to update task");
      }

      return res.data.task;
    },
    onSuccess: (updatedTask) => {
      // Update cache for this specific project
      queryClient.setQueryData<Task[]>(["tasks", projectId], (old = []) =>
        old.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    },
    onError: (error: Error) => {
      console.error("Failed to update task:", error.message);
    },
  });

  // Update task status (specific for status updates, e.g., drag and drop)
  const updateTaskStatus = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTaskInput;
    }): Promise<Task> => {
      // Assuming you have a specific endpoint for status updates
      const res = await ApiData.task.updateTaskstauts(data, id);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to update task status");
      }

      return res.data.task;
    },
    onSuccess: (updatedTask) => {
      // Optimistically update the cache
      queryClient.setQueryData<Task[]>(["tasks", projectId], (old = []) =>
        old.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    },
    onError: (error: Error) => {
      console.error("Failed to update task status:", error.message);
      // Optional: Revert optimistic update on error
    },
  });

  // Delete task
  const deleteTask = useMutation({
    mutationFn: async (taskId: string): Promise<string> => {
      const res = await ApiData.task.deleteTasks(taskId);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to delete task");
      }

      return taskId;
    },
    onSuccess: (deletedTaskId) => {
      // Remove from cache
      queryClient.setQueryData<Task[]>(["tasks", projectId], (old = []) =>
        old.filter((t) => t._id !== deletedTaskId)
      );
    },
    onError: (error: Error) => {
      console.error("Failed to delete task:", error.message);
    },
  });

  return {
    tasksQuery,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  };
};
