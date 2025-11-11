/**
 * -----------------------------------------------------------------
 * FACULTY-SUBJECT MAPPING DATA (Session 2025-2026)
 * -----------------------------------------------------------------
 * This list contains all 162 subjects from your images, mapped to
 * the 30 faculty members based on their departments.
 */

// --- Faculty Rosters by Dept ID for assignments ---
const cs_faculty = [1, 4, 9, 14, 19, 24, 29];       // Dept 1: CS/IT/AI (7 faculty)
const ee_faculty = [2, 8, 13, 18, 23, 28];       // Dept 2: E&E/ECE (6 faculty)
const mech_faculty = [5, 10, 15, 20, 25, 30];    // Dept 3: Mech/Auto (6 faculty)
const civil_faculty = [7, 12, 17, 22, 27];      // Dept 4: Civil (5 faculty)
const mgmt_faculty = [3, 6, 11, 16, 21, 26];    // Dept 5: Mgmt/BBA (6 faculty)
const session_year = '2025-2026';

const subjectFacultyMappings = [
    // --- Subjects 1-15 (BTECH CS&E) -> Mapped to CS Faculty ---
    { subject_id: 1, faculty_id: cs_faculty[0], session_year }, // Eng. Mathematics - I
    { subject_id: 2, faculty_id: ee_faculty[0], session_year }, // Eng. Physics (assigning E&E)
    { subject_id: 3, faculty_id: cs_faculty[1], session_year }, // Programming for Problem Solving
    { subject_id: 4, faculty_id: cs_faculty[2], session_year }, // Eng. Mathematics - II
    { subject_id: 5, faculty_id: cs_faculty[3], session_year }, // Data Structures
    { subject_id: 6, faculty_id: cs_faculty[4], session_year }, // Object Oriented Programming
    { subject_id: 7, faculty_id: cs_faculty[5], session_year }, // Discrete Mathematics
    { subject_id: 8, faculty_id: cs_faculty[6], session_year }, // Database Management Systems
    { subject_id: 9, faculty_id: cs_faculty[0], session_year }, // Operating Systems
    { subject_id: 10, faculty_id: cs_faculty[1], session_year }, // Computer Networks
    { subject_id: 11, faculty_id: cs_faculty[2], session_year }, // Theory of Computation
    { subject_id: 12, faculty_id: cs_faculty[3], session_year }, // Compiler Design
    { subject_id: 13, faculty_id: cs_faculty[4], session_year }, // Artificial Intelligence
    { subject_id: 14, faculty_id: cs_faculty[5], session_year }, // Machine Learning
    { subject_id: 15, faculty_id: cs_faculty[6], session_year }, // Project - I

    // --- Subjects 16-30 (CS/IT/AI/DSA) -> Mapped to CS Faculty ---
    { subject_id: 16, faculty_id: cs_faculty[0], session_year }, // Project - II
    { subject_id: 17, faculty_id: cs_faculty[1], session_year }, // Web Technologies
    { subject_id: 18, faculty_id: cs_faculty[2], session_year }, // Software Engineering
    { subject_id: 19, faculty_id: cs_faculty[3], session_year }, // Data Analytics
    { subject_id: 20, faculty_id: cs_faculty[4], session_year }, // Cloud Computing
    { subject_id: 21, faculty_id: mgmt_faculty[0], session_year }, // Business Communication (Mgmt)
    { subject_id: 22, faculty_id: mgmt_faculty[1], session_year }, // Financial Management (Mgmt)
    { subject_id: 23, faculty_id: mgmt_faculty[2], session_year }, // ERP Systems (Mgmt)
    { subject_id: 24, faculty_id: cs_faculty[5], session_year }, // Advanced Machine Learning
    { subject_id: 25, faculty_id: cs_faculty[6], session_year }, // Natural Language Processing
    { subject_id: 26, faculty_id: cs_faculty[0], session_year }, // Computer Vision
    { subject_id: 27, faculty_id: cs_faculty[1], session_year }, // Dissertation
    { subject_id: 28, faculty_id: cs_faculty[2], session_year }, // Big Data Analytics
    { subject_id: 29, faculty_id: cs_faculty[3], session_year }, // Data Visualization
    { subject_id: 30, faculty_id: cs_faculty[4], session_year }, // Time Series Analysis

    // --- Subjects 31-43, 70 (DSA/CS-Sec/MCA) -> Mapped to CS & E&E Faculty ---
    { subject_id: 31, faculty_id: cs_faculty[5], session_year }, // Dissertation
    { subject_id: 32, faculty_id: cs_faculty[6], session_year }, // Network Security
    { subject_id: 33, faculty_id: cs_faculty[0], session_year }, // Cryptography
    { subject_id: 34, faculty_id: cs_faculty[1], session_year }, // Ethical Hacking
    { subject_id: 35, faculty_id: cs_faculty[2], session_year }, // Dissertation
    { subject_id: 36, faculty_id: cs_faculty[3], session_year }, // Advanced Data Structures
    { subject_id: 37, faculty_id: cs_faculty[4], session_year }, // Advanced Database Systems
    { subject_id: 38, faculty_id: cs_faculty[5], session_year }, // Software Engineering Concepts
    { subject_id: 39, faculty_id: cs_faculty[6], session_year }, // Computer Networks
    { subject_id: 40, faculty_id: cs_faculty[0], session_year }, // Software Project Management
    { subject_id: 41, faculty_id: cs_faculty[1], session_year }, // Software Testing
    { subject_id: 42, faculty_id: cs_faculty[2], session_year }, // DevOps
    { subject_id: 43, faculty_id: cs_faculty[3], session_year }, // Final Project
    { subject_id: 70, faculty_id: ee_faculty[1], session_year }, // Engineering Mathematics - I (BTEEE)

    // --- Subjects 71-85 (BTEEE/EE/ECE) -> Mapped to E&E Faculty ---
    { subject_id: 71, faculty_id: ee_faculty[2], session_year }, // Basic Electrical Engineering
    { subject_id: 72, faculty_id: ee_faculty[3], session_year }, // Engineering Mathematics - II
    { subject_id: 73, faculty_id: ee_faculty[4], session_year }, // Basic Electronics Engineering
    { subject_id: 74, faculty_id: ee_faculty[5], session_year }, // Network Analysis
    { subject_id: 75, faculty_id: ee_faculty[0], session_year }, // Electrical Machines - I
    { subject_id: 76, faculty_id: ee_faculty[1], session_year }, // Electrical Machines - II
    { subject_id: 77, faculty_id: ee_faculty[2], session_year }, // Power Systems - I
    { subject_id: 78, faculty_id: ee_faculty[3], session_year }, // Control Systems
    { subject_id: 79, faculty_id: ee_faculty[4], session_year }, // Power Electronics
    { subject_id: 80, faculty_id: ee_faculty[5], session_year }, // Project - II
    { subject_id: 81, faculty_id: ee_faculty[0], session_year }, // Analog Electronics
    { subject_id: 82, faculty_id: ee_faculty[1], session_year }, // Digital Logic Design
    { subject_id: 83, faculty_id: ee_faculty[2], session_year }, // Signals and Systems
    { subject_id: 84, faculty_id: ee_faculty[3], session_year }, // Analog Communication
    { subject_id: 85, faculty_id: ee_faculty[4], session_year }, // Digital Communication

    // --- Subjects 86-100 (ECE/VLSI/BME/BTECH-Mech) -> Mapped to E&E & Mech Faculty ---
    { subject_id: 86, faculty_id: ee_faculty[5], session_year }, // VLSI Design
    { subject_id: 87, faculty_id: ee_faculty[0], session_year }, // Project - II
    { subject_id: 88, faculty_id: ee_faculty[1], session_year }, // Advanced VLSI Design
    { subject_id: 89, faculty_id: ee_faculty[2], session_year }, // Semiconductor Device Physics
    { subject_id: 90, faculty_id: ee_faculty[3], session_year }, // Dissertation
    { subject_id: 91, faculty_id: ee_faculty[4], session_year }, // Power Systems - II
    { subject_id: 92, faculty_id: ee_faculty[5], session_year }, // Human Anatomy (BME, assigned E&E)
    { subject_id: 93, faculty_id: ee_faculty[0], session_year }, // Medical Instrumentation (BME, assigned E&E)
    { subject_id: 94, faculty_id: mech_faculty[0], session_year }, // Engineering Mathematics - I (BTECH-MECH)
    { subject_id: 95, faculty_id: mech_faculty[1], session_year }, // Engineering Mechanics
    { subject_id: 96, faculty_id: mech_faculty[2], session_year }, // Engineering Drawing
    { subject_id: 97, faculty_id: mech_faculty[3], session_year }, // Workshop Practice
    { subject_id: 98, faculty_id: mech_faculty[4], session_year }, // Thermodynamics
    { subject_id: 99, faculty_id: mech_faculty[5], session_year }, // Strength of Materials
    { subject_id: 100, faculty_id: mech_faculty[0], session_year }, // Fluid Mechanics

    // --- Subjects 101-117 (MECH/Auto/Aerospace) -> Mapped to Mech Faculty ---
    { subject_id: 101, faculty_id: mech_faculty[1], session_year }, // Theory of Machines
    { subject_id: 102, faculty_id: mech_faculty[2], session_year }, // Heat Transfer
    { subject_id: 103, faculty_id: mech_faculty[3], session_year }, // Machine Design
    { subject_id: 104, faculty_id: mech_faculty[4], session_year }, // Major Project
    { subject_id: 105, faculty_id: mech_faculty[5], session_year }, // Automotive Engines
    { subject_id: 106, faculty_id: mech_faculty[0], session_year }, // Automotive Chassis
    { subject_id: 107, faculty_id: mech_faculty[1], session_year }, // Vehicle Dynamics
    { subject_id: 108, faculty_id: mech_faculty[2], session_year }, // Advanced Thermodynamics
    { subject_id: 109, faculty_id: mech_faculty[3], session_year }, // Advanced Heat Transfer
    { subject_id: 110, faculty_id: mech_faculty[4], session_year }, // Refrigeration & Air Conditioning
    { subject_id: 111, faculty_id: mech_faculty[5], session_year }, // Dissertation - I
    { subject_id: 112, faculty_id: mech_faculty[0], session_year }, // Dissertation - II
    { subject_id: 113, faculty_id: mech_faculty[1], session_year }, // Introduction to Aerospace
    { subject_id: 114, faculty_id: mech_faculty[2], session_year }, // Aerodynamics
    { subject_id: 115, faculty_id: mech_faculty[3], session_year }, // Aircraft Structures
    { subject_id: 116, faculty_id: mech_faculty[4], session_year }, // Flight Mechanics
    { subject_id: 117, faculty_id: mech_faculty[5], session_year }, // Propulsion

    // --- Subjects 118-130 (BTECH-Civil) -> Mapped to Civil Faculty ---
    { subject_id: 118, faculty_id: civil_faculty[0], session_year }, // Engineering Mathematics - I
    { subject_id: 119, faculty_id: civil_faculty[1], session_year }, // Basic Civil Engineering
    { subject_id: 120, faculty_id: civil_faculty[2], session_year }, // Engineering Mechanics
    { subject_id: 121, faculty_id: civil_faculty[3], session_year }, // Strength of Materials
    { subject_id: 122, faculty_id: civil_faculty[4], session_year }, // Surveying
    { subject_id: 123, faculty_id: civil_faculty[0], session_year }, // Fluid Mechanics
    { subject_id: 124, faculty_id: civil_faculty[1], session_year }, // Structural Analysis - I
    { subject_id: 125, faculty_id: civil_faculty[2], session_year }, // Geotechnical Engineering - I
    { subject_id: 126, faculty_id: civil_faculty[3], session_year }, // Concrete Technology
    { subject_id: 127, faculty_id: civil_faculty[4], session_year }, // Design of Concrete Structures
    { subject_id: 128, faculty_id: civil_faculty[0], session_year }, // Transportation Engineering
    { subject_id: 129, faculty_id: civil_faculty[1], session_year }, // Water Resources Engineering
    { subject_id: 130, faculty_id: civil_faculty[2], session_year }, // Project - II

    // --- Subjects 131-145 (MTECH-Civil/CEM/MBA) -> Mapped to Civil & Mgmt Faculty ---
    { subject_id: 131, faculty_id: civil_faculty[3], session_year }, // Advanced Structural Analysis
    { subject_id: 132, faculty_id: civil_faculty[4], session_year }, // Earthquake Engineering
    { subject_id: 133, faculty_id: civil_faculty[0], session_year }, // Dissertation
    { subject_id: 134, faculty_id: civil_faculty[1], session_year }, // Construction Planning
    { subject_id: 135, faculty_id: civil_faculty[2], session_year }, // Project Management
    { subject_id: 136, faculty_id: mgmt_faculty[0], session_year }, // Principles of Management
    { subject_id: 137, faculty_id: mgmt_faculty[1], session_year }, // Managerial Economics
    { subject_id: 138, faculty_id: mgmt_faculty[2], session_year }, // Financial Accounting
    { subject_id: 139, faculty_id: mgmt_faculty[3], session_year }, // Business Statistics
    { subject_id: 140, faculty_id: mgmt_faculty[4], session_year }, // Marketing Management
    { subject_id: 141, faculty_id: mgmt_faculty[5], session_year }, // Human Resource Management
    { subject_id: 142, faculty_id: mgmt_faculty[0], session_year }, // Corporate Finance
    { subject_id: 143, faculty_id: mgmt_faculty[1], session_year }, // Operations Management
    { subject_id: 144, faculty_id: mgmt_faculty[2], session_year }, // Investment Analysis
    { subject_id: 145, faculty_id: mgmt_faculty[3], session_year }, // Financial Derivatives

    // --- Subjects 146-160 (MBA/BBA) -> Mapped to Mgmt Faculty ---
    { subject_id: 146, faculty_id: mgmt_faculty[4], session_year }, // International Finance
    { subject_id: 147, faculty_id: mgmt_faculty[5], session_year }, // Corporate Valuation
    { subject_id: 148, faculty_id: mgmt_faculty[0], session_year }, // Consumer Behavior
    { subject_id: 149, faculty_id: mgmt_faculty[1], session_year }, // Digital Marketing
    { subject_id: 150, faculty_id: mgmt_faculty[2], session_year }, // Sales and Distribution
    { subject_id: 151, faculty_id: mgmt_faculty[3], session_year }, // Brand Management
    { subject_id: 152, faculty_id: mgmt_faculty[4], session_year }, // Performance Management
    { subject_id: 153, faculty_id: mgmt_faculty[5], session_year }, // Training and Development
    { subject_id: 154, faculty_id: mgmt_faculty[0], session_year }, // Labor Laws
    { subject_id: 155, faculty_id: mgmt_faculty[1], session_year }, // Compensation Management
    { subject_id: 156, faculty_id: mgmt_faculty[2], session_year }, // Principles of Microeconomics
    { subject_id: 157, faculty_id: mgmt_faculty[3], session_year }, // Business Communication
    { subject_id: 158, faculty_id: mgmt_faculty[4], session_year }, // Principles of Macroeconomics
    { subject_id: 159, faculty_id: mgmt_faculty[5], session_year }, // Cost Accounting
    { subject_id: 160, faculty_id: mgmt_faculty[0], session_year }, // Business Law

    // --- Subjects 161-162 (BBA-BA) -> Mapped to Mgmt Faculty ---
    { subject_id: 161, faculty_id: mgmt_faculty[1], session_year }, // Data Visualization
    { subject_id: 162, faculty_id: mgmt_faculty[2], session_year }  // Predictive Analytics
];



async function assignSubjectsToFaculty() {
    // --- Your new endpoint ---
    const endpoint = 'http://localhost:3000/admin/assign-subject';

    for (const mapping of subjectFacultyMappings) {
        console.log(`%cAssigning Subject ID ${mapping.subject_id} to Faculty ID ${mapping.faculty_id}...`, 'color: blue;');

        try {
            // Send as simple JSON
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mapping) 
            });

            const result = await response.json();

            if (!response.ok) {
                // Log errors (e.g., 409 "already exists")
                console.error(`Error assigning: ${result.message}`);
            } else {
                // Log success
                console.log(`%cSuccessfully assigned: ${result.message}`, 'color: green;');
            }

        } catch (error) {
            
            console.error(`Network error or fetch failed:`, error);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log("%cAll 162 subject assignments processing complete.", 'color: green; font-weight: bold;');
}

assignSubjectsToFaculty();
