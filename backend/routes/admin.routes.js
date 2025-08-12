const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controllers');
const {upload}=require('../db/multer.conn');



//registering...
router.post('/signin',adminController.adminLogin)
router.post('/add-faculty', adminController.addFaculty);
router.post('/add-student', adminController.addStudent);
router.post('/add-bulk-student',upload.single('file'),adminController.addBulkStudent);

//annnouncements....

router.post('/add-announcement',upload.single('announcement_file'),adminController.uploadAnnouncement);

//adding new course...
router.post('/add-new-course',adminController.addNewCourse);
router.get('/get-all-courses', adminController.getAllCourses);

//adding new subject...
router.post('/add-new-subject', adminController.addNewSubject);
router.get('/get-all-subjects', adminController.getAllSubjects);
router.get('/get-all-subjects-by-course/:course', adminController.getAllSubjectsByCourse);

//adding new semester...
router.post('/add-course-subjects-semster-wise',adminController.addCourseSubjectsSemesterWise);


module.exports = router;