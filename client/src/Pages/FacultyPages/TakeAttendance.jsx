import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FacultyContext } from '../../context/FacultyContext';
import { FaBook, FaArrowLeft, FaUserCheck, FaUserTimes, FaUsers, FaCalendarAlt } from 'react-icons/fa';

const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
};

export default function TakeAttendance() {
    const { faculty } = useContext(FacultyContext);
    
    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [students, setStudents] = useState([]);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!faculty?.id) return;

        const fetchSubjects = async () => {
            setIsLoadingSubjects(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/faculty/my-subjects`, {
                    params: { facultyId: faculty.id }
                });
                const subjects = res?.data?.subjects ?? res?.data ?? [];
                setAssignedSubjects(subjects);
            } catch (err) {
                console.error("Failed to fetch subjects:", err);
                setAssignedSubjects([]);
            } finally {
                setIsLoadingSubjects(false);
            }
        };
        fetchSubjects();
    }, [faculty]);

    useEffect(() => {
        if (!selectedSubject) return;

        const fetchStudents = async () => {
            setIsLoadingStudents(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/faculty/students-for-subject`, {
                    params: {
                        course_id: selectedSubject.course_id,
                        semester: selectedSubject.semester,
                        branch_id: selectedSubject.branch_id
                    }
                });
                const list = res?.data?.students ?? res?.data ?? [];
                const formattedStudents = list.map(s => ({
                    id: s.student_id ?? s.id,
                    studentId: s.student_id ?? s.roll_no ?? s.studentId,
                    universityId: s.university_id ?? s.universityId,
                    name: s.name ?? `${s.first_name ?? ''} ${s.last_name ?? ''}`.trim(),
                    fatherName: s.father_name ?? s.fatherName ?? '',
                    status: 'present'
                }));
                setStudents(formattedStudents);
            } catch (err) {
                console.error("Failed to fetch students:", err);
                setStudents([]);
            } finally {
                setIsLoadingStudents(false);
            }
        };
        fetchStudents();
    }, [selectedSubject]);

    const handleStatusChange = (studentId, newStatus) => {
        setStudents(currentStudents =>
            currentStudents.map(student =>
                student.id === studentId ? { ...student, status: newStatus } : student
            )
        );
    };

    const handleMarkAllPresent = () => {
        setStudents(currentStudents =>
            currentStudents.map(student => ({ ...student, status: 'present' }))
        );
    };

    const handleMassBunk = () => {
        setStudents(currentStudents =>
            currentStudents.map(student => ({ ...student, status: 'absent' }))
        );
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const attendanceData = {
            faculty_subject_id: selectedSubject.sf_id,
            date: new Date().toISOString().split('T')[0],
            attendance: students.map(s => ({
                student_id: s.studentId,
                status: s.status
            }))
        };

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/faculty/mark-attendance`, attendanceData);
            alert("Attendance submitted successfully!");
            handleGoBack();
        } catch (err) {
            console.error("Failed to submit attendance:", err);
            alert("Error submitting attendance. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelectSubject = (subject) => {
        setSelectedSubject(subject);
    };
    
    const handleGoBack = () => {
        setSelectedSubject(null);
        setStudents([]);
    };

    const Header = () => (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-t-2xl relative">
            {selectedSubject && (
                <button 
                    onClick={handleGoBack}
                    className="absolute top-6 left-6 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                    <FaArrowLeft className="text-white" size={18} />
                </button>
            )}
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-3">
                    {selectedSubject ? selectedSubject.subject_name : "Take Attendance"}
                </h1>
                <div className="flex items-center justify-center gap-2 text-blue-100">
                    <FaCalendarAlt className="text-sm" />
                    <p className="text-lg">
                        {selectedSubject ? 
                            `${selectedSubject.course_name} • ${getCurrentDate()}` : 
                            "Select a subject to mark attendance"}
                    </p>
                </div>
            </div>
        </div>
    );

    const BulkActions = () => (
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
                onClick={handleMarkAllPresent}
                className="flex items-center gap-3 w-full sm:w-auto px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:bg-green-600 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
                <FaUserCheck className="text-lg" />
                Mark All Present
            </button>
            <button 
                onClick={handleMassBunk}
                className="flex items-center gap-3 w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-xl shadow-lg hover:bg-red-600 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
                <FaUserTimes className="text-lg" />
                Mark All Absent
            </button>
        </div>
    );

    const StudentListHeader = () => {
        const presentCount = students.filter(s => s.status === 'present').length;
        const totalCount = students.length;
        
        return (
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <FaUsers className="text-blue-600 text-lg" />
                    <span className="font-semibold text-gray-700">Student List</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {totalCount} Students
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Present: {presentCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Absent: {totalCount - presentCount}</span>
                    </div>
                </div>
            </div>
        );
    };

    const StudentList = () => {
        if (isLoadingStudents) {
            return (
                <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-lg">Loading student data...</p>
                </div>
            );
        }
        if (students.length === 0) {
            return (
                <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUsers className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-500 text-lg">No students found for this subject.</p>
                </div>
            );
        }
        return (
            <div className="divide-y divide-gray-100">
                {students.map((student) => (
                    <StudentRow key={student.universityId} student={student} />
                ))}
            </div>
        );
    };

    const StudentRow = ({ student }) => ( 
        <div className="flex items-center justify-between p-6 hover:bg-blue-50 transition-colors duration-200 group">
            <div className="flex items-center gap-4 flex-1">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                    {student.universityId ? student.universityId.slice(-3) : 'N/A'}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-lg text-gray-800 group-hover:text-blue-700 transition-colors">
                        {student.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Father: {student.fatherName}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">ID: {student.universityId}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <StatusButton studentId={student.id} currentStatus={student.status} status="present" />
                <StatusButton studentId={student.id} currentStatus={student.status} status="absent" />
            </div>
        </div>
    );

    const StatusButton = ({ studentId, currentStatus, status }) => {
        const isSelected = currentStatus === status;
        
        const baseClasses = "flex items-center gap-2 w-28 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";
        
        if (status === 'present') {
            return (
                <button
                    onClick={() => handleStatusChange(studentId, status)}
                    className={`${baseClasses} ${
                        isSelected 
                            ? 'bg-green-500 text-white shadow-lg ring-green-200' 
                            : 'bg-white border-2 border-green-300 text-green-600 hover:bg-green-50 ring-green-100'
                    }`}
                >
                    <FaUserCheck className="text-sm" />
                    Present
                </button>
            );
        } else {
            return (
                <button
                    onClick={() => handleStatusChange(studentId, status)}
                    className={`${baseClasses} ${
                        isSelected 
                            ? 'bg-red-500 text-white shadow-lg ring-red-200' 
                            : 'bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 ring-red-100'
                    }`}
                >
                    <FaUserTimes className="text-sm" />
                    Absent
                </button>
            );
        }
    };
    
    const AttendanceSummary = () => {
        const presentCount = students.filter(s => s.status === 'present').length;
        const absentCount = students.filter(s => s.status === 'absent').length;
        const totalCount = students.length;
        const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

        return (
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <FaUsers className="text-blue-600" />
                    Attendance Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
                        <div className="text-sm text-gray-500">Total Students</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200 text-center">
                        <div className="text-2xl font-bold text-green-700">{presentCount}</div>
                        <div className="text-sm text-green-600">Present</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-200 text-center">
                        <div className="text-2xl font-bold text-red-700">{absentCount}</div>
                        <div className="text-sm text-red-600">Absent</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200 text-center">
                        <div className="text-2xl font-bold text-blue-700">{percentage}%</div>
                        <div className="text-sm text-blue-600">Attendance</div>
                    </div>
                </div>
            </div>
        );
    };
    
    const Footer = () => (
        <div className="p-6 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm text-center sm:text-left">
                    Mark attendance for {getCurrentDate()}
                </p>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || students.length === 0}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Submitting...
                        </div>
                    ) : (
                        "Submit Attendance"
                    )}
                </button>
            </div>
        </div>
    );

    const SubjectSelector = () => {
        if (isLoadingSubjects) {
            return (
                <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-lg">Loading your subjects...</p>
                </div>
            );
        }
        if (!assignedSubjects || assignedSubjects.length === 0) {
            return (
                <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBook className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Subjects Assigned</h3>
                    <p className="text-gray-500">You are not currently assigned to any subjects.</p>
                </div>
            );
        }
        return (
            <div className="p-6 space-y-4">
                {assignedSubjects.map(subject => (
                    <div
                        key={subject.sf_id ?? subject.id}
                        className="flex flex-col lg:flex-row items-center justify-between p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group cursor-pointer"
                        onClick={() => handleSelectSubject(subject)}
                    >
                        <div className="flex items-center gap-5 mb-4 lg:mb-0 flex-1">
                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <FaBook size={22} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                                    {subject.subject_name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                    <span className="bg-gray-100 px-3 py-1 rounded-full">{subject.course_name}</span>
                                    {subject.branch_name && (
                                        <span className="bg-gray-100 px-3 py-1 rounded-full">{subject.branch_name}</span>
                                    )}
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                        Semester {subject.semester}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button className="w-full lg:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-md hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-200 transform group-hover:-translate-y-0.5">
                            Take Attendance
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <Header />
                    {!selectedSubject ? (
                        <SubjectSelector />
                    ) : (
                        <>
                            <BulkActions />
                            <StudentListHeader />
                            <StudentList />
                            <AttendanceSummary />
                            <Footer />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}