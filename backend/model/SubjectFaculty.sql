use university;

CREATE TABLE SubjectFaculty (
    sf_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    faculty_id INT NOT NULL,
    session_year VARCHAR(10) NOT NULL,

    -- Foreign key to the Subject table
    CONSTRAINT fk_subject
        FOREIGN KEY (subject_id) 
        REFERENCES Subjects(subject_id)
        ON DELETE CASCADE,

    -- Foreign key to the Faculty table
    CONSTRAINT fk_faculty
        FOREIGN KEY (faculty_id) 
        REFERENCES Faculty(faculty_id)
        ON DELETE CASCADE,

    -- A teacher can only be assigned to a subject once per session
    UNIQUE KEY uk_assignment (subject_id, faculty_id, session_year)
);

desc subjectfaculty;


select * from subjectFaculty;