import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
// 1. Import your background image
import universityBackground from "../assets/GEHU-Dehradun-1abd6f9c.jpg"; // <-- Make sure this path is correct

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: relative; // Needed for the overlay

  // 2. Set the background image
  background-image: url(${universityBackground});
  background-size: cover;
  background-position: center;
`;

// 3. New Overlay component for readability
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.6); // White with 60% opacity
  z-index: 1;
`;


const ContentWrapper = styled.div`
  position: relative;
  z-index: 2; // Ensures content is on top of the overlay
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;


const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-shadow: 0 1px 3px rgba(255, 4, 4, 1); // Adds a subtle shadow to the text
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); // A slightly stronger shadow
  width: 100%;
  max-width: 400px;
`;

const InputField = styled.input`
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:disabled {
    background-color: #a0cffc;
  }
`;

const ResetLink = styled.a`
  color: #007bff;
  text-align: center;
  margin-top: 1rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 1rem;
`;

const SignIn = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Your handleSignIn and handlePasswordReset functions remain the same
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Your existing sign-in logic...
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    // Your existing password reset logic...
  };

  return (
    <AuthContainer>
      <Overlay />
      <ContentWrapper>
        <Title>Campus Cloud University</Title>
        <FormContainer onSubmit={handleSignIn}>
          <InputField
            type="email"
            placeholder="University Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </SubmitButton>
          <ResetLink onClick={handlePasswordReset}>Forgot Password?</ResetLink>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormContainer>
      </ContentWrapper>
    </AuthContainer>
  );
};

export default SignIn;