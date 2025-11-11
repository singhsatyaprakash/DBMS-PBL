// File: seed_mgmt_subjects.js
// Seeds subjects for Dept 5: Management Studies

const connDB = require('../db/db.conn'); // Adjust path if needed
const util = require('util');
const query = util.promisify(connDB.query).bind(connDB);

const subjectsToInsert = [
    // --- Course 15: MBA (4 Semesters) ---
    // --- Common 1st Year (Sem 1 & 2) ---
    // branch_id: null -> Applies to all MBA branches (FA, MM, HRM)
    { subject_name: "Principles of Management", subject_code: "MBA-101", course_id: 15, branch_id: null, semester: 1, credits: 3, description: "Planning, organizing, staffing, controlling." },
    { subject_name: "Managerial Economics", subject_code: "MBA-102", course_id: 15, branch_id: null, semester: 1, credits: 3, description: "Micro and macro-economic principles." },
    { subject_name: "Financial Accounting", subject_code: "MBA-103", course_id: 15, branch_id: null, semester: 1, credits: 3, description: "Balance sheets, P&L statements." },
    { subject_name: "Business Statistics", subject_code: "MBA-104", course_id: 15, branch_id: null, semester: 1, credits: 3, description: "Data analysis, probability." },
    { subject_name: "Marketing Management", subject_code: "MBA-201", course_id: 15, branch_id: null, semester: 2, credits: 3, description: "Market segmentation, 4 Ps." },
    { subject_name: "Human Resource Management", subject_code: "MBA-202", course_id: 15, branch_id: null, semester: 2, credits: 3, description: "Recruitment, training, compensation." },
    { subject_name: "Corporate Finance", subject_code: "MBA-203", course_id: 15, branch_id: null, semester: 2, credits: 3, description: "Capital budgeting, working capital." },
    { subject_name: "Operations Management", subject_code: "MBA-204", course_id: 15, branch_id: null, semester: 2, credits: 3, description: "Supply chain, quality control." },

    // --- Branch 37: Finance and Accounting (FA) ---
    { subject_name: "Investment Analysis", subject_code: "MBA-FA-301", course_id: 15, branch_id: 37, semester: 3, credits: 3, description: "Equity, bonds, portfolio theory." },
    { subject_name: "Financial Derivatives", subject_code: "MBA-FA-302", course_id: 15, branch_id: 37, semester: 3, credits: 3, description: "Futures, options, and swaps." },
    { subject_name: "International Finance", subject_code: "MBA-FA-401", course_id: 15, branch_id: 37, semester: 4, credits: 3, description: "Foreign exchange markets." },
    { subject_name: "Corporate Valuation", subject_code: "MBA-FA-402", course_id: 15, branch_id: 37, semester: 4, credits: 3, description: "Mergers and acquisitions." },

    // --- Branch 38: Marketing Management (MM) ---
    { subject_name: "Consumer Behavior", subject_code: "MBA-MM-301", course_id: 15, branch_id: 38, semester: 3, credits: 3, description: "Buying process, consumer psychology." },
    { subject_name: "Digital Marketing", subject_code: "MBA-MM-302", course_id: 15, branch_id: 38, semester: 3, credits: 3, description: "SEO, SEM, social media." },
    { subject_name: "Sales and Distribution", subject_code: "MBA-MM-401", course_id: 15, branch_id: 38, semester: 4, credits: 3, description: "Sales force management." },
    { subject_name: "Brand Management", subject_code: "MBA-MM-402", course_id: 15, branch_id: 38, semester: 4, credits: 3, description: "Brand equity, positioning." },

    // --- Branch 39: Human Resource Management (HRM) ---
    { subject_name: "Performance Management", subject_code: "MBA-HRM-301", course_id: 15, branch_id: 39, semester: 3, credits: 3, description: "Appraisal systems, MBO." },
    { subject_name: "Training and Development", subject_code: "MBA-HRM-302", course_id: 15, branch_id: 39, semester: 3, credits: 3, description: "Needs analysis, evaluation." },
    { subject_name: "Labor Laws", subject_code: "MBA-HRM-401", course_id: 15, branch_id: 39, semester: 4, credits: 3, description: "Industrial relations, disputes." },
    { subject_name: "Compensation Management", subject_code: "MBA-HRM-402", course_id: 15, branch_id: 39, semester: 4, credits: 3, description: "Wage, salary, incentives." },

    // --- Course 16: BBA (6 Semesters) ---
    { subject_name: "Principles of Microeconomics", subject_code: "BBA-101", course_id: 16, branch_id: null, semester: 1, credits: 3, description: "Supply, demand, markets." },
    { subject_name: "Business Communication", subject_code: "BBA-102", course_id: 16, branch_id: null, semester: 1, credits: 3, description: "Writing and presentation." },
    { subject_name: "Principles of Macroeconomics", subject_code: "BBA-201", course_id: 16, branch_id: null, semester: 2, credits: 3, description: "GDP, inflation, monetary policy." },
    { subject_name: "Cost Accounting", subject_code: "BBA-301", course_id: 16, branch_id: null, semester: 3, credits: 4, description: "Costing methods." },
    { subject_name: "Business Law", subject_code: "BBA-401", course_id: 16, branch_id: null, semester: 4, credits: 4, description: "Contracts, company law." },
    // --- Branch 40: Business Analytics (BA) ---
    { subject_name: "Data Visualization", subject_code: "BBA-BA-501", course_id: 16, branch_id: 40, semester: 5, credits: 4, description: "Tableau, PowerBI." },
    { subject_name: "Predictive Analytics", subject_code: "BBA-BA-601", course_id: 16, branch_id: 40, semester: 6, credits: 4, description: "Regression models." },
];

/**
 * Inserts an array of subject objects into the database.
 */
async function bulkInsertSubjects() {
    console.log("Connecting to database (Dept: MGMT)...");
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
            console.log("Inserting subjects for Dept: MGMT...");
            const [result] = await query(sql, [values]);
            console.log(`Successfully inserted ${result.affectedRows} subjects for MGMT.`);
        } catch (error) {
            console.error("Error bulk inserting MGMT subjects:", error);
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