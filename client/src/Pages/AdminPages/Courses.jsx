import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { FaPlus, FaEllipsisV, FaArrowLeft, FaEye, FaBook, FaCode, FaUniversity, FaTrash, FaTimes, FaCalendarAlt, FaHashtag, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';

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
  const [departments, setDepartments] = useState(["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electronics"]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "", code: "", duration: "", totalSemesters: "", department: "", branches: []
  });

  // Dummy data
  useEffect(() => {
    const dummyData = [
      { id: uuidv4(), name: "Bachelor of Technology", code: "B.Tech", duration: 4, totalSemesters: 8, department: "Computer Science", branches: [
          { id: uuidv4(), name: "CSE Core", description: "Focuses on core computer science principles." },
          { id: uuidv4(), name: "CSE with AI/ML", description: "Specialization in Artificial Intelligence and Machine Learning." }
      ]},
      { id: uuidv4(), name: "Bachelor of Business Administration", code: "BBA", duration: 3, totalSemesters: 6, department: "Mechanical Engineering", branches: [
          { id: uuidv4(), name: "General Management", description: "Covers all aspects of business management." },
          { id: uuidv4(), name: "Finance", description: "Specialization in financial markets and analysis." }
      ]},
    ];
    setCourses(dummyData);
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleBranchChange = (index, field, value) => {
      const updatedBranches = [...formData.branches];
      updatedBranches[index][field] = value;
      setFormData(prev => ({...prev, branches: updatedBranches}));
  };

  const addBranch = () => {
      setFormData(prev => ({
          ...prev,
          branches: [...prev.branches, {id: uuidv4(), name: "", description: ""}]
      }));
  };

  const removeBranch = (index) => {
      setFormData(prev => ({
          ...prev,
          branches: prev.branches.filter((_, i) => i !== index)
      }));
  };

  const handleCancel = () => {
    setFormData({ name: "", code: "", duration: "", totalSemesters: "", department: "", branches: [] });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      setCourses(courses.map((course) => course.id === editingId ? { ...formData, id: editingId } : course));
    } else {
      setCourses([...courses, { ...formData, id: uuidv4() }]);
    }
    handleCancel();
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData(course);
    setShowForm(true);
    setMenuOpen(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course and all its branches?")) {
        setCourses(courses.filter(course => course.id !== id));
    }
    setMenuOpen(null);
  };
  
  const handleRemoveBranchFromDetails = (courseId, branchId) => {
    if (window.confirm("Are you sure you want to remove this branch?")) {
      let updatedCourse = null;
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const newBranches = course.branches.filter(branch => branch.id !== branchId);
          updatedCourse = { ...course, branches: newBranches };
          return updatedCourse;
        }
        return course;
      });
      setCourses(updatedCourses);
      setShowDetails(updatedCourse);
    }
  };

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Courses</h2>
          <button onClick={() => { setEditingId(null); setFormData({ name: "", code: "", duration: "", totalSemesters: "", department: departments[0], branches: [] }); setShowForm(true); }} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
            <FaPlus /> Add Course
          </button>
        </div>

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
                  <p className="flex items-center gap-2"><FaCode className="text-slate-400"/> {course.code}</p>
                  <p className="flex items-center gap-2"><FaUniversity className="text-slate-400"/> {course.department}</p>
                </div>
              </div>
              <button onClick={() => setShowDetails(course)} className="mt-4 flex items-center justify-center gap-2 w-full font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition">
                <FaEye /> View Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- ADD/EDIT FORM MODAL (CODE IS NOW HERE) --- */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h3 className="text-2xl font-bold mb-6 text-center text-slate-800">{editingId ? "Edit Course" : "Add Course"}</h3>
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
                        {formData.branches.map((branch, index) => (
                            <div key={index} className="bg-slate-50 p-4 rounded-lg border flex items-start gap-4">
                                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Branch Name" value={branch.name} onChange={(e) => handleBranchChange(index, 'name', e.target.value)} className="w-full p-2 bg-white border rounded-md" required/>
                                    <input type="text" placeholder="Branch Description" value={branch.description} onChange={(e) => handleBranchChange(index, 'description', e.target.value)} className="w-full p-2 bg-white border rounded-md" required/>
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
        )}
      </AnimatePresence>

      {/* Details View */}
      <AnimatePresence>
        {showDetails && (
          <motion.div className="fixed inset-0 bg-white overflow-y-auto p-6 sm:p-10 z-50" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}>
              <button onClick={() => setShowDetails(null)} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 font-semibold mb-6"><FaArrowLeft /> Back to List</button>
              <div className="bg-slate-50 p-6 rounded-xl border">
                <h2 className="text-3xl font-bold text-slate-800">{showDetails.name}</h2>
                <p className="text-slate-500 font-semibold mb-6">Code: {showDetails.code}</p>
                <div className="flex justify-between items-end">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                        <DetailItem icon={<FaUniversity />} label="Department" value={showDetails.department} />
                        <DetailItem icon={<FaCalendarAlt />} label="Duration" value={`${showDetails.duration} Years`} />
                        <DetailItem icon={<FaHashtag />} label="Total Semesters" value={showDetails.totalSemesters} />
                    </div>
                    <button onClick={() => { handleEdit(showDetails); setShowDetails(null); }} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition text-sm font-semibold">
                        <FaPlus /> Add Branch
                    </button>
                </div>
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">Branches Offered</h3>
                    <div className="space-y-3">
                        {showDetails.branches.map(branch => (
                            <div key={branch.id} className="bg-white p-4 rounded-lg border flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-slate-800">{branch.name}</p>
                                    <p className="text-sm text-slate-600">{branch.description}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => { handleEdit(showDetails); setShowDetails(null); }} className="text-slate-500 hover:text-blue-600 p-2"><FaEdit /></button>
                                    <button onClick={() => handleRemoveBranchFromDetails(showDetails.id, branch.id)} className="text-slate-500 hover:text-red-600 p-2"><FaTrash /></button>
                                </div>
                            </div>
                        ))}
                         {showDetails.branches.length === 0 && (
                            <p className="text-slate-500 text-center py-4">No branches have been added to this course yet.</p>
                        )}
                    </div>
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Courses;