// Mock API service for subscription plans
// Ready for backend integration

const mockPlans = [
  {
    id: 1,
    plan_name: "Free",
    description: "Perfect for small teams getting started",
    price: 0,
    billing_cycle: "Monthly",
    max_employees: 10,
    features: ["Basic HR Management", "Employee Records", "Leave Tracking", "Email Support"],
    is_active: true,
    created_date: "2024-01-01",
  },
  {
    id: 2,
    plan_name: "Basic",
    description: "Great for growing businesses",
    price: 299,
    billing_cycle: "Monthly",
    max_employees: 50,
    features: [
      "Everything in Free",
      "Payroll Management",
      "Attendance Tracking",
      "Performance Reviews",
      "Priority Email Support",
    ],
    is_active: true,
    created_date: "2024-01-01",
  },
  {
    id: 3,
    plan_name: "Premium",
    description: "Advanced features for established companies",
    price: 999,
    billing_cycle: "Monthly",
    max_employees: 200,
    features: [
      "Everything in Basic",
      "Advanced Analytics",
      "Custom Reports",
      "API Access",
      "Recruitment Module",
      "Training Management",
      "24/7 Phone Support",
    ],
    is_active: true,
    created_date: "2024-01-01",
  },
  {
    id: 4,
    plan_name: "Enterprise",
    description: "Complete solution for large organizations",
    price: 2499,
    billing_cycle: "Monthly",
    max_employees: -1, // Unlimited
    features: [
      "Everything in Premium",
      "Unlimited Employees",
      "Dedicated Account Manager",
      "Custom Integrations",
      "Advanced Security",
      "SLA Guarantee",
      "On-premise Deployment Option",
      "White-label Solution",
    ],
    is_active: true,
    created_date: "2024-01-01",
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const plansAPI = {
  getAll: async (params) => {
    await delay(500);

    let filtered = [...mockPlans];

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (plan) =>
          plan.plan_name.toLowerCase().includes(searchLower) ||
          plan.description.toLowerCase().includes(searchLower)
      );
    }

    
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
    const plan = mockPlans.find((p) => p.id === id);
    return { data: plan };
  },

  create: async (data) => {
    await delay(500);
    const newPlan = {
      id: mockPlans.length + 1,
      created_date: new Date().toISOString().split('T')[0],
      ...data,
    };
    mockPlans.push(newPlan);
    return { data: newPlan };
  },

  update: async (id, data) => {
    await delay(500);
    const index = mockPlans.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockPlans[index] = { ...mockPlans[index], ...data };
      return { data: mockPlans[index] };
    }
    throw new Error("Plan not found");
  },

  delete: async (id) => {
    await delay(300);
    const index = mockPlans.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockPlans.splice(index, 1);
      return { data: { success: true } };
    }
    throw new Error("Plan not found");
  },
};

// When you get the real API, replace with:
/*
import API from "./api";

export const plansAPI = {
  getAll: (params) => API.get("/plans/", { params }),
  getById: (id) => API.get(`/plans/${id}/`),
  create: (data) => API.post("/plans/", data),
  update: (id, data) => API.put(`/plans/${id}/`, data),
  delete: (id) => API.delete(`/plans/${id}/`),
};
*/
