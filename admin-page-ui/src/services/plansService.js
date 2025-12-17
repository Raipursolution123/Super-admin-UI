import API from "./api";

export const plansAPI = {
  // Plan CRUD
  getAll: (params) => API.get("/superadmin/plans/", { params }),

  getById: (id) => API.get(`/superadmin/plans/${id}/`),

  create: (data) => API.post("/superadmin/plans/", data),

  update: (id, data) => API.put(`/superadmin/plans/${id}/`, data),

  delete: (id) => API.delete(`/superadmin/plans/${id}/`),

  // Page Assignments
  getPlanPages: (id) => API.get(`/superadmin/plans/${id}/pages/`),

  assignPages: (id, page_ids) => API.post(`/superadmin/plans/${id}/pages/`, { page_ids }),

  // Page List (Tree)
  getAllPages: () => API.get("/pages/"),
};
