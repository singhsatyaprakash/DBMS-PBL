const express=require("express");
const router=express.Router();
const facultyController=require('../controllers/faculty.controllers');



router.post('/login', facultyController.loginFaculty);

module.exports = router;