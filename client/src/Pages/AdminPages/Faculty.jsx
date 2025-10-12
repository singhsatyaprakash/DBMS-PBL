import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { FaPlus, FaEllipsisV, FaArrowLeft, FaEye, FaUserTie, FaBuilding, FaGraduationCap, FaEnvelope, FaPhone, FaBirthdayCake, FaVenusMars, FaMapMarkedAlt, FaFilter, FaUser, FaBriefcase, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';

// Reusable Components
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
            <input id={id} {...props} className="w-full pl-10 p-2.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400" />
        </div>
    </div>
);

const Faculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState(["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electronics"]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [filterDept, setFilterDept] = useState("All");

  const [formData, setFormData] = useState({
    name: "", department: "", degree: "", designation: "", email: "", dob: "", contact: "", address: "", gender: "Male", profileImage: null
  });

  // Dummy Data
  useEffect(() => {
    const dummyData = [
      { id: uuidv4(), name: "Dr. Meena Sharma", department: "Computer Science", degree: "Ph.D. in AI", designation: "Professor", email: "meena@college.edu", dob: "1980-05-15", contact: "9876543210", address: "123 Tech Park, Dehradun", gender: "Female", profileImage: `https://randomuser.me/api/portraits/women/44.jpg`, specialization: "Artificial Intelligence" },
      { id: uuidv4(), name: "Dr. Rajesh Patel", department: "Mechanical Engineering", degree: "M.Tech in Robotics", designation: "Associate Professor", email: "rajesh@college.edu", dob: "1975-11-22", contact: "9123456780", address: "456 Industry Hub, Dehradun", gender: "Male", profileImage: `https://randomuser.me/api/portraits/men/44.jpg`, specialization: "Robotics" },
    ];
    setFacultyList(dummyData);
  }, []);

  const filteredAndSortedFaculty = facultyList
    .filter(faculty => filterDept === "All" || faculty.department === filterDept)
    .sort((a, b) => {
        switch (sortOrder) {
            case 'name-desc': return b.name.localeCompare(a.name);
            case 'degree-asc': return a.degree.localeCompare(b.degree);
            case 'degree-desc': return b.degree.localeCompare(a.degree);
            case 'name-asc': default: return a.name.localeCompare(b.name);
        }
    });

  // Handlers
  const handleInputChange = (e) => {
    const { id, name, value, files } = e.target;
    if (id === "profileImage" && files[0]) {
      if (formData.profileImage && formData.profileImage.startsWith('blob:')) {
        URL.revokeObjectURL(formData.profileImage);
      }
      setFormData(prev => ({ ...prev, profileImage: URL.createObjectURL(files[0]) }));
    } else {
      const key = id || name;
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", department: "", degree: "", designation: "", email: "", dob: "", contact: "", address: "", gender: "Male", profileImage: null });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      setFacultyList(facultyList.map((faculty) => faculty.id === editingId ? { ...formData, id: editingId } : faculty));
    } else {
      const newFacultyData = { ...formData, id: uuidv4() };
      if (!newFacultyData.profileImage) {
        const randomNumber = Math.floor(Math.random() * 70);
        newFacultyData.profileImage = newFacultyData.gender === 'Female' 
          ? `https://randomuser.me/api/portraits/women/${randomNumber}.jpg`
          : `https://randomuser.me/api/portraits/men/${randomNumber}.jpg`;
      }
      setFacultyList([...facultyList, newFacultyData]);
    }
    handleCancel();
  };

  const handleEdit = (faculty) => {
    setEditingId(faculty.id);
    setFormData(faculty);
    setShowForm(true);
    setMenuOpen(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this faculty member?")) {
        setFacultyList(facultyList.filter(faculty => faculty.id !== id));
    }
    setMenuOpen(null);
  };

  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Faculty</h2>
          <button onClick={() => { setEditingId(null); setFormData({ name: "", department: departments[0], degree: "", designation: "", email: "", dob: "", contact: "", address: "", gender: "Male", profileImage: null }); setShowForm(true); }} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
            <FaPlus /> Add New Faculty
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-1"><FaFilter /> Filter by Department</label>
                <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="w-full border border-slate-300 p-2 rounded-lg bg-slate-50">
                    <option value="All">All Departments</option>
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
            </div>
            <div className="flex-1">
                <label className="text-sm font-medium text-slate-600 mb-1">Sort By</label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full border border-slate-300 p-2 rounded-lg bg-slate-50">
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="degree-asc">Degree (A-Z)</option>
                    <option value="degree-desc">Degree (Z-A)</option>
                </select>
            </div>
        </div>

        <div>
          {filteredAndSortedFaculty.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-slate-200">
              <FaSearch className="mx-auto text-5xl text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700">No Records Found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedFaculty.map((faculty) => (
                <motion.div key={faculty.id} layout className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all relative flex flex-col hover:-translate-y-1 border items-center text-center p-6">
                  <div className="absolute top-2 right-2">
                    <button onClick={() => setMenuOpen(menuOpen === faculty.id ? null : faculty.id)} className="p-1 rounded-full hover:bg-slate-100"><FaEllipsisV className="text-slate-500" /></button>
                    <AnimatePresence>
                    {menuOpen === faculty.id && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute right-0 bg-white border rounded-lg shadow-lg mt-2 z-10 w-32 overflow-hidden text-left">
                        <button onClick={() => handleEdit(faculty)} className="block w-full px-4 py-2 hover:bg-slate-100 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDelete(faculty.id)} className="block w-full px-4 py-2 hover:bg-slate-100 text-red-600 text-sm font-medium">Delete</button>
                      </motion.div>
                    )}
                    </AnimatePresence>
                  </div>
                  <img src={faculty.profileImage} alt={faculty.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-200 mb-4" />
                  <h3 className="text-lg font-bold text-slate-800">{faculty.name}</h3>
                  <p className="text-sm text-slate-500">{faculty.designation}</p>
                  <div className="text-sm text-slate-600 mt-2 flex-grow">
                      <p className="flex items-center justify-center gap-2"><FaBuilding className="text-slate-400"/> {faculty.department}</p>
                      <p className="flex items-center justify-center gap-2 mt-1"><FaGraduationCap className="text-slate-400"/> {faculty.degree}</p>
                  </div>
                  <button onClick={() => setShowDetails(faculty)} className="mt-4 w-full font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition">
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h3 className="text-2xl font-bold mb-6 text-center text-slate-800">{editingId ? "Edit Faculty" : "Add New Faculty"}</h3>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                    <img src={formData.profileImage || (formData.gender === 'Female' ? `https://randomuser.me/api/portraits/women/50.jpg` : `https://randomuser.me/api/portraits/men/50.jpg`)} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-200"/>
                    <label htmlFor="profileImage" className="cursor-pointer text-sm font-semibold text-blue-600 bg-blue-50 py-2 px-4 rounded-full hover:bg-blue-100 transition">
                      Upload Photo
                      <input id="profileImage" type="file" accept="image/*" onChange={handleInputChange} className="hidden"/>
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput id="name" label="Full Name" type="text" value={formData.name} onChange={handleInputChange} required icon={<FaUser />} placeholder="e.g., Dr. Meena Sharma"/>
                  <FormInput id="designation" label="Designation" type="text" value={formData.designation} onChange={handleInputChange} required icon={<FaBriefcase />} placeholder="e.g., Professor"/>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <select id="department" value={formData.department} onChange={handleInputChange} className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {departments.map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <FormInput id="degree" label="Degree" type="text" value={formData.degree} onChange={handleInputChange} required icon={<FaGraduationCap />} placeholder="e.g., Ph.D. in AI"/>
                  <FormInput id="email" label="Email Address" type="email" value={formData.email} onChange={handleInputChange} required icon={<FaEnvelope />} placeholder="e.g., name@college.edu"/>
                  <FormInput id="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleInputChange} required icon={<FaBirthdayCake />} />
                  <FormInput id="contact" label="Contact Number" type="tel" value={formData.contact} onChange={handleInputChange} required icon={<FaPhone />} placeholder="e.g., 9876543210"/>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                      <div className="flex gap-6"><label className="flex items-center gap-2"><input type="radio" value="Male" name="gender" checked={formData.gender === "Male"} onChange={handleInputChange}/>Male</label><label className="flex items-center gap-2"><input type="radio" value="Female" name="gender" checked={formData.gender === "Female"} onChange={handleInputChange}/>Female</label></div>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <textarea id="address" value={formData.address} onChange={handleInputChange} required rows="3" placeholder="Enter full address" className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={handleCancel} className="px-5 py-2.5 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg shadow-blue-500/20 transition">Save Faculty</button>
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
              <div className="text-center"><img src={showDetails.profileImage} alt={showDetails.name} className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-200 mx-auto"/>
                <h2 className="text-3xl font-bold text-slate-800 mt-4">{showDetails.name}</h2>
                <p className="text-slate-500 font-semibold">{showDetails.designation}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border mt-6">
                <DetailItem icon={<FaBuilding />} label="Department" value={showDetails.department} />
                <DetailItem icon={<FaGraduationCap />} label="Degree/Specialization" value={`${showDetails.degree} / ${showDetails.specialization || 'N/A'}`} />
                <DetailItem icon={<FaEnvelope />} label="Email" value={showDetails.email} />
                <DetailItem icon={<FaPhone />} label="Contact" value={showDetails.contact} />
                <DetailItem icon={<FaBirthdayCake />} label="Date of Birth" value={showDetails.dob} />
                <DetailItem icon={<FaVenusMars />} label="Gender" value={showDetails.gender} />
                <DetailItem icon={<FaMapMarkedAlt />} label="Address" value={showDetails.address} />
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Faculty;