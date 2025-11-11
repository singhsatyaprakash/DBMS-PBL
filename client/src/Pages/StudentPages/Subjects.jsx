// src/Pages/StudentPages/Subjects.jsx

import React, { useContext, useEffect, useState } from 'react';
import { FaUserTie, FaBarcode } from 'react-icons/fa';
import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';

const Subjects = () => {

  const { student } = useContext(StudentContext);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
     const [studentData,setStudentData]=useState({});
    useEffect(() => {
    const fetchStudentData = async () => {
        if (student && student.email) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/student/profile`, {
            params: {
                email: student.email
            }
            });
            setStudentData(response.data.student);
        } catch (error) {
            console.error("Failed to fetch student data:", error);
        }
        }
    };

    fetchStudentData();
    }, [student]);

  useEffect(() => {
    const fetchSubjects = async () => {
      // require student to be present (populated by StudentDashboard or login)
      if (!student) return;
      setLoading(true);
      try {
        // console.log(student)
        // Try fetching by student's identifying details. Backend should accept email or department/course details.
        const params = {
          department_id: studentData.department_id,
          course_id: studentData.course_id,
          branch_id: studentData.branch_id,
          year: studentData.year,
          semester: studentData.semester,
        };
        console.log(params);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/student/current-subjects`, { params });
        console.log(res);
        const data = res?.data?.subjects ?? res?.data ?? [];

        if (Array.isArray(data) && data.length > 0) {
          // normalize faculty field for display
          const normalized = data.map(s => ({
            name: s.name || s.subject_name || s.title || 'Untitled',
            code: s.code || s.subject_code || s.id || 'N/A',
            faculty: s.faculty_name || s.faculty || (s.faculty_first_name && s.faculty_last_name ? `${s.faculty_first_name} ${s.faculty_last_name}` : 'TBA'),
          }));
          setSubjects(normalized);
        } else {
          // empty result: set to empty array and let UI show message
          setSubjects([]);
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        // keep sampleList as fallback if fetch fails (but show console message)
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [studentData]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Current Subjects</h2>

      {loading ? (
        <div className="text-sm text-slate-600">Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <div className="text-sm text-slate-600">No subjects found for your current course/semester. If this seems wrong, contact admin.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {subjects.map(item => (
            <div key={item.code} className="p-4 border rounded-lg bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-slate-600">
                <p className="flex items-center gap-2"><FaBarcode /> {item.code}</p>
                <p className="flex items-center gap-2"><FaUserTie /> {item.faculty}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subjects;