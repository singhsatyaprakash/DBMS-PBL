import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaUserGraduate, FaBullhorn, 
    FaIdCard, FaEnvelope, FaPhone, FaChevronRight, FaUniversity, FaUserFriends, 
    FaBirthdayCake, FaBookReader, FaHashtag, FaUsers, FaClipboardCheck,
    FaCalendarAlt, FaBell
} from 'react-icons/fa';
import { motion } from 'framer-motion';

import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';
import noprofile from "../../assets/noprofile.png"

// Quick Links
const quickLinks = [
    { title: "Academic", icon: <FaUserGraduate />, color: "from-blue-500 to-blue-600", path: "/student/academic" },
    { title: "Circular", icon: <FaBullhorn />, color: "from-orange-500 to-orange-600", path: "/student/circulars" },
];

const StudentDashboard = () => {
    const {student} = useContext(StudentContext);
    const [studentData, setStudentData] = useState({});
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchStudentData = async () => {
            if (student && student.email) {
                try {
                    const profileResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/student/profile`, {
                        params: {
                            email: student.email
                        }
                    });
                    const data = profileResponse.data.student;
                    setStudentData(data);
                } catch (error) {
                    console.error("Failed to fetch student data:", error);
                }
            }
        };

        fetchStudentData();
    }, [student]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/get-announcements`);
                setAnnouncements(response.data.announcements.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch announcements:", error);
            }
        };

        fetchAnnouncements();
    }, []);

    const listVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    
    const DetailItem = ({ label, value, icon }) => (
        <motion.li 
            className="flex justify-between items-center py-3 px-3 border-b border-slate-100 last:border-none hover:bg-slate-50 rounded-lg transition-colors"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <span className="flex items-center gap-3 font-medium text-slate-600">
                <span className="text-blue-500">{icon}</span>
                {label}
            </span>
            <span className="text-slate-800 text-right break-all ml-4 font-medium">{value || "N/A"}</span>
        </motion.li>
    );

    return (
        <main className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen overflow-y-auto">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-slate-800">Welcome back, {studentData.name}!</h2>
                </div>
                <p className="text-slate-600 ml-5">Here's your dashboard overview for today</p>
                
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaHashtag className="text-blue-600 text-lg" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Student ID</p>
                                <p className="font-bold text-slate-800">{studentData?.student_id}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaBookReader className="text-green-600 text-lg" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Year/Semester</p>
                                <p className="font-bold text-slate-800">{studentData?.year}/{studentData?.semester}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FaUniversity className="text-purple-600 text-lg" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Course</p>
                                <p className="font-bold text-slate-800 truncate">{studentData?.course_id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column: Profile Information */}
                <motion.div 
                    className="xl:col-span-2 space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Profile Card */}
                    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                        <div className="absolute -bottom-16 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
                        
                        <div className="relative z-10 flex items-start gap-6">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <img 
                                    src={studentData?.profile_image_url || noprofile} 
                                    alt="Student Profile" 
                                    className="w-24 h-24 rounded-2xl ring-4 ring-white/30 object-cover shadow-2xl" 
                                />
                            </motion.div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-1">{studentData?.name}</h3>
                                <p className="text-blue-100 font-mono tracking-wider mb-4">{studentData?.student_id}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <FaEnvelope className="text-blue-200" />
                                        <span className="truncate">{studentData?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <FaPhone className="text-blue-200" />
                                        <span>{studentData?.contact}</span>
                                    </div>
                                </div>
                                
                                <motion.button 
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-6 w-full bg-white text-blue-600 font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-blue-50 transition-all shadow-lg"
                                >
                                    <FaIdCard className="text-lg" /> 
                                    View ID Card
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {quickLinks.map(link => (
                            <motion.div key={link.title} variants={itemVariants}>
                                <Link to={link.path}>
                                    <motion.div 
                                        whileHover={{ scale: 1.03, y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-slate-100"
                                    >
                                        <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${link.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform mb-4`}>
                                            {link.icon}
                                        </div>
                                        <p className="text-center text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                            {link.title}
                                        </p>
                                        <div className="w-0 group-hover:w-12 h-0.5 bg-blue-500 mx-auto mt-2 transition-all duration-300"></div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right Column: Details and Announcements */}
                <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {/* Profile Details Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaUserFriends className="text-blue-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800">Profile Details</h4>
                        </div>
                        
                        <ul className="space-y-1">
                            <DetailItem label="Father's Name" value={studentData?.father_name} icon={<FaUserFriends />} />
                            <DetailItem label="Mother's Name" value={studentData?.mother_name} icon={<FaUserFriends />} />
                            <DetailItem 
                                label="Date of Birth" 
                                value={studentData?.dob ? new Date(studentData.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null} 
                                icon={<FaBirthdayCake />} 
                            />
                            <DetailItem label="College" value={studentData?.college || "Graphic Era Hill University"} icon={<FaUniversity />} />
                            <DetailItem label="Course" value={studentData?.course_id} icon={<FaBookReader />} />
                            <DetailItem label="Year/Semester" value={studentData?.year && studentData?.semester ? `${studentData.year}/${studentData.semester}` : null} icon={<FaClipboardCheck />} />
                            <DetailItem label="Class Roll No." value={studentData?.class_rollno} icon={<FaHashtag />} />
                            <DetailItem label="Enrollment No." value={studentData?.roll_no} icon={<FaHashtag />} />
                            <DetailItem label="University ID" value={studentData?.university_id} icon={<FaHashtag />} />
                        </ul>
                    </div>

                    {/* Latest Announcements Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <FaBell className="text-orange-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800">Latest Announcements</h4>
                        </div>
                        
                        <div className="space-y-4">
                            {announcements.length > 0 ? (
                                announcements.map((ann, index) => (
                                    <motion.div 
                                        key={ann._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-slate-100 group"
                                    >
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                                            <FaCalendarAlt className="text-blue-600 text-sm" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                                                {ann.title}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {new Date(ann.created_at || ann.date).toLocaleDateString('en-GB', { 
                                                    day: 'numeric', 
                                                    month: 'short', 
                                                    year: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                        <FaChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors mt-1 flex-shrink-0" />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FaBell className="text-slate-400 text-xl" />
                                    </div>
                                    <p className="text-slate-500 text-sm">No new announcements found</p>
                                </div>
                            )}
                        </div>
                        
                        <Link 
                            to="/student/circulars" 
                            className="block text-center mt-6 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors py-2 border border-blue-100 rounded-lg hover:bg-blue-50"
                        >
                            View All Announcements
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default StudentDashboard;