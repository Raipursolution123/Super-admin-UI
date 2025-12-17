import { useState, useEffect } from "react";
import { jobRequirementsAPI } from "../services/jobRequirementsService";
import { message } from "antd";

export const useJobRequirements = () => {
  const [jobRequirements, setJobRequirements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");

  const fetchJobRequirements = async (page = 1, pageSize = 10, search = "") => {
    setLoading(true);
    try {
      const params = { page, page_size: pageSize, search };
      const res = await jobRequirementsAPI.getAll(params);
      const results = res.data?.results || res.data || [];
      const total = res.data?.count ?? results.length;
      setJobRequirements(results);
      setPagination({ current: page, pageSize, total });
    } catch (error) {
      message.error("Failed to load job requirements");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createJobRequirement = async (data) => {
    try {
      await jobRequirementsAPI.create(data);
      message.success("Job requirement created successfully");
      fetchJobRequirements(pagination.current, pagination.pageSize, search);
    } catch (error) {
      message.error("Failed to create job requirement");
      console.error(error);
    }
  };

  const updateJobRequirement = async (id, data) => {
    try {
      await jobRequirementsAPI.update(id, data);
      message.success("Job requirement updated successfully");
      fetchJobRequirements(pagination.current, pagination.pageSize, search);
    } catch (error) {
      message.error("Failed to update job requirement");
      console.error(error);
    }
  };

  const deleteJobRequirement = async (id) => {
    try {
      await jobRequirementsAPI.delete(id);
      message.success("Job requirement deleted successfully");
      fetchJobRequirements(pagination.current, pagination.pageSize, search);
    } catch (error) {
      message.error("Failed to delete job requirement");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchJobRequirements(pagination.current, pagination.pageSize, search);
  }, []);

  return {
    jobRequirements,
    loading,
    pagination,
    setPagination,
    fetchJobRequirements,
    createJobRequirement,
    updateJobRequirement,
    deleteJobRequirement,
    search,
    setSearch,
  };
};
