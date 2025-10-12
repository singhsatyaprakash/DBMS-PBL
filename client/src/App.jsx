import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import Layouts
import AdminLayout from './Pages/AdminPages/Layout';
import StudentLayout from './Pages/StudentPages/StudentLayout';
import AcademicLayout from './Pages/StudentPages/AcademicLayout';

// Import Pages
import Home from './Pages/OtherPages/Home';
import AdminLogin from './Pages/AdminPages/AdminLogin';
import AdminDashboard from './Pages/AdminPages/AdminDashboard';
import Announcements from './Pages/AdminPages/Announcements';
import Departments from './Pages/AdminPages/Departments';
import Courses from './Pages/AdminPages/Courses';
import Faculty from './Pages/AdminPages/Faculty';
// ... import other admin pages

import StudentDashboard from './Pages/StudentPages/StudentDashboard';

// Placeholder Pages for Academic Section
const AcademicHomePage = () => <div className="p-4">Please select an option from the Academic Menu.</div>;
const AttendancePage = () => <div className="p-4">This is the Attendance Page.</div>;
const TimetablePage = () => <div className="p-4">This is the Timetable Page.</div>;


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="departments" element={<Departments />} />
          <Route path="courses" element={<Courses />} />
          <Route path="faculty" element={<Faculty />} />
          {/* Add other admin routes like students, result, etc. here */}
        </Route>

        {/* Main Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            {/* Add other main student routes like 'fee' here */}
        </Route>

        {/* Academic Section Routes (uses its own layout) */}
        <Route path="/student/academic" element={<AcademicLayout />}>
            <Route index element={<AcademicHomePage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="timetable" element={<TimetablePage />} />
            {/* Add other academic sub-routes here */}
        </Route>

      </Routes>
    </Router>
  );
};

export default App;