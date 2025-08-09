const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();

const query = util.promisify(connDB.query).bind(connDB);

exports.loginStudent = async (req, res) => {
    const {email ,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try{
        const result= await query("SELECT * from student where email=?",[email]);
        if(result.length===0){
            return res.status(404).json({message:"Student not found"});
        }
        const isMatch=await bcrypt.compare(password,result[0].password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const token=jwt.sign(
            {id:result[0].student_id,email:result[0].email,name:result[0].name},
            process.env.JWT_SECRET_KEY,
            {expiresIn:'1h'}
        );
        return res.status(200).json({
            message:"Login successful",
            token,
            role:"student",
        });
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}