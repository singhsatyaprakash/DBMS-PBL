// FILE: src/pages/Teachers/MarkAttendance.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";

import {
  Content,
  Header,       // EDITED: Imported correct components
  List,
  ListItem,
  Select,
  Input,
  Button,
  SuccessMessage,
  ErrorMessage,
} from '../../styles/GlobalStyles';

const AttendanceWrapper = styled.div`
  display: flex;
`;

const ControlsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

// EDITED: Defined missing styled-components locally
const StudentInfo = styled.div`
  flex-grow: 1;
  small {
    color: #6c757d;
  }
`;

const AttendanceControls = styled.div`
  display: flex;
  align-items: center;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const MarkAttendance = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [feedback, setFeedback] = useState({ message: '', type: '' }); // For on-screen messages

  // Dummy data for teacher's subjects and students in those subjects
  const dummyData = {
    'TCS509': [
      { id: '21BCA001', name: 'Mayank Sharma', rollNo: '21BCA001' },
      { id: '21BCA002', name: 'Amit Singh', rollNo: '21BCA002' },
    ],
    'TCS593': [
      { id: '20BME015', name: 'Riya Verma', rollNo: '20BME015' },
      { id: '20BME016', name: 'Karan Gupta', rollNo: '20BME016' },
    ]
  };

  useEffect(() => {
    // In a real app, you would fetch the teacher's assigned subjects
    const teacherSubjects = [
      { id: 'TCS509', name: 'Machine Learning' },
      { id: 'TCS593', name: 'Deep Learning Fundamentals' },
    ];
    setSubjects(teacherSubjects);
    if (teacherSubjects.length > 0) {
      setSelectedSubject(teacherSubjects[0].id);
    }
  }, []);

  useEffect(() => {
    // Update student list when a subject is selected
    if (selectedSubject) {
      const studentList = dummyData[selectedSubject] || [];
      setStudents(studentList);
      // Initialize attendance data for the new list of students
      const initialData = {};
      studentList.forEach(student => {
        initialData[student.id] = { present: true }; // Default to 'Present'
      });
      setAttendanceData(initialData);
    }
  }, [selectedSubject]);

  // Effect to clear feedback message after 3 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { present: isPresent }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submission = {
      facultySubjectId: selectedSubject,
      date: date,
      attendance: students.map(student => ({
        studentId: student.id,
        status: attendanceData[student.id]?.present ? 'Present' : 'Absent'
      }))
    };
    console.log('Submitting Attendance:', submission);
    setFeedback({ message: 'Attendance submitted successfully!', type: 'success' });
  };

  return (
    <AttendanceWrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="teacher" />
      <Content $isOpen={isOpen}>
        <Header>Mark Attendance</Header>
        
        {feedback.message && (
          feedback.type === 'success' 
            ? <SuccessMessage>{feedback.message}</SuccessMessage>
            : <ErrorMessage>{feedback.message}</ErrorMessage>
        )}

        <ControlsWrapper>
          <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name} ({subject.id})</option>
            ))}
          </Select>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </ControlsWrapper>

        <Form onSubmit={handleSubmit}>
          <List>
            {students.map(student => (
              <ListItem key={student.id}>
                <StudentInfo>
                  <div>{student.name}</div>
                  <small>ID: {student.rollNo}</small>
                </StudentInfo>
                <AttendanceControls>
                  <RadioGroup>
                    <CheckboxLabel>
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={attendanceData[student.id]?.present === true}
                        onChange={() => handleAttendanceChange(student.id, true)}
                      />
                      Present
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={attendanceData[student.id]?.present === false}
                        onChange={() => handleAttendanceChange(student.id, false)}
                      />
                      Absent
                    </CheckboxLabel>
                  </RadioGroup>
                </AttendanceControls>
              </ListItem>
            ))}
          </List>
          {students.length > 0 && (
            <Button type="submit" style={{marginTop: '1rem'}}>Submit Attendance</Button>
          )}
        </Form>
      </Content>
    </AttendanceWrapper>
  );
};

export default MarkAttendance;
