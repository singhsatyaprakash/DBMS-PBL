import React, { useContext, useEffect, useState } from 'react';
import { FaUsers, FaBook, FaBullhorn, FaChalkboardTeacher } from 'react-icons/fa'; // Added FaChalkboardTeacher
import { FacultyContext } from '../../context/FacultyContext';
import axios from 'axios';

// No changes to StatCard
const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-gradient-to-br ${color} text-white p-6 rounded-xl shadow-lg flex items-center justify-between`}>
        <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl opacity-50">{icon}</div>
    </div>
);

const FacultyDashboard = () => {
    // Stats state
    const [stats, setStats] = useState([
        { title: "Total Students", value: "...", icon: <FaUsers />, color: "from-blue-500 to-blue-600" },
        { title: "Courses Assigned", value: "...", icon: <FaBook />, color: "from-green-500 to-green-600" },
    ]);

    // State for data and loading
    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);
    
    const { faculty, setFaculty } = useContext(FacultyContext);
    
    // Fetch faculty details
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

    // Fetch all dashboard stats
    useEffect(() => {
        const fetchDashboardStats = async () => {
            if (faculty?.id) {
                setIsLoadingStats(true);
                try {
                    // Fetch subjects and student count concurrently
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

                    // Update the stats state with all fetched data
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

        // Separate fetch for announcements
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
    }, [faculty.id]); // Re-run all fetches if the faculty ID changes

    return (
        // Main container with spacious vertical layout
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                Welcome, {faculty?.name || "Faculty Member"}
            </h2>

            {/* Stats Section - now 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
            </div>

            {/* NEW LAYOUT: 
              We no longer use the lg:grid-cols-2 wrapper.
              Announcements is its own full-width card.
              Subjects is its own full-width section.
            */}

            {/* Recent Announcements Card */}
            <div className="bg-white p-6 rounded-2xl shadow-md border">
                <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-3">
                    <FaBullhorn className="text-blue-600"/> Recent Announcements
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {isLoadingAnnouncements ? (
                         <p className="text-sm text-slate-500">Loading announcements...</p>
                    ) : announcements.length === 0 ? (
                        <p className="text-sm text-slate-500">No announcements found.</p>
                    ) : (
                        announcements.map(item => (
                            <div key={item.announcement_id} className="bg-slate-50 p-4 rounded-lg border">
                                <h4 className="font-semibold text-slate-800">{item.title}</h4>
                                <span className="text-sm text-slate-500">
                                    {/* Use date_posted (from your backend) */}
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            {/* My Assigned Subjects Section */}
            <div>
                <h3 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-3">
                    <FaChalkboardTeacher className="text-green-600"/> My Assigned Subjects
                </h3>
                
                {isLoadingStats ? (
                    <p className="text-sm text-slate-500">Loading subjects...</p>
                ) : assignedSubjects.length === 0 ? (
                    <div className="bg-white p-6 rounded-2xl shadow-md border text-center">
                        <p className="text-slate-600">You are not currently assigned to any subjects.</p>
                    </div>
                ) : (
                    // This is the new responsive grid for subject cards
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {assignedSubjects.map(subject => (
                            <div key={subject.sf_id} className="bg-white p-5 rounded-lg border shadow-sm transition-all hover:shadow-md">
                                
                                <p className="font-bold text-lg text-slate-800">
                                    {subject.subject_name}
                                </p>
                                <p className="text-sm font-medium text-slate-500 mb-3">
                                    ({subject.subject_code})
                                </p>
                                
                                <div className="text-sm text-slate-600 space-y-1 mt-3 pt-3 border-t">
                                    <p>
                                        <span className="font-semibold text-gray-800">Course:</span> {subject.course_name}
                                    </p>
                                    
                                    {/* Conditionally render Branch only if it exists */}
                                    {subject.branch_name && (
                                        <p>
                                            <span className="font-semibold text-gray-800">Branch:</span> {subject.branch_name}
                                        </p>
                                    )}
                                    <p>
                                        <span className="font-semibold text-gray-800">Semester:</span> {subject.semester}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacultyDashboard;