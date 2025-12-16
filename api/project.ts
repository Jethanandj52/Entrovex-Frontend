import api from "@/lib/api";

const ApiData = {
  Project: {
    createProject: (data: any) =>
      api.post(
        "/project/create",
        
        data
      ),

    updateProject: (data: any, id: any) => api.put(`/update/${id}`, data),

    deleteProject: (id: any) => api.delete(`/delete/${id}`),

    getProject: () => api.get("/project/my-projects"),

    getProjectDetails: (id: any) => api.get(`/project/details/${id}`),

    getJoinedprojects: (id:any) => api.get("/project/joined-projects"),
  },

  Invite: {
    sendInvite: (data: any) => api.post("/project/invite", data),

    responseToInvite: (data: any) => api.post("/project/respond-invite", data),

    getInvitaions: () => api.get("/project/my-invitations"),
  },

  task: {
    createTask: (data: any) => api.post("/tasks/create", data),

    updateTask: (data: any, id: any) => api.put(`/tasks/update/${id}`, data),

    updateTaskstauts: (data: any, id: any) =>
      api.put(`/tasks/status/${id}`, data),

    getTasksOfProject: (id: any) => api.get(`/tasks/project/${id}`),

    deleteTasks: (id: any) => api.delete(`/tasks/delete/${id}`),
  },
};

export default ApiData;
