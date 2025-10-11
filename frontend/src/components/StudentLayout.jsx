import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Content } from '../styles/GlobalStyles';

const StudentLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar 
        userType="student" 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      <Content $isOpen={isSidebarOpen}>
        <Outlet />
      </Content>
    </div>
  );
};

export default StudentLayout;