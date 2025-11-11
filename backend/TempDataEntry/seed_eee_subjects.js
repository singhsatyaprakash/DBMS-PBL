// File: seed_eee_subjects.js
// Seeds subjects for Dept 2: Electrical & Electronics Engineering
// (With UNIQUE subject codes)

const connDB = require('../db/db.conn'); // Adjust path if needed
const util = require('util');
const query = util.promisify(connDB.query).bind(connDB);

const subjectsToInsert = [
    // --- Course 6: B.Tech (8 Semesters) ---
    // --- Common 1st Year (Sem 1 & 2) ---
    // Codes are prefixed with 'BTEEE' to be unique from CSE's 'BTE'
    { subject_name: "Engineering Mathematics - I", subject_code: "BTEEE-101", course_id: 6, branch_id: null, semester: 1, credits: 4, description: "Calculus, matrices, and linear algebra." },
    { subject_name: "Basic Electrical Engineering", subject_code: "BTEEE-102", course_id: 6, branch_id: null, semester: 1, credits: 4, description: "DC/AC circuits, transformers." },
    { subject_name: "Engineering Mathematics - II", subject_code: "BTEEE-201", course_id: 6, branch_id: null, semester: 2, credits: 4, description: "Differential equations, vector calculus." },
    { subject_name: "Basic Electronics Engineering", subject_code: "BTEEE-202", course_id: 6, branch_id: null, semester: 2, credits: 4, description: "Diodes, transistors, and amplifiers." },

    // --- Branch 10: Electrical Engineering (EE) ---
    { subject_name: "Network Analysis", subject_code: "EE-301", course_id: 6, branch_id: 10, semester: 3, credits: 4, description: "Circuit theorems, transient analysis." },
    { subject_name: "Electrical Machines - I", subject_code: "EE-302", course_id: 6, branch_id: 10, semester: 3, credits: 4, description: "DC machines, transformers." },
    { subject_name: "Electrical Machines - II", subject_code: "EE-401", course_id: 6, branch_id: 10, semester: 4, credits: 4, description: "Induction and synchronous machines." },
    { subject_name: "Power Systems - I", subject_code: "EE-501", course_id: 6, branch_id: 10, semester: 5, credits: 4, description: "Generation, transmission." },
    { subject_name: "Control Systems", subject_code: "EE-601", course_id: 6, branch_id: 10, semester: 6, credits: 4, description: "Block diagrams, stability." },
    { subject_name: "Power Electronics", subject_code: "EE-701", course_id: 6, branch_id: 10, semester: 7, credits: 3, description: "Rectifiers, inverters, choppers." },
    { subject_name: "Project - II", subject_code: "EE-80P", course_id: 6, branch_id: 10, semester: 8, credits: 10, description: "Major project phase 2." },
    
    // --- Branch 11: Electronics and Communication Engineering (ECE) ---
    { subject_name: "Analog Electronics", subject_code: "ECE-301", course_id: 6, branch_id: 11, semester: 3, credits: 4, description: "BJTs, FETs, op-amps." },
    { subject_name: "Digital Logic Design", subject_code: "ECE-302", course_id: 6, branch_id: 11, semester: 3, credits: 4, description: "Logic gates, combinational circuits." },
    { subject_name: "Signals and Systems", subject_code: "ECE-401", course_id: 6, branch_id: 11, semester: 4, credits: 4, description: "Fourier, Laplace, Z-transforms." },
    { subject_name: "Analog Communication", subject_code: "ECE-501", course_id: 6, branch_id: 11, semester: 5, credits: 4, description: "AM, FM, PM modulation." },
    { subject_name: "Digital Communication", subject_code: "ECE-601", course_id: 6, branch_id: 11, semester: 6, credits: 4, description: "PCM, ASK, FSK, PSK." },
    { subject_name: "VLSI Design", subject_code: "ECE-701", course_id: 6, branch_id: 11, semester: 7, credits: 3, description: "MOS logic, CMOS design." },
    { subject_name: "Project - II", subject_code: "ECE-80P", course_id: 6, branch_id: 11, semester: 8, credits: 10, description: "Major project phase 2." },

    // --- Course 7: M.Tech (2 Semesters) ---
    // --- Branch 14: VLSI Design ---
    { subject_name: "Advanced VLSI Design", subject_code: "MT-VLSI-101", course_id: 7, branch_id: 14, semester: 1, credits: 4, description: "Advanced MOS, low-power design." },
    { subject_name: "Semiconductor Device Physics", subject_code: "MT-VLSI-102", course_id: 7, branch_id: 14, semester: 1, credits: 4, description: "PN junctions, BJT, MOS physics." },
    { subject_name: "Dissertation", subject_code: "MT-VLSI-201", course_id: 7, branch_id: 14, semester: 2, credits: 10, description: "Thesis work." },

    // --- Course 8: B.E. (8 Semesters) ---
    // --- Branch 16: Electrical and Electronics Engineering (EEE) ---
    { subject_name: "Power Systems - II", subject_code: "BEEE-501", course_id: 8, branch_id: 16, semester: 5, credits: 4, description: "Fault analysis, stability." },
    // --- Branch 18: Biomedical Engineering (BME) ---
    { subject_name: "Human Anatomy", subject_code: "BME-301", course_id: 8, branch_id: 18, semester: 3, credits: 3, description: "Study of the human body." },
    { subject_name: "Medical Instrumentation", subject_code: "BME-401", course_id: 8, branch_id: 18, semester: 4, credits: 4, description: "ECG, EEG, biosensors." },
];

/**
 * Inserts an array of subject objects into the database.
 */
async function bulkInsertSubjects() {
    console.log("Connecting to database (Dept: EEE)...");
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
            console.log("Inserting subjects for Dept: EEE...");
            const [result] = await query(sql, [values]);
            console.log(`Successfully inserted ${result.affectedRows} subjects for EEE.`);
        } catch (error) {
            console.error("Error bulk inserting EEE subjects:", error);
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