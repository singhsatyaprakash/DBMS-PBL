/**
 * -----------------------------------------------------------------
 * SAMPLE FACULTY DATA (30 Records)
 * -----------------------------------------------------------------
 * This data matches your 'faculty' table structure and the
 * department_id values from your 'departments' table image.
 * The first 3 records use your requested email addresses.
 */
const facultyData = [
    // --- Your 3 Requested Emails ---
    {
        name: "Satya Prakash Singh",
        department_id: 1, // 1 = CS&E
        email: "satyasingh159357@gmail.com",
        dob: "1990-01-15",
        contact_number: "9000000001",
        address: "A-1, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Professor",
        degree: "Ph.D. in Computer Science"
    },
    {
        name: "Yash Rai",
        department_id: 2, // 2 = E&E
        email: "yashrai2024@gmail.com",
        dob: "1988-03-20",
        contact_number: "9000000002",
        address: "A-2, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Associate Professor",
        degree: "Ph.D. in Electrical Eng."
    },
    {
        name: "Admin Satya",
        department_id: 5, // 5 = Management
        email: "singhsatyaprakash70675@gmail.com",
        dob: "1985-05-10",
        contact_number: "9000000003",
        address: "A-3, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "HOD",
        degree: "MBA in Finance"
    },
    // --- Additional Generated Data ---
    {
        name: "Dr. Meera Sharma",
        department_id: 1, // CS&E
        email: "meera.sharma@university.edu",
        dob: "1978-11-02",
        contact_number: "9000000004",
        address: "B-1, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Professor",
        degree: "Ph.D. in AI"
    },
    {
        name: "Mr. Rajesh Kumar",
        department_id: 3, // Mechanical
        email: "rajesh.kumar@university.edu",
        dob: "1982-07-14",
        contact_number: "9000000005",
        address: "B-2, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Assistant Professor",
        degree: "M.Tech in Robotics"
    },
    {
        name: "Dr. Ananya Gupta",
        department_id: 5, // Management
        email: "ananya.gupta@university.edu",
        dob: "1980-09-01",
        contact_number: "9000000006",
        address: "B-3, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Associate Professor",
        degree: "Ph.D. in Management"
    },
    {
        name: "Mr. Vikram Singh",
        department_id: 4, // Civil
        email: "vikram.singh@university.edu",
        dob: "1985-12-19",
        contact_number: "9000000007",
        address: "C-1, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Assistant Professor",
        degree: "M.Tech in Structures"
    },
    {
        name: "Dr. Priya Das",
        department_id: 2, // E&E
        email: "priya.das@university.edu",
        dob: "1979-04-25",
        contact_number: "9000000008",
        address: "C-2, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Professor",
        degree: "Ph.D. in VLSI Design"
    },
    {
        name: "Mr. Arjun Reddy",
        department_id: 1, // CS&E
        email: "arjun.reddy@university.edu",
        dob: "1988-06-30",
        contact_number: "9000000009",
        address: "C-3, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Assistant Professor",
        degree: "M.Tech in Data Science"
    },
    {
        name: "Ms. Sneha Patel",
        department_id: 3, // Mechanical
        email: "sneha.patel@university.edu",
        dob: "1990-02-11",
        contact_number: "9000000010",
        address: "D-1, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Lecturer",
        degree: "M.Tech in Thermodynamics"
    },
    {
        name: "Dr. Rohan Bose",
        department_id: 5, // Management
        email: "rohan.bose@university.edu",
        dob: "1975-08-08",
        contact_number: "9000000011",
        address: "D-2, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Professor",
        degree: "Ph.D. in Marketing"
    },
    {
        name: "Ms. Kavita Iyer",
        department_id: 4, // Civil
        email: "kavita.iyer@university.edu",
        dob: "1983-01-07",
        contact_number: "9000000012",
        address: "D-3, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Associate Professor",
        degree: "Ph.D. in Environmental Eng."
    },
    {
        name: "Mr. Aditya Verma",
        department_id: 2, // E&E
        email: "aditya.verma@university.edu",
        dob: "1987-10-18",
        contact_number: "9000000013",
        address: "E-1, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Assistant Professor",
        degree: "M.Tech in Power Systems"
    },
    {
        name: "Dr. Pooja Nair",
        department_id: 1, // CS&E
        email: "pooja.nair@university.edu",
        dob: "1981-03-22",
        contact_number: "9000000014",
        address: "E-2, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Associate Professor",
        degree: "Ph.D. in Cybersecurity"
    },
    {
        name: "Mr. Karan Malhotra",
        department_id: 3, // Mechanical
        email: "karan.malhotra@university.edu",
        dob: "1984-05-16",
        contact_number: "9000000015",
        address: "E-3, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Professor",
        degree: "Ph.D. in Mechanical Eng."
    },
    {
        name: "Ms. Nisha Jain",
        department_id: 5, // Management
        email: "nisha.jain@university.edu",
        dob: "1989-11-28",
        contact_number: "9000000016",
        address: "F-1, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Assistant Professor",
        degree: "MBA in HR"
    },
    {
        name: "Mr. Sameer Ali",
        department_id: 4, // Civil
        email: "sameer.ali@university.edu",
        dob: "1986-09-12",
        contact_number: "9000000017",
        address: "F-2, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Lecturer",
        degree: "M.Tech in Transportation"
    },
    {
        name: "Dr. Divya Rao",
        department_id: 2, // E&E
        email: "divya.rao@university.edu",
        dob: "1982-04-03",
        contact_number: "9000000018",
        address: "F-3, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Associate Professor",
        degree: "Ph.D. in Communications"
    },
    {
        name: "Dr. Harish Mehta",
        department_id: 1, // CS&E
        email: "harish.mehta@university.edu",
        dob: "1976-12-01",
        contact_number: "9000000019",
        address: "G-1, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "HOD",
        degree: "Ph.D. in Computer Networks"
    },
    {
        name: "Ms. Geeta Menon",
        department_id: 3, // Mechanical
        email: "geeta.menon@university.edu",
        dob: "1980-10-20",
        contact_number: "9000000020",
        address: "G-2, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Associate Professor",
        degree: "Ph.D. in Fluid Mechanics"
    },
    {
        name: "Mr. Varun Joshi",
        department_id: 5, // Management
        email: "varun.joshi@university.edu",
        dob: "1988-08-17",
        contact_number: "9000000021",
        address: "G-3, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Assistant Professor",
        degree: "MBA in Operations"
    },
    {
        name: "Dr. Lakshmi Murthy",
        department_id: 4, // Civil
        email: "lakshmi.murthy@university.edu",
        dob: "1977-02-18",
        contact_number: "9000000022",
        address: "H-1, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Professor",
        degree: "Ph.D. in Geotechnical Eng."
    },
    {
        name: "Mr. Nikhil Kumar",
        department_id: 2, // E&E
        email: "nikhil.kumar@university.edu",
        dob: "1991-06-05",
        contact_number: "9000000023",
        address: "H-2, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Lecturer",
        degree: "M.Tech in Control Systems"
    },
    {
        name: "Ms. Ritu Desai",
        department_id: 1, // CS&E
        email: "ritu.desai@university.edu",
        dob: "1984-07-29",
        contact_number: "9000000024",
        address: "H-3, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Assistant Professor",
        degree: "M.Tech in Software Eng."
    },
    {
        name: "Mr. Prateek Sharma",
        department_id: 3, // Mechanical
        email: "prateek.sharma@university.edu",
        dob: "1987-05-13",
        contact_number: "9000000025",
        address: "I-1, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Assistant Professor",
        degree: "M.Tech in Manufacturing"
    },
    {
        name: "Dr. Sunita Krishnan",
        department_id: 5, // Management
        email: "sunita.krishnan@university.edu",
        dob: "1979-03-09",
        contact_number: "9000000026",
        address: "I-2, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Associate Professor",
        degree: "Ph.D. in Economics"
    },
    {
        name: "Mr. Mohan Prasad",
        department_id: 4, // Civil
        email: "mohan.prasad@university.edu",
        dob: "1981-11-11",
        contact_number: "9000000027",
        address: "I-3, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Associate Professor",
        degree: "M.Tech in Water Resources"
    },
    {
        name: "Ms. Deepa Biswas",
        department_id: 2, // E&E
        email: "deepa.biswas@university.edu",
        dob: "1989-10-06",
        contact_number: "9000000028",
        address: "J-1, Staff Quarters, Dehradun",
        gender: "Female",
        designation: "Assistant Professor",
        degree: "M.Tech in Signal Processing"
    },
    {
        name: "Dr. Alok Nath",
        department_id: 1, // CS&E
        email: "alok.nath@university.edu",
        dob: "1972-01-24",
        contact_number: "9000000029",
        address: "J-2, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Professor",
        degree: "Ph.D. in Algorithms"
    },
    {
        name: "Mr. Ishaan Bhatt",
        department_id: 3, // Mechanical
        email: "ishaan.bhatt@university.edu",
        dob: "1990-12-30",
        contact_number: "9000000030",
        address: "J-3, Staff Quarters, Dehradun",
        gender: "Male",
        designation: "Lecturer",
        degree: "M.Tech in Machine Design"
    }
];

/**
 * -----------------------------------------------------------------
 * ASYNC FUNCTION TO SEND DATA SEQUENTIALLY
 * -----------------------------------------------------------------
 * This function loops through the data and 'awaits' each
 * request, ensuring they are sent one after another.
 */
async function addFacultyData() {
    // --- UPDATED ENDPOINT ---
    const endpoint = 'http://localhost:3000/admin/add-faculty';

    for (const faculty of facultyData) {
        console.log(`%cSending data for: ${faculty.name}`, 'color: blue;');

        // 1. Use FormData because your backend route uses 'upload.single()'.
        const formData = new FormData();

        // 2. Append each piece of data to the FormData object.
        formData.append('name', faculty.name);
        formData.append('department_id', faculty.department_id);
        formData.append('email', faculty.email);
        formData.append('dob', faculty.dob);
        formData.append('contact_number', faculty.contact_number);
        formData.append('address', faculty.address);
        formData.append('gender', faculty.gender);
        formData.append('designation', faculty.designation);
        formData.append('degree', faculty.degree);

        // 3. No 'profileImage' is appended, so req.file will be undefined
        //    and profileImageUrl will correctly be set to null.

        try {
            // 4. Send the request using fetch.
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
                // Add authorization headers if needed
                // headers: {
                //   'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE'
                // }
            });

            const result = await response.json();

            if (!response.ok) {
                // Log errors (e.g., 409 "already exists")
                console.error(`Error adding ${faculty.name}: ${result.message}`);
            } else {
                // Log success
                console.log(`%cSuccessfully added ${faculty.name}: ${result.message}`, 'color: green;');
            }

        } catch (error) {
            // Log network errors
            console.error(`Network error or fetch failed for ${faculty.name}:`, error);
        }

        // 5. Wait for 1 second (1000ms) before sending the next request.
        // This is gentle on your server and email service.
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("%cAll faculty data processing complete.", 'color: green; font-weight: bold;');
}

// -----------------------------------------------------------------
//  HOW TO RUN:
// -----------------------------------------------------------------
// To start the process, just call the function.
//
addFacultyData();
//
// -----------------------------------------------------------------