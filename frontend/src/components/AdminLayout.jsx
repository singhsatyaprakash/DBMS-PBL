import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { Content } from '../styles/GlobalStyles';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar 
        userType="admin" 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      <Content $isOpen={isSidebarOpen}>
        <Outlet />
      </Content>
    </div>
  );
};

export default AdminLayout;
