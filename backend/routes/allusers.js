const express=require("express");
const router=express.Router();
const connDB=require('../db/db.conn');
const bcrypt = require('bcrypt');
const util = require('util');

const query = util.promisify(connDB.query).bind(connDB);

