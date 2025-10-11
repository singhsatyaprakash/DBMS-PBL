// FILE: src/pages/Admin/Announcement.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import styled from "styled-components";

// Reusing styles from GlobalStyles for consistency
import {
  Content,
  Header,
  Form,
  List,
  ListItem,
  Button,
  TextArea,
  Input as FormInput,
  SuccessMessage,
  ErrorMessage,
} from '../../styles/GlobalStyles';

const AnnouncementWrapper = styled.div`
  display: flex;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
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

const AdminAnnouncement = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // Load existing announcements on component mount
  useEffect(() => {
    // In a real app, you'd fetch all announcements
    const dummyData = [
      { id: 1, title: 'Mid-Term Exam Schedule', message: 'The schedule for the upcoming mid-term examinations has been posted.', date: '2025-08-15' },
      { id: 2, title: 'Holiday Notice: Independence Day', message: 'The university will remain closed on August 15th on account of Independence Day.', date: '2025-08-12' },
    ];
    setAnnouncements(dummyData);
  }, []);

  // Effect to clear feedback message after 3 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.message) {
      setFeedback({ message: 'Please fill in both the title and the message.', type: 'error' });
      return;
    }
    const announcementToAdd = {
      ...newAnnouncement,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements(prev => [announcementToAdd, ...prev]);
    setNewAnnouncement({ title: '', message: '' }); // Reset form
    setFeedback({ message: 'Announcement posted successfully!', type: 'success' });
  };

  return (
    <AnnouncementWrapper>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="admin" />
      <Content $isOpen={isOpen}>
        <Header>Manage Announcements</Header>
        
        {feedback.message && (
          feedback.type === 'success' 
            ? <SuccessMessage>{feedback.message}</SuccessMessage>
            : <ErrorMessage>{feedback.message}</ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title:</Label>
            <FormInput
              type="text"
              id="title"
              name="title"
              value={newAnnouncement.title}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="message">Message:</Label>
            <TextArea
              id="message"
              name="message"
              rows="5"
              value={newAnnouncement.message}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <Button type="submit">Post Announcement</Button>
        </Form>

        <hr style={{ margin: '2rem 0' }} />

        <h2>Previously Posted</h2>
        <List>
          {announcements.length > 0 ? (
            announcements.map((item) => (
              <ListItem key={item.id}>
                <AnnouncementContent>
                  <h3>{item.title}</h3>
                  <p>{item.message}</p>
                  <small>Posted on: {new Date(item.date).toLocaleDateString()}</small>
                </AnnouncementContent>
              </ListItem>
            ))
          ) : (
            <p>No announcements have been posted yet.</p>
          )}
        </List>
      </Content>
    </AnnouncementWrapper>
  );
};

export default AdminAnnouncement;
