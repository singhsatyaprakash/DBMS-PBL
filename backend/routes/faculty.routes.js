const express=require("express");
const router=express.Router();
const facultyController=require('../controllers/faculty.controllers');



router.post('/login', facultyController.loginFaculty);
router.post('/reset-password',facultyController.resetPassword);
router.post('/logout',facultyController.logout);
router.post('/validate-token',facultyController.validationWithToken);
router.get('/get-faculty',facultyController.getFaculty);
router.get('/get-faculty/:id',facultyController.getFacultyById);
router.get('/my-subjects',facultyController.getMyAssignedSubjects);

router.get('/get-total-student',facultyController.getTotalStudents);

router.get('/students-for-subject', facultyController.getStudentsForSubject);
router.post('/mark-attendance',facultyController.markAttendance);

router.get('/get-announcement',facultyController.getAnnouncement);


router.get('/attendance-summary/:sf_id',facultyController.getAttendanceSummary);

module.exports = router;