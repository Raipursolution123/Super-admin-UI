// Mock API service for company/customer management
// Ready for backend integration

const mockCompanies = [
  {
    id: 1,
    company_name: "Tech Innovators Inc.",
    contact_person: "John Smith",
    email: "admin@techinnovators.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, San Francisco, CA 94105",
    employee_count: 245,
    subscription_plan: "Enterprise",
    status: "Active",
    registration_date: "2024-01-15",
    last_login: "2024-12-04",
    monthly_fee: 2499,
    industry: "Technology",
    website: "www.techinnovators.com",
  },
  {
    id: 2,
    company_name: "Digital Solutions Ltd.",
    contact_person: "Sarah Johnson",
    email: "hr@digitalsolutions.com",
    phone: "+1 (555) 234-5678",
    address: "456 Digital Ave, New York, NY 10001",
    employee_count: 89,
    subscription_plan: "Premium",
    status: "Active",
    registration_date: "2024-03-22",
    last_login: "2024-12-03",
    monthly_fee: 999,
    industry: "Marketing",
    website: "www.digitalsolutions.com",
  },
  {
    id: 3,
    company_name: "StartUp Ventures",
    contact_person: "Mike Chen",
    email: "team@startupventures.com",
    phone: "+1 (555) 345-6789",
    address: "789 Startup Blvd, Austin, TX 78701",
    employee_count: 25,
    subscription_plan: "Basic",
    status: "Pending",
    registration_date: "2024-11-28",
    last_login: "2024-12-01",
    monthly_fee: 299,
    industry: "E-commerce",
    website: "www.startupventures.com",
  },
  {
    id: 4,
    company_name: "Global Enterprises",
    contact_person: "Emily Davis",
    email: "contact@globalenterprises.com",
    phone: "+1 (555) 456-7890",
    address: "321 Global Plaza, Chicago, IL 60601",
    employee_count: 520,
    subscription_plan: "Enterprise",
    status: "Active",
    registration_date: "2023-11-05",
    last_login: "2024-12-04",
    monthly_fee: 2499,
    industry: "Finance",
    website: "www.globalenterprises.com",
  },
  {
    id: 5,
    company_name: "Retail Chain Co.",
    contact_person: "David Wilson",
    email: "hr@retailchain.com",
    phone: "+1 (555) 567-8901",
    address: "654 Retail Road, Seattle, WA 98101",
    employee_count: 156,
    subscription_plan: "Premium",
    status: "Suspended",
    registration_date: "2024-02-28",
    last_login: "2024-11-15",
    monthly_fee: 999,
    industry: "Retail",
    website: "www.retailchain.com",
  },
];

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const companiesAPI = {
  getAll: async (params) => {
    await delay(500);

    let filtered = [...mockCompanies];

    // Simulate search
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.company_name.toLowerCase().includes(searchLower) ||
          company.contact_person.toLowerCase().includes(searchLower) ||
          company.email.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (params?.status) {
      filtered = filtered.filter((company) => company.status === params.status);
    }

    // Simulate pagination
    const page = params?.page || 1;
    const pageSize = params?.page_size || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: {
        results: filtered.slice(start, end),
        count: filtered.length,
      },
    };
  },

  getById: async (id) => {
    await delay(300);
    const company = mockCompanies.find((c) => c.id === id);
    return { data: company };
  },

  create: async (data) => {
    await delay(500);
    const newCompany = {
      id: mockCompanies.length + 1,
      registration_date: new Date().toISOString().split('T')[0],
      last_login: null,
      status: "Pending",
      ...data,
    };
    mockCompanies.push(newCompany);
    return { data: newCompany };
  },

  update: async (id, data) => {
    await delay(500);
    const index = mockCompanies.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockCompanies[index] = { ...mockCompanies[index], ...data };
      return { data: mockCompanies[index] };
    }
    throw new Error("Company not found");
  },

  approve: async (id) => {
    await delay(500);
    const index = mockCompanies.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockCompanies[index].status = "Active";
      return { data: mockCompanies[index] };
    }
    throw new Error("Company not found");
  },

  disapprove: async (id) => {
    await delay(500);
    const index = mockCompanies.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockCompanies[index].status = "Pending";
      return { data: mockCompanies[index] };
    }
    throw new Error("Company not found");
  },

  suspend: async (id) => {
    await delay(500);
    const index = mockCompanies.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockCompanies[index].status = "Suspended";
      return { data: mockCompanies[index] };
    }
    throw new Error("Company not found");
  },

  delete: async (id) => {
    await delay(300);
    const index = mockCompanies.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockCompanies.splice(index, 1);
      return { data: { success: true } };
    }
    throw new Error("Company not found");
  },
};

// When you get the real API, replace with:
/*
import API from "./api";

export const companiesAPI = {
  getAll: (params) => API.get("/companies/", { params }),
  getById: (id) => API.get(`/companies/${id}/`),
  create: (data) => API.post("/companies/", data),
  update: (id, data) => API.put(`/companies/${id}/`, data),
  approve: (id) => API.post(`/companies/${id}/approve/`),
  disapprove: (id) => API.post(`/companies/${id}/disapprove/`),
  suspend: (id) => API.post(`/companies/${id}/suspend/`),
  delete: (id) => API.delete(`/companies/${id}/`),
};
*/
