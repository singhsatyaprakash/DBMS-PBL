USE university;

-- Drop table first if you are re-creating it
DROP TABLE IF EXISTS Subjects;

CREATE TABLE Subjects (
    subject_id    INT PRIMARY KEY AUTO_INCREMENT,
    subject_name  VARCHAR(100) NOT NULL,
    subject_code  VARCHAR(20) NOT NULL UNIQUE,
    semester      INT NOT NULL,
    credits       INT NOT NULL,
    description   TEXT,
    course_id     INT NOT NULL,
    branch_id     INT,          
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    FOREIGN KEY (branch_id) REFERENCES Course_Branch(branch_id) 
);

desc subjects;
desc Subjects;

select * from subjects;