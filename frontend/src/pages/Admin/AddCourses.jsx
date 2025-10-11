// FILE: src/pages/Admin/AddCourses.jsx

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
// ✅ Updated to use the consolidated GlobalStyles file
import {
  PageWrapper,
  Content,
  Header,
  Form,
  FormSection,
  FormRow,
  Input,
  Button,
  TextArea, // Import TextArea from global styles
} from '../../styles/GlobalStyles';

const AddCourses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [courseData, setCourseData] = useState({
    courseName: '',
    courseId: '',
    duration: '',
    totalSemesters: '',
    department: '',
    courseCode: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Course Data:', courseData);
    alert('Course added successfully! (Check the console for the data)');
    setCourseData({
      courseName: '', courseId: '', duration: '',
      totalSemesters: '', department: '', courseCode: '', description: '',
    });
  };

  return (
    // ✅ Using PageWrapper from GlobalStyles
    <PageWrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="admin" />
      <Content $isOpen={isOpen}>
        {/* ✅ Using Header from GlobalStyles */}
        <Header>Add New Course</Header>
        {/* ✅ Using Form from GlobalStyles */}
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <FormRow>
              <div>
                <label>Course Name *</label>
                {/* ✅ Using Input from GlobalStyles */}
                <Input type="text" name="courseName" value={courseData.courseName} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Course ID *</label>
                <Input type="text" name="courseId" value={courseData.courseId} onChange={handleInputChange} required />
              </div>
            </FormRow>
            <FormRow>
              <div>
                <label>Duration (Years) *</label>
                <Input type="number" name="duration" value={courseData.duration} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Total Semesters *</label>
                <Input type="number" name="totalSemesters" value={courseData.totalSemesters} onChange={handleInputChange} required />
              </div>
            </FormRow>
            <FormRow>
              <div>
                <label>Department *</label>
                <Input type="text" name="department" value={courseData.department} onChange={handleInputChange} required />
              </div>
              <div>
                <label>Course Code *</label>
                <Input type="text" name="courseCode" value={courseData.courseCode} onChange={handleInputChange} required />
              </div>
            </FormRow>
             <FormRow>
              <div>
                <label>Description</label>
                {/* ✅ Using TextArea from GlobalStyles */}
                <TextArea name="description" value={courseData.description} onChange={handleInputChange} />
              </div>
            </FormRow>
          </FormSection>
          {/* ✅ Using Button from GlobalStyles */}
          <Button type="submit">Add Course</Button>
        </Form>
      </Content>
    </PageWrapper>
  );
};

export default AddCourses;
