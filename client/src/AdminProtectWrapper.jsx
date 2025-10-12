import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './context/useAdmin';

const AdminProtectWrapper = ({ children }) => {
  const navigate = useNavigate();

  const { admin, loading, refresh } = useAdmin();

  useEffect(() => {
    // If there's no admin but a token exists, try to refresh profile once
    const adminToken = localStorage.getItem('token');
    if (!admin && adminToken) {
      // attempt to refresh admin profile from context
      refresh();
    }

    if (!loading && !admin) {
      // no admin after loading -> redirect to login
      navigate('/admin/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin, loading, navigate]);

  if (loading) return null; // or a spinner

  return <>{children}</>;
};

export default AdminProtectWrapper;
