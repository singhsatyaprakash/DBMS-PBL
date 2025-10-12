import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminLogin from './Pages/AdminPages/AdminLogin'
import Home from './Pages/OtherPages/Home'
import AdminDashboard from './Pages/AdminPages/AdminDashboard'
import StudentDashboard from './Pages/StudentPages/StudentDashboard'
import Departments from './Pages/AdminPages/Departments'
import Admissions from './Pages/AdminPages/Admissions'
import Notice from './Pages/AdminPages/Notice'
import Announcements from './Pages/AdminPages/Announcements'
import Courses from './Pages/AdminPages/Courses'
import Faculty from './Pages/AdminPages/Faculty'
import Students from './Pages/AdminPages/Students'
import ExamTimetable from './Pages/AdminPages/ExamTimetable'
import Result from './Pages/AdminPages/Result'
import Library from './Pages/AdminPages/Library'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/admissions" element={<Admissions />} />
        <Route path="/admin/announcements" element={<Announcements />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/courses" element={<Courses />} />
        <Route path="/admin/faculty" element={<Faculty />} />
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/exam-timetable" element={<ExamTimetable />} />
        <Route path="/admin/result" element={<Result />} />
        <Route path="/admin/library" element={<Library />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
