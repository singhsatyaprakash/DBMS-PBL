// File: seed_civil_subjects.js
// Seeds subjects for Dept 4: Civil Engineering
// (With UNIQUE subject codes)

const connDB = require('../db/db.conn'); // Adjust path if needed
const util = require('util');
const query = util.promisify(connDB.query).bind(connDB);

const subjectsToInsert = [
    // --- Course 12: B.Tech (8 Semesters) ---
    // --- Common 1st Year (Sem 1 & 2) ---
    // Codes are prefixed with 'BTCIVIL' to be unique
    { subject_name: "Engineering Mathematics - I", subject_code: "BTCIVIL-101", course_id: 12, branch_id: null, semester: 1, credits: 4, description: "Calculus, matrices." },
    { subject_name: "Basic Civil Engineering", subject_code: "BTCIVIL-102", course_id: 12, branch_id: null, semester: 1, credits: 4, description: "Materials, surveying." },
    { subject_name: "Engineering Mechanics", subject_code: "BTCIVIL-201", course_id: 12, branch_id: null, semester: 2, credits: 4, description: "Statics, dynamics." },

    // --- Branch 28: Civil Engineering (CE) ---
    { subject_name: "Strength of Materials", subject_code: "CE-301", course_id: 12, branch_id: 28, semester: 3, credits: 4, description: "Stress, strain, bending." },
    { subject_name: "Surveying", subject_code: "CE-302", course_id: 12, branch_id: 28, semester: 3, credits: 4, description: "Chain, compass, levelling." },
    { subject_name: "Fluid Mechanics", subject_code: "CE-401", course_id: 12, branch_id: 28, semester: 4, credits: 4, description: "Fluid properties, flow analysis." },
    { subject_name: "Structural Analysis - I", subject_code: "CE-402", course_id: 12, branch_id: 28, semester: 4, credits: 4, description: "Beams, trusses." },
    { subject_name: "Geotechnical Engineering - I", subject_code: "CE-501", course_id: 12, branch_id: 28, semester: 5, credits: 4, description: "Soil properties." },
    { subject_name: "Concrete Technology", subject_code: "CE-502", course_id: 12, branch_id: 28, semester: 5, credits: 4, description: "Mix design, testing." },
    { subject_name: "Design of Concrete Structures", subject_code: "CE-601", course_id: 12, branch_id: 28, semester: 6, credits: 4, description: "RCC design, beams, slabs." },
    { subject_name: "Transportation Engineering", subject_code: "CE-602", course_id: 12, branch_id: 28, semester: 6, credits: 4, description: "Highway design." },
    { subject_name: "Water Resources Engineering", subject_code: "CE-701", course_id: 12, branch_id: 28, semester: 7, credits: 3, description: "Hydrology, irrigation." },
    { subject_name: "Project - II", subject_code: "CE-80P", course_id: 12, branch_id: 28, semester: 8, credits: 10, description: "Major project phase 2." },

    // --- Course 13: M.Tech (1 Semester - as per data, likely 2-4) ---
    // Assuming 2 semesters for this example
    // --- Branch 31: Structural Engineering (SE) ---
    { subject_name: "Advanced Structural Analysis", subject_code: "MT-SE-101", course_id: 13, branch_id: 31, semester: 1, credits: 4, description: "Matrix methods, FEM." },
    { subject_name: "Earthquake Engineering", subject_code: "MT-SE-102", course_id: 13, branch_id: 31, semester: 1, credits: 4, description: "Seismic design." },
    { subject_name: "Dissertation", subject_code: "MT-SE-201", course_id: 13, branch_id: 31, semester: 2, credits: 10, description: "Thesis work." }, // Added Sem 2

    // --- Course 14: B.E. (8 Semesters) ---
    // --- Branch 34: Construction Engineering and Management (CEM) ---
    { subject_name: "Construction Planning", subject_code: "CEM-501", course_id: 14, branch_id: 34, semester: 5, credits: 4, description: "CPM, PERT." },
    { subject_name: "Project Management", subject_code: "CEM-601", course_id: 14, branch_id: 34, semester: 6, credits: 4, description: "Cost estimation, contracts." },
];

/**
 * Inserts an array of subject objects into the database.
 */
async function bulkInsertSubjects() {
    console.log("Connecting to database (Dept: CIVIL)...");
    connDB.connect(async (err) => {
        if (err) {
            console.error('Database connection failed:', err);
            return;
        }
        console.log('Connected to the database.');

        if (!subjectsToInsert || subjectsToInsert.length === 0) {
            console.log("No subjects to insert.");
            connDB.end();
            return;
        }

        const values = subjectsToInsert.map(s => [
            s.subject_name, s.subject_code, s.semester, s.credits, s.description, s.course_id, s.branch_id
        ]);

        const sql = `
            INSERT INTO Subjects 
            (subject_name, subject_code, semester, credits, description, course_id, branch_id) 
            VALUES ?
        `;

        try {
            console.log("Inserting subjects for Dept: CIVIL...");
            const [result] = await query(sql, [values]);
            console.log(`Successfully inserted ${result.affectedRows} subjects for CIVIL.`);
        } catch (error) {
            console.error("Error bulk inserting CIVIL subjects:", error);
        } finally {
            connDB.end((err) => {
                if(err) console.error("Error closing connection:", err);
                else console.log("Database connection closed.");
            });
        }
    });
}

// --- Run the script ---
bulkInsertSubjects();