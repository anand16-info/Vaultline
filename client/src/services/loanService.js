import api from "./api";

export const loanService = {
  calculate: (data) => api.post("/loans/calculate", data).then((res) => res.data),
  getAll: () => api.get("/loans").then((res) => res.data),
  create: (data) => api.post("/loans", data).then((res) => res.data),
  remove: (id) => api.delete(`/loans/${id}`).then((res) => res.data),
};
