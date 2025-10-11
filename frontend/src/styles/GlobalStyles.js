import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
// 1. Import your background image
import universityBackground from '../assets/GEHU-Dehradun-1abd6f9c.jpg';

// --- CORE LAYOUT COMPONENTS ---

// Use this as the main wrapper for every page
export const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: transparent; // EDITED: Ensures global background is visible
`;

// This is the main content area for every page
export const Content = styled.div`
  flex: 1;
  padding: 2rem;
  margin-left: ${({ $isOpen }) => ($isOpen ? "250px" : "80px")};
  transition: margin-left 0.3s ease;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    opacity: 0.1;
    z-index: -1;
  }
`;

// --- AUTHENTICATION & HOME PAGE STYLES ---

export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

export const FormContainer = styled.form`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 1.2rem;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    border-color: #4361ee;
    outline: none;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #3a56d4;
  }
  &:disabled {
    background-color: #9aa5b1;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: #d90429;
  background-color: #ffd6d6;
  padding: 12px;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.9rem;
  text-align: center;
`;

export const SuccessMessage = styled.div`
  color: #155724;
  background-color: #d4edda;
  padding: 12px;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.9rem;
  text-align: center;
`;

export const Title = styled.h1`
  color: #2b2d42;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
  font-weight: 700;
`;


// --- GENERAL PAGE COMPONENTS (Forms, Lists, etc.) ---

export const Header = styled.h1`
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eaecef;
`;

export const Form = styled.form`
  /* EDITED: Changed background to be semi-transparent */
  background-color: rgba(255, 255, 255, 0.85); 
  backdrop-filter: blur(5px); /* Optional: Adds a frosted glass effect */
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

export const FormSection = styled.div`
  /* EDITED: Increased margin-bottom for more space between sections */
  margin-bottom: 25px;
  h3 {
    color: #2c3e50;
    font-size: 18px;
    margin-bottom: 15px;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  
  /* EDITED: Increased gap significantly for more horizontal space */
  gap: 40px; 
  
  /* EDITED: Increased margin for more vertical space */
  margin-bottom: 30px; 
  
  label {
    display: block;
    margin-bottom: 8px; /* This adds space between the label and the input box */
    font-weight: 500;
    color: #495057;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

export const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2980b9;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

export const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#3498db" : "#e9ecef")};
  color: ${({ active }) => (active ? "white" : "#495057")};
  transition: all 0.3s;

  &:hover {
    background-color: ${({ active }) => (active ? "#2980b9" : "#dee2e6")};
  }
`;

export const List = styled.div`
  background-color: #ffffff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

export const ListItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eaecef;
  &:last-child {
    border-bottom: none;
  }
`;

// --- PROFILE PAGE STYLES ---

export const ProfileHeader = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

export const ProfileInfo = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
`;

export const ProfileDetail = styled.div`
  display: flex;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

export const Label = styled.span`
  font-weight: bold;
  width: 150px;
  color: #555;
`;

export const Value = styled.span`
  color: #333;
`;

export const ProfileImageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

export const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ddd;
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    position: relative; /* Needed for the overlay */
    background-image: url(${universityBackground});
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: 100vh;

    /* EDITED: Added an overlay to control image visibility */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8); /* White overlay with 80% opacity, making image 20% visible */
      z-index: -1;
    }
  }
`;

export default GlobalStyle;
