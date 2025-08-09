const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();

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
        const {name,email,course,branch,semester,year,dob,gender,contact,address}=req.body;
        const password = generateRandomPassword();
        const lastRoll = await query("SELECT MAX(roll_no) AS maxRoll FROM Student");
        let newRollNo = 1;
        if (lastRoll[0].maxRoll !== null) {
            newRollNo = lastRoll[0].maxRoll + 1;
        }
        // Send credentials to student email
        const mailSendDetails=await adminService.sendCredentials(email, name,password,"Student");
        const hashedPassword= await bcrypt.hash(mailSendDetails.password, 10);
        let result=await query(
                `INSERT INTO Student 
                 (name, email, password, roll_no, course, branch, semester, year, dob, gender, contact, address)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, email,hashedPassword, newRollNo, course, branch, semester, year, dob, gender, contact, address]
            );
            //console.log(result);
        if (result.affectedRows === 0 || mailSendDetails.success === false) {
            return res.status(500).json({ success: false, message: "Error adding student or sending email", error: mailSendDetails.error });
        }
        res.status(201).json({
            success: true,
            message: "Student added successfully",
            data: {
                student_id:result.insertId,
                roll_no:newRollNo
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
        // Parse file to structured data
        const students = await adminService.parseStudentFile(req.file.path);

        // checking are required column are present in file...
        const requiredFields = ['name', 'email', 'roll_no', 'course', 'branch', 'semester', 'year', 'dob', 'gender', 'contact', 'address'];
        for (const student of students) {
            for (const field of requiredFields) {
                if (!student[field]) {
                    return res.status(400).json({ message: `Missing field ${field} in some record` });
                }
            }
        }
        const values = [];
        let failedEmails = [];
        for (const s of students) {
            const password = generateRandomPassword();
            const mailSendDetails = await adminService.sendCredentials(s.email, s.name, password,"Student");
            if (!mailSendDetails.success) {
                failedEmails.push({ email: s.email, error: mailSendDetails.error });
                continue; // Skip this student if email sending fails
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            values.push([
                s.name, s.email, hashedPassword, s.roll_no, s.course, s.branch, s.semester, s.year, s.dob, s.gender, s.contact, s.address
            ]);
        }

        if (values.length === 0) {
            return res.status(500).json({ message: "No students added. All emails failed.", failedEmails });
        }

        const sql = `
            INSERT INTO Student
            (name, email, password, roll_no, course, branch, semester, year, dob, gender, contact, address)
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
module.exports = {adminLogin,addFaculty,addStudent,addBulkStudent};