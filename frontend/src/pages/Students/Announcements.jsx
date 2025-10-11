// FILE: src/pages/Students/Announcements.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";

// Reusing styles from GlobalStyles for consistency
import {
  Content,
  Header,       // EDITED: Imported Header instead of Title
  List,         // EDITED: Imported List for the main container
  ListItem,     // EDITED: Imported ListItem for each announcement
} from '../../styles/GlobalStyles';

const AnnouncementWrapper = styled.div`
  display: flex;
`;

// EDITED: Defined missing styled-components locally
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

const StudentAnnouncements = () => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default
  const [announcements, setAnnouncements] = useState([]);

  // Fetch announcements when the component mounts
  useEffect(() => {
    // In a real app, you would fetch this from your API
    // axios.get('/api/announcements').then(res => setAnnouncements(res.data));
    
    // Using dummy data for now
    const dummyAnnouncements = [
      { id: 1, title: 'Mid-Term Exam Schedule', message: 'The schedule for the upcoming mid-term examinations has been posted. Please check the notice board.', date: '2025-08-15' },
      { id: 2, title: 'Holiday Notice: Independence Day', message: 'The university will remain closed on August 15th on account of Independence Day.', date: '2025-08-12' },
      { id: 3, title: 'Library Books Return', message: 'All students are requested to return their library books by August 20th to avoid fines.', date: '2025-08-10' },
    ];
    setAnnouncements(dummyAnnouncements);
  }, []);

  return (
    <AnnouncementWrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="student" />
      <Content $isOpen={isOpen}>
        <Header>Announcements</Header> {/* EDITED: Used Header */}
        <List> {/* EDITED: Used List */}
          {announcements.length > 0 ? (
            announcements.map((item) => (
              <ListItem key={item.id}> {/* EDITED: Used ListItem */}
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

export default StudentAnnouncements;
