// FILE: src/pages/Students/Dashboard.jsx

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

const StudentDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [calendarPdf, setCalendarPdf] = useState(null);
  const [currentCalendarTitle, setCurrentCalendarTitle] = useState("");

  // Fetch student-specific data
  useEffect(() => {
    // In a real app, you would fetch data for the logged-in student
    const dummyStudentData = {
      name: "Ankit Sharma",
      univId: "21BCA001",
      course: "Bachelor of Computer Applications",
      semester: 6,
      email: "ankit.sharma@example.com",
      contactNo: "+91 98765 43210",
      address: "123 University Lane, Dehradun",
    };
    setStudentData(dummyStudentData);
  }, []);

  // Fetch the academic calendar
  useEffect(() => {
    // This would be the same API call as the admin dashboard
    // For now, we'll simulate it.
    console.log("Fetching academic calendar...");
  }, []);

  return (
    <DashboardContainer>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="student" />
      <Content $isOpen={isOpen}>
        <Section>
          <SectionTitle>
            Welcome, {studentData?.name || "Student"}!
          </SectionTitle>
          <CardContainer>
            <Card>
              <CardTitle>Academic Information</CardTitle>
              <CardContent style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                <div><strong>University ID:</strong> {studentData?.univId || "N/A"}</div>
                <div><strong>Program:</strong> {studentData?.course || "N/A"}</div>
                <div><strong>Current Semester:</strong> {studentData?.semester || "N/A"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardTitle>Contact Information</CardTitle>
              <CardContent style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                <div><strong>Email:</strong> {studentData?.email || "N/A"}</div>
                <div><strong>Phone:</strong> {studentData?.contactNo || "N/A"}</div>
                <div><strong>Address:</strong> {studentData?.address || "N/A"}</div>
              </CardContent>
            </Card>
          </CardContainer>
        </Section>
        <Section>
          <SectionTitle>Academic Calendar</SectionTitle>
          <Card>
            {/* This section would display the PDF viewer for the calendar */}
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

export default StudentDashboard;
