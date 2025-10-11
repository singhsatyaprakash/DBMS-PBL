const express = require('express');
const router = express.Router();
const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const util = require('util');
const crypto = require('crypto');

const query = util.promisify(connDB.query).bind(connDB);

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existing = await query('SELECT * FROM admin WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await query(
            'INSERT INTO admin (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        const adminId = result.insertId;
        const token = crypto.randomBytes(32).toString('hex');

        await query('UPDATE admin SET token = ? WHERE admin_id = ?', [token, adminId]);

        res.status(201).json({ message: "Admin signed up successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
