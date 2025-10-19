import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { FaBars, FaTimes, FaKey, FaSignOutAlt } from 'react-icons/fa';
import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';

const StudentNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); 
  const {student}=useContext(StudentContext);
  function getInitials(name) {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    if (words.length === 0 || words[0] === "") {
      return "";
    }
    if (words.length >= 2) {
      const firstLetter = words[0][0] || "";
      const secondLetter = words[1][0] || "";
      return (firstLetter + secondLetter).toUpperCase();
    } else {
      return words[0].substring(0, 2).toUpperCase();
    }
  }

  const handleChangePassword = () => {
    navigate('/student/changepassword');
    setIsMenuOpen(false);
  };

  const handleLogout = async() => {
    try{
      const token=localStorage.getItem('token');
      let response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/student/logout`,{token});
      if(response.status===200){
        navigate('/')
      }
      else{
        alert("Retry! Logout failed!");
      }
    }
    catch(err){
      console.error(err?.message);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between z-30 relative">
      {toggleSidebar && (
        <button onClick={toggleSidebar} className="text-slate-600 hover:text-blue-600">
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      {!toggleSidebar && <div />}

      <div
        className="relative"
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <div className="flex items-center gap-4 cursor-pointer">
          <span className="font-semibold text-slate-700 hidden sm:block">
            {student?.name}
          </span>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold ring-2 ring-offset-2 ring-blue-300">
            {getInitials(student?.name)}
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50"
            >
              <ul>
                <li>
                  <button
                    // 5. Use the new handler
                    onClick={handleChangePassword}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <FaKey className="text-slate-500" />
                    Change Password
                  </button>
                </li>
                <li>
                  <button
                    // 6. Use the new handler
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt className="text-red-500" />
                    Logout
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default StudentNavbar;