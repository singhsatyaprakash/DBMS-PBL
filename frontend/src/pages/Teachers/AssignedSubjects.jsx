// FILE: src/pages/Teachers/AssignedSubjects.jsx

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";

// Reusing styles from other components for a consistent look
import {
  Content,
  Header,       // EDITED: Imported correct components
  List,
  ListItem,
} from '../../styles/GlobalStyles';

const SubjectInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
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

const AssignedSubjects = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default

  // Dummy data for subjects assigned to the teacher
  const assignedSubjects = [
    { id: 'TCS509', name: 'Machine Learning', course: 'B.Tech CSE', semester: 5 },
    { id: 'TCS593', name: 'Deep Learning Fundamentals', course: 'B.Tech CSE', semester: 7 },
    { id: 'PCS514', name: 'Computer Networks Lab', course: 'B.Tech CSE', semester: 5 },
    { id: 'TCS301', name: 'Data Structures', course: 'B.Tech IT', semester: 3 },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="teacher" />
      <Content $isOpen={isOpen}>
        <Header>My Assigned Subjects</Header> {/* EDITED: Used Header */}
        <List> {/* EDITED: Used List */}
          {assignedSubjects.map(subject => (
            <ListItem key={subject.id}> {/* EDITED: Used ListItem */}
              <SubjectInfo>
                <SubjectName>{subject.name}</SubjectName>
                <SubjectDetails>
                  <span>Code: {subject.id}</span>
                  <span>Course: {subject.course} (Sem {subject.semester})</span>
                </SubjectDetails>
              </SubjectInfo>
            </ListItem>
          ))}
        </List>
      </Content>
    </div>
  );
};

export default AssignedSubjects;
