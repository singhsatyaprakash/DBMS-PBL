import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { FaPlus, FaEllipsisV, FaArrowLeft, FaEye, FaBook, FaCode, FaUniversity, FaTrash, FaCalendarAlt, FaHashtag, FaEdit, FaSpinner, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

// Reusable Components
const FormInput = ({ id, label, type, value, onChange, placeholder, required, icon }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>
            <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full pl-10 p-2.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required={required} />
        </div>
    </div>
);
const DetailItem = ({ icon, label, value }) => (
    <div className="border-b border-slate-200 py-3">
        <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">{icon} {label}</p>
        <p className="text-md text-slate-800 mt-1">{value || "N/A"}</p>
    </div>
);

// Main Component
const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [formData, setFormData] = useState({ name: "", code: "", duration: "", totalSemesters: "", department: "", branches: [] });
    const [viewingBranch, setViewingBranch] = useState(null);

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-all-departments`);
            const mappedData = res.data.map(dept => dept.department_name);
            setDepartments(mappedData);
            if (!editingId) {
                setFormData(prev => ({ ...prev, department: mappedData[0] || "" }));
            }
        } catch (err) {
            console.error("Error fetching departments:", err);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-all-courses`);
            const mappedCourses = res.data.map(course => ({
                id: course.course_id,
                name: course.course_name,
                code: course.course_code,
                department: course.department,
                duration: course.duration_years,
                totalSemesters: course.total_semesters,
                branches: [] 
            }));
            setCourses(mappedCourses);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchCourses();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleBranchChange = (index, field, value) => {
        const updatedBranches = [...formData.branches];
        updatedBranches[index][field] = value;
        setFormData(prev => ({ ...prev, branches: updatedBranches }));
    };

    const addBranch = () => {
        setFormData(prev => ({
            ...prev,
            branches: [...prev.branches, { id: `temp-${uuidv4()}`, name: "", description: "" }]
        }));
    };

    const removeBranch = (index) => {
        setFormData(prev => ({
            ...prev,
            branches: prev.branches.filter((_, i) => i !== index)
        }));
    };
    
    const handleCancel = () => {
        setFormData({ name: "", code: "", duration: "", totalSemesters: "", department: departments[0] || "", branches: [] });
        setShowForm(false);
        setEditingId(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const courseDataForAPI = {
            course_name: formData.name,
            course_code: formData.code,
            department: formData.department,
            duration_years: formData.duration,
            total_semesters: formData.totalSemesters,
            branches: formData.branches.map(b => ({
                branch_id: String(b.id).startsWith('temp-') ? undefined : b.id,
                branch_name: b.name,
                description: b.description
            }))
        };

        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/update-course/${editingId}`, courseDataForAPI);
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-new-course`, courseDataForAPI);
            }
            fetchCourses();
            handleCancel();
        } catch (err) {
            console.error("Error saving course:", err);
        }
    };

    const handleEdit = (course) => {
        setEditingId(course.id);
        handleViewDetails(course, (fetchedCourseWithBranches) => {
            setFormData(fetchedCourseWithBranches);
        });
        setShowForm(true);
        setMenuOpen(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course and all its branches?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-course/${id}`);
            fetchCourses();
            setMenuOpen(null);
        } catch (err) {
            console.error("Error deleting course:", err);
        }
    };

    const handleRemoveBranchFromDetails = async (branchId) => {
        if (!window.confirm("Are you sure you want to remove this branch?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-branch/${branchId}`);
            if (showDetails) {
                handleViewDetails(showDetails);
            }
        } catch (err) {
            console.error("Error removing branch:", err);
        }
    };

    const handleViewDetails = async (course, callback) => {
        try {
            if (!callback) {
              setShowDetails({ ...course, branches: [], isLoading: true });
            }
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-branches/${course.id}`);
            const mappedBranches = res.data.map(b => ({
                id: b.branch_id,
                name: b.branch_name,
                description: b.description
            }));
            const courseWithBranches = { ...course, branches: mappedBranches, isLoading: false };
            if (callback) {
                callback(courseWithBranches);
            } else {
                setShowDetails(courseWithBranches);
            }
        } catch (error) {
            console.error("Failed to fetch branches:", error);
            if (error.response && error.response.status === 404) {
                const courseWithoutBranches = { ...course, branches: [], isLoading: false };
                 if (callback) {
                    callback(courseWithoutBranches);
                } else {
                    setShowDetails(courseWithoutBranches);
                }
            } else {
                 if (callback) {
                    callback({ ...course, branches: [], error: "Could not load branches."});
                } else {
                    setShowDetails({ ...course, branches: [], isLoading: false, error: "Could not load branches." });
                }
            }
        }
    };

    return (
        <Layout>
            <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Courses</h2>
                    <button
                        onClick={() => { setEditingId(null); setFormData({ name: "", code: "", duration: "", totalSemesters: "", department: departments[0] || "", branches: [] }); setShowForm(true); }}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        <FaPlus /> Add Course
                    </button>
                </div>

                {/* Course Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <motion.div key={course.id} layout className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all relative flex flex-col hover:-translate-y-1 border">
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-slate-800 pr-4">{course.name}</h3>
                                    <div className="relative">
                                        <button onClick={() => setMenuOpen(menuOpen === course.id ? null : course.id)} className="p-1 rounded-full hover:bg-slate-100"><FaEllipsisV className="text-slate-500" /></button>
                                        <AnimatePresence>
                                            {menuOpen === course.id && (
                                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute right-0 bg-white border rounded-lg shadow-lg mt-2 z-10 w-32 overflow-hidden">
                                                    <button onClick={() => handleEdit(course)} className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm font-medium">Edit</button>
                                                    <button onClick={() => handleDelete(course.id)} className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-red-600 text-sm font-medium">Delete</button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-600 mt-2 space-y-1">
                                    <p className="flex items-center gap-2"><FaCode className="text-slate-400" /> {course.code}</p>
                                    <p className="flex items-center gap-2"><FaUniversity className="text-slate-400" /> {course.department}</p>
                                </div>
                            </div>
                            <button onClick={() => handleViewDetails(course)} className="mt-4 flex items-center justify-center gap-2 w-full font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition">
                                <FaEye /> View Details
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Form Modal */}
            <AnimatePresence>{showForm && (
                <motion.div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                        <h3 className="text-2xl font-bold mb-6 text-center text-slate-800">{editingId ? "Edit Course" : "Add New Course"}</h3>
                        <form onSubmit={handleSave}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput id="name" label="Course Name" type="text" value={formData.name} onChange={handleInputChange} required icon={<FaBook />} />
                                <FormInput id="code" label="Course Code" type="text" value={formData.code} onChange={handleInputChange} required icon={<FaCode />} />
                                <FormInput id="duration" label="Duration (Years)" type="number" value={formData.duration} onChange={handleInputChange} required icon={<FaCalendarAlt />} />
                                <FormInput id="totalSemesters" label="Total Semesters" type="number" value={formData.totalSemesters} onChange={handleInputChange} required icon={<FaHashtag />} />
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                    <select id="department" value={formData.department} onChange={handleInputChange} className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-8 border-t pt-6">
                                <h4 className="text-lg font-bold text-slate-700 mb-4">Branches</h4>
                                <div className="space-y-4">
                                    {formData.branches && formData.branches.map((branch, index) => (
                                        <div key={branch.id} className="bg-slate-50 p-4 rounded-lg border flex items-start gap-4">
                                            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input type="text" placeholder="Branch Name" value={branch.name} onChange={(e) => handleBranchChange(index, 'name', e.target.value)} className="w-full p-2 bg-white border rounded-md" required />
                                                <input type="text" placeholder="Branch Description" value={branch.description} onChange={(e) => handleBranchChange(index, 'description', e.target.value)} className="w-full p-2 bg-white border rounded-md" />
                                            </div>
                                            <button type="button" onClick={() => removeBranch(index)} className="text-red-500 hover:text-red-700 p-2"><FaTrash /></button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addBranch} className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800">+ Add Branch</button>
                            </div>
                            <div className="flex justify-end gap-4 mt-8">
                                <button type="button" onClick={handleCancel} className="px-5 py-2.5 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow">Save Course</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}</AnimatePresence>
            
            {/* Details View Panel */}
            <AnimatePresence>
                {showDetails && (
                    <motion.div className="fixed inset-0 bg-white overflow-y-auto p-6 sm:p-10 z-50" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}>
                        <button onClick={() => setShowDetails(null)} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 font-semibold mb-6"><FaArrowLeft /> Back to List</button>
                        <div className="bg-slate-50 p-6 rounded-xl border">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800">{showDetails.name}</h2>
                                    <p className="text-slate-500 font-semibold mb-6">Code: {showDetails.code}</p>
                                </div>
                                <button onClick={() => { handleEdit(showDetails); setShowDetails(null); }} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition text-sm font-semibold">
                                    <FaEdit /> Edit Course
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <DetailItem icon={<FaUniversity />} label="Department" value={showDetails.department} />
                                <DetailItem icon={<FaCalendarAlt />} label="Duration" value={`${showDetails.duration} Years`} />
                                <DetailItem icon={<FaHashtag />} label="Total Semesters" value={showDetails.totalSemesters} />
                            </div>
                            <div className="mt-6 border-t pt-6">
                                <h3 className="text-xl font-bold text-slate-700 mb-4">Branches Offered</h3>
                                <div className="space-y-3">
                                    {showDetails.isLoading ? (
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <FaSpinner className="animate-spin" /> Loading branches...
                                        </div>
                                    ) : showDetails.error ? (
                                        <p className="text-red-500">{showDetails.error}</p>
                                    ) : showDetails.branches && showDetails.branches.length > 0 ? (
                                        showDetails.branches.map(branch => (
                                            // **FIX:** Changed the outer <button> to a <div> to prevent nesting errors.
                                            <div
                                                key={branch.id}
                                                onClick={() => setViewingBranch(branch)}
                                                className="w-full text-left bg-white p-4 rounded-lg border flex justify-between items-center hover:bg-slate-50 transition cursor-pointer"
                                            >
                                                <div>
                                                    <p className="font-semibold text-slate-800">{branch.name}</p>
                                                    <p className="text-slate-500 text-sm truncate">{branch.description}</p>
                                                </div>
                                                {/* This button is now valid and stops click propagation. */}
                                                <button 
                                                    onClick={(e) => { 
                                                        e.stopPropagation(); 
                                                        handleRemoveBranchFromDetails(branch.id); 
                                                    }} 
                                                    className="text-red-500 hover:text-red-700 p-2 z-10 relative"
                                                    aria-label={`Delete ${branch.name} branch`}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-400">No branches available for this course.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Branch Details Pop-up Modal */}
            <AnimatePresence>
                {viewingBranch && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[60] p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setViewingBranch(null)}
                    >
                        <motion.div
                            className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setViewingBranch(null)} 
                                className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition"
                                aria-label="Close branch details"
                            >
                                <FaTimes size={20} />
                            </button>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">{viewingBranch.name}</h3>
                            <div className="border-t mt-4 pt-4">
                                <p className="text-slate-600 whitespace-pre-wrap">{viewingBranch.description || "No description provided."}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </Layout>
    );
};

export default Courses;