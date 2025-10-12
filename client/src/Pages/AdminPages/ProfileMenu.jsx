import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const changepassword = async () => {
    navigate('/admin/changepassword');
  };

  const logoutAdmin = async () => {
    const token = localStorage.getItem("token");
    let response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/admin/logout`,
      { token }
    );
    // console.log(response);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate('/admin/login');
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center space-x-2 cursor-pointer">
        <FaUserCircle size={30} />
        <span className="font-medium">Satya Prakash Singh</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg text-gray-700 z-10"
          >
            <button
              onClick={changepassword}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Change Password
            </button>
            <button
              onClick={logoutAdmin}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
