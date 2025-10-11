// FILE: src/styles/DashboardStyles.js

import styled from 'styled-components';

export const AdminDashboardContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const Content = styled.div`
  flex-grow: 1;
  padding: 2rem;
  margin-left: ${({ $isOpen }) => ($isOpen ? "250px" : "80px")};
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const TopContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

export const BottomContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

export const CardContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  flex: 1;
`;

export const CardTitle = styled.h3`
  font-size: 1.1rem;
  color: #555;
  margin-top: 0;
  margin-bottom: 1rem;
`;

export const CardContent = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
  
  ${({ secondary }) => secondary && `
    background-color: #6c757d;
    &:hover {
      background-color: #5a6268;
    }
  `}
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const FileInput = styled.input`
  width: 100%;
  margin-bottom: 1rem;
`;

export const PDFViewer = styled.iframe`
  border: 1px solid #ddd;
  border-radius: 4px;
`;
