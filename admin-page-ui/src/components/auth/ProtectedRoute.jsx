import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const hasTokenInUrl = params.get('access');

  if (!isAuthenticated && !hasTokenInUrl) {

    return window.location.replace('http://hrms.raipursolutions.com/login?logout=true');
  }

  return <Outlet />;
};

export default ProtectedRoute;
