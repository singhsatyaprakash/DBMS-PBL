const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/admin.controllers');


const upload=multer({dest:'uploads/'});

router.post('/signin',adminController.adminLogin)
router.post('/add-faculty', adminController.addFaculty);
router.post('/add-student', adminController.addStudent);
router.post('/add-bulk-student',upload.single('file'),adminController.addBulkStudent);

module.exports = router;