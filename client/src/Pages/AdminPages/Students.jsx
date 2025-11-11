import React, { useState, useEffect, useMemo } from 'react';
import Layout from './Layout'; // Assuming this component exists in your project
import axios from 'axios';

// --- Helper Functions ---

// Generates initials from a name (e.g., "Aarav Sharma" -> "AS")
const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  // Get first letter of first and last name
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// --- SVG Icons ---
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

// --- Edit Modal Component ---
const EditStudentModal = ({ student, onClose, onSave }) => {
  const [form, setForm] = useState(student);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Student</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Name" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Student ID</label>
            <input name="universityId" value={form.universityId} onChange={handleChange} className="w-full border p-2 rounded" placeholder="University ID" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Course</label>
            <input name="course" value={form.course} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Course" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Semester</label>
            <input name="semester" value={form.semester} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Semester" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Year</label>
            <input name="admissionYear" value={form.admissionYear} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Year" />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Contact</label>
            <input name="contact" value={form.contact} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Contact" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Students Page Component ---
const Students = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [editingStudent, setEditingStudent] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  // --- Data Fetching ---
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_URL}/admin/students`);
        // Assuming the API returns data in the same format as allStudentsData
        // e.g., { id, universityId, name, course, semester, admissionYear, contact }
        console.log(res);
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [API_URL]);

  // --- Dynamic Filters (Derived from data) ---
  const courses = useMemo(() => {
    return ['All', ...new Set(students.map(s => s.course))];
  }, [students]);

  const semesters = useMemo(() => {
    return ['All', ...new Set(students.map(s => s.semester))].sort((a, b) => {
      if (a === 'All') return -1;
      if (b === 'All') return 1;
      return a - b;
    });
  }, [students]);

  const admissionYears = useMemo(() => {
    return ['All', ...new Set(students.map(s => s.admissionYear))].sort((a, b) => {
      if (a === 'All') return -1;
      if (b === 'All') return 1;
      return b - a; // Sort years descending
    });
  }, [students]);

  // --- Filtering & Sorting ---
  const sortedAndFilteredStudents = useMemo(() => {
    let filtered = students
      .filter(s => courseFilter === 'All' || s.course === courseFilter)
      .filter(s => semesterFilter === 'All' || s.semester == semesterFilter)
      .filter(s => yearFilter === 'All' || s.admissionYear == yearFilter)
      .filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.universityId.includes(searchTerm)
      );

    if (sortConfig.key !== null) {
      filtered = [...filtered].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [students, courseFilter, semesterFilter, yearFilter, searchTerm, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // --- API Actions ---

  // Delete student permanently
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        // We assume the delete route is /admin/student/:id
        await axios.delete(`${API_URL}/admin/student/${id}`);
        setStudents(prev => prev.filter(student => student.id !== id));
      } catch (err) {
        console.error("Failed to delete student:", err);
        alert("Error: Could not delete student.");
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  const handleSaveEdit = async (updatedStudent) => {
    try {
      // We assume the update route is /admin/student/:id
      await axios.put(`${API_URL}/admin/student/${updatedStudent.id}`, updatedStudent);
      setStudents(prev =>
        prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
      );
      setEditingStudent(null);
    } catch (err) {
      console.error("Failed to update student:", err);
      alert("Error: Could not save changes.");
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Students</h1>
            <p className="text-gray-500 mt-1">Manage student information for GEHU Admin.</p>
          </div>
        </div>
        
        {/* --- Filters --- */}
        <div className="p-4 border-y border-gray-200 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            <span className="font-semibold text-gray-600">Search</span>
            <span className="font-semibold text-gray-600">Course Filter</span>
            <span className="font-semibold text-gray-600">Semester Filter</span>
            <span className="font-semibold text-gray-600">Year Filter</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Search by name or ID"
              />
            </div>
            <div>
              <select
                value={courseFilter}
                onChange={e => setCourseFilter(e.target.value)}
                className="w-full border p-2 rounded"
              >
                {courses.map(course => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={semesterFilter}
                onChange={e => setSemesterFilter(e.target.value)}
                className="w-full border p-2 rounded"
              >
                {semesters.map(semester => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={yearFilter}
                onChange={e => setYearFilter(e.target.value)}
                className="w-full border p-2 rounded"
              >
                {admissionYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* --- Student Table --- */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="px-6 py-3 text-left" onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                  Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▲▼'}
                </th>
                <th className="px-6 py-3 text-left" onClick={() => requestSort('universityId')} style={{ cursor: 'pointer' }}>
                  Student ID {sortConfig.key === 'universityId' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▲▼'}
                </th>
                <th className="px-6 py-3 text-left" onClick={() => requestSort('course')} style={{ cursor: 'pointer' }}>
                  Course {sortConfig.key === 'course' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▲▼'}
                </th>
                <th className="px-6 py-3 text-left" onClick={() => requestSort('semester')} style={{ cursor: 'pointer' }}>
                  Semester {sortConfig.key === 'semester' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▲▼'}
                </th>
                <th className="px-6 py-3 text-left" onClick={() => requestSort('admissionYear')} style={{ cursor: 'pointer' }}>
                  Year {sortConfig.key === 'admissionYear' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▲▼'}
                </th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center p-8">Loading student data...</td>
                </tr>
              ) : sortedAndFilteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-8">No students found.</td>
                </tr>
              ) : (
                sortedAndFilteredStudents.map(student => (
                  <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          {getInitials(student.name)}
                        </div>
                        <div className="font-bold">{student.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{student.universityId}</td>
                    <td className="px-6 py-4">{student.course}</td>
                    <td className="px-6 py-4">{student.semester}</td>
                    <td className="px-6 py-4">{student.admissionYear}</td>
                    <td className="px-6 py-4">{student.contact}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          className="hover:bg-orange-50 rounded-full p-1"
                          title="Edit Student"
                          onClick={() => handleEdit(student)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="hover:bg-red-50 rounded-full p-1"
                          title="Delete Student"
                          onClick={() => handleDelete(student.id)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- Edit Modal --- */}
        {editingStudent && (
          <EditStudentModal
            student={editingStudent}
            onClose={() => setEditingStudent(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </Layout>
  );
};

export default Students;