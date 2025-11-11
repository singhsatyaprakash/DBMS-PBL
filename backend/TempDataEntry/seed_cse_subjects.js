// File: seed_cse_subjects.js
// Seeds subjects for Dept 1: Computer Science & Engineering

const connDB = require('../db/db.conn'); // Adjust path if needed
const util = require('util');
const query = util.promisify(connDB.query).bind(connDB);

const subjectsToInsert = [
    // --- Course 1: B.Tech (8 Semesters) ---
    // --- Common 1st Year (Sem 1 & 2) ---
    // branch_id: null -> Applies to all B.Tech branches (CSE, IT, CSBS)
    { subject_name: "Engineering Mathematics - I", subject_code: "BTE-101", course_id: 1, branch_id: null, semester: 1, credits: 4, description: "Calculus, matrices, and linear algebra." },
    { subject_name: "Engineering Physics", subject_code: "BTE-102", course_id: 1, branch_id: null, semester: 1, credits: 3, description: "Mechanics, optics, and quantum theory." },
    { subject_name: "Programming for Problem Solving", subject_code: "BTE-103", course_id: 1, branch_id: null, semester: 1, credits: 4, description: "C programming, loops, functions, and arrays." },
    { subject_name: "Engineering Mathematics - II", subject_code: "BTE-201", course_id: 1, branch_id: null, semester: 2, credits: 4, description: "Differential equations, vector calculus." },
    { subject_name: "Data Structures", subject_code: "BTE-202", course_id: 1, branch_id: null, semester: 2, credits: 4, description: "Stacks, queues, linked lists, trees." },

    // --- Branch 1: Computer Science and Engineering (CSE) ---
    { subject_name: "Object Oriented Programming", subject_code: "CSE-301", course_id: 1, branch_id: 1, semester: 3, credits: 4, description: "Java, classes, inheritance, polymorphism." },
    { subject_name: "Discrete Mathematics", subject_code: "CSE-302", course_id: 1, branch_id: 1, semester: 3, credits: 4, description: "Sets, graphs, logic, and combinatorics." },
    { subject_name: "Database Management Systems", subject_code: "CSE-401", course_id: 1, branch_id: 1, semester: 4, credits: 4, description: "SQL, normalization, transactions." },
    { subject_name: "Operating Systems", subject_code: "CSE-402", course_id: 1, branch_id: 1, semester: 4, credits: 4, description: "Process, memory, and file management." },
    { subject_name: "Computer Networks", subject_code: "CSE-501", course_id: 1, branch_id: 1, semester: 5, credits: 4, description: "OSI model, TCP/IP, routing." },
    { subject_name: "Theory of Computation", subject_code: "CSE-502", course_id: 1, branch_id: 1, semester: 5, credits: 3, description: "Automata, grammars, and turing machines." },
    { subject_name: "Compiler Design", subject_code: "CSE-601", course_id: 1, branch_id: 1, semester: 6, credits: 4, description: "Lexical analysis, parsing, and code generation." },
    { subject_name: "Artificial Intelligence", subject_code: "CSE-602", course_id: 1, branch_id: 1, semester: 6, credits: 3, description: "Search algorithms, machine learning basics." },
    { subject_name: "Machine Learning", subject_code: "CSE-701", course_id: 1, branch_id: 1, semester: 7, credits: 3, description: "Supervised and unsupervised learning." },
    { subject_name: "Project - I", subject_code: "CSE-70P", course_id: 1, branch_id: 1, semester: 7, credits: 5, description: "Major project phase 1." },
    { subject_name: "Project - II", subject_code: "CSE-80P", course_id: 1, branch_id: 1, semester: 8, credits: 10, description: "Major project phase 2." },

    // --- Branch 2: Information Technology (IT) ---
    { subject_name: "Web Technologies", subject_code: "IT-301", course_id: 1, branch_id: 2, semester: 3, credits: 4, description: "HTML, CSS, JavaScript, PHP." },
    { subject_name: "Software Engineering", subject_code: "IT-401", course_id: 1, branch_id: 2, semester: 4, credits: 4, description: "SDLC, Agile, Scrum." },
    { subject_name: "Data Analytics", subject_code: "IT-501", course_id: 1, branch_id: 2, semester: 5, credits: 4, description: "Data mining, visualization." },
    { subject_name: "Cloud Computing", subject_code: "IT-601", course_id: 1, branch_id: 2, semester: 6, credits: 3, description: "AWS/Azure, virtualization." },

    // --- Branch 3: Computer Science and Business Systems (CSBS) ---
    { subject_name: "Business Communication", subject_code: "CSBS-301", course_id: 1, branch_id: 3, semester: 3, credits: 3, description: "Verbal and written communication." },
    { subject_name: "Financial Management", subject_code: "CSBS-401", course_id: 1, branch_id: 3, semester: 4, credits: 4, description: "Financial statements, budgeting." },
    { subject_name: "ERP Systems", subject_code: "CSBS-501", course_id: 1, branch_id: 3, semester: 5, credits: 4, description: "SAP, Oracle, business process." },

    // --- Course 2: M.Tech (3 Semesters) ---
    // --- Branch 4: AI and Machine Learning ---
    { subject_name: "Advanced Machine Learning", subject_code: "MT-AI-101", course_id: 2, branch_id: 4, semester: 1, credits: 4, description: "Deep learning, neural networks." },
    { subject_name: "Natural Language Processing", subject_code: "MT-AI-102", course_id: 2, branch_id: 4, semester: 1, credits: 4, description: "NLP models, transformers." },
    { subject_name: "Computer Vision", subject_code: "MT-AI-201", course_id: 2, branch_id: 4, semester: 2, credits: 4, description: "Image recognition, CNNs." },
    { subject_name: "Dissertation", subject_code: "MT-AI-301", course_id: 2, branch_id: 4, semester: 3, credits: 10, description: "Thesis work." },

    // --- Branch 5: Data Science and Analytics ---
    { subject_name: "Big Data Analytics", subject_code: "MT-DSA-101", course_id: 2, branch_id: 5, semester: 1, credits: 4, description: "Hadoop, Spark, and data ecosystems." },
    { subject_name: "Data Visualization", subject_code: "MT-DSA-102", course_id: 2, branch_id: 5, semester: 1, credits: 4, description: "Tableau, PowerBI." },
    { subject_name: "Time Series Analysis", subject_code: "MT-DSA-201", course_id: 2, branch_id: 5, semester: 2, credits: 4, description: "Forecasting and modeling." },
    { subject_name: "Dissertation", subject_code: "MT-DSA-301", course_id: 2, branch_id: 5, semester: 3, credits: 10, description: "Thesis work." },

    // --- Branch 6: Cyber Security ---
    { subject_name: "Network Security", subject_code: "MT-CS-101", course_id: 2, branch_id: 6, semester: 1, credits: 4, description: "Firewalls, IDS, IPS." },
    { subject_name: "Cryptography", subject_code: "MT-CS-102", course_id: 2, branch_id: 6, semester: 1, credits: 4, description: "Encryption, hashing." },
    { subject_name: "Ethical Hacking", subject_code: "MT-CS-201", course_id: 2, branch_id: 6, semester: 2, credits: 4, description: "Penetration testing." },
    { subject_name: "Dissertation", subject_code: "MT-CS-301", course_id: 2, branch_id: 6, semester: 3, credits: 10, description: "Thesis work." },

    // --- Course 3: MCA (6 Semesters) ---
    // (Similar structure to B.Tech, but more focused)
    { subject_name: "Advanced Data Structures", subject_code: "MCA-101", course_id: 3, branch_id: null, semester: 1, credits: 4, description: "Advanced trees, graphs." },
    { subject_name: "Advanced Database Systems", subject_code: "MCA-102", course_id: 3, branch_id: null, semester: 1, credits: 4, description: "NoSQL, query optimization." },
    { subject_name: "Software Engineering Concepts", subject_code: "MCA-201", course_id: 3, branch_id: null, semester: 2, credits: 4, description: "SDLC, Agile." },
    { subject_name: "Computer Networks", subject_code: "MCA-202", course_id: 3, branch_id: null, semester: 2, credits: 4, description: "TCP/IP, routing." },

    // --- Branch 7: Software Engineering ---
    { subject_name: "Software Project Management", subject_code: "MCA-SE-301", course_id: 3, branch_id: 7, semester: 3, credits: 4, description: "Project planning, risk." },
    { subject_name: "Software Testing", subject_code: "MCA-SE-401", course_id: 3, branch_id: 7, semester: 4, credits: 4, description: "Manual and automated testing." },
    { subject_name: "DevOps", subject_code: "MCA-SE-501", course_id: 3, branch_id: 7, semester: 5, credits: 4, description: "CI/CD, Docker, Kubernetes." },
    { subject_name: "Final Project", subject_code: "MCA-SE-601", course_id: 3, branch_id: 7, semester: 6, credits: 12, description: "Final capstone project." },
];

/**
 * Inserts an array of subject objects into the database.
 */
async function bulkInsertSubjects() {
    console.log("Connecting to database (Dept: CSE)...");
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
            console.log("Inserting subjects for Dept: CSE...");
            const [result] = await query(sql, [values]);
            console.log(`Successfully inserted ${result.affectedRows} subjects for CSE.`);
        } catch (error) {
            console.error("Error bulk inserting CSE subjects:", error);
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                console.error("\nERROR: A 'course_id' or 'branch_id' does not exist. Check your 'Courses' and 'Branches' tables.");
            }
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