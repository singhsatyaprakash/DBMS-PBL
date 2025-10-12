import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminLogin from './Pages/AdminPages/AdminLogin'
import Home from './Pages/OtherPages/Home'
import AdminDashboard from './Pages/AdminPages/AdminDashboard'
import AdminProtectWrapper from './AdminProtectWrapper'
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
        <Route
          path="/admin"
          element={
            <AdminProtectWrapper>
              <AdminDashboard />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/admin/admissions"
          element={
            <AdminProtectWrapper>
              <Admissions />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/admin/notice"
          element={
            <AdminProtectWrapper>
              <Notice />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <AdminProtectWrapper>
              <Announcements />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <AdminProtectWrapper>
              <Departments />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <AdminProtectWrapper>
              <Courses />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/admin/faculty"
          element={
            <AdminProtectWrapper>
              <Faculty />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/admin/students"
          element={
            <AdminProtectWrapper>
              <Students />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/admin/exam-timetable"
          element={
            <AdminProtectWrapper>
              <ExamTimetable />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/admin/result"
          element={
            <AdminProtectWrapper>
              <Result />
            </AdminProtectWrapper>
          }
        />
        <Route
          path="/admin/library"
          element={
            <AdminProtectWrapper>
              <Library />
            </AdminProtectWrapper>
          }
        />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
