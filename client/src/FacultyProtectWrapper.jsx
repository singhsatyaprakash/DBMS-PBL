import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FacultyContext } from './context/FacultyContext';

const FacultyProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { faculty, setFaculty } = useContext(FacultyContext);

  useEffect(() => {
    if (faculty) {
      return;
    }
    const facultyToken = localStorage.getItem('token');
    if (!facultyToken) {
      navigate('/');
      return;
    }

    const validateFaculty= async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/faculty/validate-token`,{ token: facultyToken });
        // console.log(response);
        if (response.status === 200) {
          setFaculty(response.data.user);
        } else {
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    validateFaculty();
  }, []);

  return faculty ? <>{children}</> : null; 
};

export default FacultyProtectWrapper;