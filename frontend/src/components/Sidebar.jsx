// FILE: src/components/Sidebar.jsx

import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  BsGrid1X2, BsPeople, BsPerson, BsMegaphone, BsBook,
  BsPersonVcard, BsCalendarCheck, BsFileEarmarkText,
  BsWallet2, BsBuilding, BsJournalCheck, BsTable, BsKey
} from "react-icons/bs";
import bg1 from "../assets/bg1.png";

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

export const SidebarContainer = styled.div`
  position: relative;
  width: ${({ $isOpen }) => ($isOpen ? "250px" : "80px")};
  height: 100vh;
  background-color: rgb(34, 36, 141);
  color: white;
  overflow-y: auto;
  padding-top: 20px;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SidebarHeader = styled.div`
  padding: 10px 20px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  margin-bottom: 20px;
`;

export const UserRoleText = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-top: 5px;
  text-align: center;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

export const SidebarNav = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

export const SidebarNavItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? "flex-start" : "center")};
  padding: 15px 25px;
  font-size: 18px;
  border-top: 1px solid #34495e;
  transition: background-color 0.3s ease;
  cursor: pointer;

  &:last-child {
    border-bottom: 1px solid #34495e;
  }
  &:hover {
    background-color: #34495e;
  }
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin-left: ${({ $isOpen }) => ($isOpen ? "15px" : "0")};
  white-space: nowrap;
  overflow: hidden;
  display: ${({ $isOpen }) => ($isOpen ? "inline" : "none")};
`;

export const SidebarIcon = styled.div`
  flex-shrink: 0;
  font-size: 20px;
`;

export const Logo = styled.img`
  width: 150px;
  height: auto;
  border-radius: 0;
  border: none;
  transition: width 0.3s ease, height 0.3s ease;
  background-color: transparent;
  object-fit: contain;
`;

const Sidebar = ({ userType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  const getNavigationLinks = (type) => {
    switch (type) {
      case "admin":
        return (
          <>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsBook /></SidebarIcon><StyledLink to="/admin/add-courses" $isOpen={isOpen}>Add Courses</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsJournalCheck /></SidebarIcon><StyledLink to="/admin/add-subjects" $isOpen={isOpen}>Add Subjects</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsFileEarmarkText /></SidebarIcon><StyledLink to="/admin/add-subject-to-sem" $isOpen={isOpen}>Add Subject to Sem</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsBuilding /></SidebarIcon><StyledLink to="/admin/create-sections" $isOpen={isOpen}>Create Sections</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsPeople /></SidebarIcon><StyledLink to="/admin/add-students-to-section" $isOpen={isOpen}>Add Students to Section</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsPersonVcard /></SidebarIcon><StyledLink to="/admin/add-faculty" $isOpen={isOpen}>Add Faculty</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsPersonVcard /></SidebarIcon><StyledLink to="/admin/announcement" $isOpen={isOpen}>Announcement</StyledLink></SidebarNavItem>
          </>
        );
      case "teacher":
        return (
          <>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsBook /></SidebarIcon><StyledLink to="/teacher/assigned-subjects" $isOpen={isOpen}>Assigned Subjects</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsBuilding /></SidebarIcon><StyledLink to="/teacher/assigned-sections" $isOpen={isOpen}>Assigned Sections</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsPeople /></SidebarIcon><StyledLink to="/teacher/search-student" $isOpen={isOpen}>Search Student</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsCalendarCheck /></SidebarIcon><StyledLink to="/teacher/mark-attendance" $isOpen={isOpen}>Mark Attendance</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsMegaphone /></SidebarIcon><StyledLink to="/teacher/announcement" $isOpen={isOpen}>Announcement</StyledLink></SidebarNavItem>
          </>
        );
      case "student":
        return (
          <>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsPersonVcard /></SidebarIcon><StyledLink to="/student/profile" $isOpen={isOpen}>Profile</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsBook /></SidebarIcon><StyledLink to="/student/subjects" $isOpen={isOpen}>Current Subjects</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsMegaphone /></SidebarIcon><StyledLink to="/student/announcements" $isOpen={isOpen}>Announcements</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsCalendarCheck /></SidebarIcon><StyledLink to="/student/attendance" $isOpen={isOpen}>Attendance</StyledLink></SidebarNavItem>
            <SidebarNavItem $isOpen={isOpen}><SidebarIcon><BsKey /></SidebarIcon><StyledLink to="/student/reset-password" $isOpen={isOpen}>Reset Password</StyledLink></SidebarNavItem>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarWrapper onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <SidebarContainer $isOpen={isOpen}>
        <SidebarHeader>
          <Logo src={bg1} alt="Logo" $isOpen={isOpen} />
          <UserRoleText $isOpen={isOpen}>
            {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : ''}
          </UserRoleText>
        </SidebarHeader>
        <SidebarNav>
          {getNavigationLinks(userType)}
        </SidebarNav>
      </SidebarContainer>
    </SidebarWrapper>
  );
};

export default Sidebar;
