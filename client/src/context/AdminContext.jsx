import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const AdminContext = createContext(null);
export { AdminContext };

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/profile-by-token`, {
        params: { token },
      });

      if (response.status === 200) {
        setAdmin(response.data);
      } else {
    
        setAdmin(null);
      }
    } catch (err) {
      console.error('Failed to fetch admin profile:', err?.message || err);
      // clear invalid token/role
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setAdmin(null);
      setError(err?.message || 'Failed to fetch admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  const value = {
    admin,
    setAdmin,
    loading,
    error,
    refresh: fetchAdmin,
  };

  return( 
  <AdminContext.Provider value={value}>
    {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
