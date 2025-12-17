import { useState, useEffect } from "react";
import { companiesAPI } from "../services/companiesService";
import { message } from "antd";

export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);

  const fetchCompanies = async (page = 1, pageSize = 10, search = "", status = null) => {
    setLoading(true);
    try {
      const params = { page, page_size: pageSize, search };
      if (status) params.status = status;

      const res = await companiesAPI.getAll(params);
      // Backend response: { companies: [...], total_count: N }
      const results = res.data?.companies || [];
      const total = res.data?.total_count || 0;

      setCompanies(results);
      setPagination({ current: page, pageSize, total });
    } catch (error) {
      message.error("Failed to load companies");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (data) => {
    try {
      await companiesAPI.create(data);
      message.success("Company added successfully");
      // Refresh list
      fetchCompanies(pagination.current, pagination.pageSize, search, statusFilter);
    } catch (error) {
      // Backend returns error object, try to show specific message
      const errorMsg = error.response?.data?.error || "Failed to add company";
      message.error(errorMsg);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanies(pagination.current, pagination.pageSize, search, statusFilter);
  }, []);

  return {
    companies,
    loading,
    pagination,
    setPagination,
    fetchCompanies,
    createCompany,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  };
};
