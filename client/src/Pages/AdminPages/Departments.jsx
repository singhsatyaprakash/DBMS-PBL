import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { FaPlus, FaEllipsisV, FaArrowLeft, FaEye, FaUserTie, FaHashtag, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaAlignLeft, FaUniversity, FaBarcode } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';

// Helper component: Reusable Form Input with Icon
const FormInput = ({ id, label, type, value, onChange, placeholder, required, icon }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        {icon}
      </div>
      <input 
        id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} 
        className="w-full pl-10 p-2.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400" 
        required={required} 
      />
    </div>
  </div>
);

// Animation Variants for the form
const formContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const formItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};


const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [menuOpen, setMenuOpen] = useState(null);
  const [formData, setFormData] = useState({
    name: "", code: "", hodName: "", hodEmail: "", phone: "", officeLocation: "", description: "",
  });

  // Dummy data
  useEffect(() => {
    const dummyData = [
      { id: uuidv4(), name: "Computer Science", code: "CSE101", hodName: "Dr. Meena Sharma", hodEmail: "meena@college.edu", phone: "9876543210", officeLocation: "Block A - 204", description: "Focuses on programming, AI, and software systems.", },
      { id: uuidv4(), name: "Mechanical Engineering", code: "ME102", hodName: "Dr. Rajesh Patel", hodEmail: "rajesh@college.edu", phone: "9123456780", officeLocation: "Block B - 301", description: "Deals with mechanics, thermodynamics, and robotics.", },
    ];
    setDepartments(dummyData);
  }, []);

  // Sorting departments
  const sortedDepartments = [...departments].sort((a, b) =>
    sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  // Handlers
  const handleCancel = () => {
    setFormData({ name: "", code: "", hodName: "", hodEmail: "", phone: "", officeLocation: "", description: "" });
    setShowForm(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.hodEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.hodEmail)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (formData.id) {
      setDepartments(departments.map((dept) => dept.id === formData.id ? { ...dept, ...formData } : dept));
    } else {
      setDepartments([...departments, { id: uuidv4(), ...formData }]);
    }
    handleCancel();
  };

  const handleEdit = (id) => {
    const deptToEdit = departments.find((d) => d.id === id);
    if (deptToEdit) {
      setFormData(deptToEdit);
      setShowForm(true);
      setMenuOpen(null);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
        setDepartments(departments.filter(dept => dept.id !== id));
    }
    setMenuOpen(null);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Helper component for detail items
  const DetailItem = ({ icon, label, value }) => (
    <div className="border-b border-slate-200 py-3 flex items-start gap-4">
      <div className="bg-slate-100 p-2 rounded-full text-blue-600">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <p className="text-md text-slate-800">{value || "N/A"}</p>
      </div>
    </div>
  );


  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight text-center sm:text-left">
            Departments
          </h2>
          <button
            onClick={() => { setFormData({ name: "", code: "", hodName: "", hodEmail: "", phone: "", officeLocation: "", description: "" }); setShowForm(true); }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <FaPlus /> Add Department
          </button>
        </div>
        <div className="mb-6 flex justify-end">
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border border-slate-300 p-2 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="asc">Sort A-Z</option><option value="desc">Sort Z-A</option>
          </select>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDepartments.map((dept) => (
            <motion.div key={dept.id} layout className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col hover:-translate-y-1 border border-slate-200">
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-slate-800 pr-4">{dept.name}</h3>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === dept.id ? null : dept.id)} className="p-1 rounded-full hover:bg-slate-100">
                      <FaEllipsisV className="text-slate-500" />
                    </button>
                    <AnimatePresence>
                    {menuOpen === dept.id && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute right-0 bg-white border rounded-lg shadow-lg mt-2 z-10 w-32 overflow-hidden">
                        <button onClick={() => handleEdit(dept.id)} className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDelete(dept.id)} className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-red-600 text-sm font-medium">Delete</button>
                      </motion.div>
                    )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="text-sm text-slate-600 mt-2 space-y-1">
                  <p className="flex items-center gap-2"><FaHashtag className="text-slate-400"/> {dept.code}</p>
                  <p className="flex items-center gap-2"><FaUserTie className="text-slate-400"/> {dept.hodName || "N/A"}</p>
                </div>
              </div>
              <button onClick={() => setShowDetails(dept)} className="mt-4 flex items-center justify-center gap-2 w-full font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors duration-300">
                <FaEye /> View Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
              <h3 className="text-2xl font-bold mb-6 text-center text-slate-800">{formData.id ? "Edit Department" : "Add Department"}</h3>
              <motion.form onSubmit={handleSave} variants={formContainerVariants} initial="hidden" animate="show">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <motion.div variants={formItemVariants}><FormInput id="name" label="Department Name" type="text" value={formData.name} onChange={handleInputChange} placeholder="e.g., Computer Science" required icon={<FaUniversity />} /></motion.div>
                  <motion.div variants={formItemVariants}><FormInput id="code" label="Department Code" type="text" value={formData.code} onChange={handleInputChange} placeholder="e.g., CSE101" required icon={<FaBarcode />} /></motion.div>
                  <motion.div variants={formItemVariants}><FormInput id="hodName" label="HOD Name (optional)" type="text" value={formData.hodName} onChange={handleInputChange} placeholder="e.g., Dr. Meena Sharma" icon={<FaUserTie />} /></motion.div>
                  <motion.div variants={formItemVariants}><FormInput id="hodEmail" label="HOD Email (optional)" type="email" value={formData.hodEmail} onChange={handleInputChange} placeholder="e.g., meena@college.edu" icon={<FaEnvelope />} /></motion.div>
                  <motion.div variants={formItemVariants}><FormInput id="phone" label="Phone (optional)" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="e.g., 9876543210" icon={<FaPhone />} /></motion.div>
                  <motion.div variants={formItemVariants}><FormInput id="officeLocation" label="Office Location" type="text" value={formData.officeLocation} onChange={handleInputChange} placeholder="e.g., Block A - 204" required icon={<FaMapMarkerAlt />} /></motion.div>
                  <motion.div className="md:col-span-2" variants={formItemVariants}>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <div className="relative">
                       <div className="absolute top-3.5 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><FaAlignLeft /></div>
                       <textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="A brief summary of the department" rows="4" className="w-full pl-10 p-2.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none placeholder:text-slate-400" required />
                    </div>
                  </motion.div>
                </div>
                <motion.div className="flex justify-end gap-4 mt-8" variants={formItemVariants}>
                  <button type="button" onClick={handleCancel} className="px-5 py-2.5 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition font-semibold">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-500/20">Save Department</button>
                </motion.div>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FULL PAGE DETAILS VIEW (CONTENT IS NOW FIXED) --- */}
      <AnimatePresence>
        {showDetails && (
          <motion.div className="fixed inset-0 bg-white overflow-y-auto p-6 sm:p-10 z-50" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}>
              <button onClick={() => setShowDetails(null)} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition font-semibold mb-6"><FaArrowLeft /> Back to List</button>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{showDetails.name}</h2>
                <p className="text-slate-500 font-semibold mb-6">Code: {showDetails.code}</p>
                <div className="mt-4">
                  <DetailItem icon={<FaUserTie />} label="Head of Department" value={showDetails.hodName} />
                  <DetailItem icon={<FaEnvelope />} label="Email" value={showDetails.hodEmail} />
                  <DetailItem icon={<FaPhone />} label="Phone" value={showDetails.phone} />
                  <DetailItem icon={<FaMapMarkerAlt />} label="Office Location" value={showDetails.officeLocation} />
                </div>
                <div className="mt-4 pt-4">
                  <p className="text-sm font-semibold text-slate-500">Description</p>
                  <p className="text-md text-slate-800 leading-relaxed mt-1">{showDetails.description}</p>
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; } .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </Layout>
  );
};

export default Departments;