const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();

const query = util.promisify(connDB.query).bind(connDB);

exports.loginStudent = async (req, res) => {
    const {email ,password}=req.body;
    console.log(req.body);
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try{
        const result= await query("SELECT * from student where email=?",[email]);
        if(result.length===0){
            return res.status(404).json({message:"Student not found"});
        }
        const isMatch=await bcrypt.compare(password,result[0].password);
        if(!isMatch){
            console.log("Password not matched...")
            return res.status(401).json({message:"Invalid credentials"});
        }
        const studentData = {id:result[0].student_id,email:result[0].email,name:result[0].name};
        const token=jwt.sign(
            studentData,
            process.env.JWT_SECRET_KEY,
            {expiresIn:'1h'}
        );
        
        await query("UPDATE student SET token = ? WHERE student_id = ?", [token, result[0].student_id]);

        return res.status(200).json({
            message:"Login successful",
            token,
            role:"student",
        });
    }
    catch(err){
        console.error("Student login error:", err);
        return res.status(500).json({message:"Server error",error:err.message});
    }
}
exports.studentLogout = async (req, res) => {
    const {token} = req.body;

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        await query('INSERT INTO blocked_tokens (token) VALUES (?)', [token]);
        
        await query('UPDATE student SET token = NULL WHERE token = ?', [token]);
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error during logout." });
    }
};
exports.resetPassword = async (req, res) => {
    const { student_id, oldPassword, newPassword } = req.body;

    if (!newPassword || !oldPassword || !student_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        
        const result = await query("SELECT * FROM Student WHERE student_id = ?", [student_id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, result[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect old password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        
        await query("UPDATE Student SET password = ? WHERE student_id = ?", [hashedPassword, student_id]);

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.validationWithToken=async(req,res)=>{
    const { token } = req.body;
    if(!token){
        return res.status(400).json({message:"Token not found!"});
    }
    
    try {
    
        const studentResult = await query('SELECT * FROM student WHERE token = ?', [token]);
        if (studentResult.length === 0) {
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
exports.getProfileWithToken = async (req, res) => {
    const { token } = req.query;
    console.log("reaching");
    if (!token) {
        return res.status(400).json({ 
            success: false, 
            message: "Authentication token is required." 
        });
    }

    try {
        const sql = 'SELECT student_id, name, email FROM student WHERE token = ?';
        const results = await query(sql, [token]);
        if (results.length > 0) {
            const studentProfile = results[0];
            return res.status(200).json({
                success: true,
                message: "Student profile found!",
                student: studentProfile
            });
        } else {
            return res.status(404).json({ 
                success: false, 
                message: "Student not found or token is invalid." 
            });
        }
    } catch (error) {
        console.error("Error fetching student profile by token:", error);
        return res.status(500).json({ 
            success: false, 
            message: "An internal server error occurred." 
        });
    }
};
exports.getProfileById=async(req,res)=>{
    const studentID=req.params.student_id;
    if(!studentID){
        return res.status(400).json({message:"Required Student ID"});
    }
    try{
        const result=await query('SELECT * FROM Student Where student_id=?',[studentID]);
        if(result.length===0){
            return res.status(404).json({message:"Student not found"});
        }
        return res.status(200).json({result});
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}
exports.getProfile=async(req,res)=>{
    const {email}=req.query;
    if(!email){
        return res.status(400).json({message:"Email id required."})
    }
    try{
        const sql='Select * from student where email=?';
        const result=await query(sql,[email]);
        console.log(result);
        if(result.length===0){
            return res.status(401).json({message:"Student not found"});
        }

        const student=result[0];
        delete student.password;
        //after fetech the data fetech the course with course id and fetech 
        return res.status(200).json({message:"Student data fetech sucessfully",student});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({mesaage:"Internal Server error",error:err.mesg})
    }
}





exports.currentSubject = async (req, res) => {
    // 1. Read from req.query to match the frontend's axios params
    const { course_id, branch_id, semester } = req.query;
    console.log("Fetching subjects for:", req.query);

    // 2. Validate the essential parameters
    if (!course_id || !semester) {
        return res.status(400).json({ message: "Course ID and Semester are required" });
    }

    try {
        // 3. Corrected SQL Query
        // We start from the 'Subjects' table, which has course, semester, and branch.
        // Then we find the faculty assigned using 'SubjectFaculty'.
        const subjects = await query(
            `SELECT 
                subj.subject_id, 
                subj.subject_name, 
                subj.subject_code, 
                f.name AS faculty_name,
                sf.sf_id,
                f.faculty_id
             FROM 
                Subjects subj
             JOIN 
                SubjectFaculty sf ON subj.subject_id = sf.subject_id
             JOIN 
                Faculty f ON sf.faculty_id = f.faculty_id
             WHERE 
                subj.course_id = ? 
                AND subj.semester = ?
                AND (subj.branch_id <=> ? OR subj.branch_id IS NULL)
             ORDER BY
                subj.subject_name`,
            [course_id, semester, branch_id || null] // Pass params in order
        );

        if (subjects.length === 0) {
            // This is not an error, just no subjects found
            console.log("No subjects found for this combination.");
            return res.status(200).json([]); 
        }

        // 4. Return the array of subjects directly
        return res.status(200).json(subjects);

    } catch (err) {
        console.error("Error fetching current subjects:", err); // Log the full error
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getAnnouncement = async (req, res) => {
    try {
        const [announcements] = await db.query(
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



// exports.getMyAttendance = async (req, res) => {
//     const { studentId } = req.params;
//     // console.log(studentId)
//     const session_year = '2025-2026';
//     if (!studentId) {
//         return res.status(400).json({ message: "Student ID is required in query parameters" });
//     }

//     try {
//         const studentDetails = await query(
//             `SELECT course_id, branch_id, semester
//              FROM Student
//              WHERE student_id = ?`,
//             [studentId]
//         );
//         // console.log(studentDetails);

//         if (!studentDetails || studentDetails.length === 0) {
//             return res.status(404).json({ message: "Student not found" });
//         }
//         const { course_id, branch_id, semester } = studentDetails[0];
//         // console.log(studentDetails[0])
//         const subjects = await query(
//             `SELECT 
//                 subj.subject_id, 
//                 subj.subject_name, 
//                 subj.subject_code, 
//                 f.name AS faculty_name,
//                 sf.sf_id,
//                 f.faculty_id
//              FROM 
//                 Subjects subj
//              JOIN 
//                 SubjectFaculty sf ON subj.subject_id = sf.subject_id
//              JOIN 
//                 Faculty f ON sf.faculty_id = f.faculty_id
//              WHERE 
//                 subj.course_id = ? 
//                 AND subj.semester = ?
//                 AND (subj.branch_id <=> ? OR subj.branch_id IS NULL)
//              ORDER BY
//                 subj.subject_name`,
//             [course_id, semester, branch_id || null] // Pass params in order
//         );
//         console.log(subjects);
//         //on the basis of sf_id count the attedance for each subject if no one data found it means that 0/0 means 100% attendance
// //         [
// //   RowDataPacket {
// //     subject_id: 1,
// //     subject_name: 'Engineering Mathematics - I',
// //     subject_code: 'BTE-101',
// //     faculty_name: 'Satya Prakash Singh',
// //     sf_id: 1,
// //     faculty_id: 1
// //   },
// //   RowDataPacket {
// //     subject_id: 2,
// //     subject_name: 'Engineering Physics',
// //     subject_code: 'BTE-102',
// //     faculty_name: 'Yash Rai',
// //     sf_id: 2,
// //     faculty_id: 2
// //   },
// //   RowDataPacket {
// //     subject_id: 3,
// //     subject_name: 'Programming for Problem Solving',
// //     subject_code: 'BTE-103',
// //     faculty_name: 'Dr. Meera Sharma',
// //     sf_id: 3,
// //     faculty_id: 4
// //   }
// // ]

//     } catch (err) {
//         console.error("Error fetching student attendance:", err);
//         return res.status(500).json({ message: "Server error", error: err.message });
//     }
// };

exports.getMyAttendance = async (req, res) => {
    const { studentId } = req.params;
    const session_year = '2025-2026'; // This is important for filtering subjects

    if (!studentId) {
        return res.status(400).json({ message: "Student ID is required in query parameters" });
    }

    try {
        // 1. Get Student Details
        const studentDetails = await query(
            `SELECT course_id, branch_id, semester
             FROM Student
             WHERE student_id = ?`,
            [studentId]
        );

        if (!studentDetails || studentDetails.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        const { course_id, branch_id, semester } = studentDetails[0];

        // 2. Get all subjects AND their attendance stats in one query
        const attendanceStats = await query(
            `SELECT 
                subj.subject_id, 
                subj.subject_name, 
                subj.subject_code, 
                f.name AS faculty_name,
                sf.sf_id,
                f.faculty_id,

                -- Subquery to get total classes held for this subject (sf_id)
                (SELECT COUNT(DISTINCT date) 
                 FROM Attendance a 
                 WHERE a.sf_id = sf.sf_id) AS totalLectures,
                
                -- Subquery to get classes attended by this specific student
                (SELECT COUNT(*) 
                 FROM Attendance a 
                 WHERE a.sf_id = sf.sf_id 
                   AND a.student_id = ? 
                   AND a.status = 'present') AS attendedLectures
            FROM 
                Subjects subj
            JOIN 
                SubjectFaculty sf ON subj.subject_id = sf.subject_id
            JOIN 
                Faculty f ON sf.faculty_id = f.faculty_id
            WHERE 
                subj.course_id = ? 
                AND subj.semester = ?
                AND (subj.branch_id <=> ? OR subj.branch_id IS NULL)
                AND sf.session_year = ? -- Filter by session year
            ORDER BY
                subj.subject_name`,
            // Parameters must be in the order of the '?' marks
            [studentId, course_id, semester, branch_id || null, session_year] 
        );

        // 3. Process the results to calculate percentage
        const finalAttendance = attendanceStats.map(stat => {
            let percentage = 100; // Default to 100% (for the 0/0 case)

            if (stat.totalLectures > 0) {
                percentage = (stat.attendedLectures / stat.totalLectures) * 100;
            }

            return {
                subject_id: stat.subject_id,
                subject_name: stat.subject_name,
                subject_code: stat.subject_code,
                faculty_name: stat.faculty_name,
                sf_id: stat.sf_id,
                totalLectures: stat.totalLectures,
                attendedLectures: stat.attendedLectures,
                percentage: Math.round(percentage) // Round to nearest whole number
            };
        });

        console.log(finalAttendance);
        res.status(200).json(finalAttendance);

    } catch (err) {
        console.error("Error fetching student attendance:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};