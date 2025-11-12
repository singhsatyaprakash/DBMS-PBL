import React, { useContext, useEffect, useState } from 'react';
import { FaUsers, FaBook, FaBullhorn, FaChalkboardTeacher } from 'react-icons/fa';
import { FacultyContext } from '../../context/FacultyContext';
import axios from 'axios';

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-gradient-to-br ${color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium opacity-90 mb-2">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  </div>
);

const FacultyDashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Students", value: "...", icon: <FaUsers />, color: "from-blue-500 to-blue-600" },
    { title: "Courses Assigned", value: "...", icon: <FaBook />, color: "from-green-500 to-green-600" },
  ]);

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);
  
  const { faculty, setFaculty } = useContext(FacultyContext);
  
  useEffect(() => {
    const fetchFacultyDetails = async () => {
      if (faculty?.id && !faculty?.name) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/faculty/get-faculty/${faculty.id}`);
          setFaculty(response.data.faculty);
        } catch (err) {
          console.error("Failed to fetch faculty details:", err);
        }
      }
    };
    fetchFacultyDetails();
  }, [faculty.id, faculty.name, setFaculty]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (faculty?.id) {
        setIsLoadingStats(true);
        try {
          const [subjectsRes, studentsRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/faculty/my-subjects`, { 
              params: { facultyId: faculty.id } 
            }),
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/faculty/get-total-student`, {
              params: { facultyId: faculty.id }
            })
          ]);
          
          const subjectsData = subjectsRes.data;
          const assignedCoursesCount = subjectsData.length;
          const totalStudents = studentsRes.data.totalStudents;

          setAssignedSubjects(subjectsData);

          setStats([
            { ...stats[0], value: totalStudents }, 
            { ...stats[1], value: assignedCoursesCount }, 
          ]);

        } catch (err) {
          console.error("Failed to fetch faculty dashboard stats:", err);
          setStats(prev => prev.map(s => ({ ...s, value: '0' })));
        } finally {
          setIsLoadingStats(false);
        }
      }
    };

    const fetchAnnouncements = async () => {
      setIsLoadingAnnouncements(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/faculty/get-announcement`);
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      } finally {
        setIsLoadingAnnouncements(false);
      }
    };

    fetchDashboardStats();
    fetchAnnouncements();
  }, [faculty.id]);

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome, {faculty?.name || "Faculty Member"}
        </h2>
        <p className="text-gray-600 text-lg">Here's your dashboard overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.map(stat => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FaBullhorn className="text-blue-600 text-xl"/>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Recent Announcements</h3>
          </div>
          
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {isLoadingAnnouncements ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-gray-500">Loading announcements...</div>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No announcements found
              </div>
            ) : (
              announcements.map(item => (
                <div key={item.announcement_id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors group">
                  <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Announcement</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <FaChalkboardTeacher className="text-green-600 text-xl"/>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">My Assigned Subjects</h3>
              <p className="text-sm text-gray-500">{assignedSubjects.length} subjects assigned</p>
            </div>
          </div>
          
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {isLoadingStats ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-gray-500">Loading subjects...</div>
              </div>
            ) : assignedSubjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No subjects assigned currently
              </div>
            ) : (
              assignedSubjects.map(subject => (
                <div key={subject.sf_id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors">
                        {subject.subject_name}
                      </h4>
                      <p className="text-sm font-mono text-gray-500 mt-1">
                        {subject.subject_code}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Course:</span>
                      <span>{subject.course_name}</span>
                    </div>
                    {subject.branch_name && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Branch:</span>
                        <span>{subject.branch_name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Semester:</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Semester {subject.semester}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;