// src/Pages/StudentPages/Subjects.jsx

import React, { useContext, useEffect, useState } from 'react';
import { FaUserTie, FaBarcode, FaBook, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';

const Subjects = () => {
  const { student } = useContext(StudentContext);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [error, setError] = useState('');

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
          setError('Failed to load student profile');
        }
      }
    };

    fetchStudentData();
  }, [student]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!student) return;
      
      setLoading(true);
      setError('');
      try {
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
          const normalized = data.map(s => ({
            name: s.name || s.subject_name || s.title || 'Untitled',
            code: s.code || s.subject_code || s.id || 'N/A',
            faculty: s.faculty_name || s.faculty || (s.faculty_first_name && s.faculty_last_name ? `${s.faculty_first_name} ${s.faculty_last_name}` : 'TBA'),
            credits: s.credits || s.credit_points || 'N/A',
            type: s.type || s.subject_type || 'Core',
          }));
          setSubjects(normalized);
        } else {
          setSubjects([]);
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        setError('Failed to load subjects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (studentData.department_id) {
      fetchSubjects();
    }
  }, [studentData]);

  // Enhanced loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="p-6 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Subject card component
  const SubjectCard = ({ subject, index }) => (
    <div 
      className="group p-6 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.5s ease-out forwards'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
            {subject.name}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              subject.type === 'Elective' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {subject.type}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {subject.credits} Credits
            </span>
          </div>
        </div>
        <div className="ml-4 p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          <FaBook className="text-blue-600 text-xl" />
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="p-2 bg-gray-100 rounded-lg">
            <FaBarcode className="text-gray-500" />
          </div>
          <div>
            <span className="font-medium text-gray-500">Code:</span>
            <span className="ml-2 font-mono text-gray-800">{subject.code}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="p-2 bg-gray-100 rounded-lg">
            <FaUserTie className="text-gray-500" />
          </div>
          <div>
            <span className="font-medium text-gray-500">Faculty:</span>
            <span className="ml-2 text-gray-800">{subject.faculty}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Current Subjects</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {studentData.semester && studentData.year 
              ? `Semester ${studentData.semester}, Year ${studentData.year}`
              : 'Your current semester subjects'
            }
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <FaExclamationTriangle className="text-red-500 text-xl" />
              <div>
                <p className="text-red-800 font-medium">{error}</p>
                <p className="text-red-600 text-sm mt-1">Please refresh the page or contact support if the problem persists.</p>
              </div>
            </div>
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : subjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBook className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Subjects Found</h3>
                <p className="text-gray-500 mb-6">
                  {error 
                    ? 'Unable to load subjects due to an error.'
                    : 'No subjects found for your current course and semester.'
                  }
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Bar */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
                <div className="flex flex-wrap justify-between items-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{subjects.length}</div>
                    <div className="text-blue-100">Total Subjects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {subjects.filter(s => s.type === 'Core').length}
                    </div>
                    <div className="text-blue-100">Core Subjects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {subjects.filter(s => s.type === 'Elective').length}
                    </div>
                    <div className="text-blue-100">Electives</div>
                  </div>
                </div>
              </div>

              {/* Subjects Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                {subjects.map((subject, index) => (
                  <SubjectCard key={subject.code} subject={subject} index={index} />
                ))}
              </div>

              {/* Footer Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-500 text-sm">
                  Need help with your subjects? Contact your academic advisor or department office.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Subjects;