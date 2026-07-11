import api from "./api";

export const goalService = {
  getAll: () => api.get("/goals").then((res) => res.data),
  create: (data) => api.post("/goals", data).then((res) => res.data),
  update: (id, data) => api.put(`/goals/${id}`, data).then((res) => res.data),
  remove: (id) => api.delete(`/goals/${id}`).then((res) => res.data),
};
