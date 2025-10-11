// FILE: src/pages/Students/Attendance.jsx

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";

// Reusing styles from other components for a consistent look
import {
  Content,
  Header, // EDITED: Imported the correct Header component
} from '../../styles/GlobalStyles';

const AttendanceWrapper = styled.div`
  display: flex;
`;

const SummaryBar = styled.div`
  background-color: #eef5ff;
  border: 1px solid #b8d6fb;
  color: #3e5a7e;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 2rem;
  font-weight: 500;

  span {
    font-weight: bold;
    color: #28a745;
  }
`;

const TableContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eaecef;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background-color: #f1f3f5;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  gap: 1rem;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  ${({ primary }) => primary && `
    background-color: #007bff;
    color: white;
    &:hover {
      background-color: #0056b3;
    }
  `}

  ${({ danger }) => danger && `
    background-color: #dc3545;
    color: white;
    &:hover {
      background-color: #c82333;
    }
  `}
`;


const StudentAttendance = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default

  // Dummy data based on the screenshot
  const attendanceData = [
    { id: 1, subject: 'Machine Learning(S)', code: 'TCS509', faculty: 'Dr. Vikrant Sharma', lectures: 12 },
    { id: 2, subject: 'Deep Learning Fundamentale(S)', code: 'TCS593', faculty: 'DR. SUSHEELA DAHIYA', lectures: 6 },
    { id: 3, subject: 'Computer Networks - 1 Lab(L)', code: 'PCS514', faculty: 'Neha Pokhriyal', lectures: 3 },
    { id: 4, subject: 'Operating Systems Lab(L)', code: 'PCS502', faculty: 'DR. SUSHEELA DAHIYA', lectures: 5 },
    { id: 5, subject: 'Database Management Systems(S)', code: 'TCS503', faculty: 'CHANDRADEEP BHATT', lectures: 11 },
    { id: 6, subject: 'DBMS Lab(L)', code: 'PCS503', faculty: 'CHANDRADEEP BHATT', lectures: 15 },
    { id: 7, subject: 'Operating Systems(S)', code: 'TCS502', faculty: 'DR. SUSHEELA DAHIYA', lectures: 9 },
    { id: 8, subject: 'Career Skills(S)', code: 'XCS501', faculty: 'OKESH CHHABRA, P.A. ANAND', lectures: 4 },
    { id: 9, subject: 'Computer Networks-1(S)', code: 'TCS514', faculty: 'Neha Pokhriyal', lectures: 11 },
    { id: 10, subject: 'Practical for Employability Skill Enhancement(L)', code: 'PESE500', faculty: 'Animesh Sharma', lectures: 4 },
    { id: 11, subject: 'Career Excellence Course(S)', code: 'CEC', faculty: 'Ashish Arya', lectures: 2 },
  ];

  return (
    <AttendanceWrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="student" />
      <Content $isOpen={isOpen}>
        <Header>Subjects</Header> {/* EDITED: Used the correct Header component */}
        <SummaryBar>
          Your Attendance % From 15/07/2025 To 18/08/2025 is <span>97.56</span>
        </SummaryBar>
        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Subject</th>
                <th>Subject Code</th>
                <th>Faculty</th>
                <th>Total Lecture</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map(row => (
                <tr key={row.id}>
                  <td><input type="checkbox" /></td>
                  <td>{row.subject}</td>
                  <td>{row.code}</td>
                  <td>{row.faculty}</td>
                  <td>{row.lectures}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
        <Footer>
          <StyledButton primary>Attendance Detail</StyledButton>
          <StyledButton danger>Unit Detail</StyledButton>
        </Footer>
      </Content>
    </AttendanceWrapper>
  );
};

export default StudentAttendance;
