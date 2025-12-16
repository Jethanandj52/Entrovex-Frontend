// =========================
// Project Type
// =========================
export interface Member {
  _id: string;  // mandatory
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
  members?: string; // optional now
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
  members: string; // Or string[] depending on your form
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
  members?: string; // Or string[] depending on your form
}

// =========================
// API Response Types
// =========================
export interface ProjectsResponse {
  success: boolean;
  message: string;
  projects: Project[]; // always array
}

export interface SingleProjectResponse {
  success: boolean;
  message: string;
  project: Project; // mandatory now to avoid undefined errors
}
