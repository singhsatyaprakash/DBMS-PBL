// FILE: src/pages/Teachers/StudentsById.jsx

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";

import {
  Content,
  Header,       // EDITED: Imported correct components
  Form,
  FormRow,
  Input,
  Button,
  ErrorMessage,
  ProfileHeader,
  ProfileInfo,
  ProfileDetail,
  Label,
  Value,
  ProfileImageContainer,
  ProfileImage,
} from '../../styles/GlobalStyles';

const SearchWrapper = styled.div`
  display: flex;
`;

const StudentProfileCard = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
  width: 100%;
  max-width: 800px;
`;

const StudentsById = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default
  const [studentId, setStudentId] = useState('');
  const [foundStudent, setFoundStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Dummy database of students
  const dummyStudentDatabase = {
    '21BCA001': {
      name: 'Mayank Sharma',
      email: 'mayank.sharma@example.com',
      rollNo: '21BCA001',
      course: 'Bachelor of Computer Applications',
      department: 'Computer Science',
      semester: '6',
      year: '3',
      dob: '2003-05-15',
      contactNo: '+91 98765 43210',
      profileImageUrl: 'https://placehold.co/150x150/EFEFEFF/333333?text=MS'
    },
    '20BME015': {
      name: 'Riya Verma',
      email: 'riya.verma@example.com',
      rollNo: '20BME015',
      course: 'Bachelor of Mechanical Engineering',
      department: 'Mechanical',
      semester: '8',
      year: '4',
      dob: '2002-11-22',
      contactNo: '+91 98765 11223',
      profileImageUrl: 'https://placehold.co/150x150/EFEFEFF/333333?text=RV'
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFoundStudent(null);

    // Simulate API call
    setTimeout(() => {
      const student = dummyStudentDatabase[studentId];
      if (student) {
        setFoundStudent(student);
      } else {
        setError('No student found with that ID. Please check and try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <SearchWrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="teacher" />
      <Content $isOpen={isOpen}>
        <Header>Search Student by ID</Header> {/* EDITED: Used Header */}
        <Form onSubmit={handleSearch}> {/* EDITED: Used Form */}
          <FormRow>
            <Input
              type="text"
              placeholder="Enter Student University ID or Roll No."
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </FormRow>
        </Form>

        {error && <ErrorMessage>{error}</ErrorMessage>} {/* EDITED: Used ErrorMessage */}

        {foundStudent && (
          <StudentProfileCard>
            <ProfileImageContainer>
              <ProfileImage src={foundStudent.profileImageUrl} alt="Student Profile" />
            </ProfileImageContainer>
            <ProfileInfo>
              <ProfileDetail><Label>Name:</Label><Value>{foundStudent.name}</Value></ProfileDetail>
              <ProfileDetail><Label>Email:</Label><Value>{foundStudent.email}</Value></ProfileDetail>
              <ProfileDetail><Label>Roll Number:</Label><Value>{foundStudent.rollNo}</Value></ProfileDetail>
              <ProfileDetail><Label>Course:</Label><Value>{foundStudent.course}</Value></ProfileDetail>
              <ProfileDetail><Label>Department:</Label><Value>{foundStudent.department}</Value></ProfileDetail>
              <ProfileDetail><Label>Current Semester:</Label><Value>{foundStudent.semester}</Value></ProfileDetail>
              <ProfileDetail><Label>Contact No:</Label><Value>{foundStudent.contactNo}</Value></ProfileDetail>
            </ProfileInfo>
          </StudentProfileCard>
        )}
      </Content>
    </SearchWrapper>
  );
};

export default StudentsById;
