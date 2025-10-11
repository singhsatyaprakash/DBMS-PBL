// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// This component injects your global styles, including the background image, into the entire app.
import GlobalStyle from './styles/GlobalStyles';

// Import Layouts - These components provide the sidebar and content structure for each user role.
import AdminLayout from './components/AdminLayout';
import StudentLayout from './components/StudentLayout';
import TeacherLayout from './components/TeacherLayout';

// Core Components
import ChooseUser from "./components/ChooseUser";
import SignIn from "./components/SignIn";

// Admin Page Imports
import AdminDashboard from "./pages/Admin/Dashboard";
import AddCourses from './pages/Admin/AddCourses';
import AddFaculty from './pages/Admin/AddFaculty';
import AddStudentsToSection from './pages/Admin/AddStudentsToSection';
import AddSubjects from './pages/Admin/AddSubjects';
import AddSubjectToSem from './pages/Admin/AddSubjectToSem';
import CreateSectionsInCourse from './pages/Admin/CreateSectionsInCourse';
import AdminAnnouncement from './pages/Admin/Announcement'; // EDITED: Added import for Admin Announcement

// Student Page Imports
import StudentDashboard from "./pages/Students/dashboard";
import StudentAnnouncements from "./pages/Students/Announcements";
import StudentAttendance from "./pages/Students/Attendance";
import CurrentSubjects from "./pages/Students/CurrentSubjects";
import StudentProfile from "./pages/Students/Profile";
import ResetPassword from "./pages/Students/ResetPassword";

// Teacher Page Imports
import TeacherDashboard from "./pages/Teachers/dashboard";
import TeacherAnnouncement from "./pages/Teachers/Announcement";
import AssignedSections from "./pages/Teachers/AssignedSections";
import AssignedSubjects from "./pages/Teachers/AssignedSubjects";
import MarkAttendance from "./pages/Teachers/MarkAttendance";
import StudentsById from "./pages/Teachers/StudentsById";


function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          {/* Core Routes - These pages do not have a sidebar and appear first. */}
          <Route path="/" element={<ChooseUser />} />
          <Route path="/admin/signin" element={<SignIn role="admin" />} />
          <Route path="/teacher/signin" element={<SignIn role="teacher" />} />
          <Route path="/student/signin" element={<SignIn role="student" />} />
          <Route path="/student/reset-password" element={<ResetPassword />} />

          {/* Admin Routes - All wrapped in AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="add-courses" element={<AddCourses />} />
            <Route path="add-faculty" element={<AddFaculty />} />
            <Route path="add-students-to-section" element={<AddStudentsToSection />} />
            <Route path="add-subjects" element={<AddSubjects />} />
            <Route path="add-subject-to-sem" element={<AddSubjectToSem />} />
            <Route path="create-sections" element={<CreateSectionsInCourse />} />
            <Route path="announcement" element={<AdminAnnouncement />} /> {/* EDITED: Added route for Admin Announcement */}
          </Route>

          {/* Student Routes - All wrapped in StudentLayout */}
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="announcements" element={<StudentAnnouncements />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="subjects" element={<CurrentSubjects />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Teacher Routes - All wrapped in TeacherLayout */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="announcement" element={<TeacherAnnouncement />} />
            <Route path="assigned-sections" element={<AssignedSections />} />
            <Route path="assigned-subjects" element={<AssignedSubjects />} />
            <Route path="mark-attendance" element={<MarkAttendance />} />
            <Route path="search-student" element={<StudentsById />} />
          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;
