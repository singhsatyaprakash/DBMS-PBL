
const express = require('express');
const router = express.Router();
const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const util = require('util');

const query = util.promisify(connDB.query).bind(connDB);

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await query('SELECT * FROM admin WHERE email = ?', [email]);
        if (result.length > 0) {
            return res.status(409).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await query(
            'INSERT INTO admin (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: "Admin signed up successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;