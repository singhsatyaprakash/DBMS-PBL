// FILE: src/pages/Admin/AddSubjectToSem.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";

// Reusing styles from other components for a consistent look
import {
  Content,
  Header,       // EDITED: Imported Header
  Form,         // EDITED: Imported Form
  FormSection,
  FormRow,
  Select,       // EDITED: Imported Select
  Button,       // EDITED: Imported Button
} from '../../styles/GlobalStyles';

const Wrapper = styled.div`
  display: flex;
`;

const AddSubjectToSem = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  // Fetch existing courses and subjects to populate the dropdowns
  useEffect(() => {
    // In a real app, you would fetch this from your API
    const dummyCourses = [
      { id: 1, name: 'Bachelor of Technology', totalSemesters: 8 },
      { id: 2, name: 'Master of Computer Applications', totalSemesters: 4 },
      { id: 3, name: 'Bachelor of Business Administration', totalSemesters: 6 },
    ];
    const dummySubjects = [
        {id: 101, name: 'Introduction to Programming'},
        {id: 102, name: 'Calculus II'},
        {id: 103, name: 'Modern Physics'},
    ];
    setCourses(dummyCourses);
    setSubjects(dummySubjects);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedCourse || !selectedSubject || !selectedSemester) {
        alert("Please select all fields.");
        return;
    }
    // --- FRONTEND ONLY ---
    const courseName = courses.find(c => c.id === parseInt(selectedCourse))?.name;
    const subjectName = subjects.find(s => s.id === parseInt(selectedSubject))?.name;

    console.log('Assigning Subject to Semester:', {
      courseId: selectedCourse,
      subjectId: selectedSubject,
      semester: selectedSemester,
    });
    alert(`Assigned "${subjectName}" to Semester ${selectedSemester} of "${courseName}" successfully!`);
  };
  
  const totalSemestersForSelectedCourse = courses.find(c => c.id === parseInt(selectedCourse))?.totalSemesters || 0;

  return (
    <Wrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="admin" />
      <Content $isOpen={isOpen}>
        <Header>Add Subject to Semester</Header> {/* EDITED: Used Header */}
        <Form onSubmit={handleSubmit}> {/* EDITED: Used Form */}
          <FormSection>
            <FormRow>
              <div>
                <label>Choose Course *</label>
                <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
                  <option value="">Select a Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </Select>
              </div>
            </FormRow>
            <FormRow>
              <div>
                <label>Choose Subject *</label>
                <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
                  <option value="">Select a Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </Select>
              </div>
            </FormRow>
            <FormRow>
              <div>
                <label>Assign to Semester *</label>
                <Select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} required disabled={!selectedCourse}>
                  <option value="">Select a Semester</option>
                  {[...Array(totalSemestersForSelectedCourse).keys()].map(i => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </Select>
              </div>
            </FormRow>
          </FormSection>
          <Button type="submit">Add Subject to Course</Button> {/* EDITED: Used Button */}
        </Form>
      </Content>
    </Wrapper>
  );
};

export default AddSubjectToSem;
