import { useState, useEffect } from "react";
import { plansAPI } from "../services/plansService";
import { message } from "antd";

export const usePlans = () => {
  const [plans, setPlans] = useState([]);
  const [statistics, setStatistics] = useState(null);
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

      // Backend returns { plans: [...], statistics: {...} }
      // Or if using standard DRF pagination it might be inside results
      // Based on user snippet: return Response({ "plans": serializer.data, "statistics": ... })

      const plansData = res.data.plans || [];
      const statsData = res.data.statistics || null;

      setPlans(plansData);
      setStatistics(statsData);

      // Since the backend snippet uses a simple list view without built-in pagination in the snippet,
      // we might need to handle pagination client-side or assume standard DRF pagination if enabled globally.
      // The snippet showed `plans = SubscriptionPlan.objects.all()...` and `serializer(plans, many=True)`, 
      // suggesting NO server-side pagination in that specific view code.
      // So we set total to length of data.

      setPagination({
        current: page,
        pageSize,
        total: plansData.length
      });

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
      return true;
    } catch (error) {
      message.error(error.response?.data?.plan_name?.[0] || "Failed to create plan");
      console.error(error);
      return false;
    }
  };

  const updatePlan = async (id, data) => {
    try {
      await plansAPI.update(id, data);
      message.success("Plan updated successfully");
      fetchPlans(pagination.current, pagination.pageSize, search);
      return true;
    } catch (error) {
      message.error("Failed to update plan");
      console.error(error);
      return false;
    }
  };

  const deletePlan = async (id) => {
    try {
      await plansAPI.delete(id);
      message.success("Plan deleted successfully");
      fetchPlans(pagination.current, pagination.pageSize, search);
    } catch (error) {
      // Show specific backend error if available (e.g. active subscriptions)
      message.error(error.response?.data?.error || "Failed to delete plan");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlans(pagination.current, pagination.pageSize, search);
  }, []);

  return {
    plans,
    statistics,
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
