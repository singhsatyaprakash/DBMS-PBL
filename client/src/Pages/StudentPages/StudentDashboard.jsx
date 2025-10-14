import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaUserGraduate, FaMoneyBill, FaBullhorn, FaFileSignature, 
    FaIdCard, FaEnvelope, FaPhone 
} from 'react-icons/fa';
import StudentNavbar from './StudentNavbar';

const StudentDashboard = () => {
    
    // Dummy data for the student profile
    const studentData = {
        name: "SHASHANK BISHT",
        id: "23151280",
        email: "SHASHANKBISHT784@GMAIL.COM",
        phone: "9138086489",
        fatherName: "INDRA SINGH",
        motherName: "SHANTI DEVI",
        dob: "13/05/2004",
        officialEmail: "SHASHANKBISHT.23151280@gehu.ac.in",
        college: "GEHU Dehradun Campus",
        course: "BACHELOR OF COMPUTER APPLICATIONS",
        yearSem: 5,
        section: "B2",
        classRollNo: 46,
        enrollNo: "PH-23210026",
        universityRollNo: "2321026",
        profileImage: "https://i.pravatar.cc/150?u=shashank"
    };

    // Data for the quick link icon buttons
    const quickLinks = [
        { title: "Academic", icon: <FaUserGraduate />, color: "bg-pink-500", path: "/student/academic" },
        { title: "Fee", icon: <FaMoneyBill />, color: "bg-green-500", path: "/student/fee" },
        { title: "Circular", icon: <FaBullhorn />, color: "bg-yellow-500", path: "/student/circulars" },
        { title: "Exam", icon: <FaFileSignature />, color: "bg-purple-500", path: "/student/exams" },
    ];

    return (
        <>
        <StudentNavbar></StudentNavbar>
        <div className="p-4 sm:p-6 bg-slate-100 min-h-full">
            {/* Main Dashboard Layout: Left Profile + Right Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Profile Information */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg text-center">
                        <img src={studentData.profileImage} alt="Student Profile" className="w-24 h-24 rounded-full mx-auto ring-4 ring-blue-400 object-cover" />
                        <h3 className="text-xl font-bold mt-4">{studentData.name}</h3>
                        <p className="text-sm opacity-80">{studentData.id}</p>
                        <div className="text-left mt-4 space-y-2 text-sm">
                            <p className="flex items-center gap-2"><FaEnvelope /> {studentData.email}</p>
                            <p className="flex items-center gap-2"><FaPhone /> {studentData.phone}</p>
                        </div>
                        <button className="mt-4 w-full bg-white text-blue-600 font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition">
                            <FaIdCard /> ID Card
                        </button>
                    </div>

                    {/* Detailed Info List */}
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <ul className="text-sm text-slate-700 divide-y divide-slate-200">
                            <li className="py-2 flex justify-between items-center"><strong>Father's Name :</strong> <span>{studentData.fatherName}</span></li>
                            <li className="py-2 flex justify-between items-center"><strong>Mother's Name :</strong> <span>{studentData.motherName}</span></li>
                            <li className="py-2 flex justify-between items-center"><strong>D.O.B. :</strong> <span>{studentData.dob}</span></li>
                            <li className="py-2 flex justify-between items-start">
                                <strong>Official Email :</strong> 
                                <span className="text-right break-all ml-2">{studentData.officialEmail}</span>
                            </li>
                            <li className="py-2 flex justify-between items-center"><strong>Course :</strong> <span className="font-semibold">{studentData.course}</span></li>
                            <li className="py-2 flex justify-between items-center"><strong>Year/Sem :</strong> <span>{studentData.yearSem}</span></li>
                            <li className="py-2 flex justify-between items-center"><strong>Section :</strong> <span>{studentData.section}</span></li>
                            <li className="py-2 flex justify-between items-center"><strong>Class Roll No. :</strong> <span>{studentData.classRollNo}</span></li>
                            <li className="py-2 flex justify-between items-center"><strong>Enroll No. :</strong> <span>{studentData.enrollNo}</span></li>
                            <li className="py-2 flex justify-between items-center"><strong>University Roll No. :</strong> <span>{studentData.universityRollNo}</span></li>
                        </ul>
                    </div>
                </div>

                {/* Right Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {quickLinks.map(link => (
                            <Link to={link.path} key={link.title}>
                                <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                    <div className={`w-16 h-16 mx-auto ${link.color} text-white rounded-full flex items-center justify-center text-3xl`}>
                                        {link.icon}
                                    </div>
                                    <p className="mt-3 font-semibold text-slate-700">{link.title}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Circular Notices Card */}
                        <div className="bg-white p-4 rounded-xl shadow-md">
                            <h4 className="font-bold text-blue-700 border-b pb-2 mb-2">Circular Notices</h4>
                            <ul className="text-sm space-y-2">
                                <li className="hover:bg-slate-50 p-1 rounded">
                                    <p>KINDLY FIND THE ATTACHED NOTICE NO 50...</p>
                                    <p className="text-xs text-slate-500">08/10/2025</p>
                                </li>
                                <li className="hover:bg-slate-50 p-1 rounded">
                                    <p>Notice no 25 regarding Shooting and Taekwondo classes</p>
                                    <p className="text-xs text-slate-500">20/08/2025</p>
                                </li>
                            </ul>
                            <button className="text-sm text-blue-600 font-semibold mt-2 hover:underline">More..</button>
                        </div>
                        
                        {/* Placeholder Cards */}
                        <div className="bg-white p-4 rounded-xl shadow-md">
                            <h4 className="font-bold text-blue-700 border-b pb-2 mb-2">Results</h4>
                            <p className="text-sm text-slate-500">No new results to show.</p>
                            <button className="text-sm text-blue-600 font-semibold mt-2 hover:underline">More..</button>                               
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};

export default StudentDashboard;

