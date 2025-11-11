use university;

CREATE TABLE Courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    duration_years INT NOT NULL,                  
    total_semesters INT NOT NULL,                 
    course_code VARCHAR(20) UNIQUE,               
    department VARCHAR(100),                     
    description TEXT                             
);
ALTER TABLE Courses
DROP INDEX course_name;

ALTER TABLE Courses
ADD COLUMN department_id INT;

select * from courses;

drop table Courses;
TRuNCATE TABLE courses;

UPDATE Courses 
SET department_id = 5 
WHERE course_id IN (15, 16,17);

SELECT course_id, course_name FROM courses WHERE department_id =1;

desc courses;