const express=require("express");
const router=express.Router();
const studentController=require('../controllers/student.controllers');

router.post('/login',studentController.loginStudent);
router.post('/logout', studentController.studentLogout);
router.post('/reset-password',studentController.resetPassword);
router.get('/profile-by-token',studentController.getProfileWithToken);
router.post('/validate-token',studentController.validationWithToken);
router.get('/profile/:student_id',studentController.getProfileById);
router.get('/profile',studentController.getProfile);

router.get('/current-subjects',studentController.currentSubject);
router.get('/get-student-attendance',studentController.getStudentAttendance);

module.exports=router;


// router.get('get-announcement',studentController.getAnnouncement);