import API from "./api";

export const companiesAPI = {
  // GET /api/superadmin/companies/ - List all companies
  getAll: async (params) => {
    // Note: The backend list endpoint /superadmin/companies/ might not support server-side pagination/search params yet based on the provided code.
    // However, we pass params just in case or for future use.
    // Ideally we should process the params if the backend supported it.
    // For now, we'll just fetch the list.
    const response = await API.get("/superadmin/companies/", { params });
    return response;
  },

  // POST /api/superadmin/create-company-owner/ - Create new company user
  create: async (data) => {
    const response = await API.post("/superadmin/create-company-owner/", data);
    return response;
  }
};
