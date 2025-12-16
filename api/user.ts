import api from "@/lib/api";

const user = {
  acc: {
    register: (data: any) => api.post("/auth/register", data),

    login: (data: any) => api.post("/auth/login", data),

    getUser: (id: any) => api.get(`/auth/getUserById/${id}`),

    getAllUser: () => api.get("/auth/getAllUsers"),
  },

  forgetPassword: {
    sendOTP: (data: any) => api.post("/auth/forgot-password", data),

    verifyOTP: (data: any) => api.post("/auth/verify-otp", data),

    changePass: (data: any) => api.post("/auth/reset-password", data),
  },
};

export default user;
