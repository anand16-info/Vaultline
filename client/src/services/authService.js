import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data).then((res) => res.data),
  login: (data) => api.post("/auth/login", data).then((res) => res.data),
  getMe: () => api.get("/auth/me").then((res) => res.data),
  updateMe: (data) => api.put("/auth/me", data).then((res) => res.data),
  changePassword: (data) => api.put("/auth/change-password", data).then((res) => res.data),
};
