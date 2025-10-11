// src/components/ChooseUser.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import universityBackground from '../assets/GEHU-Dehradun-1abd6f9c.jpg';

// ... (the rest of your styled-components code remains the same)

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-image: url(${universityBackground});
  background-size: cover;
  background-position: center;
`;

const SelectionBox = styled.div`
  padding: 3rem 4rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  backdrop-filter: blur(4px);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
`;

const RoleButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;


const ChooseUser = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <SelectionBox>
        <Title>Welcome to Campus Management</Title>
        <Subtitle>Please select your role to sign in.</Subtitle>
        <ButtonContainer>
          <RoleButton onClick={() => navigate('/admin/signin')}>Admin</RoleButton>
          <RoleButton onClick={() => navigate('/teacher/signin')}>Teacher</RoleButton>
          <RoleButton onClick={() => navigate('/student/signin')}>Student</RoleButton>
        </ButtonContainer>
      </SelectionBox>
    </PageContainer>
  );
};

export default ChooseUser;