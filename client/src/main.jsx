import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AdminProvider } from './context/AdminContext'
import StudentProvider from './context/StudentContext.jsx'
import FacultyProvider from './context/FacultyContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProvider>
      <FacultyProvider>
        <StudentProvider>
            <App />
        </StudentProvider>
      </FacultyProvider>
    </AdminProvider>
  </StrictMode>
)
