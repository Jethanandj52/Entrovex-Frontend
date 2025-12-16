export interface Project {
  _id?: string;
  name: string; // frontend name
  title?: string; // backend title
  description: string;
  color: string;
  members: string; // comma separated emails for input
  createdBy?: {
    _id: string;
    username: string;
    email: string;
  };
  teamMembers?: {
    _id: string;
    username: string;
    email: string;
  }[];
  invitedMembers?: {
    email: string;
    status: "pending" | "accepted" | "rejected";
  }[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}


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

// API Response types
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
