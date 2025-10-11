// FILE: src/pages/Teachers/AssignedSections.jsx

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

const SectionInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectionName = styled.span`
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
`;

const SectionDetails = styled.div`
  display: flex;
  gap: 1.5rem;
  color: #555;
`;

const AssignedSections = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default

  // Dummy data for sections assigned to the teacher
  const assignedSections = [
    { id: 1, subject: 'Machine Learning', course: 'B.Tech CSE', semester: 5, section: 'A' },
    { id: 2, subject: 'Machine Learning', course: 'B.Tech CSE', semester: 5, section: 'B' },
    { id: 3, subject: 'Deep Learning Fundamentals', course: 'B.Tech CSE', semester: 7, section: 'A' },
    { id: 4, subject: 'Data Structures', course: 'B.Tech IT', semester: 3, section: 'C' },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="teacher" />
      <Content $isOpen={isOpen}>
        <Header>My Assigned Sections</Header> {/* EDITED: Used Header */}
        <List> {/* EDITED: Used List */}
          {assignedSections.map(section => (
            <ListItem key={section.id}> {/* EDITED: Used ListItem */}
              <SectionInfo>
                <SectionName>{section.subject}</SectionName>
                <SectionDetails>
                  <span>{section.course}</span>
                  <span>Semester: {section.semester}</span>
                  <span>Section: {section.section}</span>
                </SectionDetails>
              </SectionInfo>
            </ListItem>
          ))}
        </List>
      </Content>
    </div>
  );
};

export default AssignedSections;
