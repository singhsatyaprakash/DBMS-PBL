import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <SchoolInfo>
        <Title>Campus Management System</Title>
        <button onClick={() => navigate("/signin")}>Get Started</button>
      </SchoolInfo>
    </HomeContainer>
  );
};

export default Home;

const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f8f9fa;
`;

const SchoolInfo = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;
