import React, { useContext, useEffect, useState } from 'react';
import { FacultyContext } from '../../context/FacultyContext';
import axios from 'axios';
import { FaChalkboardTeacher } from 'react-icons/fa'; // Icon for the title

const Schedule = () => {
    // State to hold data fetched from the API
    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { faculty } = useContext(FacultyContext);

    // Fetch the assigned subjects when the component loads
    useEffect(() => {
        const fetchSubjects = async () => {
            // Only fetch if we have the faculty ID from context
            if (faculty?.id) {
                setIsLoading(true);
                try {
                    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/faculty/my-subjects`, {
                        params: { facultyId: faculty.id } // Pass facultyId as a query param
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
    }, [faculty.id]); // Re-run this effect if the faculty.id changes

    return (
        <div>
            {/* Updated title to reflect the data being shown */}
            <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight flex items-center gap-3">
                <FaChalkboardTeacher /> My Assigned Subjects
            </h2>
            
            {isLoading ? (
                <p className="text-sm text-slate-500">Loading subjects...</p>
            ) : assignedSubjects.length === 0 ? (
                // Show a clean message if no subjects are assigned
                <div className="bg-white p-6 rounded-2xl shadow-md border text-center">
                    <p className="text-slate-600">You are not currently assigned to any subjects.</p>
                </div>
            ) : (
                // Display the subjects in a responsive grid
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
    );
};

export default Schedule;