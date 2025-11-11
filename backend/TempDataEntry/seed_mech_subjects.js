// File: seed_mech_subjects.js
// Seeds subjects for Dept 3: Mechanical Engineering
// (With UNIQUE subject codes)

const connDB = require('../db/db.conn'); // Adjust path if needed
const util = require('util');
const query = util.promisify(connDB.query).bind(connDB);

const subjectsToInsert = [
    // --- Course 9: B.Tech (6 Semesters) ---
    // --- Common 1st Year (Sem 1 & 2) ---
    // Codes are prefixed with 'BTMECH' to be unique
    { subject_name: "Engineering Mathematics - I", subject_code: "BTMECH-101", course_id: 9, branch_id: null, semester: 1, credits: 4, description: "Calculus, matrices." },
    { subject_name: "Engineering Mechanics", subject_code: "BTMECH-102", course_id: 9, branch_id: null, semester: 1, credits: 4, description: "Statics, dynamics." },
    { subject_name: "Engineering Drawing", subject_code: "BTMECH-201", course_id: 9, branch_id: null, semester: 2, credits: 4, description: "Projections, CAD." },
    { subject_name: "Workshop Practice", subject_code: "BTMECH-202", course_id: 9, branch_id: null, semester: 2, credits: 3, description: "Fitting, welding, machining." },

    // --- Branch 19: Mechanical Engineering (ME) ---
    { subject_name: "Thermodynamics", subject_code: "ME-301", course_id: 9, branch_id: 19, semester: 3, credits: 4, description: "Laws of thermodynamics, cycles." },
    { subject_name: "Strength of Materials", subject_code: "ME-302", course_id: 9, branch_id: 19, semester: 3, credits: 4, description: "Stress, strain, bending." },
    { subject_name: "Fluid Mechanics", subject_code: "ME-401", course_id: 9, branch_id: 19, semester: 4, credits: 4, description: "Fluid properties, flow analysis." },
    { subject_name: "Theory of Machines", subject_code: "ME-402", course_id: 9, branch_id: 19, semester: 4, credits: 4, description: "Gears, cams, governors." },
    { subject_name: "Heat Transfer", subject_code: "ME-501", course_id: 9, branch_id: 19, semester: 5, credits: 4, description: "Conduction, convection, radiation." },
    { subject_name: "Machine Design", subject_code: "ME-502", course_id: 9, branch_id: 19, semester: 5, credits: 4, description: "Design of joints, shafts, gears." },
    { subject_name: "Major Project", subject_code: "ME-601", course_id: 9, branch_id: 19, semester: 6, credits: 10, description: "Final year project." },

    // --- Branch 20: Automobile Engineering (AE) ---
    { subject_name: "Automotive Engines", subject_code: "AE-301", course_id: 9, branch_id: 20, semester: 3, credits: 4, description: "IC engines, combustion." },
    { subject_name: "Automotive Chassis", subject_code: "AE-401", course_id: 9, branch_id: 20, semester: 4, credits: 4, description: "Suspension, brakes, steering." },
    { subject_name: "Vehicle Dynamics", subject_code: "AE-501", course_id: 9, branch_id: 20, semester: 5, credits: 4, description: "Handling, ride comfort." },

    // --- Course 10: M.Tech (4 Semesters) ---
    // --- Branch 22: Thermal Engineering (TE) ---
    { subject_name: "Advanced Thermodynamics", subject_code: "MT-TE-101", course_id: 10, branch_id: 22, semester: 1, credits: 4, description: "Advanced cycles." },
    { subject_name: "Advanced Heat Transfer", subject_code: "MT-TE-102", course_id: 10, branch_id: 22, semester: 1, credits: 4, description: "Boiling, condensation." },
    { subject_name: "Refrigeration & Air Conditioning", subject_code: "MT-TE-201", course_id: 10, branch_id: 22, semester: 2, credits: 4, description: "HVAC systems." },
    { subject_name: "Dissertation - I", subject_code: "MT-TE-301", course_id: 10, branch_id: 22, semester: 3, credits: 8, description: "Thesis work phase 1." },
    { subject_name: "Dissertation - II", subject_code: "MT-TE-401", course_id: 10, branch_id: 22, semester: 4, credits: 12, description: "Thesis work phase 2." },

    // --- Course 11: B.E. (8 Semesters) ---
    // --- Branch 27: Aerospace Engineering (ASE) ---
    { subject_name: "Introduction to Aerospace", subject_code: "ASE-301", course_id: 11, branch_id: 27, semester: 3, credits: 3, description: "History, fundamentals." },
    { subject_name: "Aerodynamics", subject_code: "ASE-401", course_id: 11, branch_id: 27, semester: 4, credits: 4, description: "Airfoil theory, compressible flow." },
    { subject_name: "Aircraft Structures", subject_code: "ASE-501", course_id: 11, branch_id: 27, semester: 5, credits: 4, description: "Stress analysis of fuselage." },
    { subject_name: "Flight Mechanics", subject_code: "ASE-601", course_id: 11, branch_id: 27, semester: 6, credits: 4, description: "Aircraft performance." },
    { subject_name: "Propulsion", subject_code: "ASE-701", course_id: 11, branch_id: 27, semester: 7, credits: 3, description: "Jet engines, rocket propulsion." },
];

/**
 * Inserts an array of subject objects into the database.
 */
async function bulkInsertSubjects() {
    console.log("Connecting to database (Dept: MECH)...");
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
            console.log("Inserting subjects for Dept: MECH...");
            const [result] = await query(sql, [values]);
            console.log(`Successfully inserted ${result.affectedRows} subjects for MECH.`);
        } catch (error) {
            console.error("Error bulk inserting MECH subjects:", error);
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