import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './store/slices/authSlice';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import JobRequirements from './pages/JobRequirements';
import PlanManagement from './pages/PlanManagement';
import CompanyManagement from './pages/CompanyManagement';
import EmailSettings from './pages/EmailSettings';

// Placeholder components
const Menu5 = () => <h2>Menu Item 5 Content</h2>;
const Profile = () => <h2>User Profile</h2>;

const AuthHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const access = params.get('access');
    const refresh = params.get('refresh');

    if (access) {
      dispatch(setCredentials({ access, refresh }));
      // Remove tokens from URL
      navigate(location.pathname, { replace: true });
    }
  }, [location, dispatch, navigate]);

  return null;
};

import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthHandler />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="job-requirements" element={<JobRequirements />} />
            <Route path="plan-management" element={<PlanManagement />} />
            <Route path="company-management" element={<CompanyManagement />} />
            <Route path="email-settings" element={<EmailSettings />} />
            <Route path="menu5" element={<Menu5 />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="/login" element={<h2>Login Page Placeholder (Redirect to Hrms-ui Login)</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
