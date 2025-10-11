// FILE: src/pages/Admin/AddSubjects.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";

// Reusing styles from other components for a consistent look
import {
  Content,
  Header, // EDITED: Imported Header instead of StudentsHeader
  Form,   // EDITED: Imported the main Form component
  FormSection,
  FormRow,
  Input,  // EDITED: Imported the generic Input component
  Select, // EDITED: Imported the generic Select component
  Button, // EDITED: Imported the generic Button component
  TextArea,
} from '../../styles/GlobalStyles';

const SubjectWrapper = styled.div`
  display: flex;
`;

const AddSubjects = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default
  const [courses, setCourses] = useState([]);
  const [subjectData, setSubjectData] = useState({
    subjectId: '',
    subjectName: '',
    subjectCode: '',
    course: '',
    credits: '',
    description: '',
  });

  // Fetch existing courses to populate the dropdown
  useEffect(() => {
    // In a real app, you would fetch this from your API
    const dummyCourses = [
      { id: 1, name: 'Bachelor of Technology' },
      { id: 2, name: 'Master of Computer Applications' },
      { id: 3, name: 'Bachelor of Business Administration' },
    ];
    setCourses(dummyCourses);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // --- FRONTEND ONLY ---
    console.log('New Subject Data:', subjectData);
    alert('Subject added successfully! (Check the console for the data)');
    // Reset form after submission
    setSubjectData({
      subjectId: '',
      subjectName: '',
      subjectCode: '',
      course: '',
      credits: '',
      description: '',
    });
  };

  return (
    <SubjectWrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="admin" />
      <Content $isOpen={isOpen}>
        <Header>Add New Subject</Header> {/* EDITED: Used Header component */}
        <Form onSubmit={handleSubmit}>      {/* EDITED: Used Form component */}
          <FormSection>
            <FormRow>
              <div>
                <label>Subject Name *</label>
                <Input type="text" name="subjectName" value={subjectData.subjectName} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Subject ID *</label>
                <Input type="text" name="subjectId" value={subjectData.subjectId} onChange={handleInputChange} required />
              </div>
            </FormRow>
            <FormRow>
              <div>
                <label>Subject Code *</label>
                <Input type="text" name="subjectCode" value={subjectData.subjectCode} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Credits *</label>
                <Input type="number" name="credits" value={subjectData.credits} onChange={handleInputChange} required />
              </div>
            </FormRow>
            <FormRow>
              <div>
                <label>Course *</label>
                <Select name="course" value={subjectData.course} onChange={handleInputChange} required>
                  <option value="">Select a Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </Select>
              </div>
            </FormRow>
              <FormRow>
              <div>
                <label>Description</label>
                <TextArea name="description" value={subjectData.description} onChange={handleInputChange} />
              </div>
            </FormRow>
          </FormSection>
          <Button type="submit">Add Subject</Button> {/* EDITED: Used Button component */}
        </Form>
      </Content>
    </SubjectWrapper>
  );
};

export default AddSubjects;
