// FILE: src/pages/Admin/AddStudentsToSection.jsx

import React, {useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";


// Reusing styles from other components for a consistent look
import {
  Content,
  Header,       // EDITED: Imported correct components
  Form,
  FormSection,
  FormRow,
  Select,
  Button,
  List,         // EDITED: Imported List for the student list
} from '../../styles/GlobalStyles';

const Wrapper = styled.div`
  display: flex;
`;

const StudentCheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
`;

const AddStudentsToSection = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default
  
  // State for dropdowns and selections
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStudents, setSelectedStudents] = useState(new Set());

  // Dummy Data Initialization
  useEffect(() => {
    const dummyCourses = [
      { id: 1, name: 'Bachelor of Technology', branches: ['Computer Science', 'Mechanical'] },
      { id: 2, name: 'Master of Computer Applications', branches: [] },
    ];
    const dummyStudents = [
        {id: '21BCA001', name: 'Ankit Sharma', rollNo: '21BCA001'},
        {id: '21BCA002', name: 'Amit Singh', rollNo: '21BCA002'},
        {id: '20BME015', name: 'Riya Verma', rollNo: '20BME015'},
        {id: '20BME016', name: 'Karan Gupta', rollNo: '20BME016'},
    ];
    setCourses(dummyCourses);
    setAllStudents(dummyStudents);
  }, []);

  // Update branches when course changes
  useEffect(() => {
    const course = courses.find(c => c.id === parseInt(selectedCourse));
    setBranches(course?.branches || []);
    setSelectedBranch('');
    setSections([]); // Reset sections when course changes
    setSelectedSection('');
  }, [selectedCourse, courses]);
  
  // Update sections when branch/course changes
  useEffect(() => {
    if (selectedCourse) {
        // In a real app, you would fetch sections based on course/branch
        const dummySections = ['A', 'B', 'C'];
        setSections(dummySections);
    }
  }, [selectedCourse, selectedBranch]);

  const handleStudentSelect = (studentId) => {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudents(newSelection);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allStudentIds = new Set(allStudents.map(s => s.id));
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSection || selectedStudents.size === 0) {
        alert("Please choose a section and select at least one student.");
        return;
    }
    const submissionData = {
      sectionId: selectedSection,
      studentIds: Array.from(selectedStudents),
    };
    console.log('Adding Students to Section:', submissionData);
    alert(`${selectedStudents.size} students added to section ${selectedSection} successfully!`);
    setSelectedStudents(new Set()); // Reset selection
  };

  return (
    <Wrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="admin" />
      <Content $isOpen={isOpen}>
        <Header>Add Students to Section</Header> {/* EDITED: Used Header */}
        <Form onSubmit={handleSubmit}> {/* EDITED: Used Form */}
          <FormSection>
            <FormRow>
              <div>
                <label>Choose Course *</label>
                <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </div>
              <div>
                <label>Choose Branch</label>
                <Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} disabled={branches.length === 0}>
                   <option value="">{branches.length === 0 ? 'No branches' : 'Select Branch'}</option>
                   {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
              </div>
              <div>
                <label>Choose Section *</label>
                <Select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} required disabled={!selectedCourse}>
                   <option value="">Select Section</option>
                   {sections.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
            </FormRow>
          </FormSection>

          <List> {/* EDITED: Used List */}
            <h3>Select Students to Add</h3>
            <StudentCheckboxItem>
              <input type="checkbox" onChange={handleSelectAll} />
              <strong>Select All Students</strong>
            </StudentCheckboxItem>
            {allStudents.map(student => (
              <StudentCheckboxItem key={student.id}>
                <input 
                  type="checkbox" 
                  checked={selectedStudents.has(student.id)} 
                  onChange={() => handleStudentSelect(student.id)}
                />
                <div>
                  <strong>{student.name}</strong> (Roll No: {student.rollNo})
                </div>
              </StudentCheckboxItem>
            ))}
          </List>

          <Button type="submit" style={{marginTop: '1rem'}}> {/* EDITED: Used Button */}
            Add Selected Students to Section
          </Button>
        </Form>
      </Content>
    </Wrapper>
  );
};

export default AddStudentsToSection;
