import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentContext } from './context/StudentContext';
import axios from 'axios';

const StudentProtectWrapper = ({ children }) => {
  const navigate = useNavigate();

  const {student,setStudent}=useContext(StudentContext);
  useEffect(() => {
    if (student) {
      return;
    }
    const studentToken = localStorage.getItem('token');
    if (!studentToken) {
      navigate('/');
      return;
    }

    const validateStudent = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/student/validate-token`,{ token: studentToken });
        if (response.status === 200) {
          setStudent(response.data.user);
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

    validateStudent();
  }, []);

  return student ? <>{children}</> : null; 
};

export default StudentProtectWrapper;
