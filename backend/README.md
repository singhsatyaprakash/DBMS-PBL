# University Management System API Documentation

This document provides a complete overview of the backend API for the University Management System, including authentication, user management, and bulk operations. It also details the database schema for all models.

---

## Table of Contents

- [API Endpoints](#api-endpoints)
  - [Admin](#admin)
  - [Faculty](#faculty)
  - [Student](#student)
- [Database Models](#database-models)
  - [Admin Table](#admin-table)
  - [Faculty Table](#faculty-table)
  - [Student Table](#student-table)
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

### Faculty

| Endpoint                              | Method | Description                      | Request Body / Params                                                                 | Response Example                                                                                   |
|----------------------------------------|--------|----------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `/faculty/login`                      | POST   | Faculty login                    | `{ "email": "faculty@email.com", "password": "password" }`                           | `{ "message": "Login successful", "token": "...", "role": "faculty" }`                             |

### Student

| Endpoint                              | Method | Description                      | Request Body / Params                                                                 | Response Example                                                                                   |
|----------------------------------------|--------|----------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `/student/login`                      | POST   | Student login                    | `{ "email": "student@email.com", "password": "password" }`                           | `{ "message": "Login successful", "token": "...", "role": "student" }`                             |

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
   ```

3. **Setup MySQL database:**
   - Run the SQL scripts in [`backend/model/createDatabase.sql`](backend/model/createDatabase.sql), [`backend/model/admin.sql`](backend/model/admin.sql), [`backend/model/faculty.sql`](backend/model/faculty.sql), and [`backend/model/student.sql`](backend/model/student.sql).

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
  "roll_no": 1001,
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

---

## Notes

- Passwords are randomly generated and sent to users via email.
- All sensitive operations require authentication.
- For bulk uploads, ensure your file matches the required schema.

---

For further details, refer to the source code