import API from './api';

export const authAPI = {
  login: (credentials) => API.post('/login/', credentials),
  signup: (userData) => API.post('/signup/', userData),
  logout: () => API.post('/logout/'),
  getProfile: () => API.get('/auth/profile/'), // Assuming profile endpoint exists
};
