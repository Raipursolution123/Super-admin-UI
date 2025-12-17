import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { message } from 'antd';

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [planDistribution, setPlanDistribution] = useState([]);

  // Default colors for plans
  const PLAN_COLORS = {
    'Enterprise': '#667eea',
    'Premium': '#764ba2',
    'Basic': '#f59e0b',
    'Free': '#6b7280'
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both APIs in parallel
      const [statsData, growthDataResponse] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getGrowthOverview()
      ]);

      // Process Stats & Plan Distribution
      setStats({
        totalCompanies: statsData.total_companies,
        totalEmployees: statsData.total_employees,
        activeSubscriptions: statsData.active_subscriptions,
        monthlyRevenue: statsData.monthly_revenue
      });

      // Transform plan distribution from object { "Plan": count } to array for charts
      const distributionArray = Object.entries(statsData.plan_distribution || {}).map(([name, value]) => ({
        name,
        value,
        color: PLAN_COLORS[name] || '#9ca3af' // Default color if not found
      }));
      setPlanDistribution(distributionArray);

      // Process Growth Data
      // API returns { months: [], companies: [], employees: [] }
      // We need array of objects { month, companies, employees }
      if (growthDataResponse && growthDataResponse.months) {
        const formattedGrowthData = growthDataResponse.months.map((month, index) => ({
          month,
          companies: growthDataResponse.companies[index] || 0,
          employees: growthDataResponse.employees[index] || 0
        }));
        setGrowthData(formattedGrowthData);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    loading,
    error,
    stats,
    growthData,
    planDistribution,
    refetch: fetchDashboardData
  };
};
