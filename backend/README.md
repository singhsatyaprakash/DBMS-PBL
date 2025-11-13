# University Management System — Backend

This document describes the backend API for the University Management System built with Node.js + Express and MySQL. It includes a complete list of routes, examples of requests/responses, database model summaries (tabular), setup instructions, and how to enable a private admin enrollment route so you can enroll an initial admin using Hoppscotch (or Postman).

## Table of contents

- Overview
- Quick start
- Environment variables
- How to run
- Enabling private admin creation (Hoppscotch)
- API endpoints (with request & response examples)
- Database models (tabular)
- Bulk operations & file uploads
- Error handling and common responses
- Notes & next steps

---

## Overview

This backend exposes REST endpoints for admin, faculty, and student authentication and management; courses and subjects; semester-wise subject assignment; announcements (with file upload); and bulk student import. It uses MySQL as the primary data store and Cloudinary (or local `uploads/`) for storing announcement files.

Code entrypoint: `app.js` (in `backend/`). Key folders:

- `controllers/` — route handlers
- `routes/` — route definitions
- `services/` — business logic (e.g., admin.services.js)
- `db/` — DB and cloudinary/multer connectors
- `model/` — SQL files describing tables

## Quick start

1. Copy `.env.example` to `.env` and set values (see Environment variables below).
2. Install dependencies:

```bash
cd backend
npm install
```

3. Start the server (development):

```bash
set PORT=5000 && node app.js
```

4. Server listens on the `PORT` defined in `.env` (or `process.env.PORT`). Test with: `GET /check`.

## Environment variables (example)

Create a `.env` at `backend/` with at least:

- PORT=5000
- DB_HOST=localhost
- DB_USER=root
- DB_PASSWORD=your_db_password
- DB_NAME=university
- CLOUDINARY_URL=... (if using Cloudinary)

## How to run

- Start MySQL and ensure `DB_NAME` exists (you can run `model/createDatabase.sql`).
- Run node server: `node app.js` (or use nodemon in dev).

## Enabling private admin creation (useful to seed the first admin)

By default the repository includes a private route that can create an admin programmatically (useful for bootstrapping). In `app.js` the private route is commented out. To enable the private route so you can create an admin via Hoppscotch or Postman:

1. Open `backend/app.js` and find these lines near the top:

```js
// const privateRoutes=require('./private/admin.create');
// app.use("/private",privateRoutes);
```

2. Uncomment them so they read:

```js
const privateRoutes = require('./private/admin.create');
app.use('/private', privateRoutes);
```

3. Restart the backend.

4. Use Hoppscotch (https://hoppscotch.io) or Postman to send a POST to `http://localhost:PORT/private/create-admin` (or the exact private route path if different) with the required body (see `private/admin.create.js` for the expected body). This creates an admin in the `admin` table.

Hoppscotch quick steps:

- Open Hoppscotch → Method: POST → URL: `http://localhost:5000/private/create-admin`
- Header: `Content-Type: application/json`
- Body (JSON): `{ "name": "Admin Name", "email": "admin@example.com", "password": "StrongPass123" }`
- Send — inspect response and then login via `/admin/signin`.

> Important: after you bootstrap the first admin, consider removing or locking down the private route for security.

## API endpoints (high-level + examples)

Common conventions:

- All protected admin/faculty/student routes return 401 if token invalid or missing.
- `multipart/form-data` used for file uploads.

Base path mapping in `app.js`:

- `/admin` → admin routes
- `/faculty` → faculty routes
- `/student` → student routes
- `/public` → public/all-users routes

### Admin

1) POST /admin/signin — Admin login

Request example

```json
POST /admin/signin
Content-Type: application/json

{ "email": "admin@example.com", "password": "password123" }
```

Success response (200):

```json
{ "message": "Login successful", "token": "<jwt-token>", "role": "admin" }
```

2) POST /admin/add-faculty — Add faculty (admin-only)

Request example

```json
POST /admin/add-faculty
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Dr. Alice",
  "department": "Computer Science",
  "email": "alice@univ.edu",
  "dob": "1980-02-12"
}
```

Response (201):

```json
{ "message": "Faculty added successfully", "faculty_id": 123 }
```

3) POST /admin/add-student — Add single student

Request example

```json
POST /admin/add-student
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Bob",
  "email": "bob@student.edu",
  "course_id": 1,
  "branch_id": 2,
  "dob": "2003-08-05"
}
```

Response (201):

```json
{ "success": true, "message": "Student added successfully", "data": { "student_id": 456 } }
```

4) POST /admin/add-bulk-student — Bulk add students (CSV/XLSX)

Request: multipart/form-data with field `file` (CSV/Excel). The server will parse and insert multiple student rows.

Response (200):

```json
{ "message": "Bulk students added successfully", "added": 120, "failed": 2, "failedEmails": ["bad@example.com"] }
```

5) POST /admin/upload-announcement — Announcement with optional file

Request: multipart/form-data fields: `type`, `title`, `description`, `file` (optional).

Response (201):

```json
{ "message": "Announcement saved successfully", "url": "https://.../uploads/xxx.pdf" }
```

### Courses & Subjects (Admin)

1) POST /admin/add-new-course

Request example

```json
{ "course_name": "B.Tech Computer Science", "duration_years": 4, "total_semesters": 8, "course_code": "BTECH-CS", "department_id": 1, "description": "..." }
```

Response:

```json
{ "message": "Course added successfully", "course_id": 1 }
```

2) GET /admin/get-all-courses

Response example

```json
[ { "course_id": 1, "course_name": "B.Tech Computer Science", "duration_years": 4, "course_code": "BTECH-CS" }, ... ]
```

3) POST /admin/add-new-subject

Request example

```json
{ "subject_name":"Data Structures","subject_code":"CS201","semester":3,"credits":4,"course_id":1 }
```

Response:

```json
{ "message": "Subject added successfully", "subject_id": 21 }
```

4) GET /admin/get-all-subjects — returns all subjects

5) GET /admin/get-all-subjects-by-course/:course — returns subjects for a given course

6) POST /admin/add-course-subjects-semster-wise

Request example

```json
{ "course_id": 1, "semester": 3, "subject_ids": [5,7,9] }
```

Response:

```json
{ "message": "Subjects for semester updated successfully" }
```

### Faculty

POST /faculty/login — faculty login (email/password), returns token like admin.

### Student

POST /student/login — student login (email/password), returns token like admin.

### Public / Announcements

GET `/public/announcements` — returns announcements (most recent first). Each announcement includes `file_url` if file uploaded.

---

## Database models (tabular)

Below are the core tables and representative columns (drawn from `model/*.sql`). Use these as a quick reference.

### admin

| Column | Type | Notes |
|---|---:|---|
| admin_id | INT PRIMARY KEY AUTO_INCREMENT | PK |
| name | VARCHAR(25) | admin full name |
| email | VARCHAR(100) NOT NULL UNIQUE | login email |
| password | VARCHAR(100) | hashed password |
| token | VARCHAR(500) | last-issued token (optional) |
| role | VARCHAR(50) DEFAULT 'admin' | role label |

Source: `model/admin.sql`

### Courses

| Column | Type | Notes |
|---|---:|---|
| course_id | INT PK AUTO_INCREMENT | PK |
| course_name | VARCHAR(100) NOT NULL | human name |
| duration_years | INT NOT NULL | duration in years |
| total_semesters | INT NOT NULL | total sems |
| course_code | VARCHAR(20) UNIQUE | short code |
| department | VARCHAR(100) | department name (legacy) |
| department_id | INT | FK to `department` (if used) |
| description | TEXT | description |

Source: `model/course.sql`

### Subjects

| Column | Type | Notes |
|---|---:|---|
| subject_id | INT PK AUTO_INCREMENT | PK |
| subject_name | VARCHAR(100) NOT NULL | |
| subject_code | VARCHAR(20) NOT NULL UNIQUE | |
| semester | INT NOT NULL | semester number |
| credits | INT NOT NULL | credit points |
| description | TEXT | optional |
| course_id | INT NOT NULL | FK → Courses(course_id) |
| branch_id | INT | FK → Course_Branch(branch_id) |

Source: `model/subjects.sql`

### announcement

| Column | Type | Notes |
|---|---:|---|
| announcement_id | INT PK AUTO_INCREMENT | PK |
| title | VARCHAR(255) NOT NULL | |
| type | ENUM('Holiday','Academic','Sports','Exam','Fees','Admission','Others') NOT NULL | |
| description | TEXT | |
| file_url | VARCHAR(500) | stored file URL/path |
| admin_id | INT NOT NULL | FK → admin(admin_id) |
| created_at | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | |

Source: `model/announcement.sql`

### Representative other tables

- `faculty` — columns: faculty_id, name, email, department_id, password, dob, phone, created_at
- `student` — columns: student_id, name, email, course_id, branch_id, roll_no, password, dob
- `Course_Branch` — branch_id, branch_name, course_id
- `Course_Subject` / `Faculty_Subject` / `Student_Subject` — mapping tables that relate entities via FK ids
- `Attendance`, `Result` (if present) — use typical columns (`attendance_id`, `student_id`, `status`, `date`)

For the exact column list, see the SQL files in `backend/model/`.

## Bulk operations & file uploads

- Student bulk import: `POST /admin/add-bulk-student` (multipart/form-data: file field). Accepts CSV/XLS(X). The controller will parse rows, validate, and insert.
- Announcement upload: `POST /admin/upload-announcement` (multipart/form-data) — file will be uploaded to the configured storage and `file_url` saved to the `announcement` table.

Important: ensure `db/multer.conn.js` and `db/cloudinary.conn.js` are configured with your environment values.

## Error handling & common responses

- 200 — OK (fetch)
- 201 — Created (successful POST creating resource)
- 400 — Bad Request (validation error) — response includes `message` and optionally `errors` array
- 401 — Unauthorized (missing/invalid token)
- 403 — Forbidden (insufficient permissions)
- 404 — Not found
- 500 — Server error — include message and log stack on server

Example error response:

```json
{ "success": false, "message": "Validation failed", "errors": ["email is required"] }
```

## Notes & next steps

- To bootstrap the first admin: enable the private route in `app.js` (see earlier section), then call the private admin create endpoint from Hoppscotch or Postman.
- After bootstrapping, for security remove or protect the private route (or keep it behind an allow-list or local-only access).
- Consider adding OpenAPI (Swagger) documentation to keep the docs in sync with route code.

If you want, I can also:

- Generate a small OpenAPI spec for these routes.
- Create example Postman collection or Hoppscotch share link.
- Add a short `backend/README-quick-commands.md` with exact curl commands.

---

If anything in the routes or controllers changed since this doc, tell me which endpoints to add or if you want the README to include exact route paths and request fields from the controller code — I can extract them and produce a fully accurate OpenAPI file.

For further details, contact: singhsatyaprakash70675@gmail.com
# University Management System API Documentation

This document provides a complete overview of the backend API for the University Management System, including authentication, faculty/student management, courses, subjects, semester-wise subject mapping, bulk operations, and announcement uploads. It also details the database schema for all models.

---

## Table of Contents

- [API Endpoints](#api-endpoints)
  - [Admin](#admin)
  - [Faculty](#faculty)
  - [Student](#student)
  - [Announcement](#announcement)
  - [Courses & Subjects](#courses--subjects)
- [Database Models](#database-models)
  - [Admin Table](#admin-table)
  - [Faculty Table](#faculty-table)
  - [Student Table](#student-table)
  - [Announcement Table](#announcement-table)
- [Bulk Operations](#bulk-operations)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)
- [Setup Instructions](#setup-instructions)

---

## API Endpoints

### Admin

| Endpoint                              | Method | Description                      | Request Body / Params                                                                 | Response Example                                                                                   |
|----------------------------------------|--------|----------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `/admin/signin`                       | POST   | Admin login                      | `{ "email": "admin@email.com", "password": "password" }`                             | `{ "message": "Login successful", "token": "...", "role": "admin" }`                               |
| `/admin/add-faculty`                   | POST   | Add new faculty                  | `{ "name": "...", "department": "...", "email": "...", "dob": "...", ... }`          | `{ "message": "Faculty added successfully" }`                                                      |
| `/admin/add-student`                   | POST   | Add new student                  | `{ "name": "...", "email": "...", "course": "...", "branch": "...", ... }`           | `{ "success": true, "message": "Student added successfully", "data": { ... } }`                    |
| `/admin/add-bulk-student`              | POST   | Bulk add students (CSV/Excel)    | `multipart/form-data` with file field                                                | `{ "message": "Bulk students added successfully", "added": N, "failedEmails": [ ... ] }`           |
| `/admin/upload-announcement`           | POST   | Upload announcement (with file)  | `multipart/form-data` with fields: `type`, `title`, `description`, `file` (optional) | `{ "message": "Announcement saved successfully", "url": "https://..." }`                           |
### Courses & Subjects

| Endpoint                                         | Method | Description                      | Request Body / Params                                                                 | Response Example                                                                                   |
|-------------------------------------------------|--------|----------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `/admin/add-new-course`                         | POST   | Add new course                   | `{ "course_name": "...", "duration_years": 3, "department": "...", "course_code": "...", "description": "..." }` | `{ "message": "Course added successfully" }`                                                       |
| `/admin/get-all-courses`                        | GET    | Get all courses                  | None                                                                                 | `[ { "course_id": 1, "course_name": "...", ... }, ... ]`                                           |
| `/admin/add-new-subject`                        | POST   | Add new subject                  | `{ "subject_name": "...", "subject_code": "...", "course": "...", "credits": 4, "description": "..." }` | `{ "message": "Subject added successfully" }`                                                      |
| `/admin/get-all-subjects`                       | GET    | Get all subjects                 | None                                                                                 | `[ { "subject_id": 1, "subject_name": "...", ... }, ... ]`                                         |
| `/admin/get-all-subjects-by-course/:course`     | GET    | Get all subjects by course name  | Path param: course name (string)                                                     | `[ { "subject_id": 1, "subject_name": "...", ... }, ... ]`                                         |
| `/admin/add-course-subjects-semster-wise`       | POST   | Assign subjects to a course semester | `{ "course_id": 1, "semester": 3, "subject_ids": [5, 7, 9] }`                         | `{ "message": "Subjects for semester updated successfully" }`                                     |

### Faculty

| Endpoint                              | Method | Description                      | Request Body / Params                                                                 | Response Example                                                                                   |
|----------------------------------------|--------|----------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `/faculty/login`                      | POST   | Faculty login                    | `{ "email": "faculty@email.com", "password": "password" }`                           | `{ "message": "Login successful", "token": "...", "role": "faculty" }`                             |

### Student

| Endpoint                              | Method | Description                      | Request Body / Params                                                                 | Response Example                                                                                   |
|----------------------------------------|--------|----------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `/student/login`                      | POST   | Student login                    | `{ "email": "student@email.com", "password": "password" }`                           | `{ "message": "Login successful", "token": "...", "role": "student" }`                             |

### Announcement

| Endpoint                              | Method | Description                      | Request Body / Params                                                                 | Response Example                                                                                   |
|----------------------------------------|--------|----------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `/admin/upload-announcement`           | POST   | Upload announcement (with file)  | `multipart/form-data` with fields: `type`, `title`, `description`, `file` (optional) | `{ "message": "Announcement saved successfully", "url": "https://..." }`                           |

---

## Database Models

### Admin Table

| Column      | Type           | Constraints           | Description         |
|-------------|----------------|----------------------|---------------------|
| admin_id    | INT            | PRIMARY KEY, AUTO_INCREMENT | Unique admin ID     |
| name        | VARCHAR(25)    |                      | Admin name          |
| email       | VARCHAR(100)   | NOT NULL, UNIQUE     | Admin email         |
| password    | VARCHAR(100)   |                      | Hashed password     |

**SQL:**
```sql
CREATE TABLE admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100)
);
```

---

### Faculty Table

| Column         | Type           | Constraints           | Description         |
|----------------|----------------|----------------------|---------------------|
| faculty_id     | INT            | UNIQUE, AUTO_INCREMENT | Unique faculty ID   |
| name           | VARCHAR(100)   | NOT NULL             | Faculty name        |
| department     | VARCHAR(100)   |                      | Department          |
| email          | VARCHAR(100)   | PRIMARY KEY          | Faculty email       |
| password       | VARCHAR(100)   |                      | Hashed password     |
| dob            | DATE           |                      | Date of birth       |
| contact_number | VARCHAR(15)    |                      | Contact number      |
| address        | TEXT           |                      | Address             |
| gender         | VARCHAR(10)    |                      | Gender              |

**SQL:**
```sql
CREATE TABLE Faculty (
    faculty_id INT UNIQUE AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    email VARCHAR(100) PRIMARY KEY,
    password varchar(100),
    dob DATE,
    contact_number VARCHAR(15),
    address TEXT,
    gender VARCHAR(10)
);
```

---

### Student Table

| Column      | Type           | Constraints           | Description         |
|-------------|----------------|----------------------|---------------------|
| student_id  | INT            | UNIQUE, AUTO_INCREMENT | Unique student ID   |
| name        | VARCHAR(100)   |                      | Student name        |
| email       | VARCHAR(100)   | PRIMARY KEY          | Student email       |
| password    | VARCHAR(100)   |                      | Hashed password     |
| roll_no     | INT            | UNIQUE               | Roll number         |
| course      | VARCHAR(100)   | NOT NULL             | Course name         |
| branch      | VARCHAR(100)   |                      | Branch              |
| semester    | INT            |                      | Semester            |
| year        | INT            |                      | Year                |
| dob         | DATE           |                      | Date of birth       |
| gender      | VARCHAR(10)    |                      | Gender              |
| contact     | VARCHAR(15)    |                      | Contact number      |
| address     | TEXT           |                      | Address             |

**SQL:**
```sql
CREATE TABLE Student (
    student_id INT UNIQUE AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) PRIMARY KEY,
    password varchar(100),
    roll_no INT UNIQUE,
    course VARCHAR(100) NOT NULL,
    branch VARCHAR(100),
    semester INT,
    year INT,
    dob DATE,
    gender VARCHAR(10),
    contact VARCHAR(15),
    address TEXT
);
ALTER TABLE Student AUTO_INCREMENT = 1000;
```

---

### Announcement Table

| Column         | Type           | Constraints           | Description         |
|----------------|----------------|----------------------|---------------------|
| announcement_id| INT            | PRIMARY KEY, AUTO_INCREMENT | Unique announcement ID |
| title          | VARCHAR(255)   | NOT NULL             | Announcement title  |
| type           | ENUM           | NOT NULL             | Announcement type   |
| description    | TEXT           |                      | Description         |
| file_url       | VARCHAR(500)   |                      | File URL (optional) |
| admin_id       | INT            | NOT NULL, FOREIGN KEY| Admin who posted    |
| created_at     | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP | Creation time   |

**SQL:**
```sql
CREATE TABLE announcement (
    announcement_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    type ENUM('Holiday', 'Academic', 'Sports', 'Exam', 'Fees', 'Admission', 'Others') NOT NULL,
    description TEXT,
    file_url VARCHAR(500),
    admin_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);
```
### Courses
| Column           | Type         | Constraints                  | Description                             |
| ---------------- | ------------ | ---------------------------- | --------------------------------------- |
| course\_id       | INT          | PRIMARY KEY, AUTO\_INCREMENT | Unique course ID                        |
| course\_name     | VARCHAR(100) | NOT NULL, UNIQUE             | Name of the course                      |
| duration\_years  | INT          | NOT NULL                     | Duration of the course in years         |
| total\_semesters | INT          | NOT NULL                     | Total number of semesters in the course |
| course\_code     | VARCHAR(20)  | UNIQUE                       | Unique course code                      |
| department       | VARCHAR(100) |                              | Department offering the course          |
| description      | TEXT         |                              | Additional details about the course     |

**SQL:**
```sql
CREATE TABLE Courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL UNIQUE,
    duration_years INT NOT NULL,
    total_semesters INT NOT NULL,
    course_code VARCHAR(20) UNIQUE,
    department VARCHAR(100),
    description TEXT
);
```

### Subjects
| Column        | Type         | Constraints                  | Description                          |
| ------------- | ------------ | ---------------------------- | ------------------------------------ |
| subject\_id   | INT          | PRIMARY KEY, AUTO\_INCREMENT | Unique subject ID                    |
| subject\_name | VARCHAR(100) | NOT NULL                     | Name of the subject                  |
| subject\_code | VARCHAR(20)  | NOT NULL, UNIQUE             | Unique code for the subject          |
| course        | VARCHAR(100) | NOT NULL                     | Course this subject belongs to       |
| credits       | INT          | NOT NULL                     | Credits awarded for this subject     |
| description   | TEXT         |                              | Additional details about the subject |

**SQL:**
```sql
CREATE TABLE Subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) NOT NULL UNIQUE,
    course VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    description TEXT
);
```

### Course_Subjects
| Column                                    | Type    | Constraints                                                          | Description                                |
| ----------------------------------------- | ------- | -------------------------------------------------------------------- | ------------------------------------------ |
| cs\_id                                    | INT     | PRIMARY KEY, AUTO\_INCREMENT                                         | Unique course-subject mapping ID           |
| course\_id                                | INT     | NOT NULL, FOREIGN KEY (Courses.course\_id) ON DELETE CASCADE         | ID of the course                           |
| subject\_id                               | INT     | NOT NULL, FOREIGN KEY (Subjects.subject\_id) ON DELETE CASCADE       | ID of the subject                          |
| semester                                  | INT     | NOT NULL                                                             | Semester in which the subject is taught    |
| is\_active                                | BOOLEAN | DEFAULT TRUE                                                         | Status of the mapping (active/inactive)    |
| UNIQUE(course\_id, subject\_id, semester) | -       | Ensures a subject can only be assigned once per semester in a course | Unique course-subject-semester combination |

**SQL:**
```sql
CREATE TABLE Course_Subjects (
    cs_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    UNIQUE(course_id, subject_id, semester)
);
```
---

## Bulk Operations

- **Bulk Add Students:**  
  Endpoint: `/admin/add-bulk-student`  
  Method: `POST`  
  Content-Type: `multipart/form-data`  
  Body: Upload a CSV or Excel file with columns matching the student table schema.  
  - Each student will receive credentials via email.
  - Failed email deliveries are reported in the response.

---

## Authentication

- All login endpoints return a JWT token on success.
- Use the token in the `Authorization` header for protected routes.

---

## Error Handling

- All endpoints return appropriate HTTP status codes and error messages.
- Common errors:
  - `400 Bad Request`: Missing required fields.
  - `401 Unauthorized`: Invalid credentials.
  - `404 Not Found`: User not found.
  - `409 Conflict`: Duplicate entry.
  - `500 Internal Server Error`: Server-side error.

---

## Environment Variables

Set these in your `.env` file:

| Variable            | Description                   |
|---------------------|------------------------------|
| `database_pass`     | MySQL root password          |
| `PORT`              | Server port (default: 3000)  |
| `JWT_SECRET_KEY`    | JWT secret key               |
| `ADMIN_EMAIL`       | Email for sending credentials|
| `ADMIN_EMAIL_PASS`  | Email password/app password  |
| `CLOUD_NAME`        | Cloudinary cloud name        |
| `CLOUD_API_KEY`     | Cloudinary API key           |
| `CLOUD_SECRET_KEY`  | Cloudinary API secret        |

---

## Setup Instructions

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure `.env` file:**
   ```
   database_pass=your_mysql_password
   PORT=3000
   JWT_SECRET_KEY=your_secret_key
   ADMIN_EMAIL=your_email@gmail.com
   ADMIN_EMAIL_PASS=your_email_app_password
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_SECRET_KEY=your_cloudinary_api_secret
   ```

3. **Setup MySQL database:**
   - Run the SQL scripts in [`backend/model/createDatabase.sql`](backend/model/createDatabase.sql), [`backend/model/admin.sql`](backend/model/admin.sql), [`backend/model/faculty.sql`](backend/model/faculty.sql), [`backend/model/student.sql`](backend/model/student.sql), and [`backend/model/announcement.sql`](backend/model/announcement.sql).

4. **Start the server:**
   ```sh
   node app.js
   ```

---

## Example Requests

### Admin Login

```http
POST /admin/signin
Content-Type: application/json

{
  "email": "satya@gmail.com",
  "password": "deepasingh"
}
```

### Add Faculty

```http
POST /admin/add-faculty
Content-Type: application/json

{
  "name": "Satya Prakash Singh",
  "email": "satyasingh159357@gmail.com"
}
```

### Add Student

```http
POST /admin/add-student
Content-Type: application/json

{
  "name": "Satya Prakash Singh",
  "email": "satyasingh159357@gmail.com",
  "course": "B.Tech",
  "branch": "Computer Science",
  "semester": 5,
  "year": 2025,
  "dob": "2004-07-15",
  "gender": "Male",
  "contact": "9843332210",
  "address": "123, MG Road, New Delhi"
}
```

### Bulk Add Students

```http
POST /admin/add-bulk-student
Content-Type: multipart/form-data

file: [students.csv or students.xlsx]
```

### Upload Announcement

```http
POST /admin/upload-announcement
Content-Type: multipart/form-data

type: "Academic"
title: "Mid-Sem Exam Schedule"
description: "Mid-semester exams will start from 15th August."
file: [optional: exam_schedule.pdf]
```

**Response:**
```json
{
  "message": "Announcement saved successfully",
  "url": "https://res.cloudinary.com/your_cloud_name/..."
}
```
### Get All Subjects by Course
```http
GET /admin/get-all-subjects-by-course/BCA
```

**Response:**
```json
[
  {
    "subject_id": 1,
    "subject_name": "Mathematics I",
    "subject_code": "MATH101",
    "course": "BCA",
    "credits": 4,
    "description": "Basic Mathematics"
  }
]
```

### Assign Semester-Wise Subjects
```http
POST /admin/add-course-subjects-semster-wise
Content-Type: application/json

{
  "course_id": 1,
  "semester": 3,
  "subject_ids": [5, 7, 9]
}
```

**Response:**
```json
{
  "message": "Subjects for semester updated successfully"
}
```

---


## Notes

- Passwords are randomly generated and sent to users via email.
- All sensitive operations require authentication.
- For bulk uploads, ensure your file matches the required schema.
- Announcement uploads support optional file attachments (PDF, images, etc.) stored on Cloudinary.


- Semester values must be valid for the course (check `total_semesters` in `Courses`).
- `subject_ids` must exist in the `Subjects` table and belong to the same course.

---

For further details, refer to the email:singhsatyaprakash70675@gmail.com