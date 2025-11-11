import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const Subject = () => {
  const [subjects, setSubjects] = useState([]); // Master list from API
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]); // --- New ---
  const [branches, setBranches] = useState([]); 

  // --- Filtering States ---
  const [filteredSubjects, setFilteredSubjects] = useState([]); // List after course filter
  const [displayedSubjects, setDisplayedSubjects] = useState([]); // List after all filters (for table)
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all'); // --- New ---
  const [searchTerm, setSearchTerm] = useState(''); // --- New ---

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  
  const [formData, setFormData] = useState({
    subject_name: '', subject_code: '', semester: '',
    credits: '', description: '', course_id: '', branch_id: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/admin`;

  // --- Updated Data Fetching (includes departments) ---
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [subjectsRes, coursesRes, deptsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/get-all-subjects`),
        axios.get(`${API_BASE_URL}/get-all-courses`),
        axios.get(`${API_BASE_URL}/get-all-departments`), // --- New ---
      ]);

      setSubjects(subjectsRes.data);
      setFilteredSubjects(subjectsRes.data);
      setDisplayedSubjects(subjectsRes.data); // --- New ---
      setCourses(coursesRes.data);
      setDepartments(deptsRes.data); // --- New ---

    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- New Helper Function for Course Name ---
  const getCourseNameWithDept = (courseId) => {
    const course = courses.find(c => c.course_id === parseInt(courseId));
    if (!course) return 'N/A';
    // Find department, default to empty string if not found
    const dept = departments.find(d => d.department_id === course.department_id);
    return `${course.course_name}${dept ? ` (${dept.department_name})` : ''}`;
  };

  // --- New useEffect for local filtering (Semester + Search) ---
  useEffect(() => {
    let tempSubjects = [...filteredSubjects];

    // 1. Filter by Semester
    if (selectedSemester !== 'all') {
      tempSubjects = tempSubjects.filter(
        subject => subject.semester === parseInt(selectedSemester)
      );
    }

    // 2. Filter by Search Term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempSubjects = tempSubjects.filter(
        subject =>
          subject.subject_name.toLowerCase().includes(lowerSearchTerm) ||
          subject.subject_code.toLowerCase().includes(lowerSearchTerm)
      );
    }

    setDisplayedSubjects(tempSubjects);
  }, [filteredSubjects, selectedSemester, searchTerm]);


  const fetchBranchesForCourse = async (courseId) => {
    if (!courseId) {
      setBranches([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/get-branches/${courseId}`);
      setBranches(res.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
      setError("Failed to load branches for the selected course.");
      setBranches([]);
    }
  };

  // --- Updated Event Handlers ---

  // Handles API-based course filter
  const handleCourseFilterChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setLoading(true);
    
    // Reset local filters when main course filter changes
    setSelectedSemester('all');
    setSearchTerm('');

    if (courseId === 'all') {
      setFilteredSubjects(subjects); // Use all subjects
      setLoading(false);
    } else {
      try {
        const res = await axios.get(`${API_BASE_URL}/get-all-subjects-by-course/${courseId}`);
        setFilteredSubjects(res.data); // Use subjects for that course
      } catch (err) {
        setError('Failed to filter subjects.');
        setFilteredSubjects([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === 'course_id') {
      fetchBranchesForCourse(value);
      newFormData = { ...newFormData, branch_id: '' };
    }
    
    setFormData(newFormData);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      subject_name: '', subject_code: '', semester: '',
      credits: '', description: '', course_id: '', branch_id: '',
    });
    setCurrentSubject(null);
    setBranches([]);
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setIsEditing(true);
    setCurrentSubject(subject);
    setFormData({
      subject_name: subject.subject_name,
      subject_code: subject.subject_code,
      semester: subject.semester,
      credits: subject.credits,
      description: subject.description || '',
      course_id: subject.course_id,
      branch_id: subject.branch_id || '',
    });
    fetchBranchesForCourse(subject.course_id); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentSubject(null);
    setError(null);
    setBranches([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/update-subject/${currentSubject.subject_id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/add-new-subject`, formData);
      }
      
      closeModal();
      await fetchAllData();
      setSelectedCourse('all');

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      console.error(err);
    }
  };

  const handleDelete = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await axios.delete(`${API_BASE_URL}/delete-subject/${subjectId}`);
        await fetchAllData();
        setSelectedCourse('all');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete subject.');
        console.error(err);
      }
    }
  };

  // (Original getCourseName is no longer needed)

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        {/* --- Header --- */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Subjects</h1>
          <button
            onClick={openAddModal}
            className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            <FaPlus className="mr-2" />
            Add Subject
          </button>
        </div>

        {/* --- Filter Bars (Updated) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Course Filter */}
          <div>
            <label htmlFor="courseFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Course
            </label>
            <select
              id="courseFilter"
              value={selectedCourse}
              onChange={handleCourseFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              disabled={courses.length === 0}
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {getCourseNameWithDept(course.course_id)}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label htmlFor="semesterFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Semester
            </label>
            <select
              id="semesterFilter"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="md:col-span-1">
             <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search by Name or Code
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., CS101 or Physics"
                className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* --- Loading and Error States --- */}
        {loading && <div className="text-center p-4">Loading subjects...</div>}
        {!loading && error && !isModalOpen && <div className="text-center p-4 text-red-600 bg-red-100 rounded-md">{error}</div>}

        {/* --- Subjects Table (Updated to use displayedSubjects) --- */}
        {!loading && !error && (
          <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-600">Subject Name</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Code</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Semester</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Credits</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Course</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No subjects found matching your filters.
                    </td>
                  </tr>
                ) : (
                  displayedSubjects.map((subject) => (
                    <tr key={subject.subject_id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{subject.subject_name}</td>
                      <td className="p-4 font-mono text-sm text-gray-700">{subject.subject_code}</td>
                      <td className="p-4">{subject.semester}</td>
                      <td className="p-4">{subject.credits}</td>
                      <td className="p-4">{getCourseNameWithDept(subject.course_id)}</td>
                      <td className="p-4 flex items-center space-x-3">
                        <button
                          onClick={() => openEditModal(subject)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(subject.subject_id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Add/Edit Modal (Updated Course Dropdown) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-lg m-4 transform transition-all">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {isEditing ? 'Edit Subject' : 'Add New Subject'}
            </h2>

            {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subject Name */}
                <div className="md:col-span-2">
                  <label htmlFor="subject_name" className="block text-sm font-medium text-gray-700">Subject Name</label>
                  <input
                    type="text" name="subject_name" id="subject_name"
                    value={formData.subject_name} onChange={handleFormChange} required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Subject Code */}
                <div>
                  <label htmlFor="subject_code" className="block text-sm font-medium text-gray-700">Subject Code</label>
                  <input
                    type="text" name="subject_code" id="subject_code"
                    value={formData.subject_code} onChange={handleFormChange} required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Semester */}
                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700">Semester</label>
                  <input
                    type="number" name="semester" id="semester"
                    value={formData.semester} onChange={handleFormChange} required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Credits */}
                <div>
                  <label htmlFor="credits" className="block text-sm font-medium text-gray-700">Credits</label>
                  <input
                    type="number" name="credits" id="credits"
                    value={formData.credits} onChange={handleFormChange} required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Course (Dropdown) */}
                <div>
                  <label htmlFor="course_id" className="block text-sm font-medium text-gray-700">Course</label>
                  <select
                    name="course_id" id="course_id"
                    value={formData.course_id} onChange={handleFormChange} required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={courses.length === 0}
                  >
                    <option value="">Select a Course</option>
                    {courses.map((course) => (
                      <option key={course.course_id} value={course.course_id}>
                        {getCourseNameWithDept(course.course_id)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Branch (Dropdown) */}
                <div className="md:col-span-2">
                  <label htmlFor="branch_id" className="block text-sm font-medium text-gray-700">Branch (Optional)</label>
                  <select
                    name="branch_id" id="branch_id"
                    value={formData.branch_id} onChange={handleFormChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={!formData.course_id} // Disabled until a course is selected
                  >
                    {!formData.course_id ? (
                      <option value="">Select a course first</option>
                    ) : branches.length === 0 ? (
                      <option value="">No branches found for this course</option>
                    ) : (
                      <> 
                        <option value="">Select a Branch (if applicable)</option>
                        {branches.map((branch) => (
                          <option key={branch.branch_id} value={branch.branch_id}>
                            {branch.branch_name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                  <textarea
                    name="description" id="description" rows="3"
                    value={formData.description} onChange={handleFormChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>

              {/* --- Form Buttons --- */}
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button" onClick={closeModal}
                  className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  {isEditing ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Subject;