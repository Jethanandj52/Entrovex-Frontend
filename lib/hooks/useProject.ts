// =========================
// useProjects Hook
// =========================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiData from "@/api/project";
import { Project, CreateProjectInput, UpdateProjectInput } from "@/types/project";

export const useProjects = (projectId?: string) => {
  const queryClient = useQueryClient();

  // -------------------------
  // GET ALL PROJECTS
  // -------------------------
  const projectsQuery = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await ApiData.Project.getProject();
      if (!res.data.success) throw new Error(res.data.message || "Failed to fetch projects");

      return res.data.projects.map((p: any) => ({
        ...p,
        _id: p._id || "",
        createdBy: p.createdBy || { _id: "", username: "Unknown", email: "unknown@example.com" },
        teamMembers: p.teamMembers || [],
        invitedMembers: p.invitedMembers || [],
        description: p.description || "",
        color: p.color || "#7e22ce",
        members: p.members || "",
        status: p.status || "Active",
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
      }));
    },
  });

  // -------------------------
  // GET PROJECT DETAILS
  // -------------------------
  const projectDetailsQuery = useQuery<Project>({
    queryKey: ["project-details", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID not provided");
      const res = await ApiData.Project.getProjectDetails(projectId);
      if (!res.data.success || !res.data.project) throw new Error(res.data.message || "Failed to load project details");

      const p = res.data.project;
      return {
        _id: p._id || "",
        name: p.name || "Untitled",
        title: p.title || "Untitled Project",
        description: p.description || "",
        color: p.color || "#7e22ce",
        members: p.members || "",
        createdBy: p.createdBy || { _id: "", username: "Unknown", email: "unknown@example.com" },
        teamMembers: p.teamMembers || [],
        invitedMembers: p.invitedMembers || [],
        status: p.status || "Active",
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
      };
    },
    enabled: !!projectId,
  });

  // -------------------------
  // GET JOINED PROJECTS
  // -------------------------
  const joinedProjectsQuery = useQuery<Project[]>({
    queryKey: ["joined-projects", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID not provided for joined projects");
      const res = await ApiData.Project.getJoinedprojects(projectId);
      if (!res.data.success) throw new Error(res.data.message || "Failed to fetch joined projects");

      return res.data.projects.map((p: any) => ({
        ...p,
        _id: p._id || "",
        createdBy: p.createdBy || { _id: "", username: "Unknown", email: "unknown@example.com" },
        teamMembers: p.teamMembers || [],
        invitedMembers: p.invitedMembers || [],
        description: p.description || "",
        color: p.color || "#7e22ce",
        members: p.members || "",
        status: p.status || "Active",
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
      }));
    },
  });

  // -------------------------
  // CREATE PROJECT
  // -------------------------
  const createProject = useMutation({
    mutationFn: async (data: CreateProjectInput): Promise<Project> => {
      const res = await ApiData.Project.createProject(data);
      if (!res.data.success || !res.data.project) throw new Error(res.data.message || "Failed to create project");

      const p = res.data.project;
      return {
        _id: p._id || "",
        name: p.name || "Untitled",
        title: p.title || "Untitled Project",
        description: p.description || "",
        color: p.color || "#7e22ce",
        members: p.members || "",
        createdBy: p.createdBy || { _id: "", username: "Unknown", email: "unknown@example.com" },
        teamMembers: p.teamMembers || [],
        invitedMembers: p.invitedMembers || [],
        status: p.status || "Active",
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
      };
    },
    onSuccess: (newProject) => {
      queryClient.setQueryData<Project[]>(["projects"], (old = []) => [...old, newProject]);
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
      if (!res.data.success || !res.data.project) throw new Error(res.data.message || "Failed to update project");

      const p = res.data.project;
      return {
        _id: p._id || "",
        name: p.name || "Untitled",
        title: p.title || "Untitled Project",
        description: p.description || "",
        color: p.color || "#7e22ce",
        members: p.members || "",
        createdBy: p.createdBy || { _id: "", username: "Unknown", email: "unknown@example.com" },
        teamMembers: p.teamMembers || [],
        invitedMembers: p.invitedMembers || [],
        status: p.status || "Active",
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
      };
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Project[]>(["projects"], (old = []) =>
        old.map((p) => (p._id === updated._id ? updated : p))
      );
    },
  });

  // -------------------------
  // DELETE PROJECT
  // -------------------------
  const deleteProject = useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const res = await ApiData.Project.deleteProject(id);
      if (!res.data.success) throw new Error(res.data.message || "Failed to delete project");
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Project[]>(["projects"], (old = []) => old.filter((p) => p._id !== id));
    },
  });

  return {
    projectsQuery,
    projectDetailsQuery,
    joinedProjectsQuery,
    createProject,
    updateProject,
    deleteProject,
  };
};
