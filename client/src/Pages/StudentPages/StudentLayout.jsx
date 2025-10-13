// src/Pages/StudentPages/StudentLayout.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import StudentNavbar from './StudentNavbar';

const StudentLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen">
      <StudentSidebar isOpen={isSidebarOpen} />
      <motion.div
        animate={{
          marginLeft: isSidebarOpen ? '256px' : '0px',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col h-screen"
      >
        <StudentNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default StudentLayout;