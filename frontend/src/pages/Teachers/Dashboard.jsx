// FILE: src/pages/Teachers/Dashboard.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import {
  AdminDashboardContainer as DashboardContainer, // Renaming for generic use
  Content,
  Section,
  SectionTitle,
  CardContainer,
  Card,
  CardTitle,
  CardContent,
  PDFViewer,
} from "../../styles/DashboardStyles";

const TeacherDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [teacherData, setTeacherData] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [calendarPdf, setCalendarPdf] = useState(null);
  const [currentCalendarTitle, setCurrentCalendarTitle] = useState("");

  // Fetch teacher-specific data
  useEffect(() => {
    // In a real app, you would fetch data for the logged-in teacher
    const dummyTeacherData = {
      name: "Dr. Vikrant Sharma",
      univId: "FAC007",
      department: "Computer Science",
      email: "vikrant.sharma@example.com",
      contactNo: "+91 91234 56789",
    };
    setTeacherData(dummyTeacherData);
  }, []);
  
  // Fetch overview data (student and class counts)
  useEffect(() => {
    // In a real app, you would fetch these counts from your API
    setStudentCount(120); // Dummy data
    setClassCount(5);     // Dummy data
  }, []);

  // Fetch the academic calendar
  useEffect(() => {
    // This would be the same API call as the admin dashboard
    // For now, we'll simulate it.
    console.log("Fetching academic calendar...");
  }, []);

  return (
    <DashboardContainer>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="teacher" />
      <Content $isOpen={isOpen}>
        <Section>
          <SectionTitle>
            Welcome, {teacherData?.name || "Teacher"}!
          </SectionTitle>
          <CardContainer>
            <Card>
              <CardTitle>Professional Information</CardTitle>
              <CardContent style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                <div><strong>University ID:</strong> {teacherData?.univId || "N/A"}</div>
                <div><strong>Department:</strong> {teacherData?.department || "N/A"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardTitle>Contact Information</CardTitle>
              <CardContent style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                <div><strong>Email:</strong> {teacherData?.email || "N/A"}</div>
                <div><strong>Phone:</strong> {teacherData?.contactNo || "N/A"}</div>
              </CardContent>
            </Card>
          </CardContainer>
        </Section>
        <Section>
          <SectionTitle>Overview</SectionTitle>
          <CardContainer>
            <Card>
              <CardTitle>Your Students</CardTitle>
              <CardContent>{studentCount}</CardContent>
            </Card>
            <Card>
              <CardTitle>Your Classes</CardTitle>
              <CardContent>{classCount}</CardContent>
            </Card>
          </CardContainer>
        </Section>
        <Section>
          <SectionTitle>Academic Calendar</SectionTitle>
          <Card>
            <CardContent style={{fontSize: '1rem'}}>
              {calendarPdf ? (
                <PDFViewer
                  src={calendarPdf}
                  width="100%"
                  height="500px"
                  title={currentCalendarTitle}
                />
              ) : (
                <p>The academic calendar is not available at this time.</p>
              )}
            </CardContent>
          </Card>
        </Section>
      </Content>
    </DashboardContainer>
  );
};

export default TeacherDashboard;
