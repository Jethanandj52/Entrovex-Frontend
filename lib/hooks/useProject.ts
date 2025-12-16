import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiData from "@/api/project";
import {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  Member,
} from "@/types/project";

// =========================
// SAFE MAPPERS
// =========================

const safeMember = (m: any): Member => ({
  _id: m?._id || "",
  username: m?.username || "Unknown",
  email: m?.email || "unknown@example.com",
});

const safeProject = (p: any): Project => ({
  _id: p?._id || "",
  name: p?.name || "Untitled",
  title: p?.title || "Untitled Project",
  description: p?.description || "",
  color: p?.color || "#7e22ce",
  members: p?.members || "",
  createdBy: safeMember(p?.createdBy),
  teamMembers: (p?.teamMembers || []).map(safeMember),
  invitedMembers: p?.invitedMembers || [],
  status: p?.status || "Active",
  createdAt: p?.createdAt || new Date().toISOString(),
  updatedAt: p?.updatedAt || new Date().toISOString(),
});

// =========================
// MAIN HOOK
// =========================

export const useProjects = (projectId?: string) => {
  const queryClient = useQueryClient();

  // -------------------------
  // GET ALL PROJECTS
  // -------------------------
  const projectsQuery = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await ApiData.Project.getProject();
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch projects");
      }
      return res.data.projects.map(safeProject);
    },
  });

  // -------------------------
  // GET PROJECT DETAILS
  // -------------------------
  const projectDetailsQuery = useQuery<Project>({
    queryKey: ["project-details", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      if (!projectId) {
        throw new Error("Project ID not provided");
      }
      const res = await ApiData.Project.getProjectDetails(projectId);
      if (!res.data.success || !res.data.project) {
        throw new Error(res.data.message || "Project not found");
      }
      return safeProject(res.data.project);
    },
  });

  // -------------------------
  // CREATE PROJECT
  // -------------------------
  const createProject = useMutation({
    mutationFn: async (data: CreateProjectInput): Promise<Project> => {
      const res = await ApiData.Project.createProject(data);
      if (!res.data.success || !res.data.project) {
        throw new Error(res.data.message || "Failed to create project");
      }
      return safeProject(res.data.project);
    },
    onSuccess: (newProject) => {
      queryClient.setQueryData<Project[]>(["projects"], (old = []) => [
        ...old,
        newProject,
      ]);
    },
  });

  // -------------------------
  // UPDATE PROJECT
  // -------------------------
  const updateProject = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProjectInput;
    }): Promise<Project> => {
      const res = await ApiData.Project.updateProject(data, id);
      if (!res.data.success || !res.data.project) {
        throw new Error(res.data.message || "Failed to update project");
      }
      return safeProject(res.data.project);
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData<Project[]>(["projects"], (old = []) =>
        old.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );
    },
  });

  // -------------------------
  // DELETE PROJECT
  // -------------------------
  const deleteProject = useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const res = await ApiData.Project.deleteProject(id);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to delete project");
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Project[]>(["projects"], (old = []) =>
        old.filter((p) => p._id !== id)
      );
    },
  });

  return {
    projectsQuery,
    projectDetailsQuery,
    createProject,
    updateProject,
    deleteProject,
  };
};
