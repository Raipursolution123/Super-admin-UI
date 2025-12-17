// Mock API service - Replace with actual API calls when backend is ready
// This structure follows your API pattern and is ready for integration

const mockJobRequirements = [
  {
    id: 1,
    job_title: "Senior Frontend Developer",
    job_post: "Frontend Development",
    description: "We are looking for an experienced Frontend Developer with expertise in React, TypeScript, and modern web technologies.",
    published_by: "Admin",
    job_publish_date: "2024-12-01",
    application_end_date: "2024-12-31",
    status: "PUBLISHED",
    department: "Engineering",
    location: "Remote",
    employment_type: "Full-time",
    experience_required: "5+ years",
    salary_range: "$80,000 - $120,000",
    skills_required: ["React", "TypeScript", "CSS", "REST APIs"],
  },
  {
    id: 2,
    job_title: "UI/UX Designer",
    job_post: "Design",
    description: "Seeking a creative UI/UX Designer to create beautiful and intuitive user interfaces.",
    published_by: "Super Admin",
    job_publish_date: "2024-12-02",
    application_end_date: "2024-12-25",
    status: "PUBLISHED",
    department: "Design",
    location: "Mumbai",
    employment_type: "Full-time",
    experience_required: "3+ years",
    salary_range: "$70,000 - $100,000",
    skills_required: ["Figma", "Adobe XD", "Prototyping", "User Research"],
  },
  {
    id: 3,
    job_title: "Backend Engineer",
    job_post: "Backend Development",
    description: "Looking for a skilled Backend Engineer proficient in Node.js and database management.",
    published_by: "Admin",
    job_publish_date: "2024-11-28",
    application_end_date: "2024-12-20",
    status: "UNPUBLISHED",
    department: "Engineering",
    location: "Pune",
    employment_type: "Full-time",
    experience_required: "4+ years",
    salary_range: "$90,000 - $130,000",
    skills_required: ["Node.js", "PostgreSQL", "MongoDB", "Docker"],
  },
];

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API - Structure ready for real API integration
export const jobRequirementsAPI = {
  getAll: async (params) => {
    await delay(500); // Simulate network delay

    let filtered = [...mockJobRequirements];

    // Simulate search
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.job_title.toLowerCase().includes(searchLower) ||
          job.job_post.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
      );
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
    const job = mockJobRequirements.find((j) => j.id === id);
    return { data: job };
  },

  create: async (data) => {
    await delay(500);
    const newJob = {
      id: mockJobRequirements.length + 1,
      ...data,
    };
    mockJobRequirements.push(newJob);
    return { data: newJob };
  },

  update: async (id, data) => {
    await delay(500);
    const index = mockJobRequirements.findIndex((j) => j.id === id);
    if (index !== -1) {
      mockJobRequirements[index] = { ...mockJobRequirements[index], ...data };
      return { data: mockJobRequirements[index] };
    }
    throw new Error("Job not found");
  },

  delete: async (id) => {
    await delay(300);
    const index = mockJobRequirements.findIndex((j) => j.id === id);
    if (index !== -1) {
      mockJobRequirements.splice(index, 1);
      return { data: { success: true } };
    }
    throw new Error("Job not found");
  },
};

// When you get the real API, replace the above with:
/*
import API from "./api";

export const jobRequirementsAPI = {
  getAll: (params) => API.get("/company/job-posts/", { params }),
  getById: (id) => API.get(`/company/job-posts/${id}/`),
  create: (data) => API.post("/company/job-posts/", data),
  update: (id, data) => API.put(`/company/job-posts/${id}/`, data),
  delete: (id) => API.delete(`/company/job-posts/${id}/`),
};
*/
