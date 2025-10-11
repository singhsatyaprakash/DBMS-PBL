// FILE: src/pages/Admin/CreateSectionsInCourse.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";

// Reusing styles from other components for a consistent look
import {
  Content,
  Header,       // EDITED: Imported correct components
  Form,
  FormSection,
  FormRow,
  Input,
  Select,
  Button,
} from '../../styles/GlobalStyles';

const Wrapper = styled.div`
  display: flex;
`;

const CreateSectionsInCourse = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default
  
  // State for form inputs
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [semester, setSemester] = useState('');

  // Dummy data for courses and their branches
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch courses from your API
    const dummyCourses = [
      { id: 1, name: 'Bachelor of Technology', branches: ['Computer Science', 'Mechanical', 'Electronics'] },
      { id: 2, name: 'Master of Computer Applications', branches: [] }, // Course with no branches
      { id: 3, name: 'Bachelor of Business Administration', branches: ['Finance', 'Marketing', 'HR'] },
    ];
    setCourses(dummyCourses);
  }, []);

  // Update branches when a course is selected
  useEffect(() => {
    const course = courses.find(c => c.id === parseInt(selectedCourse));
    setBranches(course?.branches || []);
    setSelectedBranch(''); // Reset branch selection when course changes
  }, [selectedCourse, courses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCourse || !sectionName || !semester) {
        alert("Please fill all required fields.");
        return;
    }
    // --- FRONTEND ONLY ---
    const submissionData = {
      sectionName,
      courseId: selectedCourse,
      semester,
      branch: selectedBranch || 'N/A', // Set to N/A if no branch is selected
    };
    console.log('Creating Section with Data:', submissionData);
    alert(`Section "${sectionName}" created successfully! (Check the console for data)`);
    // Reset form
    setSelectedCourse('');
    setSelectedBranch('');
    setSectionName('');
    setSemester('');
  };

  return (
    <Wrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="admin" />
      <Content $isOpen={isOpen}>
        <Header>Create Sections in Course</Header> {/* EDITED: Used Header */}
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
              <div>
                <label>Branch</label>
                <Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} disabled={branches.length === 0}>
                  <option value="">{branches.length === 0 ? 'No branches for this course' : 'Select a Branch'}</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </Select>
              </div>
            </FormRow>
            <FormRow>
              <div>
                <label>Section Name *</label>
                <Input type="text" placeholder="e.g., A, B, CS-1" value={sectionName} onChange={(e) => setSectionName(e.target.value)} required />
              </div>
              <div>
                <label>Semester *</label>
                <Input type="number" placeholder="e.g., 5" value={semester} onChange={(e) => setSemester(e.target.value)} required />
              </div>
            </FormRow>
          </FormSection>
          <Button type="submit">Create Section</Button> {/* EDITED: Used Button */}
        </Form>
      </Content>
    </Wrapper>
  );
};

export default CreateSectionsInCourse;
