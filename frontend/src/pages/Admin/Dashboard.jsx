// FILE: src/pages/Admin/Dashboard.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import {
  AdminDashboardContainer,
  Content,
  TopContent,
  BottomContent,
  Section,
  SectionTitle,
  CardContainer,
  Card,
  CardTitle,
  CardContent,
  Modal,
  ModalContent,
  ModalActions,
  Button,
  Input,
  FileInput,
  PDFViewer,
} from "../../styles/DashboardStyles";

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [calendarPdf, setCalendarPdf] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newCalendarTitle, setNewCalendarTitle] = useState("Academic Calendar");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [currentCalendarTitle, setCurrentCalendarTitle] = useState("");

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using dummy data as API is not available
        setStudentCount(1250); // Dummy count
        setTeacherCount(75);   // Dummy count
        // In a real app, you would uncomment the following:
        // const [studentRes, teacherRes] = await Promise.all([
        //   axios.get("http://localhost:8080/api/AdminDashboard/students/count"),
        //   axios.get("http://localhost:8080/api/AdminDashboard/faculty/count"),
        // ]);
        // setStudentCount(studentRes.data);
        // setTeacherCount(teacherRes.data);
        await fetchCurrentCalendar();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();

    // Cleanup function to prevent memory leaks
    return () => {
      if (calendarPdf) {
        URL.revokeObjectURL(calendarPdf);
      }
    };
  }, []);

  const fetchCurrentCalendar = async () => {
    try {
      // This part would fetch a real PDF in a live app
      // const response = await axios.get("http://localhost:8080/api/calendar", {
      //   responseType: "blob",
      // });
      // if (response.data.size > 0) {
      //   const pdfUrl = URL.createObjectURL(response.data);
      //   setCalendarPdf(pdfUrl);
      //   const title = response.headers["x-title"] || "Academic Calendar";
      //   setCurrentCalendarTitle(title);
      // }
      console.log("Fetching calendar (simulated).");
    } catch (error) {
      console.error("Error fetching calendar:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadStatus(null);
    } else {
      setUploadStatus("Please select a valid PDF file.");
    }
  };

  const handleUploadCalendar = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", newCalendarTitle);

    try {
      setUploadStatus("Uploading...");
      // In a real app, you would uncomment the following:
      // await axios.post("http://localhost:8080/api/calendar", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      console.log("Simulating calendar upload...");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // For demonstration, create a local URL for the uploaded PDF
      const pdfUrl = URL.createObjectURL(selectedFile);
      setCalendarPdf(pdfUrl);
      setCurrentCalendarTitle(newCalendarTitle);

      setUploadStatus("Calendar updated successfully!");
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadStatus(null);
      }, 1500);
    } catch (error) {
      console.error("Error uploading calendar:", error);
      setUploadStatus("Failed to upload calendar.");
    }
  };

  return (
    <AdminDashboardContainer>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userType="admin" />
      <Content $isOpen={isOpen}>
        <TopContent>
          <Section>
            <SectionTitle>Overview</SectionTitle>
            <CardContainer>
              <Card>
                <CardTitle>Total Students</CardTitle>
                <CardContent>{studentCount}</CardContent>
              </Card>
              <Card>
                <CardTitle>Total Teachers</CardTitle>
                <CardContent>{teacherCount}</CardContent>
              </Card>
            </CardContainer>
          </Section>

          <Section>
            <SectionTitle>Academic Calendar</SectionTitle>
            <Card>
              <CardContent style={{fontSize: '1rem'}}>
                {calendarPdf ? (
                  <div>
                    <p style={{ fontWeight: "bold", marginBottom: '10px' }}>{currentCalendarTitle}</p>
                    <PDFViewer src={calendarPdf} width="100%" height="250px" title={currentCalendarTitle} />
                    <Button onClick={() => setShowUploadModal(true)} style={{ marginTop: "10px" }}>Update Calendar</Button>
                  </div>
                ) : (
                  <div>
                    <p>No calendar available.</p>
                    <Button onClick={() => setShowUploadModal(true)}>Upload Calendar</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </Section>
        </TopContent>

        <BottomContent>
          <Section>
            <SectionTitle>Recent Announcements</SectionTitle>
            <Card><CardContent style={{fontSize: '1rem'}}>Announcement summary would go here.</CardContent></Card>
          </Section>
          <Section>
            <SectionTitle>Overall Performance</SectionTitle>
            <Card><CardContent style={{fontSize: '1rem'}}>A performance chart would go here.</CardContent></Card>
          </Section>
        </BottomContent>

        {showUploadModal && (
          <Modal onClick={() => setShowUploadModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <h3>Update Academic Calendar</h3>
              <Input
                type="text"
                value={newCalendarTitle}
                onChange={(e) => setNewCalendarTitle(e.target.value)}
                placeholder="Calendar Title"
              />
              <FileInput type="file" accept=".pdf" onChange={handleFileChange} />
              {selectedFile && <p style={{ margin: "10px 0" }}>Selected: {selectedFile.name}</p>}
              {uploadStatus && <p style={{ color: uploadStatus.includes("success") ? "green" : "red", margin: "10px 0" }}>{uploadStatus}</p>}
              <ModalActions>
                <Button onClick={handleUploadCalendar} disabled={uploadStatus === "Uploading..."}>
                  {uploadStatus === "Uploading..." ? "Uploading..." : "Upload"}
                </Button>
                <Button secondary onClick={() => setShowUploadModal(false)}>Cancel</Button>
              </ModalActions>
            </ModalContent>
          </Modal>
        )}
      </Content>
    </AdminDashboardContainer>
  );
};

export default AdminDashboard; // EDITED: Added the 'default' keyword here
