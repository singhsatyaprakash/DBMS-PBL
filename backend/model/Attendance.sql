use university;
CREATE TABLE Attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- This is the 'sf_id' from your 'SubjectFaculty' table.
    -- It identifies the exact class (e.g., "Dr. Sharma's Data Structures").
    sf_id INT NOT NULL, 
    
    student_id INT NOT NULL,
    
    -- The specific date the lecture was held
    date DATE NOT NULL, 
    
    -- The status of the student for that single lecture
    status ENUM('present', 'absent', 'leave') NOT NULL,

    -- ---
    -- KEYS & CONSTRAINTS
    -- ---

    -- This is the most important part. It ensures a student can
    -- only have ONE attendance record for ONE class on ONE day.
    -- This is what makes 'ON DUPLICATE KEY UPDATE' work.
    UNIQUE KEY uk_student_class_day (sf_id, student_id, date),

    -- Foreign key to your junction table
    FOREIGN KEY (sf_id) 
        REFERENCES SubjectFaculty(sf_id)
        ON DELETE CASCADE,

    -- Foreign key to your student table
    FOREIGN KEY (student_id) 
        REFERENCES Student(student_id)
        ON DELETE CASCADE
);
SELECT COUNT(DISTINCT date) AS totalLectures
FROM Attendance
WHERE sf_id = ?; -- (e.g., 134, for 'Business Law')


SELECT COUNT(*) AS attendedLectures
FROM Attendance
WHERE sf_id = ? 
  AND student_id = ? 
  AND status = 'present';

select * from attendance;

truncate  table attendance;
desc attendance;
