import React, { useContext, useState } from 'react';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';
// Changed from StudentContext
import { FacultyContext } from '../../context/FacultyContext'; 

// Renamed component
const FacultyChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(true);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const { oldPassword, newPassword, confirmPassword } = formData;
  
  // Changed from student
  const { faculty } = useContext(FacultyContext); 

  // Changed from student_id and student.id
  const faculty_id = faculty.id; 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    // Changed from student_id
    if (!faculty_id) { 
      setError("Authentication error. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      console.log(formData);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/faculty/reset-password`, {
        faculty_id, // Changed from student_id
        oldPassword,
        newPassword
      });
      console.log(response);
      
      setSuccess('Password updated successfully!');
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="w-full p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Change Your Password
        </h2>
        
        {error && (
          <div className="p-3 text-sm text-center text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm text-center text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-lg">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Old Password Input */}
          <div className="relative">
            <label 
              htmlFor="oldPassword" 
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Old Password
            </label>
            <input
              id="oldPassword"
              name="oldPassword"
              type={isOldPasswordVisible ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={oldPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {isOldPasswordVisible ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          
          {/* New Password Input */}
          <div> 
            <label 
              htmlFor="newPassword" 
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Minimum 8 characters"
            />
          </div>

          {/* Confirm New Password Input */}
          <div className="relative"> 
            <label 
              htmlFor="confirmPassword" 
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Repeat your new password"
            />
            <button
              type="button"
              onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {isConfirmPasswordVisible ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Renamed default export
export default FacultyChangePassword;