import React, { useState, useEffect } from "react";
import Layout from "./Layout"; // Assuming Layout.js is in the same directory
import { FaPlus, FaEllipsisV, FaArrowLeft, FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [menuOpen, setMenuOpen] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    hodName: "",
    hodEmail: "",
    phone: "",
    officeLocation: "",
    description: "",
  });

  // Dummy data simulating a server fetch
  useEffect(() => {
    const dummyData = [
      {
        id: uuidv4(),
        name: "Computer Science",
        code: "CSE101",
        hodName: "Dr. Meena Sharma",
        hodEmail: "meena@college.edu",
        phone: "9876543210",
        officeLocation: "Block A - 204",
        description: "Focuses on programming, AI, and software systems.",
      },
      {
        id: uuidv4(),
        name: "Mechanical Engineering",
        code: "ME102",
        hodName: "Dr. Rajesh Patel",
        hodEmail: "rajesh@college.edu",
        phone: "9123456780",
        officeLocation: "Block B - 301",
        description: "Deals with mechanics, thermodynamics, and robotics.",
      },
    ];
    setDepartments(dummyData);
  }, []);

  // Sorting departments alphabetically
  const sortedDepartments = [...departments].sort((a, b) =>
    sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  // Clears form and closes modal
  const handleCancel = () => {
    setFormData({
      name: "", code: "", hodName: "", hodEmail: "", phone: "", officeLocation: "", description: ""
    });
    setShowForm(false);
  };

  // Handles both adding a new department and updating an existing one
  const handleSave = (e) => {
    e.preventDefault();
    if (formData.hodEmail && !formData.hodEmail.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }
    if (formData.id) {
      setDepartments(
        departments.map((dept) =>
          dept.id === formData.id ? { ...dept, ...formData } : dept
        )
      );
    } else {
      const newDept = { id: uuidv4(), ...formData };
      setDepartments([...departments, newDept]);
    }
    handleCancel();
  };

  // Pre-fills the form for editing
  const handleEdit = (id) => {
    const deptToEdit = departments.find((d) => d.id === id);
    if (deptToEdit) {
      setFormData(deptToEdit);
      setShowForm(true);
      setMenuOpen(null);
    }
  };

  // Placeholder delete
  const handleDelete = (id) => {
    alert("Delete request needs admin confirmation (not yet implemented).");
    setMenuOpen(null);
  };

  // Common handler for input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
          <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
            Departments
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Department
          </button>
        </div>

        {/* Filter */}
        <div className="mb-4 flex justify-end">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2 rounded-lg text-sm"
          >
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>
        </div>

        {/* Department Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDepartments.map((dept) => (
            <motion.div
              key={dept.id}
              layout
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow relative flex flex-col"
            >
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800 pr-4">
                    {dept.name}
                  </h3>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === dept.id ? null : dept.id)}>
                      <FaEllipsisV className="text-gray-500" />
                    </button>
                    {menuOpen === dept.id && (
                      <div className="absolute right-0 bg-white border rounded-lg shadow-lg mt-2 z-10 w-28">
                        <button onClick={() => handleEdit(dept.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(dept.id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Code: {dept.code} <br />
                  HOD: {dept.hodName || "N/A"}
                </p>
              </div>
              <button
                onClick={() => setShowDetails(dept)}
                className="mt-4 flex items-center justify-center gap-2 w-full font-semibold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition"
              >
                <FaEye /> View Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.form
              onSubmit={handleSave}
              className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                {formData.id ? "Edit Department" : "Add Department"}
              </h3>

              {/* -- Form Fields (Written Manually) -- */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Department Name</label>
                <input id="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Department Name" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>

              <div className="mb-4">
                <label htmlFor="code" className="block text-gray-700 font-medium mb-1">Department Code</label>
                <input id="code" type="text" value={formData.code} onChange={handleInputChange} placeholder="Department Code" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>

              <div className="mb-4">
                <label htmlFor="hodName" className="block text-gray-700 font-medium mb-1">HOD Name (optional)</label>
                <input id="hodName" type="text" value={formData.hodName} onChange={handleInputChange} placeholder="HOD Name (optional)" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>

              <div className="mb-4">
                <label htmlFor="hodEmail" className="block text-gray-700 font-medium mb-1">HOD Email (optional)</label>
                <input id="hodEmail" type="email" value={formData.hodEmail} onChange={handleInputChange} placeholder="HOD Email (optional)" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">Phone (optional)</label>
                <input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Phone (optional)" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>

              <div className="mb-4">
                <label htmlFor="officeLocation" className="block text-gray-700 font-medium mb-1">Office Location</label>
                <input id="officeLocation" type="text" value={formData.officeLocation} onChange={handleInputChange} placeholder="Office Location" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="Description" rows="4" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" required />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Page Details View */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="fixed inset-0 bg-white overflow-y-auto p-6 sm:p-10 z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setShowDetails(null)} className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 transition">
                <FaArrowLeft /> Back
              </button>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                {showDetails.name} ({showDetails.code})
              </h2>
            </div>
            <details open className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm text-gray-700 leading-relaxed">
              <summary className="text-lg font-semibold mb-3 cursor-pointer">Department Details</summary>
              <p className="border-b py-2"><b>HOD:</b> {showDetails.hodName || "N/A"}</p>
              <p className="border-b py-2"><b>Email:</b> {showDetails.hodEmail || "N/A"}</p>
              <p className="border-b py-2"><b>Phone:</b> {showDetails.phone || "N/A"}</p>
              <p className="border-b py-2"><b>Office:</b> {showDetails.officeLocation}</p>
              <p className="pt-2"><b>Description:</b> {showDetails.description}</p>
            </details>
            <button onClick={() => setShowDetails(null)} className="mt-6 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition">
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
        .custom-scrollbar { scrollbar-width: none; }
      `}</style>
    </Layout>
  );
};

export default Departments;