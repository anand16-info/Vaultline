import api from "./api";

export const budgetService = {
  getAll: (params) => api.get("/budgets", { params }).then((res) => res.data),
  create: (data) => api.post("/budgets", data).then((res) => res.data),
  remove: (id) => api.delete(`/budgets/${id}`).then((res) => res.data),
};
