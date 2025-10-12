import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminProtectWrapper = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (role !== 'admin' || !adminToken) {
      navigate('/admin/login');
      return;
    }

    const validateToken = async () => {
      try {
        // FIX: The key should be 'token' to match the backend
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/admin/validate-token`,
          { token: adminToken } 
        );

        if (response.status !== 200) {
          localStorage.clear();
          navigate('/admin/login');
        }
      } catch (err) {
        console.error("Token validation failed:", err);
        localStorage.clear(); // Clear invalid token from storage
        navigate('/admin/login');
      }
    };

    validateToken();
  }, [navigate]); // Add navigate to the dependency array

  return <>{children}</>;
};

export default AdminProtectWrapper;
