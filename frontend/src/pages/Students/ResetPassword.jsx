// FILE: src/pages/Students/ResetPassword.jsx

import React, { useState } from 'react';
import styled from "styled-components";

// Reusing styles from AuthStyles for a consistent look and feel

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');

    // --- FRONTEND ONLY ---
    // In a real app, you would make an API call here to your backend
    // to trigger the password reset email.
    console.log(`Password reset requested for: ${email}`);

    // Simulate an API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(`A password reset link has been sent to ${email}. Please check your inbox.`);
      setEmail('');
    }, 1500);
  };

  return (
    <AuthContainer>
      <FormContainer onSubmit={handleResetPassword}>
        <Title>Reset Your Password</Title>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#555' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <InputField
          type="email"
          placeholder="Enter your university email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </SubmitButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage style={{marginTop: '1rem', color: 'green'}}>{success}</SuccessMessage>}
      </FormContainer>
    </AuthContainer>
  );
};

export default ResetPassword;
