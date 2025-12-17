import API from './api';

export const dashboardService = {

  getStats: async () => {
    const response = await API.get('superadmin/dashboard-stats/');
    return response.data;
  },


  getGrowthOverview: async () => {
    const response = await API.get('superadmin/growth-overview/');
    return response.data;
  }
};
