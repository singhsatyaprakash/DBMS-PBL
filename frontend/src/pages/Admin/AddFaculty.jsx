// FILE: src/pages/Admin/AddFaculty.jsx

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
  ButtonGroup,
  ActionButton,
  TextArea,
} from '../../styles/GlobalStyles';


const Wrapper = styled.div`
  display: flex;
`;

const AddFaculty = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default
  const [activeTab, setActiveTab] = useState('addFaculty');

  // State for Add Faculty form
  const [departments, setDepartments] = useState([]);
  const [facultyData, setFacultyData] = useState({
    facultyId: '', name: '', department: '', email: '',
    dob: '', contactNo: '', address: '', gender: '',
  });

  // State for Add Department form
  const [departmentData, setDepartmentData] = useState({
    departmentId: '', departmentName: '', deptCode: '',
    hodName: '', hodEmail: '', phone: '', officeLocation: '', description: ''
  });

  useEffect(() => {
    const dummyDepartments = [
      { id: 1, name: 'Computer Science' },
      { id: 2, name: 'Mechanical Engineering' },
    ];
    setDepartments(dummyDepartments);
  }, []);

  const handleFacultyInputChange = (e) => {
    const { name, value } = e.target;
    setFacultyData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDepartmentInputChange = (e) => {
    const { name, value } = e.target;
    setDepartmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleFacultySubmit = (e) => {
    e.preventDefault();
    console.log('New Faculty Data:', facultyData);
    alert('Faculty added successfully!');
    setFacultyData({ facultyId: '', name: '', department: '', email: '', dob: '', contactNo: '', address: '', gender: '' });
  };

  const handleDepartmentSubmit = (e) => {
    e.preventDefault();
    console.log('New Department Data:', departmentData);
    alert('Department added successfully!');
    setDepartmentData({ departmentId: '', departmentName: '', deptCode: '', hodName: '', hodEmail: '', phone: '', officeLocation: '', description: '' });
  };

  return (
    <Wrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="admin" />
      <Content $isOpen={isOpen}>
        <Header>Faculty & Department Management</Header> {/* EDITED: Used Header */}

        <ButtonGroup>
          <ActionButton active={activeTab === 'addFaculty'} onClick={() => setActiveTab('addFaculty')}>
            Add Faculty
          </ActionButton>
          <ActionButton active={activeTab === 'addDepartment'} onClick={() => setActiveTab('addDepartment')}>
            Add Department
          </ActionButton>
        </ButtonGroup>

        {activeTab === 'addFaculty' && (
          <Form onSubmit={handleFacultySubmit}> {/* EDITED: Used Form */}
            <FormSection>
              <h3>Add New Faculty Member</h3>
              <FormRow>
                <div><label>Faculty Name *</label><Input type="text" name="name" value={facultyData.name} onChange={handleFacultyInputChange} required /></div>
                <div><label>Faculty ID *</label><Input type="text" name="facultyId" value={facultyData.facultyId} onChange={handleFacultyInputChange} required /></div>
              </FormRow>
              <FormRow>
                <div><label>Department *</label><Select name="department" value={facultyData.department} onChange={handleFacultyInputChange} required><option value="">Select Department</option>{departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</Select></div>
                <div><label>Email *</label><Input type="email" name="email" value={facultyData.email} onChange={handleFacultyInputChange} required /></div>
              </FormRow>
              <FormRow>
                <div><label>Date of Birth *</label><Input type="date" name="dob" value={facultyData.dob} onChange={handleFacultyInputChange} required /></div>
                <div><label>Contact Number *</label><Input type="tel" name="contactNo" value={facultyData.contactNo} onChange={handleFacultyInputChange} required /></div>
              </FormRow>
              <FormRow>
                <div><label>Address</label><TextArea name="address" value={facultyData.address} onChange={handleFacultyInputChange} /></div>
                <div><label>Gender *</label><Select name="gender" value={facultyData.gender} onChange={handleFacultyInputChange} required><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></Select></div>
              </FormRow>
            </FormSection>
            <Button type="submit">Add Faculty</Button> {/* EDITED: Used Button */}
          </Form>
        )}

        {activeTab === 'addDepartment' && (
           <Form onSubmit={handleDepartmentSubmit}> {/* EDITED: Used Form */}
            <FormSection>
              <h3>Add New Department</h3>
              <FormRow>
                <div><label>Department Name *</label><Input type="text" name="departmentName" value={departmentData.departmentName} onChange={handleDepartmentInputChange} required /></div>
                <div><label>Department ID *</label><Input type="text" name="departmentId" value={departmentData.departmentId} onChange={handleDepartmentInputChange} required /></div>
              </FormRow>
              <FormRow>
                  <div><label>Department Code *</label><Input type="text" name="deptCode" value={departmentData.deptCode} onChange={handleDepartmentInputChange} required /></div>
                  <div><label>HOD Name</label><Input type="text" name="hodName" value={departmentData.hodName} onChange={handleDepartmentInputChange} /></div>
              </FormRow>
              <FormRow>
                  <div><label>HOD Email</label><Input type="email" name="hodEmail" value={departmentData.hodEmail} onChange={handleDepartmentInputChange} /></div>
                  <div><label>Phone</label><Input type="tel" name="phone" value={departmentData.phone} onChange={handleDepartmentInputChange} /></div>
              </FormRow>
              <FormRow>
                <div><label>Office Location</label><Input type="text" name="officeLocation" value={departmentData.officeLocation} onChange={handleDepartmentInputChange} /></div>
              </FormRow>
              <FormRow>
                <div><label>Description</label><TextArea name="description" value={departmentData.description} onChange={handleDepartmentInputChange} /></div>
              </FormRow>
            </FormSection>
            <Button type="submit">Add Department</Button> {/* EDITED: Used Button */}
          </Form>
        )}
      </Content>
    </Wrapper>
  );
};

export default AddFaculty;
