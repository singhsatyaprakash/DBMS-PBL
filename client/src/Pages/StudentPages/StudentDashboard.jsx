import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaUserGraduate, FaMoneyBillWave, FaBullhorn, FaFileSignature, 
    FaIdCard, FaEnvelope, FaPhone, FaChevronRight, FaUniversity, FaUserFriends, 
    FaBirthdayCake, FaBookReader, FaHashtag, FaUsers, FaClipboardCheck
} from 'react-icons/fa';
import { motion } from 'framer-motion';

import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';
import noprofile from "../../assets/noprofile.png"

const quickLinks = [
    { title: "Academic", icon: <FaUserGraduate />, color: "from-sky-400 to-sky-600", path: "/student/academic" },
    { title: "Fee", icon: <FaMoneyBillWave />, color: "from-emerald-400 to-emerald-600", path: "/student/fee" },
    { title: "Circular", icon: <FaBullhorn />, color: "from-amber-400 to-amber-600", path: "/student/circulars" },
    { title: "Exam", icon: <FaFileSignature />, color: "from-purple-400 to-purple-600", path: "/student/exams" },
];

const StudentDashboard = () => {
    const {student}=useContext(StudentContext);
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
            // console.log(response);
            // console.log(response.data.student);
            setStudentData(response.data.student);
        } catch (error) {
            console.error("Failed to fetch student data:", error);
        }
        }
    };

    fetchStudentData();
    }, [student]);

    const listVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    
    const DetailItem = ({ label, value, icon }) => (
        <li className="flex justify-between items-center py-3 px-2 border-b border-slate-100 last:border-none">
            <span className="flex items-center gap-3 font-semibold text-slate-600">
                {icon}
                {label}
            </span>
            <span className="text-slate-800 text-right break-all ml-4">{value}</span>
        </li>
    );

    return (
        <main className="p-4 sm:p-6 bg-slate-50 min-h-screen overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-3xl font-bold text-slate-800">Welcome, {studentData.name}!</h2>
                <p className="text-slate-500 mt-1">Here's your dashboard overview for today.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

                {/* Left Column: Profile Information */}
                <motion.div 
                    className="lg:col-span-1 space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Profile Card */}
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-6 rounded-2xl shadow-xl text-center relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                        <div className="absolute -bottom-16 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
                        <img src={studentData?.profile_image_url|| noprofile} alt="Student Profile" className="relative z-10 w-28 h-28 rounded-full mx-auto ring-4 ring-indigo-400/50 object-cover shadow-lg" />
                        <h3 className="relative z-10 text-2xl font-bold mt-4">{studentData?.name}</h3>
                        <p className="relative z-10 text-sm opacity-80 font-mono tracking-wider">{studentData?.student_id}</p>
                        <div className="relative z-10 text-left mt-6 space-y-3 text-sm bg-black/10 p-4 rounded-lg">
                            <p className="flex items-center gap-3"><FaEnvelope /> {studentData?.email}</p>
                            <p className="flex items-center gap-3"><FaPhone /> {studentData?.contact}</p>
                        </div>
                        <button className="relative z-10 mt-6 w-full bg-white text-indigo-600 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-50 transition-transform transform hover:scale-105 shadow-md">
                            <FaIdCard /> View ID Card
                        </button>
                    </div>

                    {/* UNIFIED Details Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-md">
                        <h4 className="text-lg font-bold text-slate-700 mb-2 border-b pb-3">Profile</h4>
                        <ul className="text-sm">
                            <DetailItem label="Father's Name" value={studentData?.father_name} icon={<FaUserFriends className="text-slate-400"/>} />
                            <DetailItem label="Mother's Name" value={studentData?.mother_name} icon={<FaUserFriends className="text-slate-400"/>} />
                            <DetailItem label="Date of Birth" value={studentData?.dob ? new Date(studentData.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"} icon={<FaBirthdayCake className="text-slate-400"/>} />
                            <DetailItem label="Official Email" value={studentData?.email} icon={<FaEnvelope className="text-slate-400"/>} />
                            <DetailItem label="College" value={studentData?.college||"Graphic Era Hill University "} icon={<FaUniversity className="text-slate-400"/>} />
                            <DetailItem label="Course" value={studentData?.course_id} icon={<FaBookReader className="text-slate-400"/>} />
                            <DetailItem label="Year / Semester" value={studentData?.year+"/"+studentData.semester} icon={<FaClipboardCheck className="text-slate-400"/>} />
                            <DetailItem label="Section" value={studentData?.section_id ||"N/A"} icon={<FaUsers className="text-slate-400"/>} />
                            <DetailItem label="Class Roll No." value={studentData?.class_rollno|| "N/A"} icon={<FaHashtag className="text-slate-400"/>} />
                            <DetailItem label="Enrollment No." value={studentData?.roll_no} icon={<FaHashtag className="text-slate-400"/>} />
                            <DetailItem label="University ID" value={studentData?.university_id} icon={<FaHashtag className="text-slate-400"/>} />
                        </ul>
                    </div>
                </motion.div>

                {/* Right Column: Main Content */}
                <motion.div 
                    className="lg:col-span-2 space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    {/* Quick Links */}
                    <motion.div 
                        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                        variants={listVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {quickLinks.map(link => (
                            <motion.div key={link.title} variants={itemVariants}>
                                <Link to={link.path}>
                                    <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group">
                                        <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${link.color} text-white rounded-full flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                                            {link.icon}
                                        </div>
                                        <p className="mt-3 font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{link.title}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Attendance Summary Card */}
                        <div className="bg-white p-5 rounded-2xl shadow-md flex flex-col">
                            <h4 className="text-lg font-bold text-slate-700 mb-4">Attendance Summary</h4>
                            <div className="flex-grow flex flex-col items-center justify-center">
                                <div className="relative w-32 h-32">
                                    <svg className="w-full h-full" viewBox="0 0 36 36">
                                        <path className="text-slate-200" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="text-emerald-500" strokeWidth="3" fill="none" strokeDasharray="85, 100" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-slate-700">85%</span>
                                    </div>
                                </div>
                                <p className="text-slate-600 mt-3 font-semibold">170 / 200 Classes Attended</p>
                            </div>
                            <Link to="/student/attendance" className="text-sm text-indigo-600 font-semibold mt-4 hover:underline text-center">View Detailed Report</Link>
                        </div>

                        {/* Latest Announcements Card */}
                         <div className="bg-white p-5 rounded-2xl shadow-md">
                            <h4 className="text-lg font-bold text-slate-700 mb-3">Latest Announcements</h4>
                            <ul className="text-sm space-y-3">
                                <li className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                    <div>
                                        <p className="font-medium text-slate-800">Notice regarding mid-term examinations</p>
                                        <p className="text-xs text-slate-500">October 08, 2025</p>
                                    </div>
                                    <FaChevronRight className="text-slate-400"/>
                                </li>
                                <li className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                    <div>
                                        <p className="font-medium text-slate-800">Sports week schedule announced</p>
                                        <p className="text-xs text-slate-500">August 20, 2025</p>
                                    </div>
                                    <FaChevronRight className="text-slate-400"/>
                                </li>
                                 <li className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                    <div>
                                        <p className="font-medium text-slate-800">Holiday declared on account of festival</p>
                                        <p className="text-xs text-slate-500">July 15, 2025</p>
                                    </div>
                                    <FaChevronRight className="text-slate-400"/>
                                </li>
                            </ul>
                            <Link to="/student/circulars" className="text-sm text-indigo-600 font-semibold mt-4 hover:underline inline-block">View All Announcements</Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default StudentDashboard;