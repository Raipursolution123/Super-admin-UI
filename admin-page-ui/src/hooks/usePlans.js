import { useState, useEffect } from "react";
import { plansAPI } from "../services/plansService";
import { message } from "antd";

export const usePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");

  const fetchPlans = async (page = 1, pageSize = 10, search = "") => {
    setLoading(true);
    try {
      const params = { page, page_size: pageSize, search };
      const res = await plansAPI.getAll(params);
      const results = res.data?.results || res.data || [];
      const total = res.data?.count ?? results.length;
      setPlans(results);
      setPagination({ current: page, pageSize, total });
    } catch (error) {
      message.error("Failed to load plans");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (data) => {
    try {
      await plansAPI.create(data);
      message.success("Plan created successfully");
      fetchPlans(pagination.current, pagination.pageSize, search);
    } catch (error) {
      message.error("Failed to create plan");
      console.error(error);
    }
  };

  const updatePlan = async (id, data) => {
    try {
      await plansAPI.update(id, data);
      message.success("Plan updated successfully");
      fetchPlans(pagination.current, pagination.pageSize, search);
    } catch (error) {
      message.error("Failed to update plan");
      console.error(error);
    }
  };

  const deletePlan = async (id) => {
    try {
      await plansAPI.delete(id);
      message.success("Plan deleted successfully");
      fetchPlans(pagination.current, pagination.pageSize, search);
    } catch (error) {
      message.error("Failed to delete plan");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlans(pagination.current, pagination.pageSize, search);
  }, []);

  return {
    plans,
    loading,
    pagination,
    setPagination,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    search,
    setSearch,
  };
};
