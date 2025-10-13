import React, { useState, useEffect, useMemo } from "react";
import Layout from "./Layout";
import { FaPlus, FaEllipsisV, FaArrowLeft, FaEye, FaBuilding, FaGraduationCap, FaEnvelope, FaPhone, FaBirthdayCake, FaVenusMars, FaMapMarkedAlt, FaFilter, FaUser, FaBriefcase, FaSearch, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable Components (No changes needed)
const DetailItem = ({ icon, label, value }) => (
    <div className="border-b border-slate-200 py-3">
        <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">{icon} {label}</p>
        <p className="text-md text-slate-800 mt-1">{value || "N/A"}</p>
    </div>
);

const FormInput = ({ id, label, icon, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>
            <input id={id} {...props} className="w-full pl-10 p-2.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400 disabled:bg-slate-200 disabled:cursor-not-allowed" />
        </div>
    </div>
);


const Faculty = () => {
    const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/admin`;

    const [facultyList, setFacultyList] = useState([]);
    const [departments, setDepartments] = useState([]);
    
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(null);
    const [editingEmail, setEditingEmail] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);

    const [sortOrder, setSortOrder] = useState("name-asc");
    const [filterDept, setFilterDept] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // *** ADDED ***: State to handle form submission process
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialFormData = {
        name: "", department_id: "", degree: "", designation: "", email: "", dob: "", contact_number: "", address: "", gender: "Male", profileImage: null, imageFile: null
    };
    const [formData, setFormData] = useState(initialFormData);

    const getProfileImageUrl = (faculty) => {
        return faculty.profile_image_url
            ? faculty.profile_image_url
            : `https://ui-avatars.com/api/?name=${faculty.name.replace(/\s/g, '+') || '?'}&background=random&color=fff`;
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const deptRes = await axios.get(`${API_BASE_URL}/get-all-departments`);
            setDepartments(deptRes.data);
            
            const facultyRes = await axios.get(`${API_BASE_URL}/get-all-faculty`);
            setFacultyList(facultyRes.data);
        } catch (err) {
            const errorMessage = "Failed to fetch data. Please try again later.";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredAndSortedFaculty = useMemo(() => facultyList
        .filter(faculty => {
            const matchesDept = filterDept === "All" || faculty.department_id === filterDept;
            const matchesSearch = faculty.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesDept && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortOrder) {
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'degree-desc': return (b.degree || '').localeCompare(a.degree || '');
                case 'degree-asc': return (a.degree || '').localeCompare(b.degree || '');
                case 'name-asc': default: return a.name.localeCompare(b.name);
            }
        }), [facultyList, filterDept, searchTerm, sortOrder]);

    const handleInputChange = (e) => {
        const { id, name, value, files } = e.target;
        if (id === "profileImage" && files[0]) {
            if (formData.profileImage && formData.profileImage.startsWith('blob:')) {
                URL.revokeObjectURL(formData.profileImage);
            }
            setFormData(prev => ({
                ...prev,
                profileImage: URL.createObjectURL(files[0]),
                imageFile: files[0]
            }));
        } else {
            const key = id || name;
            setFormData(prev => ({ ...prev, [key]: value }));
        }
    };
    
    useEffect(() => {
        const imageUrl = formData.profileImage;
        return () => {
            if (imageUrl && imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [formData.profileImage]);

    const handleCancel = () => {
        setFormData(initialFormData);
        setShowForm(false);
        setEditingEmail(null);
    };

    // *** MODIFIED ***: handleSave now uses the isSubmitting state
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Start submission process
        
        const apiFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'imageFile' && value) {
                apiFormData.append('profileImage', value);
            } else if (!['profileImage', 'imageFile'].includes(key) && value) {
                apiFormData.append(key, value);
            }
        });

        const isEditing = !!editingEmail;
        const url = isEditing ? `${API_BASE_URL}/update-faculty/${editingEmail}` : `${API_BASE_URL}/add-faculty`;
        const method = isEditing ? 'put' : 'post';

        try {
            await axios({ method, url, data: apiFormData, headers: { 'Content-Type': 'multipart/form-data' }});
            toast.success(`Faculty ${isEditing ? 'updated' : 'added'} successfully!`);
            handleCancel();
            fetchData();
        } catch (error) {
            const errorMessage = error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} faculty.`;
            toast.error(errorMessage);
            console.error(`Failed to save faculty:`, error);
        } finally {
            setIsSubmitting(false); // End submission process
        }
    };

    const handleEdit = (faculty) => {
        setEditingEmail(faculty.email);
        setFormData({
            ...faculty,
            dob: faculty.dob ? new Date(faculty.dob).toISOString().split('T')[0] : "",
            profileImage: faculty.profile_image_url,
            imageFile: null
        });
        setShowForm(true);
        setMenuOpen(null);
    };

    const handleDelete = async (email) => {
        if (window.confirm("Are you sure you want to delete this faculty member? This action cannot be undone.")) {
            try {
                await axios.delete(`${API_BASE_URL}/delete-faculty/${email}`);
                toast.success("Faculty deleted successfully!");
                fetchData();
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Failed to delete faculty.";
                toast.error(errorMessage);
                console.error("Failed to delete faculty:", error);
            }
        }
        setMenuOpen(null);
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center py-16"><FaSpinner className="mx-auto text-5xl text-blue-500 animate-spin" /></div>;
        }
        if (error) {
            return (
                <div className="text-center py-16 px-6 bg-red-50 rounded-xl shadow-sm border border-red-200">
                    <FaExclamationTriangle className="mx-auto text-5xl text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-red-700">An Error Occurred</h3>
                    <p className="text-red-500 mt-1">{error}</p>
                </div>
            );
        }
        if (filteredAndSortedFaculty.length === 0) {
            return (
                <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-slate-200">
                    <FaSearch className="mx-auto text-5xl text-slate-400 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700">No Records Found</h3>
                    <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedFaculty.map((faculty) => {
                    const departmentName = departments.find(d => d.department_id === faculty.department_id)?.department_name || faculty.department_id;
                    const profileImageUrl = getProfileImageUrl(faculty);

                    return (
                        <motion.div key={faculty.faculty_id || faculty.email} layout className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all relative flex flex-col hover:-translate-y-1 border items-center text-center p-6">
                            <div className="absolute top-2 right-2">
                                <button onClick={() => setMenuOpen(menuOpen === faculty.email ? null : faculty.email)} className="p-1 rounded-full hover:bg-slate-100"><FaEllipsisV className="text-slate-500" /></button>
                                <AnimatePresence>
                                {menuOpen === faculty.email && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute right-0 bg-white border rounded-lg shadow-lg mt-2 z-10 w-32 overflow-hidden text-left">
                                        <button onClick={() => handleEdit(faculty)} className="block w-full px-4 py-2 hover:bg-slate-100 text-sm font-medium">Edit</button>
                                        <button onClick={() => handleDelete(faculty.email)} className="block w-full px-4 py-2 hover:bg-slate-100 text-red-600 text-sm font-medium">Delete</button>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                            <img src={profileImageUrl} alt={faculty.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-200 mb-4 bg-slate-200" onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${faculty.name.replace(/\s/g, '+')}&background=random&color=fff`}}/>
                            <h3 className="text-lg font-bold text-slate-800">{faculty.name}</h3>
                            <p className="text-sm text-slate-500">{faculty.designation}</p>
                            <div className="text-sm text-slate-600 mt-2 flex-grow">
                                <p className="flex items-center justify-center gap-2"><FaBuilding className="text-slate-400"/> {departmentName}</p>
                                <p className="flex items-center justify-center gap-2 mt-1"><FaGraduationCap className="text-slate-400"/> {faculty.degree}</p>
                            </div>
                            <button onClick={() => setShowDetails(faculty)} className="mt-4 w-full font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition">
                                View Details
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <Layout>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
            <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Faculty Management</h2>
                    <button onClick={() => { setEditingEmail(null); setFormData({ ...initialFormData, department_id: departments[0]?.department_id || '' }); setShowForm(true); }} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                        <FaPlus /> Add New Faculty
                    </button>
                </div>

                {/* Filter, Sort, and Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label htmlFor="search" className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-1"><FaSearch /> Search by Name</label>
                        <input id="search" type="text" placeholder="Enter faculty name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-slate-300 p-2 rounded-lg bg-slate-50" />
                    </div>
                    <div>
                        <label htmlFor="filterDept" className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-1"><FaFilter /> Filter by Department</label>
                        <select id="filterDept" value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="w-full border border-slate-300 p-2 rounded-lg bg-slate-50">
                            <option value="All">All Departments</option>
                            {departments.map(dept => <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sortOrder" className="text-sm font-medium text-slate-600 mb-1">Sort By</label>
                        <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full border border-slate-300 p-2 rounded-lg bg-slate-50">
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="degree-asc">Degree (A-Z)</option>
                            <option value="degree-desc">Degree (Z-A)</option>
                        </select>
                    </div>
                </div>
                
                {/* Main Content Area */}
                <div>{renderContent()}</div>
            </div>

            {/* Add/Edit Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                       <motion.div className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                        <h3 className="text-2xl font-bold mb-6 text-center text-slate-800">{editingEmail ? "Edit Faculty" : "Add New Faculty"}</h3>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="flex flex-col items-center gap-4">
                                <img src={formData.profileImage || `https://ui-avatars.com/api/?name=${formData.name.replace(/\s/g, '+') || '?'}&background=random&color=fff`} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-200 bg-slate-200"/>
                                <label htmlFor="profileImage" className="cursor-pointer text-sm font-semibold text-blue-600 bg-blue-50 py-2 px-4 rounded-full hover:bg-blue-100 transition">
                                    {formData.imageFile ? "Change Photo" : "Upload Photo"}
                                </label>
                                <input id="profileImage" name="profileImage" type="file" accept="image/*" onChange={handleInputChange} className="hidden"/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Form Inputs... */}
                                <FormInput id="name" name="name" label="Full Name" type="text" value={formData.name} onChange={handleInputChange} required icon={<FaUser />} placeholder="e.g., Dr. Meena Sharma"/>
                                <FormInput id="designation" name="designation" label="Designation" type="text" value={formData.designation} onChange={handleInputChange} required icon={<FaBriefcase />} placeholder="e.g., Professor"/>
                                <div>
                                    <label htmlFor="department_id" className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                    <select id="department_id" name="department_id" value={formData.department_id} onChange={handleInputChange} required className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
                                    </select>
                                </div>
                                <FormInput id="degree" name="degree" label="Degree" type="text" value={formData.degree} onChange={handleInputChange} required icon={<FaGraduationCap />} placeholder="e.g., Ph.D. in AI"/>
                                <FormInput id="email" name="email" label="Email Address" type="email" value={formData.email} onChange={handleInputChange} required icon={<FaEnvelope />} placeholder="e.g., name@college.edu" disabled={!!editingEmail}/>
                                <FormInput id="dob" name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleInputChange} icon={<FaBirthdayCake />} />
                                <FormInput id="contact_number" name="contact_number" label="Contact Number" type="tel" value={formData.contact_number} onChange={handleInputChange} icon={<FaPhone />} placeholder="e.g., 9876543210"/>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2"><input type="radio" value="Male" name="gender" checked={formData.gender === "Male"} onChange={handleInputChange}/>Male</label>
                                        <label className="flex items-center gap-2"><input type="radio" value="Female" name="gender" checked={formData.gender === "Female"} onChange={handleInputChange}/>Female</label>
                                        <label className="flex items-center gap-2"><input type="radio" value="Other" name="gender" checked={formData.gender === "Other"} onChange={handleInputChange}/>Other</label>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                    <textarea id="address" name="address" value={formData.address || ''} onChange={handleInputChange} rows="3" placeholder="Enter full address" className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
                                </div>
                            </div>
                            {/* *** MODIFIED ***: Buttons are now aware of the submitting state */}
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCancel} disabled={isSubmitting} className="px-5 py-2.5 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-wait">
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Faculty"
                                    )}
                                </button>
                            </div>
                        </form>
                       </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Details View Panel */}
            <AnimatePresence>
                {showDetails && (() => {
                    const departmentName = departments.find(d => d.department_id === showDetails.department_id)?.department_name || showDetails.department_id;
                    const profileImageUrl = getProfileImageUrl(showDetails);

                    return (
                        <motion.div className="fixed inset-0 bg-white overflow-y-auto p-6 sm:p-10 z-50" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}>
                            <button onClick={() => setShowDetails(null)} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 font-semibold mb-6"><FaArrowLeft /> Back to List</button>
                            <div className="text-center">
                                <img src={profileImageUrl} alt={showDetails.name} className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-200 mx-auto bg-slate-200"/>
                                <h2 className="text-3xl font-bold text-slate-800 mt-4">{showDetails.name}</h2>
                                <p className="text-slate-500 font-semibold">{showDetails.designation}</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-xl border mt-6">
                                <DetailItem icon={<FaBuilding />} label="Department" value={departmentName} />
                                <DetailItem icon={<FaGraduationCap />} label="Degree" value={showDetails.degree} />
                                <DetailItem icon={<FaEnvelope />} label="Email" value={showDetails.email} />
                                <DetailItem icon={<FaPhone />} label="Contact" value={showDetails.contact_number} />
                                <DetailItem icon={<FaBirthdayCake />} label="Date of Birth" value={showDetails.dob ? new Date(showDetails.dob).toLocaleDateString() : 'N/A'} />
                                <DetailItem icon={<FaVenusMars />} label="Gender" value={showDetails.gender} />
                                <DetailItem icon={<FaMapMarkedAlt />} label="Address" value={showDetails.address} />
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>
        </Layout>
    );
};

export default Faculty;