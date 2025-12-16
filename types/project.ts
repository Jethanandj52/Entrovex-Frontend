// =========================
// Project Types
// =========================
export interface Member {
  _id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
}

export interface Project {
  _id: string;
  name: string;
  title?: string;
  description: string;
  color: string;
  members?: string; // optional
  createdBy: Member;
  teamMembers?: Member[];
  invitedMembers?: { email: string; status: "pending" | "accepted" | "rejected" }[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// =========================
// Input Types
// =========================
export interface CreateProjectInput {
  name: string;
  description: string;
  color: string;
  members: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
  members?: string;
}

// =========================
// API Response Types
// =========================
export interface ProjectsResponse {
  success: boolean;
  message: string;
  projects: Project[];
}

export interface SingleProjectResponse {
  success: boolean;
  message: string;
  project: Project;
}
