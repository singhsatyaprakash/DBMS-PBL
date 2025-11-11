const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();

const query = util.promisify(connDB.query).bind(connDB);

exports.loginFaculty = async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await query("SELECT * from faculty where email=?", [email]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        const isMatch = await bcrypt.compare(password, result[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: result[0].faculty_id, email: result[0].email, name: result[0].name },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        await query(
            "UPDATE faculty SET token = ? WHERE faculty_id = ?",
            [token, result[0].faculty_id]
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            role: "faculty",
        });
    }
    catch (err) {
        console.error("Login Error:", err); 
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}
exports.resetPassword = async (req, res) => {
    const { faculty_id, oldPassword, newPassword } = req.body;
    console.log(req.body);
    if (!newPassword || !oldPassword || !faculty_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        
        const result = await query("SELECT * FROM Faculty WHERE faculty_id = ?", [faculty_id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, result[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect old password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        
        await query("UPDATE Faculty SET password = ? WHERE faculty_id = ?", [hashedPassword, faculty_id]);

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.logout = async (req, res) => {
    const {token} = req.body;

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        await query('INSERT INTO blocked_tokens (token) VALUES (?)', [token]);
        
        await query('UPDATE faculty SET token = NULL WHERE token = ?', [token]);
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error during logout." });
    }
};
exports.validationWithToken=async(req,res)=>{
    const { token } = req.body;
    if(!token){
        return res.status(400).json({message:"Token not found!"});
    }
    
    try {
    
        const facultyResult = await query('SELECT * FROM faculty WHERE token = ?', [token]);
        if (facultyResult.length === 0) {
            return res.status(401).json({ message: "Invalid or expired token." });
        }

        const blockedResult = await query('SELECT * FROM blocked_tokens WHERE token = ?', [token]);
        if (blockedResult.length > 0) {
            return res.status(401).json({ message: "Token has been invalidated. Please log in again." });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token verification failed.", error: err.message });
            }
            res.status(200).json({ message: "Token is valid.", user: decoded });
        });

    } catch (error) {
        console.error("Token validation error:", error);
        res.status(500).json({ message: "Server error during token validation." });
    }
};

exports.getFaculty=async(req,res)=>{
    try{
        const result=await query('Select * from faculty');
        if(result.length===0){
            return res.status(404).json({message:"No faculty found"});
        }
        return res.status(200).json({
            message:"Faculty retrieved successfully",
            faculty:result
        });
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}

exports.getFacultyById=async(req,res)=>{
    const {id}=req.params;
    try{
        const result=await query('Select * from faculty where faculty_id=?',[id]);
        if(result.length===0){
            return res.status(404).json({message:"No faculty found"});
        }
        delete result[0].password;
        return res.status(200).json({
            message:"Faculty retrieved successfully",
            faculty:result[0]
        });
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}


exports.getMyAssignedSubjects = async (req, res) => {
    
    const { facultyId } = req.query; // Or from req.faculty.id if using auth

    if (!facultyId) {
        return res.status(401).json({ message: "Authentication error: Faculty ID not found." });
    }
    const session_year = req.query.session || '2025-2026';

    try {
        const subjects = await query(
            `SELECT 
                sf.sf_id,
                sf.session_year,
                subj.subject_id,  --  <--- ADD THIS LINE
                subj.subject_name, 
                subj.subject_code, 
                subj.semester,
                c.course_id,
                c.course_name,
                cb.branch_id,
                cb.branch_name
            FROM 
                SubjectFaculty sf
            JOIN 
                Subjects subj ON sf.subject_id = subj.subject_id
            JOIN 
                Courses c ON subj.course_id = c.course_id
            LEFT JOIN 
                Course_Branch cb ON subj.branch_id = cb.branch_id
            WHERE 
                sf.faculty_id = ?
                AND sf.session_year = ?
            ORDER BY 
                c.course_name, subj.semester, subj.subject_name`,
            [facultyId, session_year]
        );

        return res.status(200).json(subjects);

    } catch (err) {
        console.error("Error fetching faculty's subjects:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getTotalStudents = async (req, res) => {
    const { facultyId } = req.query;
    const session_year = req.query.session || '2025-2026'; // Match session

    if (!facultyId) {
        return res.status(400).json({ message: "Faculty ID is required" });
    }

    try {
        // This query finds all unique students enrolled in the courses
        // this faculty is assigned to for the current session.
        const [result] = await query(
            `SELECT COUNT(DISTINCT s.student_id) AS totalStudents
             FROM Student s
             JOIN Subjects subj ON s.course_id = subj.course_id 
                               AND s.semester = subj.semester 
                               AND (s.branch_id <=> subj.branch_id OR subj.branch_id IS NULL)
             JOIN SubjectFaculty sf ON subj.subject_id = sf.subject_id
             WHERE sf.faculty_id = ? AND sf.session_year = ?`,
            [facultyId, session_year]
        );
        console.log(result);
        res.status(200).json(result); // Returns { totalStudents: X }

    } catch (err) {
        console.error("Error fetching total students for faculty:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Mark Attendance
// const { query } = require('../db/db.conn'); // Make sure query is imported

exports.markAttendance = async (req, res) => {
    // 'faculty_subject_id' is the variable name from the frontend
    // It contains the 'sf_id' value
    const { faculty_subject_id, date, attendance } = req.body;

    if (!faculty_subject_id || !date || !attendance || !Array.isArray(attendance)) {
        return res.status(400).json({ message: "faculty_subject_id (sf_id), date, and attendance array are required" });
    }

    try {
        // Loop through each student record in the 'attendance' array
        for (const record of attendance) {
            const { student_id, status } = record;

            if (!student_id || !status) {
                console.warn("Skipping invalid attendance record:", record);
                continue; // Skip invalid record
            }

            // --- THE FIX ---
            // Insert into the 'sf_id' column, using the 'faculty_subject_id' variable
            await query(
                `INSERT INTO Attendance (sf_id, student_id, date, status)
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE status = VALUES(status)`,
                [faculty_subject_id, student_id, date, status]
            );
            // --- END OF FIX ---
        }

        return res.status(200).json({ message: "Attendance marked successfully" });

    } catch (err) {
        console.error("Error marking attendance:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getAnnouncement = async (req, res) => {
    try {
        const announcements = await query(
            "SELECT * FROM Announcement ORDER BY created_at DESC"
        );

        if (announcements.length === 0) {
            return res.status(404).json({ message: "No announcements found" });
        }

        return res.status(200).json(announcements);
    } catch (err) {
        console.error("Error fetching announcements:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getStudentsForSubject = async (req, res) => {
    console.log(req.query);
    const { course_id, semester, branch_id } = req.query; 

    if (!course_id || !semester) {
        return res.status(400).json({ message: "Course ID and Semester are required" });
    }

    try {
        // Build SQL dynamically so branch_id is optional
        let sql = `
            SELECT *
            FROM Student
            WHERE course_id = ?
              AND semester = ?
        `;
        const params = [course_id, semester];

        if (branch_id !== undefined && branch_id !== null && String(branch_id).trim() !== '') {
            sql += ` AND branch_id = ?`;
            params.push(branch_id);
        }

        const students = await query(sql, params);

        if (students.length === 0) {
            return res.status(200).json([]);
        }

        const formattedStudents = students.map(s => ({
            id: s.student_id,
            studentId: s.student_id,
            universityId: s.university_id,
            name: s.name,
            fatherName: s.father_name,
            status: 'present'
        }));

        res.status(200).json(formattedStudents);

    } catch (err) {
        console.error("Error fetching students for subject:", err); 
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getAttendanceSummary = async (req, res) => {
    const { sf_id } = req.params; // This is the faculty_subject_id

    try {
        // 1. Get the total number of lectures held for this class
        const [totalResult] = await query(
            `SELECT COUNT(DISTINCT date) AS totalLectures 
             FROM Attendance 
             WHERE faculty_subject_id = ?`,
            [sf_id]
        );
        const totalLectures = totalResult[0]?.totalLectures || 0;

        // 2. Get the attended count for each student in that class
        const [studentStats] = await query(
            `SELECT 
                s.student_id, 
                s.name, 
                s.university_id, 
                COUNT(a.date) AS attendedLectures
            FROM Attendance a
            JOIN Student s ON a.student_id = s.student_id
            WHERE a.faculty_subject_id = ?
              AND a.status = 'present'
            GROUP BY s.student_id, s.name, s.university_id
            ORDER BY s.university_id`,
            [sf_id]
        );

        // 3. Combine the data to send to the frontend
        const summary = {
            totalLectures: totalLectures,
            students: studentStats.map(stat => ({
                ...stat,
                percentage: totalLectures > 0 
                    ? parseFloat(((stat.attendedLectures / totalLectures) * 100).toFixed(1))
                    : 0
            }))
        };

        res.status(200).json(summary);

    } catch (err) {
        console.error("Error fetching attendance summary:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};