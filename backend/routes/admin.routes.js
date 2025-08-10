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


module.exports = router;