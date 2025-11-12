import React, { useContext, useEffect, useState } from 'react';
import { FacultyContext } from '../../context/FacultyContext';
import axios from 'axios';
import { FaChalkboardTeacher, FaBook, FaGraduationCap, FaCodeBranch, FaCalendarAlt } from 'react-icons/fa';

const Schedule = () => {
    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { faculty } = useContext(FacultyContext);

    useEffect(() => {
        const fetchSubjects = async () => {
            if (faculty?.id) {
                setIsLoading(true);
                try {
                    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/faculty/my-subjects`, {
                        params: { facultyId: faculty.id }
                    });
                    setAssignedSubjects(res.data);
                } catch (err) {
                    console.error("Failed to fetch subjects:", err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchSubjects();
    }, [faculty.id]);

    if (isLoading) {
        return (
            <div className="min-h-96 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your subjects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-2xl">
                        <FaChalkboardTeacher className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Assigned Subjects</h1>
                        <p className="text-gray-600 mt-1">Manage and view your teaching schedule</p>
                    </div>
                </div>
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full font-semibold">
                    {assignedSubjects.length} Subject{assignedSubjects.length !== 1 ? 's' : ''}
                </div>
            </div>

            {assignedSubjects.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaBook className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Subjects Assigned</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        You are not currently assigned to any subjects. Please contact the administration for assignment details.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {assignedSubjects.map((subject, index) => (
                        <div 
                            key={subject.sf_id} 
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                                            {subject.subject_name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                                            <FaBook className="text-gray-400" />
                                            {subject.subject_code}
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <FaChalkboardTeacher className="text-blue-600 text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                            <FaGraduationCap className="text-green-600 text-xs" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-semibold text-gray-700">Course:</span>
                                            <span className="text-gray-600 ml-2">{subject.course_name}</span>
                                        </div>
                                    </div>

                                    {subject.branch_name && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                                <FaCodeBranch className="text-purple-600 text-xs" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-semibold text-gray-700">Branch:</span>
                                                <span className="text-gray-600 ml-2">{subject.branch_name}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                                            <FaCalendarAlt className="text-orange-600 text-xs" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-semibold text-gray-700">Semester:</span>
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium ml-2">
                                                Semester {subject.semester}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 group-hover:bg-blue-50 transition-colors">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Subject ID: {subject.sf_id}</span>
                                    <span className="text-green-600 font-medium">Active</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Schedule;