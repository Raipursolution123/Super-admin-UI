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
      const results = res.data?.results || res.data || [];
      const total = res.data?.count ?? results.length;
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
      fetchCompanies(pagination.current, pagination.pageSize, search, statusFilter);
    } catch (error) {
      message.error("Failed to add company");
      console.error(error);
    }
  };

  const updateCompany = async (id, data) => {
    try {
      await companiesAPI.update(id, data);
      message.success("Company updated successfully");
      fetchCompanies(pagination.current, pagination.pageSize, search, statusFilter);
    } catch (error) {
      message.error("Failed to update company");
      console.error(error);
    }
  };

  const approveCompany = async (id) => {
    try {
      await companiesAPI.approve(id);
      message.success("Company approved successfully");
      fetchCompanies(pagination.current, pagination.pageSize, search, statusFilter);
    } catch (error) {
      message.error("Failed to approve company");
      console.error(error);
    }
  };

  const disapproveCompany = async (id) => {
    try {
      await companiesAPI.disapprove(id);
      message.success("Company disapproved");
      fetchCompanies(pagination.current, pagination.pageSize, search, statusFilter);
    } catch (error) {
      message.error("Failed to disapprove company");
      console.error(error);
    }
  };

  const suspendCompany = async (id) => {
    try {
      await companiesAPI.suspend(id);
      message.success("Company suspended");
      fetchCompanies(pagination.current, pagination.pageSize, search, statusFilter);
    } catch (error) {
      message.error("Failed to suspend company");
      console.error(error);
    }
  };

  const deleteCompany = async (id) => {
    try {
      await companiesAPI.delete(id);
      message.success("Company deleted successfully");
      fetchCompanies(pagination.current, pagination.pageSize, search, statusFilter);
    } catch (error) {
      message.error("Failed to delete company");
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
    updateCompany,
    approveCompany,
    disapproveCompany,
    suspendCompany,
    deleteCompany,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  };
};
