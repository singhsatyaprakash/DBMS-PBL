// FILE: src/pages/Teachers/Announcement.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";

// Reusing styles from GlobalStyles for consistency
import {
  Content,
  Header,
  List,
  ListItem,
} from '../../styles/GlobalStyles';

const AnnouncementWrapper = styled.div`
  display: flex;
`;

const AnnouncementContent = styled.div`
  h3 {
    margin-top: 0;
    color: #333;
  }
  p {
    margin-bottom: 10px;
    color: #555;
  }
`;

const AnnouncementDate = styled.small`
  display: block;
  margin-top: 10px;
  color: #666;
  font-style: italic;
`;

const TeacherAnnouncements = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  // Load existing announcements on component mount
  useEffect(() => {
    // In a real app, you would fetch announcements from the admin or central system
    const dummyData = [
      { id: 1, title: 'Mid-Term Exam Schedule', message: 'The schedule for the upcoming mid-term examinations has been posted.', date: '2025-08-15' },
      { id: 2, title: 'Holiday Notice: Independence Day', message: 'The university will remain closed on August 15th on account of Independence Day.', date: '2025-08-12' },
      { id: 3, title: 'Faculty Meeting', message: 'There will be a mandatory faculty meeting on August 22nd in the main conference hall.', date: '2025-08-11' },
    ];
    setAnnouncements(dummyData);
  }, []);

  return (
    <AnnouncementWrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="teacher" />
      <Content $isOpen={isOpen}>
        <Header>View Announcements</Header>
        
        <List>
          {announcements.length > 0 ? (
            announcements.map((item) => (
              <ListItem key={item.id}>
                <AnnouncementContent>
                  <h3>{item.title}</h3>
                  <p>{item.message}</p>
                  <AnnouncementDate>
                    Posted on: {new Date(item.date).toLocaleDateString()}
                  </AnnouncementDate>
                </AnnouncementContent>
              </ListItem>
            ))
          ) : (
            <p>No announcements are available at this time.</p>
          )}
        </List>
      </Content>
    </AnnouncementWrapper>
  );
};

export default TeacherAnnouncements;
