const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();
const cloudinary=require('../db/cloudinary.conn');
const fs=require('fs');
const path = require('path');

const query = util.promisify(connDB.query).bind(connDB);
const adminService = require('../services/admin.services');


function generateRandomPassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await query('SELECT * FROM admin WHERE email=?', [email]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const isMatch = await bcrypt.compare(password, result[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: result[0].admin_id, email: result[0].email, name: result[0].name },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        return res.status(200).json({
            message: "Login successful",
            token,
            role: "admin",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};
//adding faculty...
const addFaculty=async(req,res)=>{
    const {name,department,email,dob,contact_number,address,gender}=req.body;
    if(!name || !email){
        return res.status(400).json({ message: "Name and email are required" });
    }
    

    try {
        const existing = await query('SELECT * FROM Faculty WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Faculty with this email already exists" });
        }
        const password = generateRandomPassword();
        // Send credentials to faculty email
        const mailSendDetails = await adminService.sendCredentials(email, name, password,"Faculty Member");
        if (!mailSendDetails.success) {
            return res.status(500).json({ message: "Error sending email", error: mailSendDetails.error });
        }
        const hashedPassword = await bcrypt.hash(mailSendDetails.password, 10);
        await query(
            `INSERT INTO Faculty (name, department, email, password, dob, contact_number, address, gender)
             VALUES (?, ? , ?, ?, ?, ?, ?, ?)`,
            [name, department, email,hashedPassword, dob, contact_number, address, gender]
        );

        res.status(201).json({ message: "Faculty added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const addStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            course,
            branch,
            semester,
            year,
            dob,
            gender,
            nationality,
            blood_group,
            contact,
            address,
            father_name,
            father_contact,
            father_occupation,
            mother_name,
            mother_contact,
            mother_occupation
        } = req.body;

        const lastStudent = await query("SELECT MAX(student_id) AS maxId FROM Student");
        const newStudentId = lastStudent[0].maxId ? lastStudent[0].maxId + 1 : 1000;
        const university_id = String(newStudentId).padStart(5, '0');
        const lastRoll = await query("SELECT MAX(roll_no) AS maxRoll FROM Student");
        let newRollNo = lastRoll[0].maxRoll ? String(Number(lastRoll[0].maxRoll) + 1).padStart(5, '0') : "10000";

        const password = generateRandomPassword();
        const mailSendDetails = await adminService.sendCredentials(email, name, password, "Student");
        if (!mailSendDetails.success) {
            return res.status(500).json({ success: false, message: "Error sending email", error: mailSendDetails.error });
        }
        const hashedPassword = await bcrypt.hash(mailSendDetails.password, 10);

        let result = await query(
            `INSERT INTO Student 
            (university_id, name, email, password, roll_no, course, branch, semester, year, dob, gender, nationality, blood_group, contact, address, father_name, father_contact, father_occupation, mother_name, mother_contact, mother_occupation)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                university_id,
                name,
                email,
                hashedPassword,
                newRollNo,
                course,
                branch,
                semester,
                year,
                dob,
                gender,
                nationality,
                blood_group,
                contact,
                address,
                father_name,
                father_contact,
                father_occupation,
                mother_name,
                mother_contact,
                mother_occupation
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({ success: false, message: "Error adding student" });
        }
        res.status(201).json({
            success: true,
            message: "Student added successfully",
            data: {
                student_id: result.insertId,
                university_id,
                roll_no: newRollNo
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error adding student", error: err.message });
    }
};


const addBulkStudent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        // Parse file into structured array of objects
        const students = await adminService.parseStudentFile(req.file.path);

        // Required fields in CSV (excluding auto-generated fields)
        const requiredFields = [
            'name', 'email', 'course', 'branch', 'semester', 'year',
            'dob', 'gender', 'contact', 'address'
        ];

        for (const student of students) {
            for (const field of requiredFields) {
                if (!student[field]) {
                    return res.status(400).json({ message: `Missing field ${field} in some record` });
                }
            }
        }

        const values = [];
        let failedEmails = [];

        // Get last auto-generated IDs for roll_no & university_id
        const [lastIds] = await query(`SELECT 
            COALESCE(MAX(CAST(roll_no AS UNSIGNED)), 0) AS last_roll,
            COALESCE(MAX(CAST(university_id AS UNSIGNED)), 0) AS last_univ
            FROM Student`);

        let rollCounter = lastIds.last_roll;
        let univCounter = lastIds.last_univ;

        for (const s of students) {
            const password = generateRandomPassword();

            // Send email with credentials
            const mailSendDetails = await adminService.sendCredentials(s.email, s.name, password, "Student");
            if (!mailSendDetails.success) {
                failedEmails.push({ email: s.email, error: mailSendDetails.error });
                continue; // Skip if email sending fails
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Auto-generate 5-digit IDs
            rollCounter++;
            univCounter++;
            const roll_no = String(rollCounter).padStart(5, '0');
            const university_id = String(univCounter).padStart(5, '0');

            values.push([
                university_id, s.name, s.email, hashedPassword, roll_no, s.course, s.branch, s.semester,
                s.year, s.dob, s.gender, s.nationality || null, s.blood_group || null, s.contact, s.address,
                s.father_name || null, s.father_contact || null, s.father_occupation || null,
                s.mother_name || null, s.mother_contact || null, s.mother_occupation || null
            ]);
        }

        if (values.length === 0) {
            return res.status(500).json({ message: "No students added. All emails failed.", failedEmails });
        }

        const sql = `
            INSERT INTO Student
            (university_id, name, email, password, roll_no, course, branch, semester, year, dob, gender,
            nationality, blood_group, contact, address, father_name, father_contact, father_occupation,
            mother_name, mother_contact, mother_occupation)
            VALUES ?`;

        await query(sql, [values]);

        res.status(201).json({
            message: "Bulk students added successfully",
            added: values.length,
            failedEmails
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const uploadAnnouncement = async (req, res) => {
    const { type, title, description } = req.body;
    let fileUrl = null;

    try {
        if (req.file) {
            // Normalize path for all OS
            const filePath = req.file.path.split(path.sep).join(path.posix.sep);
            const result = await cloudinary.uploader.upload(filePath, {
                folder: type || "Others",
                resource_type: 'auto',
                access_mode: "public"
            });
            fs.unlinkSync(req.file.path);
            fileUrl = result.secure_url;
        }

        // Save announcement info in DB
        await query(
            `INSERT INTO announcement (title, description, type, file_url, admin_id, created_at)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                title || '',
                description || '',
                type || 'Others',
                fileUrl,
                req.user?.admin_id || 1 
            ]
        );

        res.status(201).json({
            message: "Announcement saved successfully",
            url: fileUrl
        });

    } catch (err) {
        res.status(500).json({
            message: "Uploading failed.",
            error: err.message
        });
    }
}

const addNewCourse = async (req, res) => {
    const { course_name, duration_years, department, course_code, description } = req.body;

    if (!course_name || !course_code || !duration_years) {
        return res.status(400).json({ message: "Course name, code, and duration (years) are required" });
    }
    const total_semesters = duration_years * 2;
    try {
        const existing = await query('SELECT * FROM Courses WHERE course_code = ?', [course_code]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Course with this code already exists" });
        }
        await query(
            `INSERT INTO Courses (course_name, duration_years, total_semesters, department, course_code, description)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [course_name, duration_years, total_semesters, department || null, course_code, description || null]
        );

        res.status(201).json({ message: "Course added successfully" });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllCourses=async(req,res)=>{
    try{
        console.log("Fetching all courses");
        const courses=await query('SELECT * FROM Courses');
        if(courses.length===0){
            return res.status(404).json("No courses found");
        }
        res.status(200).json(courses);
    }
    catch(error){
        console.error("Error fetching courses:", error);
        return res.status(500).json({ message: "Server error" });
    }
}


const addNewSubject=async(req,res)=>{
    const {subject_name,subject_code,course,credits,description}=req.body;
    try{
        if(!subject_name || !subject_code ||!course || !credits){
            return res.status(400).json({ message: "Subject name, code, and credits are required" });
        }
        const existing = await query('SELECT * FROM Subjects WHERE subject_code = ?', [subject_code]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Subject with this code already exists" });
        }
        await query(
            `INSERT INTO Subjects (subject_name, subject_code,course, credits, description)
             VALUES (?, ?, ?, ?, ?)`,
            [subject_name, subject_code,course, credits, description || null]
        );

        res.status(201).json({ message: "Subject added successfully" });
    }
    catch(error){
        console.error("Error adding subject:", error);
        res.status(500).json({ message: "Server error" });
    }
}
const getAllSubjects=async(req,res)=>{
    try{
        const subjects=await query('SELECT * FROM Subjects');
        if(subjects.length===0){
            return res.status(404).json("No subjects found");
        }
        res.status(200).json(subjects); 
    }
    catch(error){
        return res.status(500).json({message:"server error",error:error.message});
    }
}

const getAllSubjectsByCourse=async(req,res)=>{
    const course = req.params.course;
    if (!course) {
        return res.status(400).json({ message: "Course Name is required" });
    }
    try {
        const subjects = await query(
            `SELECT * FROM Subjects WHERE course= ?`,
            [course]
        );
        if (subjects.length === 0) {
            return res.status(404).json({ message: "No subjects found for this course" });
        }
        res.status(200).json(subjects);
    } catch (error) {
        console.error("Error fetching subjects by course:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const addCourseSubjectsSemesterWise = async (req, res) => {
    const { course_id, semester, subject_ids } = req.body;

    if (!course_id || !semester || !Array.isArray(subject_ids) || subject_ids.length === 0) {
        return res.status(400).json({ message: "Course ID, semester, and subject IDs array are required" });
    }

    try {
        // Start transaction
        await util.promisify(connDB.beginTransaction).call(connDB);

        // Remove old semester subjects
        await query(
            `DELETE FROM Course_Subjects WHERE course_id = ? AND semester = ?`,
            [course_id, semester]
        );

        // Insert new subjects
        const values = subject_ids.map(subject_id => [course_id, subject_id, semester]);
        await query(
            `INSERT INTO Course_Subjects (course_id, subject_id, semester) VALUES ?`,
            [values]
        );

        // Commit transaction
        await util.promisify(connDB.commit).call(connDB);

        res.status(201).json({ message: "Subjects for semester updated successfully" });

    } catch (error) {
        // Rollback transaction on error
        await util.promisify(connDB.rollback).call(connDB);
        console.error("Error updating semester subjects:", error);
        res.status(500).json({ message: "Server error" });
    }
};



module.exports = {adminLogin,addFaculty,addStudent,addBulkStudent,uploadAnnouncement,
    addNewCourse,getAllCourses,addNewSubject,getAllSubjects, addCourseSubjectsSemesterWise
,getAllSubjectsByCourse};