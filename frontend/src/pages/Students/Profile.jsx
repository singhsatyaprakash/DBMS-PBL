// FILE: src/pages/Students/Profile.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";

// Reusing styles from GlobalStyles for a consistent look
import {
  Content,
  ProfileHeader,      // EDITED: Imported necessary components
  ProfileInfo,
  ProfileDetail,
  Label,
  Value,
  ProfileImageContainer,
  ProfileImage,
} from '../../styles/GlobalStyles';

const ProfileWrapper = styled.div`
  display: flex;
`;

// EDITED: Added a wrapper to control the width of the profile content
const ProfileContentWrapper = styled.div`
  width: 100%;
  max-width: 900px; /* Adjust this value to make the container smaller or larger */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StudentProfile = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default
  const [studentProfile, setStudentProfile] = useState(null);

  // Fetch student profile data when the component mounts
  useEffect(() => {
    // In a real app, you would fetch this from your API
    // const userEmail = localStorage.getItem('userEmail');
    // axios.get(`/api/students/profile/${userEmail}`).then(res => setStudentProfile(res.data));
    
    // Using dummy data for now
    const dummyProfile = {
      name: 'Mayank Sharma',
      email: 'mayank.sharma@example.com',
      rollNo: '21BCA001',
      course: 'Bachelor of Computer Applications',
      department: 'Computer Science',
      semester: '6',
      year: '3',
      dob: '2003-05-15',
      contactNo: '+91 98765 43210',
      profileImageUrl: 'https://placehold.co/150x150/EFEFEFF/333333?text=MS' // Placeholder image
    };
    setStudentProfile(dummyProfile);
  }, []);

  return (
    <ProfileWrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="student" />
      <Content $isOpen={isOpen}>
        {studentProfile ? (
          <ProfileContentWrapper> {/* EDITED: Wrapped content */}
            <ProfileHeader>My Profile</ProfileHeader>
            <ProfileImageContainer>
              <ProfileImage
                src={studentProfile.profileImageUrl}
                alt="Student Profile"
              />
            </ProfileImageContainer>
            <ProfileInfo>
              <ProfileDetail><Label>Name:</Label><Value>{studentProfile.name}</Value></ProfileDetail>
              <ProfileDetail><Label>Email:</Label><Value>{studentProfile.email}</Value></ProfileDetail>
              <ProfileDetail><Label>Roll Number:</Label><Value>{studentProfile.rollNo}</Value></ProfileDetail>
              <ProfileDetail><Label>Course:</Label><Value>{studentProfile.course}</Value></ProfileDetail>
              <ProfileDetail><Label>Department:</Label><Value>{studentProfile.department}</Value></ProfileDetail>
              <ProfileDetail><Label>Current Semester:</Label><Value>{studentProfile.semester}</Value></ProfileDetail>
              <ProfileDetail><Label>Year:</Label><Value>{studentProfile.year}</Value></ProfileDetail>
              <ProfileDetail><Label>Date of Birth:</Label><Value>{studentProfile.dob}</Value></ProfileDetail>
              <ProfileDetail><Label>Contact No:</Label><Value>{studentProfile.contactNo}</Value></ProfileDetail>
            </ProfileInfo>
          </ProfileContentWrapper>
        ) : (
          <p>Loading profile...</p>
        )}
      </Content>
    </ProfileWrapper>
  );
};

export default StudentProfile;
