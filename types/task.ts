export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "pending" | "completed";
  priority: "normal" | "high" | "medium" | "low";
  dueDate: string; // ISO format
  assignedTo?: string; // USER_ID
  projectId: string;
  tags?: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "pending" | "completed";
  priority: "normal" | "high" | "medium" | "low";
  dueDate: string;
  assignedTo?: string;
  projectId: string;
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: "to-do" | "in-progress" | "pending" | "completed";
  priority?: "normal" | "high" | "medium" | "low";
  dueDate?: string;
  assignedTo?: string;
  tags?: string[];
  projectId?: string;
}
