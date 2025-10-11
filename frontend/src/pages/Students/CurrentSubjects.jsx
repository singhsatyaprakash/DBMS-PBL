// FILE: src/pages/Students/CurrentSubjects.jsx

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";

// Reusing styles from other components for a consistent look
import {
  Content,
  Header,   // EDITED: Imported correct components
  List,
  ListItem,
} from '../../styles/GlobalStyles';

const SubjectInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap; /* Allows items to wrap on smaller screens */
  gap: 1rem;
`;

const SubjectName = styled.span`
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
`;

const SubjectDetails = styled.div`
  display: flex;
  gap: 1.5rem;
  color: #555;
`;

const StudentSubjects = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default

  // Dummy data for the student's current subjects
  const currentSubjects = [
    { id: 'CS101', name: 'Introduction to Programming', credits: 4 },
    { id: 'MA203', name: 'Calculus II', credits: 4 },
    { id: 'PH105', name: 'Modern Physics', credits: 3 },
    { id: 'EN201', name: 'Advanced Communication', credits: 2 },
    { id: 'HU101', name: 'Human Values and Ethics', credits: 1 },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="student" />
      <Content $isOpen={isOpen}>
        <Header>My Current Subjects</Header> {/* EDITED: Used Header */}
        <List> {/* EDITED: Used List */}
          {currentSubjects.map(subject => (
            <ListItem key={subject.id}> {/* EDITED: Used ListItem */}
              <SubjectInfo>
                <SubjectName>{subject.name}</SubjectName>
                <SubjectDetails>
                  <span>Code: {subject.id}</span>
                  <span>Credits: {subject.credits}</span>
                </SubjectDetails>
              </SubjectInfo>
            </ListItem>
          ))}
        </List>
      </Content>
    </div>
  );
};

export default StudentSubjects;
