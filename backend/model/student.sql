USE university;
drop table Student;
CREATE TABLE Student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,      -- Internal unique ID
    university_id CHAR(5) UNIQUE,                   -- Auto-generated 5-digit University ID
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    roll_no CHAR(5) UNIQUE,                         -- Auto-generated 5-digit Roll No
    course VARCHAR(100) NOT NULL,
    branch VARCHAR(100),
    semester INT,                                   -- Can be set first time
    year INT,
    dob DATE,
    gender VARCHAR(10),
    nationality VARCHAR(50) DEFAULT NULL,
    blood_group VARCHAR(5) DEFAULT NULL,
    contact VARCHAR(15),
    address TEXT,
    father_name VARCHAR(100),
    father_contact VARCHAR(15),
    father_occupation VARCHAR(100),
    mother_name VARCHAR(100),
    mother_contact VARCHAR(15),
    mother_occupation VARCHAR(100)
);


-- Start student_id from 1000 so it’s always 4 digits
ALTER TABLE Student AUTO_INCREMENT = 1000;
desc student;

select * from student;
DELETE FROM student;
TRUNCATE TABLE student;
delete from student where student_id=1016;
