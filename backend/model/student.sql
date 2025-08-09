USE university;
drop table Student;
CREATE TABLE Student (
    student_id INT UNIQUE AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) PRIMARY KEY,
    password varchar(100),
    roll_no INT UNIQUE,
    course VARCHAR(100) NOT NULL,
    branch VARCHAR(100),
    semester INT,
    year INT,
    dob DATE,
    gender VARCHAR(10),
    contact VARCHAR(15),
    address TEXT
);

-- Start student_id from 1000 so it’s always 4 digits
ALTER TABLE Student AUTO_INCREMENT = 1000;
desc student;

select * from student;
DELETE FROM student;
TRUNCATE TABLE student;
delete from student where student_id=6;
