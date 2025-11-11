import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FacultyContext } from '../../context/FacultyContext'; // Make sure this path is correct
import { FaBook, FaArrowLeft } from 'react-icons/fa';

// Get current date formatted
const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
};

// --- Main Attendance Component ---
export default function TakeAttendance() {
	const { faculty } = useContext(FacultyContext); // Get logged-in faculty
    
    // --- State Management ---
    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [students, setStudents] = useState([]);
    
    // Use separate loading states for a better UI experience
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Data Fetching Hooks ---

    // 1. Fetch the faculty's assigned subjects on load
	useEffect(() => {
		if (!faculty || !faculty.id) return;

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

    // 2. Fetch students for a subject *after* one is selected
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

    // --- Event Handlers ---

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

    // --- Roll Number Feature Removed ---

    // Submits attendance to the backend
    const handleSubmit = async () => {
        setIsSubmitting(true);
        const attendanceData = {
            faculty_subject_id: selectedSubject.sf_id, // The unique SubjectFaculty ID
            date: new Date().toISOString().split('T')[0], // 'YYYY-MM-DD'
            attendance: students.map(s => ({
                student_id: s.studentId,
                status: s.status
            }))
        };

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/faculty/mark-attendance`, attendanceData);
            alert("Attendance submitted successfully!");
            handleGoBack(); // Go back to subject list after success
        } catch (err) {
            console.error("Failed to submit attendance:", err);
            alert("Error submitting attendance. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Navigation Handlers ---

    const handleSelectSubject = (subject) => {
        setSelectedSubject(subject);
    };
    
    const handleGoBack = () => {
        setSelectedSubject(null);
        setStudents([]); // Clear the student list
    };

    // --- Child Components ---

    const Header = () => (
        <div className="text-center p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl relative">
            {selectedSubject && (
                <button 
                    onClick={handleGoBack}
                    className="absolute top-0 left-0 mt-4 ml-4 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                >
                    <FaArrowLeft size={20} />
                </button>
            )}
            <h1 className="text-3xl font-bold text-gray-800">
                {selectedSubject ? selectedSubject.subject_name : "Select Subject"}
            </h1>
            <p className="text-md text-gray-500 mt-2">
                {selectedSubject ? 
                    `${selectedSubject.course_name} | ${getCurrentDate()}` : 
                    "Select a subject to take attendance"}
            </p>
        </div>
    );

    const BulkActions = () => (
        <div className="p-4 bg-gray-100 border-b border-gray-200 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button onClick={handleMarkAllPresent} className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-200">
                Mark All Present
            </button>
            <button onClick={handleMassBunk} className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200">
                Mark All Absent (Mass Bunk)
            </button>
        </div>
    );

    // --- RollNoEntry Component Removed ---

    const StudentListHeader = () => (
        <div className="px-4 sm:px-6 py-3 bg-gray-50 border-y border-gray-200">
            <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600 uppercase">Student Details</span>
                <span className="text-sm font-semibold text-gray-600 uppercase">Mark Status</span>
            </div>
        </div>
    );

    // Using `universityId` as the key as it's more likely to be unique for the list
    const StudentList = () => {
        if (isLoadingStudents) {
            return <div className="p-8 text-center text-gray-500">Loading student data...</div>;
        }
        if (students.length === 0) {
            return <div className="p-8 text-center text-gray-500">No students found for this subject.</div>;
        }
        return (
            <ul className="divide-y divide-gray-200">
                {students.map((student) => (
                    <StudentRow key={student.universityId} student={student} />
                ))}
            </ul>
        );
    };

    const StudentRow = ({ student }) => ( 
        <li className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 space-y-4 sm:space-y-0 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                    {student.universityId ? student.universityId.slice(-3) : 'N/A'}
                </div>
                <div>
                    <p className="font-medium text-lg text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-500">Father: {student.fatherName}</p>
                    <p className="text-xs text-gray-400">University ID: {student.universityId}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <StatusButton studentId={student.id} currentStatus={student.status} status="present" />
                <StatusButton studentId={student.id} currentStatus={student.status} status="absent" />
            </div>
        </li>
    );

    // This component is fixed to work with Tailwind's JIT compiler
    const StatusButton = ({ studentId, currentStatus, status }) => {
        const isSelected = currentStatus === status;
        
        let selectedClasses = '';
        let unselectedClasses = '';

        if (status === 'present') {
            selectedClasses = 'bg-green-500 text-white shadow-md';
            unselectedClasses = 'bg-white border-2 border-green-400 text-green-500 hover:bg-green-50';
        } else { // status === 'absent'
            selectedClasses = 'bg-red-500 text-white shadow-md';
            unselectedClasses = 'bg-white border-2 border-red-400 text-red-500 hover:bg-red-50';
        }
        
        const baseClasses = "w-24 px-4 py-2 text-sm font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105";
        
        return (
            <button
                onClick={() => handleStatusChange(studentId, status)}
                className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
        );
    };
    
	const AttendanceSummary = () => {
		const presentCount = students.filter(s => s.status === 'present').length;
		const absentCount = students.filter(s => s.status === 'absent').length;
		return (
			<div className="p-6 bg-gray-50 border-t border-gray-200">
				<h3 className="text-lg font-semibold text-gray-700 mb-3">Summary</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
					<div className="bg-green-100 text-green-800 p-3 rounded-lg">
						<p className="font-bold text-2xl">{presentCount}</p>
						<p className="text-sm">Present</p>
					</div>
					<div className="bg-red-100 text-red-800 p-3 rounded-lg">
						<p className="font-bold text-2xl">{absentCount}</p>
						<p className="text-sm">Absent</p>
					</div>
				</div>
			</div>
		);
	};
    
	const Footer = () => (
		<div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl text-center">
			<button
				onClick={handleSubmit}
				disabled={isSubmitting}
				className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isSubmitting ? "Submitting..." : "Submit Attendance"}
			</button>
		</div>
	);

    // --- Subject Selector Component ---
	const SubjectSelector = () => {
		if (isLoadingSubjects) {
			return <div className="p-8 text-center text-gray-500">Loading your subjects...</div>;
		}
		if (!assignedSubjects || assignedSubjects.length === 0) {
			return <div className="p-8 text-center text-gray-500">You are not assigned to any subjects.</div>;
		}
		return (
			<div className="p-4 sm:p-6 space-y-4">
				{assignedSubjects.map(subject => (
					<div
						key={subject.sf_id ?? subject.id}
						className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white border rounded-lg shadow-sm transition-all hover:shadow-md hover:border-blue-300"
					>
						<div className="flex items-center gap-4 mb-3 sm:mb-0">
							<div className="flex-shrink-0 h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
								<FaBook size={20} />
							</div>
							<div>
								<p className="font-bold text-lg text-gray-800">{subject.subject_name}</p>
								<p className="text-sm text-gray-500">{subject.course_name} {subject.branch_name ? `- ${subject.branch_name}` : ''} | Sem: {subject.semester}</p>
							</div>
						</div>
						<button
							onClick={() => handleSelectSubject(subject)}
							className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200"
						>
							Take Attendance
						</button>
					</div>
				))}
			</div>
		);
	};

    // --- Main Render: Conditional ---
    
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
			<div className="w-full max-w-4xl mx-auto">
				<div className="bg-white rounded-xl shadow-2xl overflow-hidden">
					<Header />

					{!selectedSubject ? (
						<SubjectSelector />
					) : (
						<>
							<BulkActions />
							{/* RollNoEntry component invocation removed */}
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