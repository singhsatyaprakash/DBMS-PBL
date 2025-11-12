import React, { useState, useEffect } from 'react';
import Layout from "./Layout";
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaUserPlus, FaUsers, FaTimes, FaFileUpload, FaSpinner, FaUser, FaEnvelope, 
    FaBirthdayCake, FaPhone, FaMapMarkedAlt, FaUserTie, FaBriefcase, FaGlobe, 
    FaTint, FaClipboardList, FaCamera
} from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Country codes with validation patterns
const countryCodes = [
  { code: '+91', country: 'India', digits: 10, pattern: /^[6-9]\d{9}$/ },
  { code: '+1', country: 'USA/Canada', digits: 10, pattern: /^\d{10}$/ },
  { code: '+44', country: 'UK', digits: 10, pattern: /^7\d{9}$/ },
  { code: '+966', country: 'Saudi Arabia', digits: 9, pattern: /^5\d{8}$/ },
  { code: '+971', country: 'UAE', digits: 9, pattern: /^5\d{8}$/ },
  { code: '+61', country: 'Australia', digits: 9, pattern: /^4\d{8}$/ },
  { code: '+49', country: 'Germany', digits: 10, pattern: /^1\d{9}$/ },
  { code: '+33', country: 'France', digits: 9, pattern: /^[67]\d{8}$/ },
];

// Phone Input Component
const PhoneInput = ({ value, onChange, error, countryCode, onCountryCodeChange, label }) => {
  const selectedCountry = countryCodes.find(c => c.code === countryCode);
  
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
      <div className="flex gap-3">
        {/* Country Code Selector */}
        <div className="w-32">
          <div className="relative">
            <select
              value={countryCode}
              onChange={onCountryCodeChange}
              className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none text-sm"
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code} ({country.country})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FaPhone />
            </div>
            <input
              type="tel"
              value={value}
              onChange={onChange}
              placeholder={`Enter ${selectedCountry?.digits || 10} digits`}
              className={`w-full pl-10 p-2.5 bg-slate-100 border rounded-lg focus:outline-none focus:ring-2 ${
                error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-sky-500'
              }`}
            />
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      
      {/* Success indicator */}
      {value && value.length === selectedCountry?.digits && !error && (
        <p className="mt-1 text-xs text-green-600">
          ✓ Correct format for {selectedCountry.country}
        </p>
      )}
    </div>
  );
};

// Form Input Component
const FormInput = ({ id, label, icon, error, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        {icon}
      </div>
      <input 
        id={id} 
        {...props} 
        className={`w-full pl-10 p-2.5 bg-slate-100 border rounded-lg focus:outline-none focus:ring-2 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-sky-500'
        }`} 
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// Form Select Component
const FormSelect = ({ id, label, value, onChange, children, error, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
    <select 
      id={id} 
      value={value} 
      onChange={onChange} 
      {...props} 
      className={`w-full p-2.5 border rounded-lg bg-slate-100 focus:outline-none focus:ring-2 ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-sky-500'
      }`}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const Admissions = () => {
    const [isNewAdmissionOpen, setIsNewAdmissionOpen] = useState(false);
    const [isBulkAdmissionOpen, setIsBulkAdmissionOpen] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [branches, setBranches] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [countryCode, setCountryCode] = useState('+91');
    const [fatherCountryCode, setFatherCountryCode] = useState('+91');
    const [motherCountryCode, setMotherCountryCode] = useState('+91');

    const initialFormData = {
        name: "", email: "", department_id: "", course_id: "", branch_id: "", semester: "",
        year: "", dob: "", gender: "Male", nationality: "Indian", blood_group: "", contact: "",
        address: "", father_name: "", father_contact: "", father_occupation: "",
        mother_name: "", mother_contact: "", mother_occupation: ""
    };
    const [formData, setFormData] = useState(initialFormData);
    const [profileImagePreview, setProfileImagePreview] = useState(null);

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const allowedDomains = ['gmail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com', 'outlook.com'];
        
        if (!email) return "Email is required";
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address";
        }
        
        const domain = email.split('@')[1].toLowerCase();
        if (!allowedDomains.includes(domain)) {
            return "Only Gmail, Yahoo, and Hotmail/Outlook addresses are allowed";
        }
        
        return "";
    };

    const validatePhoneNumber = (phone, code) => {
        if (!phone) return "Phone number is required";
        
        const country = countryCodes.find(c => c.code === code);
        if (!country) return "Invalid country code";
        
        if (phone.length !== country.digits) {
            return `Must be exactly ${country.digits} digits for ${country.country}`;
        }
        
        if (!country.pattern.test(phone)) {
            return `Invalid ${country.country} phone number format`;
        }
        
        return "";
    };

    const validateForm = () => {
        const errors = {};
        
        // Email validation
        const emailError = validateEmail(formData.email);
        if (emailError) errors.email = emailError;
        
        // Phone number validation
        const phoneError = validatePhoneNumber(formData.contact, countryCode);
        if (phoneError) errors.contact = phoneError;
        
        // Father's contact validation (if provided)
        if (formData.father_contact) {
            const fatherPhoneError = validatePhoneNumber(formData.father_contact, fatherCountryCode);
            if (fatherPhoneError) errors.father_contact = fatherPhoneError;
        }
        
        // Mother's contact validation (if provided)
        if (formData.mother_contact) {
            const motherPhoneError = validatePhoneNumber(formData.mother_contact, motherCountryCode);
            if (motherPhoneError) errors.mother_contact = motherPhoneError;
        }
        
        // Required fields validation
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.department_id) errors.department_id = "Department is required";
        if (!formData.course_id) errors.course_id = "Course is required";
        if (!formData.dob) errors.dob = "Date of birth is required";
        if (!formData.address.trim()) errors.address = "Address is required";
        if (!formData.year) errors.year = "Year is required";
        if (!formData.semester) errors.semester = "Semester is required";
        if (!formData.blood_group) errors.blood_group = "Blood group is required";
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Fetches departments on initial load
    useEffect(() => {
        const fetchInitialData = async () => {
            const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/admin`;
            try {
                const deptRes = await axios.get(`${BASE_URL}/get-all-departments`);
                setDepartments(deptRes.data || []);
            } catch (error) {
                toast.error("Failed to load departments.");
            }
        };
        fetchInitialData();
    }, []);

    // Fetches courses whenever the selected department changes
    useEffect(() => {
        const fetchCourses = async () => {
            if (!formData.department_id) {
                setCourses([]);
                return;
            }
            const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/admin`;
            try {
                const response = await axios.get(`${BASE_URL}/get-courses/${formData.department_id}`);
                setCourses(response.data || []);
            } catch (error) {
                toast.error(`Failed to load courses.`);
                setCourses([]);
            }
        };
        fetchCourses();
    }, [formData.department_id]);

    // Fetches branches whenever the selected course changes
    useEffect(() => {
        const fetchBranches = async () => {
            if (!formData.course_id) {
                setBranches([]);
                return;
            }
            const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/admin`;
            try {
                const response = await axios.get(`${BASE_URL}/get-branches/${formData.course_id}`);
                setBranches(response.data || []);
            } catch (error) {
                toast.error(`Failed to load branches.`);
                setBranches([]);
            }
        };
        fetchBranches();
    }, [formData.course_id]);

    const handleInputChange = (e) => {
        const { id, name, value, files } = e.target;
        const key = id || name;

        // Clear error when user starts typing
        if (formErrors[key]) {
            setFormErrors(prev => ({ ...prev, [key]: "" }));
        }

        if (key === "profile_image_url" && files && files[0]) {
            if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(profileImagePreview);
            }
            setProfileImagePreview(URL.createObjectURL(files[0]));
        } else {
            if (key === 'department_id') {
                setFormData(prev => ({ 
                    ...prev, 
                    course_id: '', 
                    branch_id: '', 
                    [key]: value 
                }));
            } else if (key === 'course_id') {
                setFormData(prev => ({ 
                    ...prev, 
                    branch_id: '', 
                    [key]: value 
                }));
            } else {
                setFormData(prev => ({ ...prev, [key]: value }));
            }
        }
    };

    const handlePhoneChange = (e, type = 'student') => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        const key = type === 'father' ? 'father_contact' : type === 'mother' ? 'mother_contact' : 'contact';
        
        // Get the appropriate country code and digit limit
        const currentCountryCode = type === 'father' ? fatherCountryCode : 
                                 type === 'mother' ? motherCountryCode : countryCode;
        const country = countryCodes.find(c => c.code === currentCountryCode);
        const maxDigits = country?.digits || 10;
        
        // Limit input to the maximum digits for the selected country
        const limitedValue = value.slice(0, maxDigits);
        
        setFormData(prev => ({ ...prev, [key]: limitedValue }));
        
        // Clear error when user starts typing
        if (formErrors[key]) {
            setFormErrors(prev => ({ ...prev, [key]: "" }));
        }
    };

    const handleCountryCodeChange = (e, type = 'student') => {
        const code = e.target.value;
        if (type === 'father') {
            setFatherCountryCode(code);
            // Clear father contact when country code changes
            setFormData(prev => ({ ...prev, father_contact: '' }));
        } else if (type === 'mother') {
            setMotherCountryCode(code);
            // Clear mother contact when country code changes
            setFormData(prev => ({ ...prev, mother_contact: '' }));
        } else {
            setCountryCode(code);
            // Clear student contact when country code changes
            setFormData(prev => ({ ...prev, contact: '' }));
        }
    };
    
    const handleNewAdmissionSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix the validation errors before submitting.");
            return;
        }

        setIsSaving(true);
        try {
            // Format phone numbers with country codes before sending
            const payload = { 
                ...formData,
                contact: countryCode + formData.contact,
                father_contact: formData.father_contact ? fatherCountryCode + formData.father_contact : "",
                mother_contact: formData.mother_contact ? motherCountryCode + formData.mother_contact : ""
            };
            
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-student`, payload);
            
            if (response.data.success) {
                toast.success("Student added successfully! 🎉");
                setIsNewAdmissionOpen(false);
                setFormData(initialFormData);
                setProfileImagePreview(null);
                setFormErrors({});
                setCountryCode('+91');
                setFatherCountryCode('+91');
                setMotherCountryCode('+91');
            } else {
                toast.error(response.data.message || "An error occurred.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleBulkAdmissionSubmit = async (e) => {
        e.preventDefault();
        if (!csvFile) return toast.warn("Please select a CSV file.");
        
        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', csvFile);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-bulk-student`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.added > 0) toast.success(`${response.data.added} students added!`);
            if (response.data.failedEmails?.length > 0) toast.warn(`${response.data.failedEmails.length} emails failed.`);
            setIsBulkAdmissionOpen(false);
            setCsvFile(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
    };

    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-3xl font-bold mb-2 text-slate-800">Student Admissions Portal</h2>
                <p className="text-slate-500 mb-8">Choose an option below to add new students to the system.</p>
            </motion.div>
            
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center flex flex-col items-center h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="p-5 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-lg -mt-16">
                            <FaUserPlus className="text-4xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mt-6">New Admission</h3>
                        <p className="text-slate-500 my-4 flex-grow">Add a single student by filling out a detailed form with all their information.</p>
                        <button onClick={() => setIsNewAdmissionOpen(true)} className="mt-4 w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold py-3 rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-300 shadow-md hover:shadow-lg">
                            Open Admission Form
                        </button>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                     <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center flex flex-col items-center h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="p-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg -mt-16">
                            <FaUsers className="text-4xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mt-6">Bulk Admission</h3>
                        <p className="text-slate-500 my-4 flex-grow">Save time by uploading a CSV file to admit multiple students simultaneously.</p>
                        <button onClick={() => setIsBulkAdmissionOpen(true)} className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg">
                            Upload CSV File
                        </button>
                    </div>
                </motion.div>
            </motion.div>

            {/* --- New Admission Modal --- */}
            <AnimatePresence>
                {isNewAdmissionOpen && (
                    <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div 
                            className="bg-slate-50 w-full max-w-5xl p-1 rounded-2xl shadow-2xl"
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                        >
                            <div className="bg-white p-6 rounded-t-xl">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-bold text-slate-800">New Student Admission</h3>
                                    <button onClick={() => setIsNewAdmissionOpen(false)} className="text-slate-400 hover:text-slate-600"><FaTimes size={20}/></button>
                                </div>
                            </div>
                            <div className="p-6 max-h-[75vh] overflow-y-auto">
                                <form onSubmit={handleNewAdmissionSubmit} className="space-y-8">
                                    <div className="relative w-32 h-32 mx-auto group">
                                        <img src={profileImagePreview || `https://placehold.co/128`} alt="Preview" className="w-full h-full rounded-full object-cover ring-4 ring-slate-200"/>
                                        <label htmlFor="profile_image_url" className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300">
                                            <FaCamera className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                                            <input id="profile_image_url" name="profile_image_url" type="file" accept="image/*" onChange={handleInputChange} className="hidden"/>
                                        </label>
                                    </div>
                                    
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                                        <h4 className="text-lg font-semibold text-slate-700 mb-4">Personal Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput 
                                                id="name" 
                                                label="Full Name" 
                                                icon={<FaUser/>} 
                                                required 
                                                value={formData.name} 
                                                onChange={handleInputChange}
                                                error={formErrors.name}
                                            />
                                            <FormInput 
                                                id="email" 
                                                label="Email Address" 
                                                type="email" 
                                                icon={<FaEnvelope/>} 
                                                required 
                                                value={formData.email} 
                                                onChange={handleInputChange}
                                                error={formErrors.email}
                                                placeholder="example@gmail.com"
                                            />
                                            <FormInput 
                                                id="dob" 
                                                label="Date of Birth" 
                                                type="date" 
                                                icon={<FaBirthdayCake/>} 
                                                value={formData.dob} 
                                                onChange={handleInputChange} 
                                                required
                                                error={formErrors.dob}
                                            />
                                            <PhoneInput 
                                                value={formData.contact}
                                                onChange={(e) => handlePhoneChange(e, 'student')}
                                                error={formErrors.contact}
                                                countryCode={countryCode}
                                                onCountryCodeChange={(e) => handleCountryCodeChange(e, 'student')}
                                                label="Contact Number"
                                            />
                                            <FormSelect 
                                                id="gender" 
                                                label="Gender" 
                                                value={formData.gender} 
                                                onChange={handleInputChange}
                                            >
                                                <option>Male</option> 
                                                <option>Female</option> 
                                                <option>Other</option>
                                            </FormSelect>
                                            <FormInput 
                                                id="nationality" 
                                                label="Nationality" 
                                                icon={<FaGlobe/>} 
                                                value={formData.nationality} 
                                                onChange={handleInputChange}
                                            />
                                            <FormSelect 
                                                id="blood_group" 
                                                label="Blood Group" 
                                                value={formData.blood_group} 
                                                onChange={handleInputChange}
                                                error={formErrors.blood_group}
                                                required
                                            >
                                                <option value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </FormSelect>
                                            <div className="md:col-span-2">
                                                <FormInput 
                                                    id="address" 
                                                    label="Full Address" 
                                                    icon={<FaMapMarkedAlt/>} 
                                                    value={formData.address} 
                                                    onChange={handleInputChange} 
                                                    required
                                                    error={formErrors.address}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                                        <h4 className="text-lg font-semibold text-slate-700 mb-4">Academic Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                             <FormSelect 
                                                 id="department_id" 
                                                 label="Department" 
                                                 value={formData.department_id} 
                                                 onChange={handleInputChange} 
                                                 required
                                                 error={formErrors.department_id}
                                             >
                                                 <option value="">Select Department</option>
                                                 {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
                                             </FormSelect>
                                             
                                             <FormSelect 
                                                 id="course_id" 
                                                 label="Course" 
                                                 value={formData.course_id} 
                                                 onChange={handleInputChange} 
                                                 required 
                                                 disabled={!formData.department_id || courses.length === 0}
                                                 error={formErrors.course_id}
                                             >
                                                 <option value="">Select Course</option>
                                                 {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
                                             </FormSelect>
                                             
                                             <FormSelect 
                                                 id="branch_id" 
                                                 label="Branch" 
                                                 value={formData.branch_id} 
                                                 onChange={handleInputChange} 
                                                 disabled={!formData.course_id || branches.length === 0}
                                             >
                                                 <option value="">Select Branch</option>
                                                 {branches.map(b => <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>)}
                                             </FormSelect>
                                             
                                             <FormInput 
                                                 id="year" 
                                                 label="Current Year" 
                                                 type="number" 
                                                 icon={<FaClipboardList/>} 
                                                 value={formData.year} 
                                                 onChange={handleInputChange} 
                                                 required
                                                 min="1"
                                                 max="6"
                                                 error={formErrors.year}
                                             />
                                             <FormInput 
                                                 id="semester" 
                                                 label="Current Semester" 
                                                 type="number" 
                                                 icon={<FaClipboardList/>} 
                                                 value={formData.semester} 
                                                 onChange={handleInputChange} 
                                                 required
                                                 min="1"
                                                 max="12"
                                                 error={formErrors.semester}
                                             />
                                        </div>
                                     </div>

                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                                        <h4 className="text-lg font-semibold text-slate-700 mb-4">Guardian Information</h4>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput 
                                                id="father_name" 
                                                label="Father's Name" 
                                                icon={<FaUserTie/>} 
                                                value={formData.father_name} 
                                                onChange={handleInputChange}
                                            />
                                            <FormInput 
                                                id="mother_name" 
                                                label="Mother's Name" 
                                                icon={<FaUserTie/>} 
                                                value={formData.mother_name} 
                                                onChange={handleInputChange}
                                            />
                                            <PhoneInput 
                                                value={formData.father_contact}
                                                onChange={(e) => handlePhoneChange(e, 'father')}
                                                error={formErrors.father_contact}
                                                countryCode={fatherCountryCode}
                                                onCountryCodeChange={(e) => handleCountryCodeChange(e, 'father')}
                                                label="Father's Contact"
                                            />
                                            <PhoneInput 
                                                value={formData.mother_contact}
                                                onChange={(e) => handlePhoneChange(e, 'mother')}
                                                error={formErrors.mother_contact}
                                                countryCode={motherCountryCode}
                                                onCountryCodeChange={(e) => handleCountryCodeChange(e, 'mother')}
                                                label="Mother's Contact"
                                            />
                                            <FormInput 
                                                id="father_occupation" 
                                                label="Father's Occupation" 
                                                icon={<FaBriefcase/>} 
                                                value={formData.father_occupation} 
                                                onChange={handleInputChange}
                                            />
                                            <FormInput 
                                                id="mother_occupation" 
                                                label="Mother's Occupation" 
                                                icon={<FaBriefcase/>} 
                                                value={formData.mother_occupation} 
                                                onChange={handleInputChange}
                                            />
                                         </div>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-slate-50 py-4 -mx-6 px-6">
                                        <button type="button" onClick={() => setIsNewAdmissionOpen(false)} className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition">Cancel</button>
                                        <button type="submit" disabled={isSaving} className="px-6 py-2.5 w-48 bg-sky-600 text-white rounded-lg font-semibold flex items-center justify-center disabled:bg-sky-300 hover:bg-sky-700 transition">
                                            {isSaving ? <FaSpinner className="animate-spin" /> : 'Save Admission'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Bulk Admission Modal --- */}
            <AnimatePresence>
                {isBulkAdmissionOpen && (
                     <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-slate-800">Bulk Student Admission</h3>
                                <button onClick={() => setIsBulkAdmissionOpen(false)} className="text-slate-400 hover:text-slate-600"><FaTimes size={20}/></button>
                            </div>
                            <form onSubmit={handleBulkAdmissionSubmit}>
                                <div className="mt-4 flex justify-center px-6 pt-8 pb-8 border-2 border-slate-300 border-dashed rounded-lg bg-slate-50">
                                    <div className="space-y-2 text-center">
                                        <FaFileUpload className="mx-auto h-16 w-16 text-slate-400" />
                                        <div className="flex text-md text-slate-600">
                                            <label htmlFor="csv-upload" className="relative cursor-pointer rounded-md font-semibold text-emerald-600 hover:text-emerald-500">
                                                <span>Upload a CSV file</span>
                                                <input id="csv-upload" name="csv-upload" type="file" accept=".csv" className="sr-only" onChange={(e) => setCsvFile(e.target.files[0])} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-sm text-slate-500">Must be a .CSV file up to 10MB</p>
                                    </div>
                                </div>
                                {csvFile && <p className="mt-4 text-md font-semibold text-emerald-700 bg-emerald-50 py-2 px-4 rounded-md">File selected: {csvFile.name}</p>}

                                <div className="mt-8">
                                    <button type="submit" disabled={isUploading || !csvFile} className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 transition-all duration-300 shadow-md hover:shadow-lg">
                                        {isUploading ? <><FaSpinner className="animate-spin" /> Uploading...</> : 'Upload and Process File'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                     </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default Admissions;